// Main app: simple hash-router + page renderers + global state.
(function() {
  const STORAGE_KEY = 'eth-learning-state';
  const DEFAULT_STATE = {
    lang: 'zh',
    bilingual: true,
    completed: {} // { chapterId: true }
  };

  window.STATE = (() => {
    try { return Object.assign({}, DEFAULT_STATE, JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')); }
    catch { return { ...DEFAULT_STATE }; }
  })();

  function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(window.STATE)); }

  const h = window.UI.h;
  const t = window.t;
  const app = document.getElementById('app');

  // ------ i18n DOM ------
  function applyI18nDom() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = t(el.dataset.i18n);
    });
    document.title = t('brand.title') + ' / ' + (window.STATE.lang === 'zh' ? 'Ethereum Whitepaper Learning' : '以太坊白皮书学习系统');
  }

  // ------ Router ------
  function route() {
    const hash = location.hash.slice(1) || '/home';
    const [path, param] = hash.replace(/^\//, '').split('/');

    document.querySelectorAll('.nav-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.route === path);
    });

    app.innerHTML = '';
    if (path === 'home') renderHome();
    else if (path === 'chapters' && param) renderChapter(param);
    else if (path === 'chapters') renderChapterList();
    else if (path === 'glossary') renderGlossary();
    else if (path === 'progress') renderProgress();
    else renderHome();
    window.scrollTo(0, 0);
  }

  // ------ Home ------
  function renderHome() {
    const hero = h('div', { class: 'hero' });
    hero.appendChild(h('h1', null, t('home.heroTitle')));
    hero.appendChild(h('p', null, t('home.heroDesc')));
    const startBtn = h('button', { class: 'hero-btn' }, t('home.heroBtn'));
    startBtn.onclick = () => { location.hash = '#/chapters/' + window.CHAPTERS[0].id; };
    hero.appendChild(startBtn);
    app.appendChild(hero);

    const featuresData = [
      { i: '📖', tk: 'home.f1' },
      { i: '🎮', tk: 'home.f2' },
      { i: '🧪', tk: 'home.f3' },
      { i: '🔤', tk: 'home.f4' }
    ];
    const features = h('div', { class: 'features' });
    featuresData.forEach(f => {
      const c = h('div', { class: 'feature-card' });
      c.appendChild(h('div', { class: 'feature-icon' }, f.i));
      c.appendChild(h('div', { class: 'feature-title' }, t(f.tk + '.title')));
      c.appendChild(h('div', { class: 'feature-desc' }, t(f.tk + '.desc')));
      features.appendChild(c);
    });
    app.appendChild(features);

    // Show chapter list preview
    renderChapterList(app, /*compact*/ false);
  }

  // ------ Chapter list ------
  function renderChapterList(target, compact) {
    target = target || app;
    target.appendChild(h('h2', { class: 'section-title' }, t('chapters.title')));
    target.appendChild(h('div', { class: 'section-sub' }, t('chapters.sub')));

    const grid = h('div', { class: 'chapter-grid' });
    window.CHAPTERS.forEach((ch, i) => {
      const done = window.STATE.completed[ch.id];
      const card = h('div', { class: 'chapter-card' });
      card.appendChild(h('div', { class: 'chapter-num' }, String(i + 1).padStart(2, '0')));
      const info = h('div', { class: 'chapter-info' });
      info.appendChild(h('div', { class: 'chapter-title' }, window.UI.pickLang(ch.title)));
      info.appendChild(h('div', { class: 'chapter-desc' }, window.UI.pickLang(ch.subtitle)));
      card.appendChild(info);
      const statusWrap = h('div', { class: 'chapter-status' });
      statusWrap.appendChild(h('span', { class: 'badge ' + (done ? 'done' : 'start') },
        done ? '✓ ' + t('chapter.doneTag') : t('chapters.startBtn')));
      card.appendChild(statusWrap);
      card.onclick = () => { location.hash = '#/chapters/' + ch.id; };
      grid.appendChild(card);
    });
    target.appendChild(grid);
  }

  // ------ Chapter detail ------
  function renderChapter(id) {
    const idx = window.CHAPTERS.findIndex(c => c.id === id);
    if (idx < 0) { renderChapterList(); return; }
    const ch = window.CHAPTERS[idx];

    const wrap = h('div', { class: 'chapter-detail' });
    const header = h('div', { class: 'chapter-header' });
    header.appendChild(h('div', { class: 'chapter-eyebrow' },
      (window.STATE.lang === 'zh' ? '第 ' + (idx + 1) + ' 节' : 'Lesson ' + (idx + 1)) +
      ' / ' + window.CHAPTERS.length));
    header.appendChild(h('h1', null, window.UI.pickLang(ch.title)));
    header.appendChild(h('div', { class: 'chapter-meta' }, window.UI.pickLang(ch.subtitle)));
    wrap.appendChild(header);

    const body = h('div', { class: 'chapter-body' });
    ch.sections.forEach(s => body.appendChild(window.UI.renderSection(s)));

    // Demo
    if (ch.demo) {
      const demoEl = window.UI.renderDemo(ch.demo);
      if (demoEl) body.appendChild(demoEl);
    }

    // Quiz
    if (ch.quiz && ch.quiz.length) {
      body.appendChild(window.UI.renderQuiz(ch.id, ch.quiz));
    }

    // Mark done
    const markBtn = h('button', { class: 'hero-btn', style: { background: '#4f46e5', color: '#fff', marginTop: '24px' } },
      window.STATE.completed[ch.id] ? '✓ ' + t('chapter.doneTag') : t('chapter.markDone'));
    markBtn.onclick = () => {
      window.STATE.completed[ch.id] = !window.STATE.completed[ch.id];
      saveState();
      route(); // re-render
    };
    body.appendChild(markBtn);

    wrap.appendChild(body);

    // Prev/Next
    const nav = h('div', { class: 'chapter-nav' });
    const prev = window.CHAPTERS[idx - 1];
    const next = window.CHAPTERS[idx + 1];

    const prevBtn = h('button', { class: 'nav-link' });
    if (prev) {
      prevBtn.appendChild(h('div', { class: 'nav-link-label' }, '← ' + t('chapter.prev')));
      prevBtn.appendChild(h('div', { class: 'nav-link-title' }, window.UI.pickLang(prev.title)));
      prevBtn.onclick = () => { location.hash = '#/chapters/' + prev.id; };
    } else {
      prevBtn.disabled = true;
      prevBtn.appendChild(h('div', { class: 'nav-link-label' }, '—'));
      prevBtn.appendChild(h('div', { class: 'nav-link-title' }, t('chapter.prev')));
    }

    const nextBtn = h('button', { class: 'nav-link next' });
    if (next) {
      nextBtn.appendChild(h('div', { class: 'nav-link-label' }, t('chapter.next') + ' →'));
      nextBtn.appendChild(h('div', { class: 'nav-link-title' }, window.UI.pickLang(next.title)));
      nextBtn.onclick = () => { location.hash = '#/chapters/' + next.id; };
    } else {
      nextBtn.disabled = true;
      nextBtn.appendChild(h('div', { class: 'nav-link-label' }, '—'));
      nextBtn.appendChild(h('div', { class: 'nav-link-title' }, t('chapter.next')));
    }

    nav.appendChild(prevBtn);
    nav.appendChild(nextBtn);
    wrap.appendChild(nav);

    app.appendChild(wrap);
  }

  // ------ Glossary ------
  function renderGlossary() {
    app.appendChild(h('h2', { class: 'section-title' }, t('glossary.title')));
    app.appendChild(h('div', { class: 'section-sub' }, t('glossary.sub')));

    const search = h('input', { type: 'text', class: 'glossary-search', placeholder: t('glossary.searchPlaceholder') });
    app.appendChild(search);

    const grid = h('div', { class: 'glossary-grid' });
    app.appendChild(grid);

    function render(filter) {
      grid.innerHTML = '';
      const f = (filter || '').toLowerCase().trim();
      const items = window.GLOSSARY.filter(g =>
        !f || g.term_zh.toLowerCase().includes(f) || g.term_en.toLowerCase().includes(f)
            || g.def_zh.toLowerCase().includes(f) || g.def_en.toLowerCase().includes(f)
      );
      if (!items.length) {
        grid.appendChild(h('div', { class: 'glossary-item' }, t('glossary.noResult')));
        return;
      }
      items.forEach(g => {
        const item = h('div', { class: 'glossary-item' });
        const heading = h('div', null,
          h('span', { class: 'term-name' }, window.STATE.lang === 'zh' ? g.term_zh : g.term_en),
          h('span', { class: 'term-en' }, window.STATE.lang === 'zh' ? g.term_en : g.term_zh)
        );
        item.appendChild(heading);
        item.appendChild(h('div', { class: 'term-def' }, window.STATE.lang === 'zh' ? g.def_zh : g.def_en));
        grid.appendChild(item);
      });
    }
    search.oninput = () => render(search.value);
    render('');
  }

  // ------ Progress ------
  function renderProgress() {
    const total = window.CHAPTERS.length;
    const done = Object.values(window.STATE.completed).filter(Boolean).length;
    const pct = total ? Math.round(done / total * 100) : 0;

    // quiz accuracy
    let q = 0, correct = 0;
    window.CHAPTERS.forEach(ch => {
      const k = 'eth-quiz-' + ch.id;
      try {
        const a = JSON.parse(localStorage.getItem(k) || '{}');
        Object.values(a).forEach(v => { q++; if (v) correct++; });
      } catch {}
    });
    const accuracy = q ? Math.round(correct / q * 100) : 0;

    const summary = h('div', { class: 'progress-summary' });
    summary.appendChild(h('h2', null, t('progress.summary')));
    summary.appendChild(h('div', null, `${t('progress.completed')}: ${done} / ${total}`));
    const bar = h('div', { class: 'progress-bar' });
    bar.appendChild(h('div', { class: 'progress-fill', style: { width: pct + '%' } }));
    summary.appendChild(bar);
    summary.appendChild(h('div', { class: 'progress-stats' },
      h('div', null, `📚 ${pct}% `),
      h('div', null, `📝 ${t('progress.quizScore')}: ${accuracy}% (${correct}/${q})`)
    ));
    const resetBtn = h('button', { class: 'reset-btn' }, t('progress.reset'));
    resetBtn.onclick = () => {
      if (confirm(t('progress.confirmReset'))) {
        window.STATE.completed = {};
        saveState();
        window.CHAPTERS.forEach(ch => localStorage.removeItem('eth-quiz-' + ch.id));
        route();
      }
    };
    summary.appendChild(resetBtn);
    app.appendChild(summary);

    renderChapterList();
  }

  // ------ Setup ------
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.onclick = () => { location.hash = '#/' + b.dataset.route; };
  });
  document.getElementById('lang-toggle').onclick = () => {
    window.STATE.lang = window.STATE.lang === 'zh' ? 'en' : 'zh';
    saveState();
    applyI18nDom();
    route();
  };
  window.addEventListener('hashchange', route);

  applyI18nDom();
  route();
})();
