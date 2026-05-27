// Small render helpers. Pure functions returning DOM elements.

window.UI = (function() {
  function h(tag, props, ...children) {
    const el = document.createElement(tag);
    if (props) {
      for (const k in props) {
        if (k === 'class') el.className = props[k];
        else if (k === 'html') el.innerHTML = props[k];
        else if (k.startsWith('on')) el.addEventListener(k.slice(2).toLowerCase(), props[k]);
        else if (k === 'style' && typeof props[k] === 'object') Object.assign(el.style, props[k]);
        else el.setAttribute(k, props[k]);
      }
    }
    for (const c of children.flat()) {
      if (c == null || c === false) continue;
      el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    }
    return el;
  }

  function pickLang(obj) {
    const lang = window.STATE.lang;
    if (obj == null) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] ?? obj.zh ?? obj.en ?? '';
  }

  function renderSection(sec) {
    const lang = window.STATE.lang;
    switch (sec.type) {
      case 'heading': {
        const tag = 'h' + (sec.level || 2);
        return h(tag, null, lang === 'zh' ? sec.zh : sec.en);
      }
      case 'paragraph': {
        const wrap = h('div', { class: 'bilingual' });
        wrap.appendChild(h('p', null, lang === 'zh' ? sec.zh : sec.en));
        if (window.STATE.bilingual) {
          wrap.appendChild(h('div', { class: 'en' }, lang === 'zh' ? sec.en : sec.zh));
        }
        return wrap;
      }
      case 'list': {
        const items = lang === 'zh' ? sec.zh : sec.en;
        return h('ul', null, ...items.map(i => h('li', null, i)));
      }
      case 'code':
        return h('pre', null, h('code', null, sec.content));
      case 'tip':
        return h('div', { class: 'tip' }, lang === 'zh' ? sec.zh : sec.en);
      case 'keypoint':
        return h('div', { class: 'key-point' }, lang === 'zh' ? sec.zh : sec.en);
      case 'blockquote':
        return h('blockquote', null, lang === 'zh' ? sec.zh : sec.en);
      default:
        return h('p', null, JSON.stringify(sec));
    }
  }

  function renderQuiz(chapterId, quiz) {
    const lang = window.STATE.lang;
    const wrap = h('div', { class: 'quiz' });
    wrap.appendChild(h('div', { class: 'quiz-title' }, `📝 ${window.t('chapter.quizTitle')}`));

    const answeredKey = 'eth-quiz-' + chapterId;
    const previous = JSON.parse(localStorage.getItem(answeredKey) || '{}');

    quiz.forEach((q, qi) => {
      const qWrap = h('div', { class: 'quiz-question' });
      qWrap.appendChild(h('div', { class: 'quiz-q' }, `${qi + 1}. ${pickLang(q.q)}`));
      const opts = h('div', { class: 'quiz-options' });
      const options = lang === 'zh' ? q.options.zh : q.options.en;
      const buttons = [];
      const feedback = h('div', { class: 'quiz-feedback', style: { display: 'none' } });

      options.forEach((opt, oi) => {
        const btn = h('button', { class: 'quiz-option' }, `${String.fromCharCode(65 + oi)}. ${opt}`);
        btn.onclick = () => {
          if (btn.disabled) return;
          buttons.forEach(b => b.disabled = true);
          const correct = oi === q.answer;
          buttons[q.answer].classList.add('correct');
          if (!correct) btn.classList.add('wrong');
          feedback.style.display = 'block';
          feedback.className = 'quiz-feedback ' + (correct ? 'ok' : 'no');
          feedback.textContent = (correct ? '✓ ' + window.t('chapter.correct') : '✗ ' + window.t('chapter.wrong')) + pickLang(q.explain);

          // record progress
          previous[qi] = correct;
          localStorage.setItem(answeredKey, JSON.stringify(previous));
        };
        buttons.push(btn);
        opts.appendChild(btn);
      });

      // restore previous answer state (just mark correct one)
      if (previous[qi] !== undefined) {
        buttons.forEach(b => b.disabled = true);
        buttons[q.answer].classList.add('correct');
        feedback.style.display = 'block';
        feedback.className = 'quiz-feedback ' + (previous[qi] ? 'ok' : 'no');
        feedback.textContent = (previous[qi] ? '✓ ' + window.t('chapter.correct') : '✗ ' + window.t('chapter.wrong')) + pickLang(q.explain);
      }

      qWrap.appendChild(opts);
      qWrap.appendChild(feedback);
      wrap.appendChild(qWrap);
    });
    return wrap;
  }

  function renderDemo(demoSpec) {
    if (!demoSpec || !window.DEMOS[demoSpec.type]) return null;
    return window.DEMOS[demoSpec.type]();
  }

  return { h, pickLang, renderSection, renderQuiz, renderDemo };
})();
