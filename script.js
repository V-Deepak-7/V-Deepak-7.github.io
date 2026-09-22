(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- theme toggle ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const iconMoon = document.getElementById('iconMoon');
  const iconSun = document.getElementById('iconSun');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    iconMoon.style.display = theme === 'dark' ? 'block' : 'none';
    iconSun.style.display = theme === 'light' ? 'block' : 'none';
    localStorage.setItem('dv-theme', theme);
  }

  const savedTheme = localStorage.getItem('dv-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  /* ---------- nav active link (scroll spy) ---------- */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = ['research', 'publications', 'cv', 'contact'].map(id => document.getElementById(id));

  function updateActiveNav() {
    let current = null;
    sections.forEach(sec => {
      if (sec && sec.getBoundingClientRect().top < 140) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* ---------- hero node-graph diffusion draw-in ---------- */
  const heroGraph = document.getElementById('heroGraph');
  const heroNodes = [
    [80, 300], [220, 180], [380, 90], [380, 320], [560, 200], [700, 120], [720, 340], [860, 220]
  ];
  const heroEdges = [
    [0, 1], [1, 2], [1, 3], [2, 4], [3, 4], [4, 5], [4, 6], [5, 7], [6, 7]
  ];

  function buildHeroGraph() {
    let svg = '';
    heroEdges.forEach(([a, b], i) => {
      const [x1, y1] = heroNodes[a];
      const [x2, y2] = heroNodes[b];
      svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--edge)" stroke-width="1"
        class="hg-edge" data-idx="${i}" stroke-dasharray="200" stroke-dashoffset="200" opacity="0"/>`;
    });
    heroNodes.forEach(([x, y], i) => {
      const bright = i === heroNodes.length - 1;
      svg += `<circle cx="${x}" cy="${y}" r="${bright ? 5 : 3.5}" fill="${bright ? 'var(--node-bright)' : 'var(--node)'}"
        class="hg-node" data-idx="${i}" opacity="0"/>`;
    });
    heroGraph.innerHTML = svg;
  }
  buildHeroGraph();

  function playHeroGraph() {
    const nodes = heroGraph.querySelectorAll('.hg-node');
    const edges = heroGraph.querySelectorAll('.hg-edge');
    if (reduceMotion) {
      nodes.forEach(n => n.setAttribute('opacity', 1));
      edges.forEach(e => { e.setAttribute('opacity', 0.6); e.style.strokeDashoffset = 0; });
      return;
    }
    // beat 1: scattered faint dots fade in
    nodes.forEach((n, i) => {
      n.style.transition = 'opacity 0.5s ease';
      setTimeout(() => n.setAttribute('opacity', 0.35), 40 * i);
    });
    // beat 2: edges snap in left to right
    setTimeout(() => {
      edges.forEach((e, i) => {
        setTimeout(() => {
          e.style.transition = 'stroke-dashoffset 0.32s ease, opacity 0.2s ease';
          e.setAttribute('opacity', 0.7);
          e.style.strokeDashoffset = '0';
        }, i * 70);
      });
    }, 300);
    // beat 3: nodes settle to full opacity with slight bounce
    setTimeout(() => {
      nodes.forEach((n, i) => {
        setTimeout(() => {
          n.style.transition = 'opacity 0.4s ease, r 0.3s cubic-bezier(.34,1.56,.64,1)';
          n.setAttribute('opacity', 1);
        }, i * 40);
      });
    }, 300 + heroEdges.length * 70 + 100);
  }
  requestAnimationFrame(() => setTimeout(playHeroGraph, 150));

  /* ---------- section dividers: diffusion sweep, once on scroll into view ---------- */
  function buildDivider(el) {
    el.innerHTML = `<svg viewBox="0 0 1000 40" preserveAspectRatio="none">
      <circle cx="30" cy="20" r="1.5" fill="var(--text-muted)" opacity="0.4"/>
      <circle cx="55" cy="12" r="1.5" fill="var(--text-muted)" opacity="0.4"/>
      <circle cx="75" cy="28" r="1.5" fill="var(--text-muted)" opacity="0.5"/>
      <circle cx="105" cy="16" r="1.5" fill="var(--text-muted)" opacity="0.6"/>
      <line class="dv-e1" x1="160" y1="20" x2="240" y2="20" stroke="var(--edge)" stroke-width="1" stroke-dasharray="80" stroke-dashoffset="80"/>
      <circle class="dv-n1" cx="160" cy="20" r="2.5" fill="var(--node)" opacity="0"/>
      <line class="dv-e2" x1="240" y1="20" x2="320" y2="20" stroke="var(--edge)" stroke-width="1" stroke-dasharray="80" stroke-dashoffset="80"/>
      <circle class="dv-n2" cx="240" cy="20" r="2.5" fill="var(--node)" opacity="0"/>
      <circle class="dv-n3" cx="320" cy="20" r="3" fill="var(--node-bright)" opacity="0"/>
      <line x1="320" y1="20" x2="1000" y2="20" stroke="var(--border)" stroke-width="1"/>
    </svg>`;
  }
  document.querySelectorAll('[data-divider]').forEach(buildDivider);

  function playDivider(el) {
    if (reduceMotion) {
      el.querySelectorAll('circle, line').forEach(n => { n.style.opacity = n.classList.contains('dv-n1') || n.classList.contains('dv-n2') || n.classList.contains('dv-n3') ? 1 : n.getAttribute('opacity'); n.style.strokeDashoffset = 0; });
      return;
    }
    const n1 = el.querySelector('.dv-n1'), n2 = el.querySelector('.dv-n2'), n3 = el.querySelector('.dv-n3');
    const e1 = el.querySelector('.dv-e1'), e2 = el.querySelector('.dv-e2');
    [n1, n2, n3, e1, e2].forEach(x => x && (x.style.transition = 'opacity 0.3s ease, stroke-dashoffset 0.4s ease'));
    setTimeout(() => n1 && n1.setAttribute('opacity', 0.8), 0);
    setTimeout(() => e1 && (e1.style.strokeDashoffset = '0'), 100);
    setTimeout(() => n2 && n2.setAttribute('opacity', 0.8), 400);
    setTimeout(() => e2 && (e2.style.strokeDashoffset = '0'), 480);
    setTimeout(() => n3 && n3.setAttribute('opacity', 1), 780);
  }

  /* ---------- generic reveal + once-only observer ---------- */
  const revealTargets = document.querySelectorAll('.about-text, .thrust-grid, .demo-panel, .pub-list, .cv-grid');
  revealTargets.forEach(el => el.setAttribute('data-reveal', ''));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.hasAttribute('data-reveal')) el.classList.add('revealed');
      if (el.hasAttribute('data-divider') && !el.dataset.played) {
        el.dataset.played = '1';
        playDivider(el);
      }
      if (el.id === 'timeline' && !el.dataset.played) {
        el.dataset.played = '1';
        playTimelineTrace();
      }
      io.unobserve(el);
    });
  }, { threshold: 0.3 });

  revealTargets.forEach(el => io.observe(el));
  document.querySelectorAll('[data-divider]').forEach(el => io.observe(el));
  io.observe(document.getElementById('timeline'));

  /* ---------- thrust panels ---------- */
  const thrustGrid = document.getElementById('thrustGrid');
  THRUSTS.forEach(t => {
    const panel = document.createElement('div');
    panel.className = 'thrust-panel';
    panel.innerHTML = `
      <p class="thrust-label mono dotmatrix">·· ${t.label}</p>
      <svg width="100%" height="50" viewBox="0 0 220 50" class="thrust-svg">${t.glyph}</svg>
      <p class="thrust-projects">${t.projects}</p>`;
    thrustGrid.appendChild(panel);

    // hover micro-replay: fade edges/nodes out then back in
    const svg = panel.querySelector('.thrust-svg');
    panel.addEventListener('mouseenter', () => {
      if (reduceMotion) return;
      const shapes = svg.querySelectorAll('line, rect, circle, path');
      shapes.forEach((s, i) => {
        s.style.transition = 'opacity 0.25s ease';
        s.style.opacity = '0.15';
        setTimeout(() => { s.style.opacity = '1'; }, 120 + i * 25);
      });
    });
  });

  /* ---------- publications ---------- */
  const pubList = document.getElementById('pubList');
  function renderPubs(filter) {
    pubList.innerHTML = '';
    PUBLICATIONS.forEach(p => {
      const row = document.createElement('div');
      row.className = 'pub-row';
      if (filter !== 'all' && p.tag !== filter) row.classList.add('hidden');
      row.innerHTML = `
        <span class="pub-year mono">${p.year}</span>
        <span>
          <span class="pub-title">${p.title}</span>
          <div class="pub-note">${p.note}</div>
        </span>
        <span class="pub-venue">${p.venue}</span>`;
      pubList.appendChild(row);
    });
  }
  renderPubs('all');

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderPubs(btn.dataset.filter);
    });
  });

  /* ---------- timeline ---------- */
  const timelineItems = document.getElementById('timelineItems');
  TIMELINE.forEach(item => {
    const el = document.createElement('div');
    el.className = 'timeline-item';
    el.innerHTML = `
      <div class="timeline-role">${item.role}</div>
      <div class="timeline-org">${item.org}</div>
      <div class="timeline-date mono">${item.date}</div>`;
    timelineItems.appendChild(el);
  });

  function playTimelineTrace() {
    const line = document.getElementById('timelineLine');
    if (reduceMotion) { line.style.strokeDashoffset = '0'; return; }
    line.style.transition = 'stroke-dashoffset 1s ease';
    requestAnimationFrame(() => { line.style.strokeDashoffset = '0'; });
  }

  /* ---------- cv ---------- */
  const cvGrid = document.getElementById('cvGrid');
  function cvBlock(title, entries) {
    const block = document.createElement('div');
    block.className = 'cv-block';
    block.innerHTML = `<h3 class="mono">${title}</h3>` + entries.map(e => `
      <div class="cv-entry">
        <div class="cv-entry-title">${e.title}</div>
        ${e.sub ? `<div class="cv-entry-sub">${e.sub}</div>` : ''}
      </div>`).join('');
    return block;
  }
  cvGrid.appendChild(cvBlock('education', CV_DATA.education));
  cvGrid.appendChild(cvBlock('awards', CV_DATA.awards));
  cvGrid.appendChild(cvBlock('skills', CV_DATA.skills));
  cvGrid.appendChild(cvBlock('service', CV_DATA.service));

  /* ---------- RL-AmpSyn demo: gm/ID sizing search + SPICE netlist ----------
     Each "Synthesize" click runs a small simulated-annealing-style search:
     early candidates sample widely across the gm/ID design space (and often
     miss spec), later candidates narrow back toward a known-good point —
     mirroring the explore-then-converge pattern of the real RL sizing loop.
     Gain/bandwidth/power are computed per candidate from standard op-amp
     small-signal equations (gm = (gm/ID)·ID, ro = VA'·L/ID), not looked up. */
  const synthesizeBtn = document.getElementById('synthesizeBtn');
  const topologySelect = document.getElementById('topologySelect');
  const glyphSegs = document.querySelectorAll('.glyph-seg');
  const outGain = document.getElementById('outGain');
  const outBw = document.getElementById('outBw');
  const outPower = document.getElementById('outPower');
  const outStatus = document.getElementById('outStatus');
  const demoSpec = document.getElementById('demoSpec');
  const demoLog = document.getElementById('demoLog');
  const netlistOut = document.getElementById('netlistOut');

  const PROC = { KN: 220, KP: 90, VA: 8.0, VDD: 1.8 }; // uA/V^2, V/um (Early voltage coeff.), V — illustrative process corner

  const gmOf = (gmid, idUA) => gmid * idUA;                                    // uS
  const roOf = (lUM, idUA) => PROC.VA * lUM / idUA;                            // MOhm
  const wOf = (gmid, idUA, k, lUM) => ((gmid * gmid * idUA) / (2 * k)) * lUM;  // um
  const rand = (min, max) => min + Math.random() * (max - min);
  const fmt = (n, d) => n.toFixed(d);

  const TOPOLOGIES = {
    'two-stage': {
      spec: { gainMin: 62, bwMin: 3, bwMax: 6, powerMax: 0.6 },
      base: { gmid1: 14, L3: 1.5, Ibias1: 40, gmid6: 8, L6: 1.5, L7: 1.5, Ibias2: 150, Cc: 11 },
      spread: { gmid1: 3, L3: 0.5, Ibias1: 15, gmid6: 2.5, L6: 0.5, L7: 0.5, Ibias2: 60, Cc: 5 },
      fixed: { L1: 0.5 },
      evaluate(p) {
        const L1 = this.fixed.L1;
        const ID1 = p.Ibias1 / 2;
        const gm1 = gmOf(p.gmid1, ID1);
        const Rout1 = (roOf(L1, ID1) * roOf(p.L3, ID1)) / (roOf(L1, ID1) + roOf(p.L3, ID1));
        const gm6 = gmOf(p.gmid6, p.Ibias2);
        const Rout2 = (roOf(p.L6, p.Ibias2) * roOf(p.L7, p.Ibias2)) / (roOf(p.L6, p.Ibias2) + roOf(p.L7, p.Ibias2));
        const gainDb = 20 * Math.log10(gm1 * Rout1 * gm6 * Rout2);
        const bwMHz = (gm1 * 1e-6) / (2 * Math.PI * p.Cc * 1e-12) / 1e6;
        const powerMW = PROC.VDD * (p.Ibias1 + p.Ibias2) * 1e-3;
        const sized = {
          W1: wOf(p.gmid1, ID1, PROC.KN, L1), L1,
          W3: wOf(p.gmid1, ID1, PROC.KP, p.L3), L3: p.L3,
          W6: wOf(p.gmid6, p.Ibias2, PROC.KP, p.L6), L6: p.L6,
          W7: wOf(p.gmid6, p.Ibias2, PROC.KN, p.L7), L7: p.L7,
          Ibias1: p.Ibias1, Ibias2: p.Ibias2, Cc: p.Cc
        };
        return { gainDb, bwMHz, powerMW, sized };
      },
      netlist(s) {
        return `* Two-stage Miller-compensated op-amp — RL-AmpSyn sizing
.subckt TWOSTAGE_OPAMP vin+ vin- vout vdd vss
M1  d1    vin+   tail  vss  NMOS  W=${fmt(s.W1, 2)}u  L=${fmt(s.L1, 2)}u
M2  d2    vin-   tail  vss  NMOS  W=${fmt(s.W1, 2)}u  L=${fmt(s.L1, 2)}u
M3  d1    d1     vdd   vdd  PMOS  W=${fmt(s.W3, 2)}u  L=${fmt(s.L3, 2)}u
M4  d2    d1     vdd   vdd  PMOS  W=${fmt(s.W3, 2)}u  L=${fmt(s.L3, 2)}u
M5  tail  vbias1 vss   vss  NMOS  W=${fmt(s.W1 * 1.6, 2)}u  L=${fmt(s.L1, 2)}u  ; tail, I=${fmt(s.Ibias1, 1)}uA
M6  vout  d2     vdd   vdd  PMOS  W=${fmt(s.W6, 2)}u  L=${fmt(s.L6, 2)}u     ; 2nd stage, I=${fmt(s.Ibias2, 1)}uA
M7  vout  vbias2 vss   vss  NMOS  W=${fmt(s.W7, 2)}u  L=${fmt(s.L7, 2)}u
CC  d2    vout   ${fmt(s.Cc, 2)}p                                          ; Miller compensation
.op
.ac dec 20 1 1g
.ends`;
      }
    },
    'telescopic': {
      spec: { gainMin: 55, bwMin: 6, bwMax: 14, powerMax: 0.7 },
      base: { gmid1: 13, gmidc: 9, Lc: 0.6, Ibias: 220, CL: 28 },
      spread: { gmid1: 3, gmidc: 2.5, Lc: 0.2, Ibias: 80, CL: 12 },
      fixed: { L1: 0.4 },
      evaluate(p) {
        const L1 = this.fixed.L1;
        const ID = p.Ibias / 2;
        const gm1 = gmOf(p.gmid1, ID);
        const RoutN = gmOf(p.gmidc, ID) * roOf(p.Lc, ID) * roOf(L1, ID);
        const Rout = RoutN / 2; // symmetric N/P cascode branches
        const gainDb = 20 * Math.log10(gm1 * Rout);
        const bwMHz = (gm1 * 1e-6) / (2 * Math.PI * p.CL * 1e-12) / 1e6;
        const powerMW = PROC.VDD * p.Ibias * 1e-3;
        const sized = {
          W1: wOf(p.gmid1, ID, PROC.KN, L1), L1,
          W3: wOf(p.gmidc, ID, PROC.KN, p.Lc),
          W5: wOf(p.gmidc, ID, PROC.KP, p.Lc),
          W7: wOf(p.gmidc, ID, PROC.KP, p.Lc), Lc: p.Lc,
          Ibias: p.Ibias, CL: p.CL
        };
        return { gainDb, bwMHz, powerMW, sized };
      },
      netlist(s) {
        return `* Telescopic cascode op-amp — RL-AmpSyn sizing
.subckt TELESCOPIC_OPAMP vin+ vin- vout vdd vss
M1  d1n  vin+   tail  vss  NMOS  W=${fmt(s.W1, 2)}u  L=${fmt(s.L1, 2)}u
M2  d2n  vin-   tail  vss  NMOS  W=${fmt(s.W1, 2)}u  L=${fmt(s.L1, 2)}u
M9  tail vbias  vss   vss  NMOS  W=${fmt(s.W1 * 1.6, 2)}u  L=${fmt(s.L1, 2)}u  ; tail, I=${fmt(s.Ibias, 1)}uA
M3  d1c  vbc_n  d1n   vss  NMOS  W=${fmt(s.W3, 2)}u  L=${fmt(s.Lc, 2)}u     ; NMOS cascode
M4  vout vbc_n  d2n   vss  NMOS  W=${fmt(s.W3, 2)}u  L=${fmt(s.Lc, 2)}u
M5  d1c  vbc_p  d1p   vdd  PMOS  W=${fmt(s.W5, 2)}u  L=${fmt(s.Lc, 2)}u     ; PMOS cascode
M6  vout vbc_p  d2p   vdd  PMOS  W=${fmt(s.W5, 2)}u  L=${fmt(s.Lc, 2)}u
M7  d1p  d1c    vdd   vdd  PMOS  W=${fmt(s.W7, 2)}u  L=${fmt(s.Lc, 2)}u     ; mirror
M8  d2p  d1c    vdd   vdd  PMOS  W=${fmt(s.W7, 2)}u  L=${fmt(s.Lc, 2)}u
CL  vout 0      ${fmt(s.CL, 2)}p
.op
.ac dec 20 1 1g
.ends`;
      }
    },
    'folded': {
      spec: { gainMin: 52, bwMin: 6, bwMax: 16, powerMax: 1.0 },
      base: { gmid1: 13, gmidc: 9, Lc: 0.6, Ibias: 150, IbiasFold: 110, CL: 18 },
      spread: { gmid1: 3, gmidc: 2.5, Lc: 0.2, Ibias: 55, IbiasFold: 40, CL: 8 },
      fixed: { L1: 0.4 },
      evaluate(p) {
        const L1 = this.fixed.L1;
        const ID = p.Ibias / 2;
        const gm1 = gmOf(p.gmid1, ID);
        const RoutN = gmOf(p.gmidc, p.IbiasFold) * roOf(p.Lc, p.IbiasFold) * roOf(L1, ID);
        const Rout = RoutN / 2; // symmetric N/P cascode branches
        const gainDb = 20 * Math.log10(gm1 * Rout);
        const bwMHz = (gm1 * 1e-6) / (2 * Math.PI * p.CL * 1e-12) / 1e6;
        const powerMW = PROC.VDD * (p.Ibias + 2 * p.IbiasFold) * 1e-3;
        const sized = {
          W1: wOf(p.gmid1, ID, PROC.KN, L1), L1,
          Wf: wOf(p.gmidc, p.IbiasFold, PROC.KP, p.Lc),
          W3: wOf(p.gmidc, p.IbiasFold, PROC.KP, p.Lc),
          W5: wOf(p.gmidc, p.IbiasFold, PROC.KN, p.Lc),
          W7: wOf(p.gmidc, p.IbiasFold, PROC.KN, p.Lc), Lc: p.Lc,
          Ibias: p.Ibias, IbiasFold: p.IbiasFold, CL: p.CL
        };
        return { gainDb, bwMHz, powerMW, sized };
      },
      netlist(s) {
        return `* Folded cascode op-amp — RL-AmpSyn sizing
.subckt FOLDED_OPAMP vin+ vin- vout vdd vss
M1  d1n  vin+   tail  vss  NMOS  W=${fmt(s.W1, 2)}u  L=${fmt(s.L1, 2)}u
M2  d2n  vin-   tail  vss  NMOS  W=${fmt(s.W1, 2)}u  L=${fmt(s.L1, 2)}u
M9  tail vbias  vss   vss  NMOS  W=${fmt(s.W1 * 1.6, 2)}u  L=${fmt(s.L1, 2)}u  ; input tail, I=${fmt(s.Ibias, 1)}uA
M10 d1n  vbf    vdd   vdd  PMOS  W=${fmt(s.Wf, 2)}u  L=${fmt(s.Lc, 2)}u     ; fold source, I=${fmt(s.IbiasFold, 1)}uA
M11 d2n  vbf    vdd   vdd  PMOS  W=${fmt(s.Wf, 2)}u  L=${fmt(s.Lc, 2)}u
M3  d1c  vbc_p  d1n   vdd  PMOS  W=${fmt(s.W3, 2)}u  L=${fmt(s.Lc, 2)}u     ; PMOS cascode
M4  vout vbc_p  d2n   vdd  PMOS  W=${fmt(s.W3, 2)}u  L=${fmt(s.Lc, 2)}u
M5  d1c  vbc_n  d1p   vss  NMOS  W=${fmt(s.W5, 2)}u  L=${fmt(s.Lc, 2)}u     ; NMOS cascode
M6  vout vbc_n  d2p   vss  NMOS  W=${fmt(s.W5, 2)}u  L=${fmt(s.Lc, 2)}u
M7  d1p  d1c    vss   vss  NMOS  W=${fmt(s.W7, 2)}u  L=${fmt(s.Lc, 2)}u     ; mirror
M8  d2p  d1c    vss   vss  NMOS  W=${fmt(s.W7, 2)}u  L=${fmt(s.Lc, 2)}u
CL  vout 0      ${fmt(s.CL, 2)}p
.op
.ac dec 20 1 1g
.ends`;
      }
    }
  };

  function sampleAt(topo, t) {
    const decay = (1 - t) * (1 - t); // exploration collapses to the known-good point by the final attempt
    const p = {};
    for (const k in topo.base) p[k] = topo.base[k] + rand(-1, 1) * topo.spread[k] * decay;
    return p;
  }

  function passSpec(spec, r) {
    return r.gainDb >= spec.gainMin && r.bwMHz >= spec.bwMin && r.bwMHz <= spec.bwMax && r.powerMW <= spec.powerMax;
  }

  function specLine(spec) {
    return `target — gain ≥ ${spec.gainMin} dB · BW ${spec.bwMin}–${spec.bwMax} MHz · power ≤ ${spec.powerMax} mW`;
  }

  function resetDemo() {
    glyphSegs.forEach(s => s.classList.remove('lit'));
    outGain.textContent = '—'; outBw.textContent = '—'; outPower.textContent = '—';
    outStatus.textContent = 'idle';
    demoLog.innerHTML = '';
    netlistOut.textContent = '— run synthesis to generate —';
  }

  function refreshSpec() {
    demoSpec.textContent = specLine(TOPOLOGIES[topologySelect.value].spec);
  }

  refreshSpec();
  resetDemo();
  topologySelect.addEventListener('change', () => { refreshSpec(); resetDemo(); });

  synthesizeBtn.addEventListener('click', () => {
    resetDemo();
    outStatus.textContent = 'searching topology…';
    synthesizeBtn.disabled = true;
    const topo = TOPOLOGIES[topologySelect.value];
    const attempts = glyphSegs.length; // one sizing candidate per glyph segment
    const stageDelay = reduceMotion ? 0 : 320;
    let finalResult = null;

    for (let i = 0; i < attempts; i++) {
      setTimeout(() => {
        glyphSegs[i].classList.add('lit');
        if (i === 1) outStatus.textContent = 'sizing…';
        if (i === attempts - 2) outStatus.textContent = 'verifying…';

        const r = topo.evaluate(sampleAt(topo, i / (attempts - 1)));
        const ok = passSpec(topo.spec, r);
        if (ok && !finalResult) finalResult = r;

        const row = document.createElement('div');
        row.className = 'demo-log-row' + (ok ? ' pass' : '');
        row.innerHTML = `<span class="lr-tag">${ok ? '✓' : '✗'}</span>` +
          `<span>iter ${i + 1} — gain ${fmt(r.gainDb, 1)} dB · bw ${fmt(r.bwMHz, 1)} MHz · power ${fmt(r.powerMW, 2)} mW` +
          `${ok ? ' — meets spec' : ' — rejected'}</span>`;
        demoLog.appendChild(row);

        if (i === attempts - 1) {
          const r2 = finalResult || topo.evaluate(topo.base);
          outGain.textContent = fmt(r2.gainDb, 1) + ' dB';
          outBw.textContent = fmt(r2.bwMHz, 1) + ' MHz';
          outPower.textContent = fmt(r2.powerMW, 2) + ' mW';
          outStatus.textContent = 'verified';
          netlistOut.textContent = topo.netlist(r2.sized);
          synthesizeBtn.disabled = false;
        }
      }, i * stageDelay);
    }
  });
})();
