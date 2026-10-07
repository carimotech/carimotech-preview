/* CARIMO site scripts — shared by every page. Blocks guard for missing elements. */
    // Navbar
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        document.getElementById('back-top').classList.toggle('visible', window.scrollY > 400);
    });

    // Hamburger
    const ham = document.getElementById('hamburger');
    const mob = document.getElementById('mobile-menu');
    ham.addEventListener('click', () => {
        ham.classList.toggle('open');
        mob.classList.toggle('open');
        document.body.style.overflow = mob.classList.contains('open') ? 'hidden' : '';
    });
    function closeMobile() {
        ham.classList.remove('open'); mob.classList.remove('open');
        document.body.style.overflow = '';
    }

    // Tabs
    function switchTab(e, tab) {
        document.querySelectorAll('.edu-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.edu-panel').forEach(p => p.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const panel = document.getElementById('panel-' + tab);
        panel.classList.add('active');
        panel.querySelectorAll('.fade-up').forEach(el => {
            el.classList.remove('vis');
            requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('vis')));
        });
    }

    // Fade-up scroll observer
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } });
    }, { threshold: 0.07 });
    document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));

    // Survey bars animate when scrolled into view
    const barObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.querySelectorAll('.sbar-fill').forEach((f, i) => {
                    setTimeout(() => { f.style.width = f.dataset.w + '%'; }, i * 90);
                });
                barObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.3 });
    const sb = document.getElementById('survey-bars');
    if (sb) barObs.observe(sb);

    // Brochure form — submit without leaving the page
    const bForm = document.getElementById('brochure-form');
    if (bForm) {
        bForm.addEventListener('submit', async (ev) => {
            if (bForm.action.indexOf('YOUR_FORM_ID') !== -1) return; // not configured yet — let it behave normally
            ev.preventDefault();
            const btn = bForm.querySelector('button');
            const original = btn.innerHTML;
            btn.innerHTML = 'Sending…';
            btn.disabled = true;
            try {
                const res = await fetch(bForm.action, {
                    method: 'POST',
                    body: new FormData(bForm),
                    headers: { 'Accept': 'application/json' }
                });
                if (res.ok) {
                    bForm.style.display = 'none';
                    document.getElementById('brochure-msg').classList.add('show');
                } else {
                    btn.innerHTML = 'Try again';
                    btn.disabled = false;
                }
            } catch (err) {
                btn.innerHTML = original;
                btn.disabled = false;
                window.location.href = 'mailto:contact@carimo.tech?subject=Brochure%20request';
            }
        });
    }

/* ═══ UPGRADE v2 — interactivity ═══ */
(function () {
    'use strict';
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var $ = function (q, r) { return (r || document).querySelector(q); };
    var $$ = function (q, r) { return Array.prototype.slice.call((r || document).querySelectorAll(q)); };

    /* ---------- Toast ---------- */
    var toastEl = $('#toast'), toastT;
    function toast(msg) {
        toastEl.textContent = msg; toastEl.classList.add('show');
        clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 2200);
    }

    /* ---------- Scroll progress + scroll-spy ---------- */
    var prog = $('#progress');
    function onScroll() {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        prog.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, window.scrollY / h) : 0) + ')';
    }
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

    /* ---------- Hamburger a11y ---------- */
    var ham = $('#hamburger');
    if (ham) {
        ham.setAttribute('aria-expanded', 'false'); ham.setAttribute('aria-controls', 'mobile-menu');
        ham.addEventListener('click', function () { ham.setAttribute('aria-expanded', ham.classList.contains('open') ? 'true' : 'false'); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && ham.classList.contains('open')) { closeMobile(); ham.setAttribute('aria-expanded', 'false'); } });
    }

    /* ---------- Edu tabs: ARIA, arrow keys, sliding indicator ---------- */
    var tabs = $('.edu-tabs');
    if (tabs) {
        var btns = $$('.edu-tab', tabs);
        tabs.setAttribute('role', 'tablist');
        var ind = document.createElement('span'); ind.className = 'tab-ind'; tabs.insertBefore(ind, tabs.firstChild);
        var ids = ['mlk', 'dcmk'];
        btns.forEach(function (b, i) {
            b.setAttribute('role', 'tab'); b.setAttribute('aria-controls', 'panel-' + ids[i]);
            b.setAttribute('aria-selected', b.classList.contains('active') ? 'true' : 'false');
            b.tabIndex = b.classList.contains('active') ? 0 : -1;
            b.addEventListener('click', function () { setTimeout(syncTabs, 0); });
            b.addEventListener('keydown', function (e) {
                var d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
                if (!d) return; e.preventDefault();
                var n = btns[(i + d + btns.length) % btns.length]; n.focus(); n.click();
            });
        });
        $$('.edu-panel').forEach(function (p) { p.setAttribute('role', 'tabpanel'); });
        var syncTabs = function () {
            var a = $('.edu-tab.active', tabs); if (!a) return;
            btns.forEach(function (b) { var on = b === a; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; });
            ind.style.left = a.offsetLeft + 'px'; ind.style.top = a.offsetTop + 'px';
            ind.style.width = a.offsetWidth + 'px'; ind.style.height = a.offsetHeight + 'px';
        };
        syncTabs(); window.addEventListener('resize', syncTabs);
        if (location.hash === '#dcmk' && btns[1]) btns[1].click();
        window.addEventListener('hashchange', function () { if (location.hash === '#dcmk' && btns[1]) btns[1].click(); else if (location.hash === '#mlk' && btns[0]) btns[0].click(); });
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncTabs);
    }

    /* ---------- Count-up numbers ---------- */
    var counters = $$('.trust-item .num, .mx-num .n, .founder-nums .n').filter(function (el) { return /^\d+\+?$/.test(el.textContent.trim()); });
    if (!reduce && 'IntersectionObserver' in window) {
        var cObs = new IntersectionObserver(function (es) {
            es.forEach(function (e) {
                if (!e.isIntersecting) return; cObs.unobserve(e.target);
                var el = e.target, raw = el.textContent.trim(), plus = raw.slice(-1) === '+', end = parseInt(raw, 10), t0 = performance.now(), dur = 1300;
                (function tick(now) {
                    var k = Math.min(1, (now - t0) / dur), v = Math.round(end * (1 - Math.pow(1 - k, 3)));
                    el.textContent = v + (k === 1 && plus ? '+' : ''); if (k < 1) requestAnimationFrame(tick); else el.textContent = raw;
                })(t0);
            });
        }, { threshold: 0.6 });
        counters.forEach(function (el) { cObs.observe(el); });
    }

    /* ---------- Lightbox for ecosystem diagrams ---------- */
    var lb = $('#lightbox'), lbImg = $('img', lb), lastFocus;
    function openLB(src, alt) { lastFocus = document.activeElement; lbImg.src = src; lbImg.alt = alt || ''; lb.hidden = false; document.body.style.overflow = 'hidden'; $('.lb-close', lb).focus(); }
    function closeLB() { lb.hidden = true; lbImg.removeAttribute('src'); document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
    $$('.mx-figure a').forEach(function (a) {
        a.addEventListener('click', function (e) {
            var img = $('img', a); if (!img || !img.complete || !img.naturalWidth) return; // fall back to normal link
            e.preventDefault(); openLB(a.getAttribute('href'), img.alt);
        });
    });
    lb.addEventListener('click', closeLB);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !lb.hidden) closeLB(); });

    /* ---------- Spotlight on CAPMAC cards ---------- */
    $$('.capmac-card, .obj-card, .dc-hl, .learn-card, .consult-card, .team-card, .contact-card, .quote-card, .res-btn, .video-card, .mx-card, .stat-box, .dept-card, .fmt-card, .prod-card, .what-card, .pil-card, .ab-facts, .tile, .spec-table').forEach(function (c) {
        c.addEventListener('pointermove', function (e) { var r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px'); });
    });

    /* ---------- Home section dots (scroll-spy) ---------- */
    var dotLinks = $$('.dots a');
    if (dotLinks.length && 'IntersectionObserver' in window) {
        var dMap = {};
        dotLinks.forEach(function (a) { dMap[a.getAttribute('href').slice(1)] = a; });
        var dObs = new IntersectionObserver(function (es) {
            es.forEach(function (e) {
                if (!e.isIntersecting) return;
                dotLinks.forEach(function (a) { a.classList.remove('on'); });
                if (dMap[e.target.id]) dMap[e.target.id].classList.add('on');
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        Object.keys(dMap).forEach(function (id) { var el = document.getElementById(id); if (el) dObs.observe(el); });
    }

    /* ---------- Card tilt (pointer devices, motion allowed) ---------- */
    if (!reduce && window.matchMedia('(hover: hover)').matches) {
        $$('.pil-card, .what-card, .dc-hl, .fmt-card, .prod-card, .contact-card, .team-card, .learn-card, .consult-card, .ind-card, .feat-card, .obj-card').forEach(function (el) {
            el.addEventListener('pointermove', function (e) {
                var r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
                var k = r.width > 420 ? 2.2 : 5;
                el.style.transition = 'transform .12s ease-out, box-shadow .3s, background-size .45s';
                el.style.transform = 'perspective(1000px) rotateX(' + (-py * k).toFixed(2) + 'deg) rotateY(' + (px * k * 1.2).toFixed(2) + 'deg) translateY(-5px)';
            });
            el.addEventListener('pointerleave', function () { el.style.transition = ''; el.style.transform = ''; });
        });
    }

    /* ---------- Hero background video: only fetched on larger screens, never on data-saver / reduced motion ---------- */
    var hv = $('.hero-video');
    if (hv) {
        var saver = navigator.connection && navigator.connection.saveData;
        var small = window.matchMedia('(max-width: 700px)').matches;
        if (reduce || saver || small) { hv.remove(); }          // the poster frame (.hero-poster) stays as the background
        else if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (es) { es[0].isIntersecting ? hv.play().catch(function () {}) : hv.pause(); }, { threshold: 0.05 }).observe(hv);
        } else { hv.play().catch(function () {}); }
    }

    /* ---------- Copy email ---------- */
    var cp = $('#copy-email');
    if (cp) cp.addEventListener('click', function () {
        var v = cp.dataset.copy;
        function ok() { toast('Email copied'); }
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(v).then(ok, function () { window.location.href = 'mailto:' + v; });
        else window.location.href = 'mailto:' + v;
    });

    /* ═══ HERO SIMULATION — first-order DC motor speed loop ═══ */
    var cv = $('#sim-canvas'); if (!cv) return;
    var ctx = cv.getContext('2d'), dpr = Math.min(2, window.devicePixelRatio || 1), W = 0, H = 0;
    var DT = 0.01, N = 900;                       // 9 s window
    var TAU = 0.6, K = 1.2, DELAY = 6, LOAD = 0.3, LO = 0.5, HI = 0.9;
    var mode = 'PI', kp = 4, loadOn = false, r = LO;
    var y = 0, integ = 0, dPrev = 0, yPrev = 0, uBuf = [], tSim = 0, nextToggle = 5;
    var buf = { r: new Float32Array(N), y: new Float32Array(N), l: new Uint8Array(N) }, head = 0, filled = 0;

    var NOTES = {
        P: 'P only: quick to respond, but it settles short of the setpoint, and a load widens the gap. Raise the gain to shrink it and watch the ringing appear.',
        PI: 'PI: the integral term keeps pushing until the error is gone, even with the load on. This is the workhorse of speed control.',
        PID: 'PID: the derivative term reacts to how fast the speed is changing, so it damps the overshoot you get at higher gain.'
    };
    function resetState() { y = 0; integ = 0; dPrev = 0; yPrev = 0; uBuf = []; for (var i = 0; i < DELAY; i++) uBuf.push(0); head = 0; filled = 0; tSim = 0; nextToggle = 5; r = LO; }
    function step() {
        var e = r - y, ki = kp / 0.7, kd = kp * 0.06, u;
        var p = kp * e;
        if (mode !== 'P') integ = Math.max(-1.5, Math.min(1.5, integ + ki * e * DT)); else integ = 0;
        var dRaw = -(y - yPrev) / DT; dPrev += 0.2 * (dRaw - dPrev); yPrev = y;
        u = p + (mode !== 'P' ? integ : 0) + (mode === 'PID' ? kd * dPrev : 0);
        u = Math.max(0, Math.min(2, u));
        uBuf.push(u); var ud = uBuf.shift();
        y += DT * (-y + K * ud - (loadOn ? LOAD : 0)) / TAU;
        if (y < 0) y = 0;
        buf.r[head] = r; buf.y[head] = y; buf.l[head] = loadOn ? 1 : 0; head = (head + 1) % N; if (filled < N) filled++;
        tSim += DT;
        if (tSim >= nextToggle) { r = r === LO ? HI : LO; nextToggle = tSim + 5; }
    }
    function prefill() { resetState(); for (var i = 0; i < N; i++) { if (i === 150) r = HI; if (i === 520) r = LO; step_noauto(); } nextToggle = tSim + 3; }
    function step_noauto() { var save = nextToggle; nextToggle = 1e9; step(); nextToggle = save; }

    function size() {
        var w = cv.clientWidth, h = cv.clientHeight; if (!w || !h) return;
        W = w; H = h; cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function cssv(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
    function draw() {
        if (!W) return;
        var pad = { l: 38, r: 10, t: 16, b: 22 }, pw = W - pad.l - pad.r, ph = H - pad.t - pad.b, ymax = 1.3;
        var navRgb = cssv('--ink-rgb'), accent = cssv('--accent-text'), navy = cssv('--ink'), dim = cssv('--text-dim'), font = "600 13px " + cssv('--font-body');
        ctx.clearRect(0, 0, W, H);
        function Y(v) { return pad.t + ph * (1 - v / ymax); }
        // grid
        ctx.font = font; ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.lineWidth = 1;
        [0, 0.5, 1].forEach(function (g) {
            ctx.strokeStyle = 'rgba(' + navRgb + ',0.10)'; ctx.beginPath(); ctx.moveTo(pad.l, Y(g) + .5); ctx.lineTo(W - pad.r, Y(g) + .5); ctx.stroke();
            ctx.fillStyle = dim; ctx.fillText(g.toFixed(1), pad.l - 8, Y(g));
        });
        if (!filled) return;
        var start = filled < N ? 0 : head, n = filled;
        function X(i) { return pad.l + pw * (i / (N - 1)); }
        // load bands
        ctx.fillStyle = 'rgba(' + navRgb + ',0.07)'; var bs = -1;
        for (var i = 0; i <= n; i++) {
            var on = i < n && buf.l[(start + i) % N];
            if (on && bs < 0) bs = i;
            if ((!on || i === n) && bs >= 0) { ctx.fillRect(X(bs), pad.t, X(i) - X(bs), ph); ctx.fillStyle = dim; ctx.textAlign = 'left'; ctx.fillText('load', X(bs) + 6, pad.t + 10); ctx.fillStyle = 'rgba(' + navRgb + ',0.07)'; bs = -1; }
        }
        // setpoint
        ctx.setLineDash([6, 5]); ctx.strokeStyle = navy; ctx.lineWidth = 2; ctx.beginPath();
        for (i = 0; i < n; i++) { var rv = buf.r[(start + i) % N]; i ? ctx.lineTo(X(i), Y(rv)) : ctx.moveTo(X(i), Y(rv)); } ctx.stroke(); ctx.setLineDash([]);
        // speed
        ctx.strokeStyle = accent; ctx.lineWidth = 3; ctx.lineJoin = 'round'; ctx.beginPath();
        for (i = 0; i < n; i++) { var yv = buf.y[(start + i) % N]; i ? ctx.lineTo(X(i), Y(yv)) : ctx.moveTo(X(i), Y(yv)); } ctx.stroke();
        var last = buf.y[(start + n - 1) % N];
        ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(X(n - 1), Y(last), 4.5, 0, 6.283); ctx.fill();
    }

    var errEl = $('#sim-err'), noteEl = $('#sim-note'), lastErrT = 0;
    function updateErr() { errEl.textContent = (r - y).toFixed(2); }
    function setNote() { noteEl.textContent = NOTES[mode]; }

    var running = false, visible = true, prev = 0, acc = 0;
    function frame(now) {
        if (!running) return;
        var dt = Math.min(0.1, (now - prev) / 1000); prev = now; acc += dt;
        while (acc >= DT) { step(); acc -= DT; }
        draw(); if (now - lastErrT > 150) { updateErr(); lastErrT = now; }
        requestAnimationFrame(frame);
    }
    function start() { if (reduce || running || !visible || document.hidden) return; running = true; prev = performance.now(); requestAnimationFrame(frame); }
    function stop() { running = false; }
    function restatic() { prefill(); draw(); updateErr(); }
    function restart() { if (reduce) restatic(); else { prefill(); draw(); updateErr(); } }

    // Controls
    $$('.seg-btn').forEach(function (b) {
        b.addEventListener('click', function () {
            mode = b.dataset.mode; $$('.seg-btn').forEach(function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on); });
            setNote(); if (reduce) restatic();
        });
    });
    var kpIn = $('#sim-kp'), kpOut = $('#sim-kp-out');
    kpIn.addEventListener('input', function () { kp = parseFloat(kpIn.value); kpOut.textContent = kp.toFixed(1); if (reduce) restatic(); });
    var loadBtn = $('#sim-load');
    loadBtn.addEventListener('click', function () { loadOn = !loadOn; loadBtn.setAttribute('aria-pressed', loadOn); loadBtn.textContent = loadOn ? 'Remove load' : 'Apply load'; if (reduce) restatic(); });
    $('#sim-step').addEventListener('click', function () { r = r === LO ? HI : LO; nextToggle = tSim + 5; if (reduce) { for (var i = 0; i < 300; i++) step_noauto(); draw(); updateErr(); } });

    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; visible ? start() : stop(); }, { threshold: 0.05 }).observe(cv);
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
    if ('ResizeObserver' in window) new ResizeObserver(function () { size(); draw(); }).observe(cv); else window.addEventListener('resize', function () { size(); draw(); });

    window.addEventListener('palettechange', function () { draw(); });
    size(); setNote(); prefill(); draw(); updateErr(); start();
})();

/* ═══ ML Kit ecosystem explorer: animated, draggable ═══ */
(function () {
    'use strict';
    [].slice.call(document.querySelectorAll('.eco')).forEach(initEco);
    function initEco(root) {
    var stage = root.querySelector('.eco-stage'); if (!stage) return;
    var mqWide = window.matchMedia('(min-width: 921px)');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var nodes = [].slice.call(stage.querySelectorAll('.eco-node'));
    var coreImg = stage.querySelector('.eco-core img') || stage.querySelector('.eco-core');
    var svg = stage.querySelector('.eco-lines'), NS = 'http://www.w3.org/2000/svg';
    var home = nodes.map(function (n) { return { x: +n.dataset.x, y: +n.dataset.y }; });
    var state = home.map(function (h) { return { x: h.x, y: h.y }; });
    var lines = [], dots = [], hot = -1, running = false, visible = true;

    nodes.forEach(function (n, i) {
        var p = document.createElementNS(NS, 'path'); p.setAttribute('class', 'eco-line'); svg.appendChild(p); lines.push(p);
        var d = document.createElementNS(NS, 'circle'); d.setAttribute('r', '4.5'); d.setAttribute('class', 'eco-dot'); svg.appendChild(d); dots.push(d);
        n.addEventListener('pointerenter', function () { hot = i; });
        n.addEventListener('pointerleave', function () { if (!drag) hot = -1; });
        n.addEventListener('focus', function () { hot = i; });
        n.addEventListener('blur', function () { hot = -1; });
    });

    function apply(i) { nodes[i].style.setProperty('--x', state[i].x + '%'); nodes[i].style.setProperty('--y', state[i].y + '%'); }
    function centre(el, s) { var r = el.getBoundingClientRect(); return { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height / 2 }; }

    function draw(t) {
        if (!mqWide.matches) return;
        var s = stage.getBoundingClientRect(); if (!s.width) return;
        svg.setAttribute('viewBox', '0 0 ' + s.width + ' ' + s.height);
        var c = centre(coreImg, s);
        nodes.forEach(function (n, i) {
            var p = centre(n, s), mx = (c.x + p.x) / 2, my = (c.y + p.y) / 2, dx = p.x - c.x, dy = p.y - c.y, len = Math.sqrt(dx * dx + dy * dy) || 1;
            var bend = 0.09 * len, cx = mx - dy / len * bend, cy = my + dx / len * bend;
            lines[i].setAttribute('d', 'M' + c.x.toFixed(1) + ' ' + c.y.toFixed(1) + ' Q' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ' ' + p.x.toFixed(1) + ' ' + p.y.toFixed(1));
            lines[i].classList.toggle('on', hot === i);
            var L = lines[i].getTotalLength(), f = ((t || 0) / 3200 + i * 0.21) % 1;
            var pt = lines[i].getPointAtLength(f * L);
            dots[i].setAttribute('cx', pt.x); dots[i].setAttribute('cy', pt.y); dots[i].style.opacity = reduce ? 0 : 1;
        });
    }
    function loop(t) { if (!running) return; draw(t); requestAnimationFrame(loop); }
    function start() { if (reduce || running || !visible || document.hidden) return; running = true; requestAnimationFrame(loop); }
    function stop() { running = false; }

    // ---- dragging
    var drag = null;
    function end(e) { if (!drag) return; drag.n.classList.remove('drag'); try { drag.n.releasePointerCapture(e.pointerId); } catch (x) {} drag = null; hot = -1; if (reduce) draw(0); }
    nodes.forEach(function (n, i) {
        n.addEventListener('pointerdown', function (e) {
            if (!mqWide.matches || e.button > 0) return;
            var r = n.getBoundingClientRect();
            drag = { n: n, i: i, ox: e.clientX - (r.left + r.width / 2), oy: e.clientY - (r.top + r.height / 2) };
            n.setPointerCapture(e.pointerId); n.classList.add('drag'); n.classList.remove('anim'); hot = i;
        });
        n.addEventListener('pointermove', function (e) {
            if (!drag || drag.n !== n) return;
            var s = stage.getBoundingClientRect(), r = n.getBoundingClientRect(), hw = r.width / 2, hh = r.height / 2;
            var cx = Math.max(hw, Math.min(s.width - hw, e.clientX - drag.ox - s.left));
            var cy = Math.max(hh, Math.min(s.height - hh, e.clientY - drag.oy - s.top));
            state[i] = { x: cx / s.width * 100, y: cy / s.height * 100 }; apply(i); if (reduce) draw(0);
        });
        n.addEventListener('pointerup', end); n.addEventListener('pointercancel', end);
        n.addEventListener('keydown', function (e) {
            var d = { ArrowLeft: [-2, 0], ArrowRight: [2, 0], ArrowUp: [0, -2], ArrowDown: [0, 2] }[e.key];
            if (!d || !mqWide.matches) return; e.preventDefault();
            state[i] = { x: Math.max(8, Math.min(92, state[i].x + d[0])), y: Math.max(10, Math.min(90, state[i].y + d[1])) }; apply(i); if (reduce) draw(0);
        });
    });

    // ---- reset
    var rb = root.querySelector('.eco-reset');
    if (rb) rb.addEventListener('click', function () {
        nodes.forEach(function (n, i) { n.classList.add('anim'); state[i] = { x: home[i].x, y: home[i].y }; apply(i); });
        setTimeout(function () { nodes.forEach(function (n) { n.classList.remove('anim'); }); }, 750);
        if (reduce) setTimeout(function () { draw(0); }, 60);
    });

    // ---- pointer parallax on the kit photo
    if (!reduce) {
        stage.addEventListener('pointermove', function (e) {
            if (!mqWide.matches || drag) return;
            var s = stage.getBoundingClientRect(), px = (e.clientX - s.left) / s.width - .5, py = (e.clientY - s.top) / s.height - .5;
            stage.style.setProperty('--rx', (-py * 7).toFixed(2) + 'deg'); stage.style.setProperty('--ry', (px * 10).toFixed(2) + 'deg');
        });
        stage.addEventListener('pointerleave', function () { stage.style.setProperty('--rx', '0deg'); stage.style.setProperty('--ry', '0deg'); });
    }

    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; visible ? start() : stop(); }, { threshold: 0.05 }).observe(stage);
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
    window.addEventListener('resize', function () { draw(0); });
    var tabsRoot = document.querySelector('.edu-tabs');
    if (tabsRoot) tabsRoot.addEventListener('click', function () { setTimeout(function () { draw(0); }, 120); });
    draw(0); start();
    }
})();

/* ═══ Theme switch (light / dark). The site opens in dark; the choice is remembered. ═══ */
(function () {
    'use strict';
    var btn = document.getElementById('theme-toggle'); if (!btn) return;
    var root = document.documentElement;
    function isDark() { return root.getAttribute('data-theme') !== 'light'; }
    function sync() {
        btn.setAttribute('aria-label', isDark() ? 'Switch to light theme' : 'Switch to dark theme');
        btn.title = isDark() ? 'Light theme' : 'Dark theme';
        var m = document.querySelector('meta[name="theme-color"]');
        if (m) m.setAttribute('content', getComputedStyle(root).getPropertyValue(isDark() ? '--bg' : '--navy').trim());
    }
    btn.addEventListener('click', function () {
        var next = isDark() ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('carimo-theme-v2', next); } catch (e) {}
        sync(); window.dispatchEvent(new Event('palettechange'));
    });
    sync();
})();

/* ═══ Brochure gate: name, email, designation and company before the download is released ═══ */
(function () {
    'use strict';
    var cfg = window.CARIMO_CONFIG || {};
    var modal = document.getElementById('brochure-modal'); if (!modal) return;
    var triggers = [].slice.call(document.querySelectorAll('[data-brochure]'));
    var form = modal.querySelector('form'), formView = modal.querySelector('.bm-form-view'), okView = modal.querySelector('.bm-ok');
    var title = modal.querySelector('#bm-title'), sub = modal.querySelector('.bm-sub'), errBox = modal.querySelector('.bm-error');
    var submitBtn = modal.querySelector('.bm-submit'), dl = modal.querySelector('.bm-dl'), okTitle = modal.querySelector('.bm-ok-title');
    var PROFILE = 'carimo-lead-profile', LEADS = 'carimo-leads';
    var current = null, lastTrigger = null;
    var FIELDS = [
        { n: 'name', msg: 'Please enter your full name.', ok: function (v) { return v.length >= 2; } },
        { n: 'email', msg: 'Please enter a valid email address.', ok: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); } },
        { n: 'designation', msg: 'Please enter your designation.', ok: function (v) { return v.length >= 2; } },
        { n: 'company', msg: 'Please enter your company or institution name.', ok: function (v) { return v.length >= 2; } }
    ];

    function store(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
    function load(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }

    function setError(name, msg) {
        var input = form.elements[name], hint = form.querySelector('[data-err="' + name + '"]');
        input.setAttribute('aria-invalid', msg ? 'true' : 'false'); hint.textContent = msg || '';
    }
    function validate() {
        var first = null;
        FIELDS.forEach(function (f) {
            var v = form.elements[f.n].value.trim(); form.elements[f.n].value = v;
            var bad = !f.ok(v); setError(f.n, bad ? f.msg : ''); if (bad && !first) first = form.elements[f.n];
        });
        if (first) first.focus();
        return !first;
    }
    FIELDS.forEach(function (f) { form.elements[f.n].addEventListener('input', function () { if (form.elements[f.n].getAttribute('aria-invalid') === 'true' && f.ok(form.elements[f.n].value.trim())) setError(f.n, ''); }); });

    function open(key, trigger) {
        var b = (cfg.brochures || {})[key];
        if (!b || !b.url) { window.location.href = trigger.getAttribute('href'); return; }   // no JS config → fall back to the e-mail link
        current = key; lastTrigger = trigger;
        title.textContent = 'Get the ' + b.name + ' brochure';
        sub.textContent = 'Tell us a little about you and the download unlocks right away.';
        formView.hidden = false; okView.hidden = true; errBox.hidden = true; errBox.textContent = '';
        if (form.elements.website) form.elements.website.value = '';
        var p = load(PROFILE) || {};
        FIELDS.forEach(function (f) { form.elements[f.n].value = p[f.n] || ''; setError(f.n, ''); });
        modal.hidden = false; document.body.classList.add('bm-lock');
        var empty = FIELDS.map(function (f) { return form.elements[f.n]; }).filter(function (i) { return !i.value; })[0] || form.elements.name;
        setTimeout(function () { empty.focus(); }, 30);
    }
    function close() {
        modal.hidden = true; document.body.classList.remove('bm-lock');
        if (lastTrigger) lastTrigger.focus();
    }
    triggers.forEach(function (t) { t.addEventListener('click', function (e) { e.preventDefault(); open(t.getAttribute('data-brochure'), t); }); });
    modal.addEventListener('click', function (e) { if (e.target === modal || e.target.closest('[data-bm-close]')) close(); });
    document.addEventListener('keydown', function (e) {
        if (modal.hidden) return;
        if (e.key === 'Escape') { close(); return; }
        if (e.key !== 'Tab') return;
        var f = [].slice.call(modal.querySelectorAll('input:not([tabindex="-1"]), button, a[href]')).filter(function (x) { return x.offsetParent !== null; });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    function send(data) {
        var url = cfg.leadEndpoint;
        if (!url) {                                           // testing mode: keep the lead in this browser only
            var all = load(LEADS) || []; var row = {}; data.forEach(function (v, k) { row[k] = v; }); all.push(row); store(LEADS, all.slice(-50));
            if (window.console) console.info('[CARIMO] brochure lead saved locally (no leadEndpoint set in js/config.js):', row);
            return Promise.resolve();
        }
        if (/script\.google\.com/.test(url)) return fetch(url, { method: 'POST', mode: 'no-cors', body: data });
        return fetch(url, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); });
    }
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validate()) return;
        var b = cfg.brochures[current];
        if (form.elements.website && form.elements.website.value) { return; }          // honeypot: bots fill this in, people never see it
        var data = new FormData(form); data.delete('website');
        data.set('brochure', b.name); data.set('page', (location.pathname.split('/').pop() || 'index.html')); data.set('submitted_at', new Date().toISOString()); data.set('_subject', 'Brochure download: ' + b.name);
        var label = submitBtn.textContent; submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; errBox.hidden = true;
        send(data).then(function () {
            var prof = {}; FIELDS.forEach(function (f) { prof[f.n] = form.elements[f.n].value; }); store(PROFILE, prof);
            okTitle.textContent = 'Thank you, ' + prof.name.split(/\s+/)[0] + '.';
            dl.href = b.url; dl.querySelector('span').textContent = 'Download the ' + b.name + ' brochure';
            formView.hidden = true; okView.hidden = false; setTimeout(function () { dl.focus(); }, 30);
        }).catch(function () {
            errBox.hidden = false; errBox.textContent = 'We could not send your details just now. Please check your connection and try again, or email contact@carimo.tech.';
        }).then(function () { submitBtn.disabled = false; submitBtn.textContent = label; });
    });
})();

/* Page pager — at the bottom of each page: "Home" on the left, next page on the right */
(function () {
    var pages = [['index.html', 'Home'], ['about.html', 'About'], ['education.html', 'Edu Kits'], ['matlab.html', 'MATLAB®'], ['training.html', 'Training'], ['industry.html', 'Industry'], ['labs.html', 'In the Labs']];
    var cur = (location.pathname.split('/').pop() || 'index.html').toLowerCase(), i = -1;
    pages.forEach(function (p, n) { if (p[0] === cur) i = n; });
    if (i < 0 && (cur === '' || cur.indexOf('.') < 0)) i = 0;
    if (i < 0) return;
    var arrowL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>';
    var arrowR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
    var html = '';
    if (i > 0) html += '<a class="pg-home" href="index.html" aria-label="Go to the homepage">' + arrowL + '<span>Home</span></a>';
    if (i < pages.length - 1) html += '<a class="pg-next" href="' + pages[i + 1][0] + '" aria-label="Next page: ' + pages[i + 1][1] + '"><span>' + pages[i + 1][1] + '</span>' + arrowR + '</a>';
    if (!html) return;
    var bar = document.createElement('nav'); bar.className = 'pager'; bar.setAttribute('aria-label', 'Page navigation'); bar.innerHTML = html;
    document.body.appendChild(bar); document.body.classList.add('pager-on');
    var t = 0;
    function check() {
        t = 0;
        var d = document.documentElement, atEnd = window.pageYOffset + window.innerHeight >= d.scrollHeight - 160;
        bar.classList.toggle('show', atEnd);
    }
    window.addEventListener('scroll', function () { if (!t) t = requestAnimationFrame(check); }, { passive: true });
    window.addEventListener('resize', check);
    check();
})();
