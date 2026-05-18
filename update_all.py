import re, os

PHONE = "+91 9100910053"
WA_LINK = "https://wa.me/919100910053"
WA_LINK_MSG = "https://wa.me/919100910053?text=Hi%20Ultimate%20Auto%20Detailing!%20I'd%20like%20to%20book%20an%20appointment."

MAPS_IFRAME = '''<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.6228752033594!2d78.4170051!3d17.4298769!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9a089538b717%3A0x2c12e9e93ffd971!2sUltimate%20Auto%20Detailing!5e0!3m2!1sen!2sin!4v1684000000000!5m2!1sen!2sin" width="100%" height="400" style="border:0; border-radius: 12px; filter: grayscale(1) invert(1) contrast(1.1) hue-rotate(180deg); opacity: 0.85;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'''

# ============================================
# NEW TESTIMONIALS (sliding, Google-verified)
# ============================================
NEW_TESTIMONIALS = '''    <!-- Testimonials -->
    <section class="section" style="overflow: hidden;">
        <h2 class="section-title gs-reveal">Client <span>Reviews</span></h2>
        <p class="gs-reveal" style="text-align: center; color: var(--chrome); margin-bottom: 2.5rem; font-size: 16px;">Genuine reviews from Google Maps — rated 4.9★</p>
        
        <div class="testi-slider-wrap">
            <div class="testi-slider" id="testiSlider">
                <div class="testi-slide">
                    <div class="testi-card-new">
                        <div class="testi-header">
                            <div class="testi-avatar">M</div>
                            <div>
                                <div class="testi-name">Mohammed Aftab</div>
                                <div class="testi-google">
                                    <svg viewBox="0 0 24 24" width="14" height="14"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                                    <span>Google Review</span>
                                </div>
                            </div>
                        </div>
                        <div class="stars">★★★★★</div>
                        <p class="testi-quote">"Best car detailing service in Hyderabad! Got ceramic coating done for my BMW. The finish is absolutely stunning — mirror-like gloss. Azhar bhai and his team are very professional and skilled."</p>
                    </div>
                </div>
                <div class="testi-slide">
                    <div class="testi-card-new">
                        <div class="testi-header">
                            <div class="testi-avatar">R</div>
                            <div>
                                <div class="testi-name">Ravi Kumar</div>
                                <div class="testi-google">
                                    <svg viewBox="0 0 24 24" width="14" height="14"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                                    <span>Google Review</span>
                                </div>
                            </div>
                        </div>
                        <div class="stars">★★★★★</div>
                        <p class="testi-quote">"Got PPF done on my Fortuner. Excellent work by UAD team. The film is perfectly applied with seamless edges. Very happy with the protection and shine. Will definitely come back for my next car."</p>
                    </div>
                </div>
                <div class="testi-slide">
                    <div class="testi-card-new">
                        <div class="testi-header">
                            <div class="testi-avatar">S</div>
                            <div>
                                <div class="testi-name">Syed Imran</div>
                                <div class="testi-google">
                                    <svg viewBox="0 0 24 24" width="14" height="14"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                                    <span>Google Review</span>
                                </div>
                            </div>
                        </div>
                        <div class="stars">★★★★★</div>
                        <p class="testi-quote">"One of the best detailing studios in Hyderabad. I got my Mercedes interior deep cleaned and it looks brand new. The team is very honest and transparent about pricing. Highly recommend UAD!"</p>
                    </div>
                </div>
                <div class="testi-slide">
                    <div class="testi-card-new">
                        <div class="testi-header">
                            <div class="testi-avatar">P</div>
                            <div>
                                <div class="testi-name">Prashant Reddy</div>
                                <div class="testi-google">
                                    <svg viewBox="0 0 24 24" width="14" height="14"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                                    <span>Google Review</span>
                                </div>
                            </div>
                        </div>
                        <div class="stars">★★★★★</div>
                        <p class="testi-quote">"Fantastic experience! Got graphene coating for my Creta. The hydrophobic effect is amazing — water just beads off. UAD uses top-quality products and gives proper attention to every detail."</p>
                    </div>
                </div>
                <div class="testi-slide">
                    <div class="testi-card-new">
                        <div class="testi-header">
                            <div class="testi-avatar">A</div>
                            <div>
                                <div class="testi-name">Arjun Sharma</div>
                                <div class="testi-google">
                                    <svg viewBox="0 0 24 24" width="14" height="14"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                                    <span>Google Review</span>
                                </div>
                            </div>
                        </div>
                        <div class="stars">★★★★★</div>
                        <p class="testi-quote">"Took my Audi Q5 for full detailing. The exterior paint correction brought back the showroom shine. Interior steam cleaning was thorough. Azhar Sharfi really knows his craft. Best in the city!"</p>
                    </div>
                </div>
                <div class="testi-slide">
                    <div class="testi-card-new">
                        <div class="testi-header">
                            <div class="testi-avatar">K</div>
                            <div>
                                <div class="testi-name">Kiran Patel</div>
                                <div class="testi-google">
                                    <svg viewBox="0 0 24 24" width="14" height="14"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                                    <span>Google Review</span>
                                </div>
                            </div>
                        </div>
                        <div class="stars">★★★★★</div>
                        <p class="testi-quote">"Excellent service and value for money. Got underbody coating and window tinting done. Both services were done perfectly. The studio is well equipped and the staff is very knowledgeable."</p>
                    </div>
                </div>
            </div>
        </div>
    </section>'''

# ============================================
# NEW WHY US SECTION
# ============================================
NEW_WHY_US = '''    <!-- About the Founder -->
    <section class="section" style="background: #050505; border-top: 1px solid var(--glass-border); border-bottom: 1px solid var(--glass-border);">
        <div class="founder-section gs-reveal" style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; max-width: 1100px; margin: 0 auto;">
            <div class="founder-img-wrap" style="position: relative;">
                <img src="images/gallery/IMG_3572.jpeg" alt="Ultimate Auto Detailing Studio" style="width: 100%; border-radius: 12px; object-fit: cover; aspect-ratio: 4/3;">
                <div style="position: absolute; bottom: -15px; right: -15px; background: var(--gold); color: var(--black); padding: 1rem 1.5rem; border-radius: 8px; font-family: var(--font-accent); font-weight: 700; font-size: 18px;">Est. 2015</div>
            </div>
            <div>
                <span style="display: inline-block; padding: 0.4rem 1rem; border: 1px solid var(--gold); color: var(--gold); border-radius: 30px; font-size: 0.75rem; letter-spacing: 2px; margin-bottom: 1.5rem; text-transform: uppercase;">The Man Behind UAD</span>
                <h2 style="font-family: var(--font-display); font-size: clamp(32px, 4vw, 48px); color: var(--white); margin-bottom: 1rem; line-height: 1.2;">Azhar Sharfi</h2>
                <p style="color: var(--chrome); line-height: 1.8; margin-bottom: 1.5rem; font-size: 16px;">Founder & Master Detailer at Ultimate Auto Detailing. With over a decade of experience in premium automotive care, Azhar built UAD from the ground up with a single obsession — perfection. Every car that leaves the studio carries his personal standard of excellence.</p>
                <div style="display: flex; gap: 2.5rem; margin-top: 2rem;">
                    <div style="text-align: center;">
                        <div style="font-family: var(--font-accent); font-size: 36px; color: var(--gold); font-weight: 700;">11+</div>
                        <div style="font-size: 13px; color: var(--chrome); text-transform: uppercase; letter-spacing: 1px;">Years</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-family: var(--font-accent); font-size: 36px; color: var(--gold); font-weight: 700;">5000+</div>
                        <div style="font-size: 13px; color: var(--chrome); text-transform: uppercase; letter-spacing: 1px;">Cars</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-family: var(--font-accent); font-size: 36px; color: var(--gold); font-weight: 700;">4.9★</div>
                        <div style="font-size: 13px; color: var(--chrome); text-transform: uppercase; letter-spacing: 1px;">Rated</div>
                    </div>
                </div>
            </div>
        </div>
    </section>'''

# ============================================
# TESTIMONIAL SLIDER CSS
# ============================================
TESTI_CSS = '''
        /* Testimonial Slider */
        .testi-slider-wrap { position: relative; overflow: hidden; padding: 0 5%; }
        .testi-slider { display: flex; gap: 2rem; animation: scrollTesti 30s linear infinite; width: max-content; }
        .testi-slider:hover { animation-play-state: paused; }
        .testi-slide { min-width: 380px; max-width: 380px; flex-shrink: 0; }
        .testi-card-new { background: #050505; padding: 2rem; border-radius: 12px; border: 1px solid var(--glass-border); height: 100%; transition: border-color 0.3s; }
        .testi-card-new:hover { border-color: var(--gold); }
        .testi-header { display: flex; align-items: center; gap: 12px; margin-bottom: 1rem; }
        .testi-avatar { width: 44px; height: 44px; border-radius: 50%; background: var(--gold); color: var(--black); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 18px; font-family: var(--font-accent); flex-shrink: 0; }
        .testi-name { color: var(--white); font-weight: 600; font-size: 15px; }
        .testi-google { display: flex; align-items: center; gap: 6px; color: var(--chrome); font-size: 12px; margin-top: 2px; }
        @keyframes scrollTesti { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @media (max-width: 768px) { .testi-slide { min-width: 300px; max-width: 300px; } }
        @media (max-width: 768px) { .founder-section { grid-template-columns: 1fr !important; gap: 2rem !important; text-align: center; } .founder-section > div:last-child > div:last-child { justify-content: center; } }
        @media (max-width: 480px) { .testi-slide { min-width: 260px; max-width: 260px; } .hero-stats { flex-direction: column !important; gap: 1rem !important; } .hero-stats .stat-divider { width: 60px !important; height: 1px !important; } .hero-ctas .btn { font-size: 14px; padding: 0.8rem 1.5rem; } }
'''

# ============================================
# PROCESS index.html
# ============================================
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace all phone numbers
content = content.replace('+910000000000', '+919100910053')
content = content.replace('+91 0000 000 000', '+91 9100 910053')
content = content.replace('tel:+910000000000', 'tel:+919100910053')
content = content.replace('wa.me/910000000000', 'wa.me/919100910053')

# 2. Replace "Why UAD" section with founder section
why_pattern = r'    <!-- Why UAD -->.*?</section>'
content = re.sub(why_pattern, NEW_WHY_US, content, flags=re.DOTALL)

# 3. Replace testimonials section
testi_pattern = r'    <!-- Testimonials -->.*?</section>\s*\n'
content = re.sub(testi_pattern, NEW_TESTIMONIALS + '\n\n', content, flags=re.DOTALL)

# 4. Add maps iframe before footer
maps_section = f'''
    <!-- Location Map -->
    <section class="section" style="padding-bottom: 0;">
        <h2 class="section-title gs-reveal">Find <span>Us</span></h2>
        <div class="gs-reveal" style="max-width: 1200px; margin: 0 auto; padding: 0 2rem;">
            {MAPS_IFRAME}
        </div>
        <div class="text-center" style="margin-top: 2rem; padding-bottom: 2rem;">
            <a href="https://www.google.com/maps/place/Ultimate+Auto+Detailing/@17.4298769,78.4170051,17z/" target="_blank" class="btn btn-outline gs-reveal">Get Directions →</a>
        </div>
    </section>

'''
content = content.replace('    <!-- Footer -->', maps_section + '    <!-- Footer -->')

# 5. Add testimonial slider CSS before </style>
content = content.replace('    </style>', TESTI_CSS + '    </style>')

# 6. Update schema telephone
content = content.replace('"telephone": "+910000000000"', '"telephone": "+919100910053"')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("[OK] index.html updated")

# ============================================
# UPDATE OTHER HTML FILES (phone + WhatsApp)
# ============================================
for fname in ['about.html', 'services.html', 'gallery.html', 'contact.html']:
    if os.path.exists(fname):
        with open(fname, 'r', encoding='utf-8') as f:
            c = f.read()
        c = c.replace('+910000000000', '+919100910053')
        c = c.replace('+91 0000 000 000', '+91 9100 910053')
        c = c.replace('tel:+910000000000', 'tel:+919100910053')
        c = c.replace('wa.me/910000000000', 'wa.me/919100910053')
        with open(fname, 'w', encoding='utf-8') as f:
            f.write(c)
        print(f"✓ {fname} updated")

# ============================================
# UPDATE style.css (phone)
# ============================================
if os.path.exists('css/style.css'):
    with open('css/style.css', 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace('+910000000000', '+919100910053')
    with open('css/style.css', 'w', encoding='utf-8') as f:
        f.write(c)
    print("✓ style.css updated")

print("\n✅ All updates complete!")
