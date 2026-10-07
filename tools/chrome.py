"""Shared header / footer for every page. Used by tools/sync_chrome.py"""
PAGES = [
    # file, nav label, mobile label
    ("about.html",     "About",        "About"),
    ("education.html", "Edu Kits",     "Edu Kits"),
    ("matlab.html",    "MATLAB®",      "MATLAB® Ecosystems"),
    ("training.html",  "Training",     "Cari-On Learning"),
    ("industry.html",  "Industry",     "Industry — CAPMAC & Consulting"),
    ("labs.html",      "In the Labs",  "In the Labs"),
]

def nav(active):
    desk = ""
    for f, lab, _ in PAGES:
        cur = ' class="active" aria-current="page"' if f == active else ""
        desk += f'        <a href="{f}"{cur}>{lab}</a>\n'
    mob = ""
    for f, _, lab in PAGES:
        cur = ' class="active" aria-current="page"' if f == active else ""
        mob += f'    <a href="{f}"{cur}>{lab}</a>\n'
    home_cur = ' aria-current="page"' if active == "index.html" else ""
    home_cls = ' class="active" aria-current="page"' if active == "index.html" else ""
    desk = f'        <a href="index.html"{home_cls}>Home</a>\n' + desk
    return f'''<!-- CHROME:NAV:START (edit tools/sync_chrome.py, then run it — do not hand-edit) -->
<nav id="navbar">
    <a href="index.html" class="nav-logo"{home_cur}>
        <img src="images/carimo-logo.png" alt="CARIMO" onerror="this.style.display='none'">
        <div class="nav-logo-text">
            <div class="name">CARIMO Technologies<span class="long"> Private Limited</span></div>
            <span class="sub">Engineering Smarter Futures</span>
        </div>
    </a>
    <div class="nav-links">
{desk}        <a href="about.html#contact" class="btn btn-primary" style="padding:9px 20px;min-height:auto;">Contact</a>
    </div>
    <button class="hamburger" id="hamburger" aria-label="Menu">
        <span></span><span></span><span></span>
    </button>
</nav>
<div class="mobile-menu" id="mobile-menu">
    <a href="index.html">Home</a>
{mob}    <a href="about.html#team">Team</a>
    <a href="about.html#contact" style="color:var(--accent)">Contact Us →</a>
</div>
<!-- CHROME:NAV:END -->'''

def footer():
    links = "".join(f'<a href="{f}">{lab}</a>' for f, lab, _ in PAGES)
    return f'''<!-- CHROME:FOOTER:START (edit tools/sync_chrome.py, then run it — do not hand-edit) -->
<footer>
    <div class="foot-grid">
        <div class="foot-brand">
            <a href="index.html" class="foot-logo-link" aria-label="CARIMO Technologies — home"><img class="foot-logo" src="images/carimo-logo-hd.png" alt="CARIMO" width="640" height="346" loading="lazy" onerror="this.parentNode.style.display='none'"></a>
            <strong>CARIMO Technologies Private Limited</strong>
            <p>Engineering Smarter Futures. Deep tech AI and hands-on engineering kits, incubated at SINE, IIT Bombay.</p>
            <a href="https://www.linkedin.com/company/carimo-technologies-private-limited" target="_blank" rel="noopener" class="foot-li">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"/></svg>
                Follow us on LinkedIn
            </a>
        </div>
        <nav class="foot-col" aria-label="Site pages">
            <h5>Explore</h5>
            <a href="index.html">Home</a>{links}
        </nav>
        <div class="foot-col">
            <h5>Resources</h5>
            <a href="education.html#downloads">Brochures &amp; downloads</a>
            <a href="matlab.html#brochure">MATLAB® ecosystems brochure</a>
            <a href="https://drive.google.com/file/d/1bKcuv3Nx6cHdFZF-zc6qmbaVbut-HGDj/view?usp=drive_link" target="_blank" rel="noopener">Warranty T&amp;C</a>
        </div>
        <div class="foot-col">
            <h5>Contact</h5>
            <a href="mailto:contact@carimo.tech">contact@carimo.tech</a>
            <p>#203, Palm-1, Royal Palms Estate, Aarey Colony, Goregaon (E), Mumbai — 400 065</p>
        </div>
    </div>
    <div class="foot-base">
        <p>© 2026 CARIMO Technologies Private Limited. All rights reserved.</p>
        <p>MATLAB<sup>®</sup> and Simulink<sup>®</sup> are registered trademarks of The MathWorks, Inc.</p>
    </div>
</footer>
<!-- CHROME:FOOTER:END -->'''
