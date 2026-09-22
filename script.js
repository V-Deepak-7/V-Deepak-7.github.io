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
     A closed-form gm/ID small-signal model (gm = (gm/ID)·ID, ro = VA'·L/ID),
     with a first-order device-geometry parasitic estimate at the output node.
     "Synthesize" runs real simulated annealing (Metropolis acceptance, see
     SA_T0/SA_T_MIN below) over that model to hit a user-editable target spec.
     This is NOT a SPICE simulation — see the disclosure note in the panel. */
  const synthesizeBtn = document.getElementById('synthesizeBtn');
  const topologySelect = document.getElementById('topologySelect');
  const glyphSegs = document.querySelectorAll('.glyph-seg');
  const outGain = document.getElementById('outGain');
  const outBw = document.getElementById('outBw');
  const outPower = document.getElementById('outPower');
  const outStatus = document.getElementById('outStatus');
  const demoLog = document.getElementById('demoLog');
  const netlistOut = document.getElementById('netlistOut');
  const bodeChartEl = document.getElementById('bodeChart');
  const specGainMinEl = document.getElementById('specGainMin');
  const specBwMinEl = document.getElementById('specBwMin');
  const specBwMaxEl = document.getElementById('specBwMax');
  const specPowerMaxEl = document.getElementById('specPowerMax');
  const specResetBtn = document.getElementById('specResetBtn');
  const disclosureToggle = document.getElementById('disclosureToggle');
  const disclosureBody = document.getElementById('disclosureBody');

  disclosureToggle.addEventListener('click', () => {
    const opening = disclosureBody.hidden;
    disclosureBody.hidden = !opening;
    disclosureToggle.textContent = opening ? 'details ▴' : 'details ▾';
  });

  const PROC = { KN: 220, KP: 90, VA: 8.0, VDD: 1.8, COX: 9.0 }; // uA/V^2, V/um, V, fF/um^2 — illustrative ~180nm-class corner

  const gmOf = (gmid, idUA) => gmid * idUA;                                    // uS
  const roOf = (lUM, idUA) => PROC.VA * lUM / idUA;                            // MOhm
  const wOf = (gmid, idUA, k, lUM) => ((gmid * gmid * idUA) / (2 * k)) * lUM;  // um
  // First-order parasitic estimate at a device's drain node (Cgd overlap + Cdb junction),
  // as a fraction of gate cap — not an extracted BSIM parasitic, but scales with the
  // actual sized W·L so bigger output devices genuinely cost bandwidth/phase margin.
  const cParOf = (wUM, lUM) => (0.4 * PROC.COX * wUM * lUM) / 1000; // pF
  const rand = (min, max) => min + Math.random() * (max - min);
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const fmt = (n, d) => n.toFixed(d);

  const TOPOLOGIES = {
    'two-stage': {
      spec: { gainMin: 62, bwMin: 3, bwMax: 6, powerMax: 0.6 },
      base: { gmid1: 14, L3: 1.5, Ibias1: 40, gmid6: 8, L6: 1.5, L7: 1.5, Ibias2: 150, Cc: 11 },
      spread: { gmid1: 3.5, L3: 0.6, Ibias1: 25, gmid6: 3, L6: 0.6, L7: 0.6, Ibias2: 90, Cc: 7 },
      bounds: { gmid1: [6, 22], L3: [0.5, 3], Ibias1: [8, 200], gmid6: [4, 16], L6: [0.5, 3], L7: [0.5, 3], Ibias2: [30, 500], Cc: [1, 40] },
      fixed: { L1: 0.5 },
      fanoutLoad: 14, // pF — assumed external load (e.g. driving an ADC sampling network), added to the sized devices' own parasitic
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
        const A0 = Math.pow(10, gainDb / 20);
        const fp1 = (bwMHz * 1e6) / A0;
        const W1 = wOf(p.gmid1, ID1, PROC.KN, L1);
        const W3 = wOf(p.gmid1, ID1, PROC.KP, p.L3);
        const W6 = wOf(p.gmid6, p.Ibias2, PROC.KP, p.L6);
        const W7 = wOf(p.gmid6, p.Ibias2, PROC.KN, p.L7);
        const cPar2 = cParOf(W6, p.L6) + cParOf(W7, p.L7) + this.fanoutLoad; // pF, output-node parasitic
        const fp2 = (gm6 * 1e-6) / (2 * Math.PI * cPar2 * 1e-12);
        const sized = {
          W1, L1, W3, L3: p.L3, W6, L6: p.L6, W7, L7: p.L7,
          Ibias1: p.Ibias1, Ibias2: p.Ibias2, Cc: p.Cc, cPar2
        };
        return { gainDb, bwMHz, powerMW, sized, poles: { fp1, fp2 } };
      },
      netlist(s) {
        return `* RL-AmpSyn sizing — two-stage Miller-compensated op-amp
* Target syntax: Synopsys PrimeSim HSPICE 2025.06 (formerly HSPICE)
* NOTE: .MODEL cards below are illustrative LEVEL=54 stubs, not a fitted PDK —
* swap in a foundry-calibrated model library before trusting simulated results.
.PARAM VDD=${PROC.VDD}

.MODEL NMOS NMOS LEVEL=54
.MODEL PMOS PMOS LEVEL=54

.SUBCKT TWOSTAGE_OPAMP vin+ vin- vout vdd vss
M1  d1    vin+   tail  vss  NMOS  W=${fmt(s.W1, 2)}U  L=${fmt(s.L1, 2)}U
M2  d2    vin-   tail  vss  NMOS  W=${fmt(s.W1, 2)}U  L=${fmt(s.L1, 2)}U
M3  d1    d1     vdd   vdd  PMOS  W=${fmt(s.W3, 2)}U  L=${fmt(s.L3, 2)}U
M4  d2    d1     vdd   vdd  PMOS  W=${fmt(s.W3, 2)}U  L=${fmt(s.L3, 2)}U
M5  tail  vbias1 vss   vss  NMOS  W=${fmt(s.W1 * 1.6, 2)}U  L=${fmt(s.L1, 2)}U  $ tail, I=${fmt(s.Ibias1, 1)}uA
M6  vout  d2     vdd   vdd  PMOS  W=${fmt(s.W6, 2)}U  L=${fmt(s.L6, 2)}U  $ 2nd stage, I=${fmt(s.Ibias2, 1)}uA
M7  vout  vbias2 vss   vss  NMOS  W=${fmt(s.W7, 2)}U  L=${fmt(s.L7, 2)}U
CC  d2    vout   ${fmt(s.Cc, 2)}P  $ Miller compensation
.ENDS TWOSTAGE_OPAMP

* Testbench — differential small-signal AC stimulus about VDD/2
VDD  vdd  0    DC 'VDD'
VSS  vss  0    DC 0
VCM  vcm  0    DC 'VDD/2'
VIP  vin+ vcm  DC 0 AC 0.5
VIN  vin- vcm  DC 0 AC -0.5
X1   vin+ vin- vout vdd vss TWOSTAGE_OPAMP

.AC DEC 20 1 1G
.OP
.MEASURE AC gain_db  MAX VDB(vout)
.MEASURE AC gbw_hz   WHEN VDB(vout)=0
.MEASURE AC pm_deg   FIND VP(vout) WHEN VDB(vout)=0
.END`;
      }
    },
    'telescopic': {
      spec: { gainMin: 55, bwMin: 6, bwMax: 14, powerMax: 0.7 },
      base: { gmid1: 13, gmidc: 9, Lc: 0.6, Ibias: 220, CL: 28 },
      spread: { gmid1: 3.5, gmidc: 3, Lc: 0.25, Ibias: 120, CL: 16 },
      bounds: { gmid1: [6, 22], gmidc: [5, 18], Lc: [0.35, 2], Ibias: [40, 600], CL: [1, 60] },
      fixed: { L1: 0.4 },
      evaluate(p) {
        const L1 = this.fixed.L1;
        const ID = p.Ibias / 2;
        const gm1 = gmOf(p.gmid1, ID);
        const RoutN = gmOf(p.gmidc, ID) * roOf(p.Lc, ID) * roOf(L1, ID);
        const Rout = RoutN / 2; // symmetric N/P cascode branches
        const gainDb = 20 * Math.log10(gm1 * Rout);
        const W1 = wOf(p.gmid1, ID, PROC.KN, L1);
        const W3 = wOf(p.gmidc, ID, PROC.KN, p.Lc);
        const W5 = wOf(p.gmidc, ID, PROC.KP, p.Lc);
        const W7 = wOf(p.gmidc, ID, PROC.KP, p.Lc);
        const cPar = cParOf(W3, p.Lc) + cParOf(W5, p.Lc); // pF, cascode output-node parasitic from sized devices
        const cTotal = p.CL + cPar;
        const bwMHz = (gm1 * 1e-6) / (2 * Math.PI * cTotal * 1e-12) / 1e6;
        const powerMW = PROC.VDD * p.Ibias * 1e-3;
        const A0 = Math.pow(10, gainDb / 20);
        const fp1 = (bwMHz * 1e6) / A0;
        const sized = {
          W1, L1, W3, W5, W7, Lc: p.Lc,
          Ibias: p.Ibias, CL: p.CL, cPar
        };
        return { gainDb, bwMHz, powerMW, sized, poles: { fp1 } };
      },
      netlist(s) {
        return `* RL-AmpSyn sizing — telescopic cascode op-amp
* Target syntax: Synopsys PrimeSim HSPICE 2025.06 (formerly HSPICE)
* NOTE: .MODEL cards below are illustrative LEVEL=54 stubs, not a fitted PDK —
* swap in a foundry-calibrated model library before trusting simulated results.
.PARAM VDD=${PROC.VDD}

.MODEL NMOS NMOS LEVEL=54
.MODEL PMOS PMOS LEVEL=54

.SUBCKT TELESCOPIC_OPAMP vin+ vin- vout vdd vss
M1  d1n  vin+   tail  vss  NMOS  W=${fmt(s.W1, 2)}U  L=${fmt(s.L1, 2)}U
M2  d2n  vin-   tail  vss  NMOS  W=${fmt(s.W1, 2)}U  L=${fmt(s.L1, 2)}U
M9  tail vbias  vss   vss  NMOS  W=${fmt(s.W1 * 1.6, 2)}U  L=${fmt(s.L1, 2)}U  $ tail, I=${fmt(s.Ibias, 1)}uA
M3  d1c  vbc_n  d1n   vss  NMOS  W=${fmt(s.W3, 2)}U  L=${fmt(s.Lc, 2)}U  $ NMOS cascode
M4  vout vbc_n  d2n   vss  NMOS  W=${fmt(s.W3, 2)}U  L=${fmt(s.Lc, 2)}U
M5  d1c  vbc_p  d1p   vdd  PMOS  W=${fmt(s.W5, 2)}U  L=${fmt(s.Lc, 2)}U  $ PMOS cascode
M6  vout vbc_p  d2p   vdd  PMOS  W=${fmt(s.W5, 2)}U  L=${fmt(s.Lc, 2)}U
M7  d1p  d1c    vdd   vdd  PMOS  W=${fmt(s.W7, 2)}U  L=${fmt(s.Lc, 2)}U  $ mirror
M8  d2p  d1c    vdd   vdd  PMOS  W=${fmt(s.W7, 2)}U  L=${fmt(s.Lc, 2)}U
CL  vout 0      ${fmt(s.CL, 2)}P
.ENDS TELESCOPIC_OPAMP

* Testbench — differential small-signal AC stimulus about VDD/2
VDD  vdd  0    DC 'VDD'
VSS  vss  0    DC 0
VCM  vcm  0    DC 'VDD/2'
VIP  vin+ vcm  DC 0 AC 0.5
VIN  vin- vcm  DC 0 AC -0.5
X1   vin+ vin- vout vdd vss TELESCOPIC_OPAMP

.AC DEC 20 1 1G
.OP
.MEASURE AC gain_db  MAX VDB(vout)
.MEASURE AC gbw_hz   WHEN VDB(vout)=0
.MEASURE AC pm_deg   FIND VP(vout) WHEN VDB(vout)=0
.END`;
      }
    },
    'folded': {
      spec: { gainMin: 52, bwMin: 6, bwMax: 16, powerMax: 1.0 },
      base: { gmid1: 13, gmidc: 9, Lc: 0.6, Ibias: 150, IbiasFold: 110, CL: 18 },
      spread: { gmid1: 3.5, gmidc: 3, Lc: 0.25, Ibias: 70, IbiasFold: 55, CL: 11 },
      bounds: { gmid1: [6, 22], gmidc: [5, 18], Lc: [0.35, 2], Ibias: [30, 400], IbiasFold: [20, 300], CL: [1, 50] },
      fixed: { L1: 0.4 },
      evaluate(p) {
        const L1 = this.fixed.L1;
        const ID = p.Ibias / 2;
        const gm1 = gmOf(p.gmid1, ID);
        const RoutN = gmOf(p.gmidc, p.IbiasFold) * roOf(p.Lc, p.IbiasFold) * roOf(L1, ID);
        const Rout = RoutN / 2; // symmetric N/P cascode branches
        const gainDb = 20 * Math.log10(gm1 * Rout);
        const W1 = wOf(p.gmid1, ID, PROC.KN, L1);
        const Wf = wOf(p.gmidc, p.IbiasFold, PROC.KP, p.Lc);
        const W3 = wOf(p.gmidc, p.IbiasFold, PROC.KP, p.Lc);
        const W5 = wOf(p.gmidc, p.IbiasFold, PROC.KN, p.Lc);
        const W7 = wOf(p.gmidc, p.IbiasFold, PROC.KN, p.Lc);
        const cPar = cParOf(W3, p.Lc) + cParOf(W5, p.Lc); // pF, cascode output-node parasitic from sized devices
        const cTotal = p.CL + cPar;
        const bwMHz = (gm1 * 1e-6) / (2 * Math.PI * cTotal * 1e-12) / 1e6;
        const powerMW = PROC.VDD * (p.Ibias + 2 * p.IbiasFold) * 1e-3;
        const A0 = Math.pow(10, gainDb / 20);
        const fp1 = (bwMHz * 1e6) / A0;
        const sized = {
          W1, L1, Wf, W3, W5, W7, Lc: p.Lc,
          Ibias: p.Ibias, IbiasFold: p.IbiasFold, CL: p.CL, cPar
        };
        return { gainDb, bwMHz, powerMW, sized, poles: { fp1 } };
      },
      netlist(s) {
        return `* RL-AmpSyn sizing — folded cascode op-amp
* Target syntax: Synopsys PrimeSim HSPICE 2025.06 (formerly HSPICE)
* NOTE: .MODEL cards below are illustrative LEVEL=54 stubs, not a fitted PDK —
* swap in a foundry-calibrated model library before trusting simulated results.
.PARAM VDD=${PROC.VDD}

.MODEL NMOS NMOS LEVEL=54
.MODEL PMOS PMOS LEVEL=54

.SUBCKT FOLDED_OPAMP vin+ vin- vout vdd vss
M1  d1n  vin+   tail  vss  NMOS  W=${fmt(s.W1, 2)}U  L=${fmt(s.L1, 2)}U
M2  d2n  vin-   tail  vss  NMOS  W=${fmt(s.W1, 2)}U  L=${fmt(s.L1, 2)}U
M9  tail vbias  vss   vss  NMOS  W=${fmt(s.W1 * 1.6, 2)}U  L=${fmt(s.L1, 2)}U  $ input tail, I=${fmt(s.Ibias, 1)}uA
M10 d1n  vbf    vdd   vdd  PMOS  W=${fmt(s.Wf, 2)}U  L=${fmt(s.Lc, 2)}U  $ fold source, I=${fmt(s.IbiasFold, 1)}uA
M11 d2n  vbf    vdd   vdd  PMOS  W=${fmt(s.Wf, 2)}U  L=${fmt(s.Lc, 2)}U
M3  d1c  vbc_p  d1n   vdd  PMOS  W=${fmt(s.W3, 2)}U  L=${fmt(s.Lc, 2)}U  $ PMOS cascode
M4  vout vbc_p  d2n   vdd  PMOS  W=${fmt(s.W3, 2)}U  L=${fmt(s.Lc, 2)}U
M5  d1c  vbc_n  d1p   vss  NMOS  W=${fmt(s.W5, 2)}U  L=${fmt(s.Lc, 2)}U  $ NMOS cascode
M6  vout vbc_n  d2p   vss  NMOS  W=${fmt(s.W5, 2)}U  L=${fmt(s.Lc, 2)}U
M7  d1p  d1c    vss   vss  NMOS  W=${fmt(s.W7, 2)}U  L=${fmt(s.Lc, 2)}U  $ mirror
M8  d2p  d1c    vss   vss  NMOS  W=${fmt(s.W7, 2)}U  L=${fmt(s.Lc, 2)}U
CL  vout 0      ${fmt(s.CL, 2)}P
.ENDS FOLDED_OPAMP

* Testbench — differential small-signal AC stimulus about VDD/2
VDD  vdd  0    DC 'VDD'
VSS  vss  0    DC 0
VCM  vcm  0    DC 'VDD/2'
VIP  vin+ vcm  DC 0 AC 0.5
VIN  vin- vcm  DC 0 AC -0.5
X1   vin+ vin- vout vdd vss FOLDED_OPAMP

.AC DEC 20 1 1G
.OP
.MEASURE AC gain_db  MAX VDB(vout)
.MEASURE AC gbw_hz   WHEN VDB(vout)=0
.MEASURE AC pm_deg   FIND VP(vout) WHEN VDB(vout)=0
.END`;
      }
    }
  };

  // Simulated annealing: each candidate perturbs the current point by a step
  // that shrinks (but never to zero) over the run. A strictly better candidate
  // is always accepted; a worse one is accepted anyway with Metropolis
  // probability exp(-delta/T), where T cools geometrically over the run — so
  // early attempts can climb out of a bad neighborhood, and by the end the
  // search behaves greedily. There is no fixed "known answer" being converged
  // toward; an unreachable target for a topology legitimately fails to converge.
  const SA_T0 = 1.4, SA_T_MIN = 0.04;

  function perturb(topo, current, factor) {
    const p = {};
    for (const k in topo.spread) {
      const v = current[k] + rand(-1, 1) * topo.spread[k] * factor;
      const b = topo.bounds[k];
      p[k] = b ? clamp(v, b[0], b[1]) : v;
    }
    return p;
  }

  function scoreOf(spec, r) {
    const gainViol = Math.max(0, spec.gainMin - r.gainDb);
    const bwViol = Math.max(0, spec.bwMin - r.bwMHz) + Math.max(0, r.bwMHz - spec.bwMax);
    const powerViol = Math.max(0, r.powerMW - spec.powerMax);
    return gainViol / 5 + bwViol / 2 + powerViol / 0.3;
  }

  function getUserSpec() {
    let gainMin = parseFloat(specGainMinEl.value);
    let bwMin = parseFloat(specBwMinEl.value);
    let bwMax = parseFloat(specBwMaxEl.value);
    let powerMax = parseFloat(specPowerMaxEl.value);
    if (!isFinite(gainMin)) gainMin = 30;
    if (!isFinite(bwMin)) bwMin = 0.5;
    if (!isFinite(bwMax)) bwMax = 60;
    if (!isFinite(powerMax)) powerMax = 3;
    gainMin = clamp(gainMin, 30, 90);
    bwMin = clamp(bwMin, 0.5, 60);
    bwMax = clamp(bwMax, 0.5, 60);
    powerMax = clamp(powerMax, 0.05, 3);
    if (bwMin > bwMax) { const t = bwMin; bwMin = bwMax; bwMax = t; }
    return { gainMin, bwMin, bwMax, powerMax };
  }

  function applyDefaultSpec(topo) {
    specGainMinEl.value = topo.spec.gainMin;
    specBwMinEl.value = topo.spec.bwMin;
    specBwMaxEl.value = topo.spec.bwMax;
    specPowerMaxEl.value = topo.spec.powerMax;
  }

  function resetDemo() {
    glyphSegs.forEach(s => s.classList.remove('lit'));
    outGain.textContent = '—'; outBw.textContent = '—'; outPower.textContent = '—';
    outStatus.textContent = 'idle';
    demoLog.innerHTML = '';
    netlistOut.textContent = '— run synthesis to generate —';
    bodeChartEl.innerHTML = '<p class="bode-empty mono">— run synthesis to generate —</p>';
  }

  applyDefaultSpec(TOPOLOGIES[topologySelect.value]);
  resetDemo();
  topologySelect.addEventListener('change', () => {
    applyDefaultSpec(TOPOLOGIES[topologySelect.value]);
    resetDemo();
  });
  specResetBtn.addEventListener('click', () => applyDefaultSpec(TOPOLOGIES[topologySelect.value]));

  synthesizeBtn.addEventListener('click', () => {
    resetDemo();
    outStatus.textContent = 'searching topology…';
    synthesizeBtn.disabled = true;
    const topo = TOPOLOGIES[topologySelect.value];
    const spec = getUserSpec();
    const attempts = glyphSegs.length; // one sizing candidate per glyph segment
    const stageDelay = reduceMotion ? 0 : 320;

    let current = topo.base;
    let currentResult = topo.evaluate(current);
    let currentScore = scoreOf(spec, currentResult);
    let best = { result: currentResult, score: currentScore };

    for (let i = 0; i < attempts; i++) {
      setTimeout(() => {
        glyphSegs[i].classList.add('lit');
        if (i === 1) outStatus.textContent = 'sizing…';
        if (i === attempts - 2) outStatus.textContent = 'verifying…';

        const t = i / (attempts - 1);
        const T = SA_T0 * Math.pow(SA_T_MIN / SA_T0, t);
        const exploreFactor = 1 - t * 0.7; // narrows, never to zero — stays a genuine search
        const candidate = perturb(topo, current, exploreFactor);
        const r = topo.evaluate(candidate);
        const score = scoreOf(spec, r);
        const ok = score === 0;
        const delta = score - currentScore;
        const annealed = delta >= 0 && Math.random() < Math.exp(-delta / T);
        if (delta < 0 || annealed) { current = candidate; currentResult = r; currentScore = score; }
        if (score < best.score) best = { result: r, score };

        const row = document.createElement('div');
        row.className = 'demo-log-row' + (ok ? ' pass' : '');
        const saNote = annealed ? ` · SA kept it anyway (T=${T.toFixed(2)})` : '';
        row.innerHTML = `<span class="lr-tag">${ok ? '✓' : '✗'}</span>` +
          `<span>iter ${i + 1} — gain ${fmt(r.gainDb, 1)} dB · bw ${fmt(r.bwMHz, 1)} MHz · power ${fmt(r.powerMW, 2)} mW` +
          `${ok ? ' — meets spec' : ' — rejected'}${saNote}</span>`;
        demoLog.appendChild(row);

        if (i === attempts - 1) {
          const r2 = best.result;
          const metSpec = best.score === 0;
          outGain.textContent = fmt(r2.gainDb, 1) + ' dB';
          outBw.textContent = fmt(r2.bwMHz, 1) + ' MHz';
          outPower.textContent = fmt(r2.powerMW, 2) + ' mW';
          outStatus.textContent = metSpec ? 'verified' : 'spec not met — closest result';
          netlistOut.textContent = topo.netlist(r2.sized);
          buildBodeChart(r2);
          synthesizeBtn.disabled = false;
        }
      }, i * stageDelay);
    }
  });

  /* ---------- Bode chart: closed-form AC response from the sized poles ---------- */
  function buildBodeChart(result) {
    const A0 = Math.pow(10, result.gainDb / 20);
    const fp1 = result.poles.fp1;
    const fp2 = result.poles.fp2;

    const FMIN = 1e3, FMAX = 1e9, N = 140;
    const freqs = [], mags = [], phases = [];
    for (let i = 0; i <= N; i++) {
      const f = Math.pow(10, 3 + (i / N) * 6);
      let m = 20 * Math.log10(A0) - 20 * Math.log10(Math.sqrt(1 + (f / fp1) ** 2));
      let ph = -Math.atan(f / fp1) * 180 / Math.PI;
      if (fp2) { m -= 20 * Math.log10(Math.sqrt(1 + (f / fp2) ** 2)); ph -= Math.atan(f / fp2) * 180 / Math.PI; }
      freqs.push(f); mags.push(m); phases.push(ph);
    }

    let crossIdx = -1;
    for (let i = 1; i <= N; i++) { if (mags[i - 1] >= 0 && mags[i] < 0) { crossIdx = i; break; } }
    let fCross = freqs[N], phAtCross = phases[N];
    if (crossIdx > 0) {
      const m0 = mags[crossIdx - 1], m1 = mags[crossIdx];
      const frac = m0 / (m0 - m1);
      fCross = Math.pow(10, Math.log10(freqs[crossIdx - 1]) + frac * (Math.log10(freqs[crossIdx]) - Math.log10(freqs[crossIdx - 1])));
      phAtCross = phases[crossIdx - 1] + frac * (phases[crossIdx] - phases[crossIdx - 1]);
    }
    const phaseMargin = 180 + phAtCross;

    renderBodeSVG(freqs, mags, phases, fCross, phaseMargin);
  }

  function renderBodeSVG(freqs, mags, phases, fCross, phaseMargin) {
    const W = 600, PAD_L = 36, PAD_R = 10;
    const plotW = W - PAD_L - PAD_R;
    const xPix = f => PAD_L + ((Math.log10(f) - 3) / 6) * plotW;

    const magH = 128, magPadT = 10, magPadB = 14;
    const magPlotH = magH - magPadT - magPadB;
    const magMax = Math.max(10, Math.ceil((Math.max(...mags, 0) + 5) / 10) * 10);
    const magMin = Math.min(-10, Math.floor((Math.min(...mags, 0) - 5) / 10) * 10);
    const magY = db => magPadT + ((magMax - db) / (magMax - magMin)) * magPlotH;

    const phH = 116, phPadT = 8, phPadB = 24;
    const phPlotH = phH - phPadT - phPadB;
    const phMax = 30;
    const phMin = Math.min(-180, Math.floor((Math.min(...phases) - 10) / 30) * 30);
    const phY = deg => phPadT + ((phMax - deg) / (phMax - phMin)) * phPlotH;

    const decades = [1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9];
    const decadeLabels = ['1k', '10k', '100k', '1M', '10M', '100M', '1G'];

    const magPath = freqs.map((f, i) => `${i === 0 ? 'M' : 'L'}${xPix(f).toFixed(1)},${magY(mags[i]).toFixed(1)}`).join(' ');
    const phPath = freqs.map((f, i) => `${i === 0 ? 'M' : 'L'}${xPix(f).toFixed(1)},${phY(phases[i]).toFixed(1)}`).join(' ');

    const magVGrid = decades.map(f => `<line class="bc-grid" x1="${xPix(f)}" y1="${magPadT}" x2="${xPix(f)}" y2="${magH - magPadB}"/>`).join('');
    const phVGrid = decades.map(f => `<line class="bc-grid" x1="${xPix(f)}" y1="${phPadT}" x2="${xPix(f)}" y2="${phH - phPadB}"/>`).join('');
    const xLabels = decades.map((f, i) => `<text class="bc-axis-label" x="${xPix(f)}" y="${phH - 6}" text-anchor="middle">${decadeLabels[i]}</text>`).join('');

    const crossX = xPix(clamp(fCross, 1e3, 1e9));
    const crossLabel = fCross >= 1e6 ? `${fmt(fCross / 1e6, 1)} MHz` : `${fmt(fCross / 1e3, 0)} kHz`;

    bodeChartEl.innerHTML = `
      <svg class="bode-chart" id="bcMag" viewBox="0 0 ${W} ${magH}" preserveAspectRatio="none">
        ${magVGrid}
        <line class="bc-zero" x1="${PAD_L}" y1="${magY(0)}" x2="${W - PAD_R}" y2="${magY(0)}"/>
        <text class="bc-axis-label" x="4" y="${magPadT + 4}">${magMax}dB</text>
        <text class="bc-axis-label" x="4" y="${magY(0) + 3}">0dB</text>
        <text class="bc-axis-label" x="4" y="${magH - magPadB}">${magMin}dB</text>
        <path class="bc-curve" d="${magPath}"/>
        <circle class="bc-mark" cx="${crossX}" cy="${magY(0)}" r="3"/>
        <text class="bc-callout" x="${clamp(crossX + 8, 0, W - 90)}" y="${magY(0) - 6}">GBW ≈ ${crossLabel}</text>
        <line class="bc-crosshair" id="bcMagCross" x1="0" y1="${magPadT}" x2="0" y2="${magH - magPadB}"/>
        <text class="bc-tooltip" id="bcMagTip" x="0" y="${magPadT + 10}"></text>
        <rect class="bc-hit" id="bcMagHit" x="${PAD_L}" y="0" width="${plotW}" height="${magH}"/>
      </svg>
      <svg class="bode-chart" id="bcPhase" viewBox="0 0 ${W} ${phH}" preserveAspectRatio="none">
        ${phVGrid}
        <line class="bc-zero" x1="${PAD_L}" y1="${phY(0)}" x2="${W - PAD_R}" y2="${phY(0)}"/>
        <line class="bc-zero" x1="${PAD_L}" y1="${phY(-90)}" x2="${W - PAD_R}" y2="${phY(-90)}"/>
        <line class="bc-zero" x1="${PAD_L}" y1="${phY(-180)}" x2="${W - PAD_R}" y2="${phY(-180)}"/>
        <text class="bc-axis-label" x="4" y="${phY(0) + 3}">0°</text>
        <text class="bc-axis-label" x="4" y="${phY(-90) + 3}">-90°</text>
        <text class="bc-axis-label" x="4" y="${phY(-180) + 3}">-180°</text>
        <path class="bc-curve" d="${phPath}"/>
        <circle class="bc-mark" cx="${crossX}" cy="${phY(phaseMargin - 180)}" r="3"/>
        <text class="bc-callout" x="${clamp(crossX + 8, 0, W - 90)}" y="${phY(phaseMargin - 180) - 6}">PM ≈ ${fmt(phaseMargin, 0)}°</text>
        ${xLabels}
        <line class="bc-crosshair" id="bcPhCross" x1="0" y1="${phPadT}" x2="0" y2="${phH - phPadB}"/>
        <text class="bc-tooltip" id="bcPhTip" x="0" y="${phPadT + 10}"></text>
        <rect class="bc-hit" id="bcPhHit" x="${PAD_L}" y="0" width="${plotW}" height="${phH}"/>
      </svg>`;

    const magSvg = document.getElementById('bcMag');
    const phSvg = document.getElementById('bcPhase');
    const magCross = document.getElementById('bcMagCross');
    const phCross = document.getElementById('bcPhCross');
    const magTip = document.getElementById('bcMagTip');
    const phTip = document.getElementById('bcPhTip');

    function freqFromEvent(evt, svg) {
      const rect = svg.getBoundingClientRect();
      const fracX = clamp((evt.clientX - rect.left) / rect.width, 0, 1);
      const xView = fracX * W;
      const logf = clamp(3 + ((xView - PAD_L) / plotW) * 6, 3, 9);
      const idx = clamp(Math.round(((logf - 3) / 6) * N), 0, N);
      return idx;
    }

    function showCrosshair(idx) {
      const f = freqs[idx];
      const x = xPix(f);
      const flabel = f >= 1e6 ? `${fmt(f / 1e6, 2)}MHz` : f >= 1e3 ? `${fmt(f / 1e3, 1)}kHz` : `${fmt(f, 0)}Hz`;
      magCross.setAttribute('x1', x); magCross.setAttribute('x2', x); magCross.style.opacity = 1;
      phCross.setAttribute('x1', x); phCross.setAttribute('x2', x); phCross.style.opacity = 1;
      const magTipX = clamp(x + 6, 0, W - 90);
      magTip.setAttribute('x', magTipX); magTip.textContent = `${flabel} · ${fmt(mags[idx], 1)}dB`; magTip.style.opacity = 1;
      const phTipX = clamp(x + 6, 0, W - 90);
      phTip.setAttribute('x', phTipX); phTip.textContent = `${flabel} · ${fmt(phases[idx], 0)}°`; phTip.style.opacity = 1;
    }

    function hideCrosshair() {
      magCross.style.opacity = 0; phCross.style.opacity = 0;
      magTip.style.opacity = 0; phTip.style.opacity = 0;
    }

    magSvg.addEventListener('pointermove', e => showCrosshair(freqFromEvent(e, magSvg)));
    phSvg.addEventListener('pointermove', e => showCrosshair(freqFromEvent(e, phSvg)));
    magSvg.addEventListener('pointerleave', hideCrosshair);
    phSvg.addEventListener('pointerleave', hideCrosshair);
  }
})();
