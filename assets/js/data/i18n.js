// Static UI strings (Chinese / English)
window.I18N = {
  zh: {
    "brand.title": "以太坊白皮书学习系统",
    "brand.sub": "Ethereum Whitepaper · 渐进式互动学习",
    "nav.home": "首页",
    "nav.chapters": "章节",
    "nav.glossary": "术语表",
    "nav.progress": "进度",
    "footer.text": "本项目用于教学目的，基于 Vitalik Buterin 2013 年以太坊白皮书。",

    "home.heroTitle": "从零开始，读懂以太坊",
    "home.heroDesc": "把厚厚的白皮书拆成 13 个循序渐进的小节（含最新升级与路线图），每节配图解、双语对照、互动演示和小测验。",
    "home.heroBtn": "开始第一节 →",
    "home.f1.title": "图文讲解",
    "home.f1.desc": "用类比、图示把复杂概念拆成直观片段。",
    "home.f2.title": "互动演示",
    "home.f2.desc": "Merkle 树、哈希、Gas、状态转换，亲手操作看效果。",
    "home.f3.title": "随堂小测",
    "home.f3.desc": "每节配选择题，加深理解，记录通关进度。",
    "home.f4.title": "术语速查",
    "home.f4.desc": "EVM、Gas、Nonce、Merkle… 不懂随时查。",

    "chapters.title": "章节列表",
    "chapters.sub": "建议按顺序学习，每节大约 10–15 分钟。",
    "chapters.startBtn": "开始学习",
    "chapters.continueBtn": "继续",
    "chapters.reviewBtn": "复习",

    "glossary.title": "术语表",
    "glossary.sub": "区块链 / 以太坊 高频术语，支持中英检索。",
    "glossary.searchPlaceholder": "搜索术语（中文 / English / 缩写）...",
    "glossary.noResult": "未找到匹配术语。",

    "progress.title": "学习进度",
    "progress.completed": "已完成章节",
    "progress.quizScore": "测验正确率",
    "progress.reset": "清空进度",
    "progress.confirmReset": "确定要清空所有学习进度吗？",
    "progress.summary": "你的学习总览",

    "chapter.prev": "上一节",
    "chapter.next": "下一节",
    "chapter.markDone": "标记本节完成 ✓",
    "chapter.doneTag": "已完成",
    "chapter.quizTitle": "随堂小测",
    "chapter.demoTitle": "互动演示",
    "chapter.submit": "提交",
    "chapter.compute": "计算",
    "chapter.reset": "重置",
    "chapter.correct": "回答正确！",
    "chapter.wrong": "再想一想 —— "
  },
  en: {
    "brand.title": "Ethereum Whitepaper Learning",
    "brand.sub": "Step-by-step interactive course",
    "nav.home": "Home",
    "nav.chapters": "Chapters",
    "nav.glossary": "Glossary",
    "nav.progress": "Progress",
    "footer.text": "For educational use. Based on the 2013 Ethereum Whitepaper by Vitalik Buterin.",

    "home.heroTitle": "Read the Ethereum Whitepaper, the easy way",
    "home.heroDesc": "13 bite-sized lessons — now with the latest upgrades & roadmap — with illustrations, bilingual text, interactive demos and quizzes.",
    "home.heroBtn": "Start Lesson 1 →",
    "home.f1.title": "Visual explanations",
    "home.f1.desc": "Break down abstract ideas with analogies and diagrams.",
    "home.f2.title": "Interactive demos",
    "home.f2.desc": "Play with Merkle trees, hashing, gas and state transitions.",
    "home.f3.title": "Inline quizzes",
    "home.f3.desc": "Multi-choice questions after each lesson — track your mastery.",
    "home.f4.title": "Glossary",
    "home.f4.desc": "EVM, Gas, Nonce, Merkle… look anything up.",

    "chapters.title": "Chapters",
    "chapters.sub": "Follow them in order; ~10–15 minutes each.",
    "chapters.startBtn": "Start",
    "chapters.continueBtn": "Continue",
    "chapters.reviewBtn": "Review",

    "glossary.title": "Glossary",
    "glossary.sub": "Search blockchain & Ethereum terms in Chinese or English.",
    "glossary.searchPlaceholder": "Search terms (Chinese / English / abbreviation)...",
    "glossary.noResult": "No matching terms.",

    "progress.title": "Your Progress",
    "progress.completed": "Lessons completed",
    "progress.quizScore": "Quiz accuracy",
    "progress.reset": "Reset progress",
    "progress.confirmReset": "Reset all learning progress?",
    "progress.summary": "Overview",

    "chapter.prev": "Previous",
    "chapter.next": "Next",
    "chapter.markDone": "Mark complete ✓",
    "chapter.doneTag": "Done",
    "chapter.quizTitle": "Quiz",
    "chapter.demoTitle": "Try it",
    "chapter.submit": "Submit",
    "chapter.compute": "Compute",
    "chapter.reset": "Reset",
    "chapter.correct": "Correct!",
    "chapter.wrong": "Not quite — "
  }
};

window.t = function(key) {
  const lang = window.STATE && window.STATE.lang ? window.STATE.lang : 'zh';
  return (window.I18N[lang] && window.I18N[lang][key]) || window.I18N.zh[key] || key;
};
