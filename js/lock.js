/**
 * UAD Website — Under Development Lock Screen (Secure Hashed Version)
 * Requires both Username (ID) and Password to access.
 * Uses sessionStorage so unlock persists across pages in a single session.
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'uad_site_unlocked';

    // If already unlocked this session, skip and add unlocked class to HTML
    if (sessionStorage.getItem(STORAGE_KEY) === 'true') {
        document.documentElement.classList.add('uad-unlocked-html');
        return;
    }

    // ── Inject CSS ──
    const style = document.createElement('style');
    style.textContent = `
        /* Lock Screen Overlay */
        #uad-lock-screen {
            position: fixed;
            inset: 0;
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #000;
            opacity: 1;
            transition: opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: 'DM Sans', 'Segoe UI', sans-serif;
            overflow: hidden;
        }

        #uad-lock-screen.unlocking {
            opacity: 0;
            transform: scale(1.08);
            pointer-events: none;
        }

        #uad-lock-screen * {
            cursor: auto !important;
        }

        /* Animated background grid */
        .lock-bg-grid {
            position: absolute;
            inset: 0;
            background-image:
                linear-gradient(rgba(212, 175, 55, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(212, 175, 55, 0.03) 1px, transparent 1px);
            background-size: 60px 60px;
            animation: gridShift 20s linear infinite;
        }

        @keyframes gridShift {
            0%   { transform: translate(0, 0); }
            100% { transform: translate(60px, 60px); }
        }

        /* Radial glow behind card */
        .lock-bg-glow {
            position: absolute;
            width: 600px;
            height: 600px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%);
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            animation: glowPulse 4s ease-in-out infinite;
        }

        @keyframes glowPulse {
            0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
            50%      { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        }

        .lock-container {
            position: relative;
            z-index: 2;
            text-align: center;
            max-width: 440px;
            width: 92%;
            padding: 3rem 2.5rem 2.5rem;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.07);
            border-radius: 24px;
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            box-shadow:
                0 30px 80px rgba(0, 0, 0, 0.6),
                inset 0 1px 0 rgba(255, 255, 255, 0.05);
            animation: lockCardIn 0.9s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes lockCardIn {
            from { opacity: 0; transform: translateY(40px) scale(0.92); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Under Development Badge */
        .lock-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 0.4rem 1.2rem;
            border: 1px solid rgba(212, 175, 55, 0.4);
            border-radius: 30px;
            color: #D4AF37;
            font-size: 11px;
            font-family: 'Rajdhani', 'DM Sans', sans-serif;
            font-weight: 600;
            letter-spacing: 2.5px;
            text-transform: uppercase;
            margin-bottom: 1.8rem;
            background: rgba(212, 175, 55, 0.06);
        }

        .lock-badge-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #D4AF37;
            animation: badgePulse 1.5s ease-in-out infinite;
        }

        @keyframes badgePulse {
            0%, 100% { opacity: 1; }
            50%      { opacity: 0.3; }
        }

        /* Lock Icon */
        .lock-icon-wrap {
            width: 76px;
            height: 76px;
            margin: 0 auto 1.5rem;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .lock-icon-ring {
            position: absolute;
            inset: 0;
            border-radius: 50%;
            border: 2px solid rgba(212, 175, 55, 0.25);
            animation: ringPulse 3s ease-in-out infinite;
        }

        .lock-icon-ring:nth-child(2) {
            inset: -10px;
            border-color: rgba(212, 175, 55, 0.1);
            animation-delay: 0.8s;
        }

        @keyframes ringPulse {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50%      { transform: scale(1.08); opacity: 1; }
        }

        .lock-icon-svg {
            width: 34px;
            height: 34px;
            color: #D4AF37;
            filter: drop-shadow(0 2px 10px rgba(212, 175, 55, 0.35));
            transition: all 0.4s ease;
        }

        .lock-icon-svg.unlocked {
            color: #34d399;
            filter: drop-shadow(0 2px 10px rgba(52, 211, 153, 0.35));
            animation: unlockPop 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes unlockPop {
            0%   { transform: scale(1); }
            50%  { transform: scale(1.35); }
            100% { transform: scale(1); }
        }

        .lock-title {
            font-family: 'Cormorant Garamond', 'Georgia', serif;
            font-size: 30px;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 0.4rem;
            letter-spacing: 0.5px;
        }

        .lock-subtitle {
            font-size: 14px;
            color: rgba(192, 192, 192, 0.55);
            margin-bottom: 2rem;
            line-height: 1.5;
        }

        /* Form */
        .lock-form {
            display: flex;
            flex-direction: column;
            gap: 0.9rem;
        }

        .lock-input-group {
            position: relative;
            text-align: left;
        }

        .lock-input-label {
            display: block;
            font-size: 12px;
            font-family: 'Rajdhani', 'DM Sans', sans-serif;
            font-weight: 600;
            color: rgba(192, 192, 192, 0.5);
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 0.4rem;
            padding-left: 2px;
        }

        .lock-input-wrap {
            position: relative;
        }

        .lock-input-icon {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            color: rgba(192, 192, 192, 0.25);
            pointer-events: none;
            transition: color 0.3s;
        }

        .lock-input-wrap:focus-within .lock-input-icon {
            color: rgba(212, 175, 55, 0.6);
        }

        .lock-input {
            width: 100%;
            padding: 0.9rem 1rem 0.9rem 2.8rem;
            background: rgba(0, 0, 0, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            color: #ffffff;
            font-size: 15px;
            font-family: 'DM Sans', sans-serif;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
            outline: none;
            box-sizing: border-box;
        }

        .lock-input::placeholder {
            color: rgba(192, 192, 192, 0.2);
            font-size: 14px;
        }

        .lock-input:focus {
            border-color: rgba(212, 175, 55, 0.5);
            box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.08), 0 4px 16px rgba(212, 175, 55, 0.06);
        }

        .lock-input.error {
            border-color: rgba(239, 68, 68, 0.6);
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
            animation: fieldShake 0.4s ease;
        }

        @keyframes fieldShake {
            0%, 100% { transform: translateX(0); }
            25%      { transform: translateX(-5px); }
            75%      { transform: translateX(5px); }
        }

        .lock-toggle-pw {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: rgba(192, 192, 192, 0.3);
            cursor: pointer !important;
            padding: 4px;
            transition: color 0.3s;
            line-height: 0;
        }

        .lock-toggle-pw:hover {
            color: rgba(212, 175, 55, 0.7);
        }

        .lock-btn {
            width: 100%;
            padding: 0.95rem;
            margin-top: 0.3rem;
            background: linear-gradient(135deg, #D4AF37 0%, #b8960f 100%);
            color: #000000;
            font-size: 14px;
            font-weight: 700;
            font-family: 'Rajdhani', 'DM Sans', sans-serif;
            text-transform: uppercase;
            letter-spacing: 2.5px;
            border: none;
            border-radius: 12px;
            cursor: pointer !important;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .lock-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(212, 175, 55, 0.25);
        }

        .lock-btn:active {
            transform: translateY(0);
        }

        .lock-btn::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, transparent 35%, rgba(255,255,255,0.25) 50%, transparent 65%);
            transform: translateX(-100%);
            transition: transform 0.6s ease;
        }

        .lock-btn:hover::after {
            transform: translateX(100%);
        }

        .lock-error-msg {
            color: #ef4444;
            font-size: 13px;
            margin-top: 0.4rem;
            opacity: 0;
            transform: translateY(-5px);
            transition: opacity 0.3s, transform 0.3s;
            min-height: 20px;
        }

        .lock-error-msg.visible {
            opacity: 1;
            transform: translateY(0);
        }

        .lock-footer {
            margin-top: 1.5rem;
            padding-top: 1.2rem;
            border-top: 1px solid rgba(255, 255, 255, 0.04);
            font-size: 11px;
            color: rgba(192, 192, 192, 0.2);
            letter-spacing: 1.5px;
            text-transform: uppercase;
        }

        /* Floating Particles */
        .lock-particle {
            position: absolute;
            width: 3px;
            height: 3px;
            background: rgba(212, 175, 55, 0.25);
            border-radius: 50%;
            pointer-events: none;
            animation: particleDrift linear infinite;
        }

        @keyframes particleDrift {
            0%   { transform: translateY(0) translateX(0); opacity: 0; }
            10%  { opacity: 0.8; }
            90%  { opacity: 0.8; }
            100% { transform: translateY(-100vh) translateX(40px); opacity: 0; }
        }

        /* Hide body scroll when locked */
        body.uad-locked {
            overflow: hidden !important;
        }

        /* Mobile responsive */
        @media (max-width: 480px) {
            .lock-container {
                padding: 2rem 1.5rem 1.8rem;
                border-radius: 18px;
            }
            .lock-title { font-size: 24px; }
            .lock-subtitle { font-size: 13px; }
            .lock-icon-wrap { width: 64px; height: 64px; }
            .lock-icon-svg { width: 28px; height: 28px; }
        }
    `;
    document.head.appendChild(style);

    // ── Build Lock HTML ──
    const overlay = document.createElement('div');
    overlay.id = 'uad-lock-screen';
    overlay.innerHTML = `
        <div class="lock-bg-grid"></div>
        <div class="lock-bg-glow"></div>
        ${generateParticles(15)}
        <div class="lock-container" id="lock-container">
            <div class="lock-badge">
                <span class="lock-badge-dot"></span>
                Under Development
            </div>

            <div class="lock-icon-wrap">
                <div class="lock-icon-ring"></div>
                <div class="lock-icon-ring"></div>
                <svg class="lock-icon-svg" id="lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
            </div>

            <h2 class="lock-title">Authorized Access Only</h2>
            <p class="lock-subtitle">This site is currently under development.<br>Enter your credentials to continue.</p>

            <div class="lock-form">
                <div class="lock-input-group">
                    <label class="lock-input-label" for="lock-username">User ID</label>
                    <div class="lock-input-wrap">
                        <svg class="lock-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <input type="text" class="lock-input" id="lock-username" placeholder="Enter your ID" autocomplete="off" spellcheck="false" />
                    </div>
                </div>

                <div class="lock-input-group">
                    <label class="lock-input-label" for="lock-password">Password</label>
                    <div class="lock-input-wrap">
                        <svg class="lock-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        <input type="password" class="lock-input" id="lock-password" placeholder="Enter your password" autocomplete="off" spellcheck="false" />
                        <button class="lock-toggle-pw" id="lock-toggle-pw" type="button" aria-label="Toggle password visibility">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        </button>
                    </div>
                </div>

                <button class="lock-btn" id="lock-submit">Unlock Access</button>
                <div class="lock-error-msg" id="lock-error">Invalid credentials. Please try again.</div>
            </div>

            <div class="lock-footer">Ultimate Auto Detailing &bull; Coming Soon</div>
        </div>
    `;

    // ── Insert into DOM ──
    document.body.prepend(overlay);
    document.body.classList.add('uad-locked');

    // ── DOM References ──
    const usernameInput = document.getElementById('lock-username');
    const passwordInput = document.getElementById('lock-password');
    const submitBtn = document.getElementById('lock-submit');
    const errorMsg = document.getElementById('lock-error');
    const container = document.getElementById('lock-container');
    const lockIcon = document.getElementById('lock-icon');
    const toggleBtn = document.getElementById('lock-toggle-pw');

    // Focus username input after a brief delay
    setTimeout(() => usernameInput.focus(), 600);

    // ── Toggle password visibility ──
    toggleBtn.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        toggleBtn.innerHTML = isPassword
            ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
            : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
        passwordInput.focus();
    });

    // ── Cryptographic Hashing (SHA-256) ──
    function sha256(ascii) {
        function rightRotate(value, amount) {
            return (value >>> amount) | (value << (32 - amount));
        }
        var words = [];
        var asciiLength = ascii.length;
        var hash = [
            0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
            0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
        ];
        var k = [
            0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
            0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
            0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
            0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
            0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
            0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
            0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
            0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
        ];
        
        ascii += '\x80';
        while (ascii.length % 64 - 56) ascii += '\x00';
        
        for (var i = 0; i < ascii.length; i++) {
            var j = ascii.charCodeAt(i);
            words[i >> 2] |= j << (24 - (i % 4) * 8);
        }
        words[words.length] = ((asciiLength >>> 29) * 8);
        words[words.length] = (asciiLength * 8);
        
        for (var chunk = 0; chunk < words.length; chunk += 16) {
            var w = words.slice(chunk, chunk + 16);
            var oldHash = hash.slice(0);
            
            for (var i = 0; i < 64; i++) {
                var w16 = w[i - 16], w15 = w[i - 15], w7 = w[i - 7], w2 = w[i - 2];
                var a = hash[0], e = hash[4];
                var temp1 = hash[7]
                    + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
                    + ((e & hash[5]) ^ (~e & hash[6]))
                    + k[i]
                    + (w[i] = (i < 16) ? w[i] : (
                            w16
                            + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
                            + w7
                            + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
                        )|0
                    );
                var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
                    + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
                
                hash = [(temp1 + temp2)|0].concat(hash);
                hash[4] = (hash[4] + temp1)|0;
            }
            
            for (var i = 0; i < 8; i++) {
                hash[i] = (hash[i] + oldHash[i])|0;
            }
        }
        
        var result = '';
        for (var i = 0; i < 8; i++) {
            for (var j = 3; j + 1; j--) {
                var b = (hash[i] >> (j * 8)) & 255;
                result += ((b < 16) ? '0' : '') + b.toString(16);
            }
        }
        return result;
    }

    // ── Submit logic ──
    function attemptUnlock() {
        const user = usernameInput.value.trim();
        const pass = passwordInput.value.trim();

        const uHash = sha256(user);
        const pHash = sha256(pass);

        const isValid = (
            // Developer credentials (admin / uad2025)
            (uHash === "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918" && pHash === "322b446a8411719a02ed50f458dc0a5cb1fa2c85bf5305dfe71f9a224494ff04") ||
            // Client credentials (client / uadclient2025)
            (uHash === "948fe603f61dc036b5c596dc09fe3ce3f3d30dc90f024c85f3c82db2ccab679d" && pHash === "20b66c4b703156e8c167eb2128d47bd7f5cecdaa3a41ec5423b12c64256fda9c")
        );

        if (isValid) {
            // ✅ Success
            errorMsg.classList.remove('visible');
            usernameInput.classList.remove('error');
            passwordInput.classList.remove('error');

            // Swap to unlocked icon
            lockIcon.innerHTML = `
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
            `;
            lockIcon.classList.add('unlocked');

            sessionStorage.setItem(STORAGE_KEY, 'true');
            document.documentElement.classList.add('uad-unlocked-html');

            setTimeout(() => {
                overlay.classList.add('unlocking');
                setTimeout(() => {
                    overlay.remove();
                    document.body.classList.remove('uad-locked');
                }, 700);
            }, 550);
        } else {
            // ❌ Wrong credentials
            usernameInput.classList.add('error');
            passwordInput.classList.add('error');
            errorMsg.classList.add('visible');

            setTimeout(() => {
                usernameInput.classList.remove('error');
                passwordInput.classList.remove('error');
            }, 600);

            if (!user) {
                usernameInput.focus();
            } else {
                passwordInput.select();
            }
        }
    }

    submitBtn.addEventListener('click', attemptUnlock);

    // Enter key moves from username → password → submit
    usernameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            passwordInput.focus();
        }
    });

    passwordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            attemptUnlock();
        }
    });

    // Clear error on new input
    [usernameInput, passwordInput].forEach(el => {
        el.addEventListener('input', () => {
            errorMsg.classList.remove('visible');
            usernameInput.classList.remove('error');
            passwordInput.classList.remove('error');
        });
    });

    // ── Particle generator ──
    function generateParticles(count) {
        let html = '';
        for (let i = 0; i < count; i++) {
            const left = Math.random() * 100;
            const delay = Math.random() * 10;
            const duration = 7 + Math.random() * 10;
            const size = 2 + Math.random() * 3;
            html += `<div class="lock-particle" style="left:${left}%;bottom:-10px;width:${size}px;height:${size}px;animation-delay:${delay}s;animation-duration:${duration}s;"></div>`;
        }
        return html;
    }
})();
