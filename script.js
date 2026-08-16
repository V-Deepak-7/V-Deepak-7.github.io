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

  /* ---------- RL-AmpSyn demo: glyph strip + mock synthesis ---------- */
  const synthesizeBtn = document.getElementById('synthesizeBtn');
  const glyphSegs = document.querySelectorAll('.glyph-seg');
  const outGain = document.getElementById('outGain');
  const outBw = document.getElementById('outBw');
  const outPower = document.getElementById('outPower');
  const outStatus = document.getElementById('outStatus');

  const MOCK_RESULTS = {
    'two-stage': { gain: '68.4 dB', bw: '4.2 MHz', power: '0.82 mW' },
    'telescopic': { gain: '74.1 dB', bw: '9.6 MHz', power: '1.15 mW' },
    'folded': { gain: '71.8 dB', bw: '12.3 MHz', power: '1.40 mW' }
  };

  function resetGlyphs() {
    glyphSegs.forEach(s => s.classList.remove('lit'));
    outGain.textContent = '—'; outBw.textContent = '—'; outPower.textContent = '—';
    outStatus.textContent = 'idle';
  }
  resetGlyphs();

  synthesizeBtn.addEventListener('click', () => {
    resetGlyphs();
    outStatus.textContent = 'searching topology…';
    synthesizeBtn.disabled = true;
    const topology = document.getElementById('topologySelect').value;
    const stageDelay = reduceMotion ? 0 : 260;

    glyphSegs.forEach((seg, i) => {
      setTimeout(() => {
        seg.classList.add('lit');
        if (i === 1) outStatus.textContent = 'sizing…';
        if (i === 3) outStatus.textContent = 'verifying…';
      }, i * stageDelay);
    });

    setTimeout(() => {
      const r = MOCK_RESULTS[topology];
      outGain.textContent = r.gain;
      outBw.textContent = r.bw;
      outPower.textContent = r.power;
      outStatus.textContent = 'verified';
      synthesizeBtn.disabled = false;
    }, glyphSegs.length * stageDelay + 200);
  });
})();
