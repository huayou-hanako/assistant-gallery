/* ============================================================
   小助手产品发布页 — Interactions
   ============================================================ */

/* Scroll-driven visibility */
const io = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.12 }
);
document.querySelectorAll(
  '.feat-label, .feat-title, .feat-desc, ' +
  '.dashboard-demo, .board-demo, .ai-demo, .cal-demo, .voice-demo, .orb-demo, ' +
  '.report-demo, .xp-themes, .xp-badges, .stmt-text, ' +
  '.search-demo, .subtask-demo, .tpl-grid, ' +
  '.footer-cta h2, .footer-cta p, .btn-pill, .cta-actions'
).forEach(el => io.observe(el));

/* Dashboard - no tabs needed, all columns visible */

/* AI Typing Animation */
const aiScenarios = [
  {
    phrase: '明天下午三点开产品评审会',
    thinking: '正在解析时间信息...',
    cards: [
      { icon: 'todo', label: '创建待办', title: '明天下午三点开产品评审会', meta: '已设置提醒 · 2026-07-10 15:00' },
      { icon: 'check', label: '同步日历', title: '已添加到日历 · 7月10日 周四' },
    ]
  },
  {
    phrase: '帮我记录充电异常，优先级设为高',
    thinking: '正在创建问题卡片...',
    cards: [
      { icon: 'todo', label: '创建卡片', title: '充电异常', meta: '优先级：高 · 类型：issue' },
      { icon: 'check', label: '自动归档', title: '已加入看板「待处理」列' },
    ]
  },
  {
    phrase: '这周做了哪些事？帮我生成周报',
    thinking: '正在汇总本周工作...',
    cards: [
      { icon: 'todo', label: 'AI 周报', title: '第 28 周工作周报已生成', meta: '3 项完成 · 2 项进行中 · 1 项风险' },
      { icon: 'check', label: '可编辑', title: '支持修改后导出' },
    ]
  },
  {
    phrase: '把 OTA 升级测试标记为已完成',
    thinking: '正在更新任务状态...',
    cards: [
      { icon: 'check', label: '状态更新', title: 'OTA 升级测试 → 已解决', meta: '看板状态已同步' },
    ]
  },
  {
    phrase: '查一下充电异常的最新进展',
    thinking: '正在搜索相关记录...',
    cards: [
      { icon: 'search', label: '查询结果', title: '充电异常问题排查', meta: '状态：进行中 · 逾期 2 天 · 高优' },
      { icon: 'todo', label: '最新动态', title: '已定位根因：IC 供电不稳', meta: '待安排修复' },
    ]
  },
  {
    phrase: '帮我安排下周的工作计划',
    thinking: '正在分析任务优先级...',
    cards: [
      { icon: 'todo', label: '计划生成', title: '下周工作计划已生成', meta: '5 项任务 · 2 项高优' },
      { icon: 'check', label: '日程安排', title: '已同步到日历', meta: '周一至周五任务已分配' },
    ]
  },
];
let aiScenarioIdx = 0;
const aiTypingEl = document.getElementById('aiTyping');
const aiResult = document.getElementById('aiResult');
const aiThinking = document.getElementById('aiThinking');

function renderAICards(cards) {
  const icons = {
    todo: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" stroke-width="1.5"/><rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" stroke-width="1.5"/></svg>`,
    check: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    search: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5"/><path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  };
  return cards.map((c, i) => `
    <div class="ai-result-card" id="aiCard${i}">
      <div class="ai-card-icon ${c.icon === 'check' ? 'green' : ''}">${icons[c.icon] || icons.todo}</div>
      <div class="ai-card-body">
        <span class="ai-card-label">${c.label}</span>
        <strong>${c.title}</strong>
        ${c.meta ? `<span class="ai-card-meta">${c.meta}</span>` : ''}
      </div>
    </div>
  `).join('');
}

function typePhrase() {
  const scenario = aiScenarios[aiScenarioIdx];
  let i = 0;
  aiResult.classList.remove('show');
  aiTypingEl.textContent = '';
  aiResult.innerHTML = renderAICards(scenario.cards);

  const typeInterval = setInterval(() => {
    if (i < scenario.phrase.length) {
      aiTypingEl.textContent += scenario.phrase[i];
      i++;
    } else {
      clearInterval(typeInterval);
      
      // 显示思考状态
      setTimeout(() => {
        if (aiThinking) {
          aiThinking.classList.add('show');
        }
      }, 200);
      
      // 显示结果
      setTimeout(() => {
        if (aiThinking) {
          aiThinking.classList.remove('show');
        }
        aiResult.classList.add('show');
        const cards = aiResult.querySelectorAll('.ai-result-card');
        cards.forEach((card, idx) => {
          setTimeout(() => card.classList.add('show'), idx * 250);
        });
      }, 1500);
      
      setTimeout(() => {
        aiScenarioIdx = (aiScenarioIdx + 1) % aiScenarios.length;
        typePhrase();
      }, 5000);
    }
  }, 60);
}

const aiSection = document.querySelector('.ai-demo');
const aiObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) { typePhrase(); aiObs.disconnect(); }
}, { threshold: 0.3 });
if (aiSection) aiObs.observe(aiSection);

/* Nav background on scroll */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  nav.style.background = window.scrollY > 100 ? 'rgba(0,0,0,0.88)' : 'rgba(0,0,0,0.72)';
}, { passive: true });

/* Orb eye follows mouse */
const orbBall = document.querySelector('.orb-ball');
const orbCore = orbBall?.querySelector('.orb-core');
if (orbBall && orbCore) {
  document.addEventListener('mousemove', e => {
    const rect = orbBall.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxMove = 4;
    const moveX = dist > 0 ? (dx / dist) * Math.min(dist / 40, 1) * maxMove : 0;
    const moveY = dist > 0 ? (dy / dist) * Math.min(dist / 40, 1) * maxMove : 0;
    orbCore.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });
}

/* Smooth scroll */
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* Search Typing Animation */
const searchPhrases = ['充电异常', 'OTA 测试', '电池寿命', 'WiFi 断连'];
let searchPhraseIdx = 0;
const searchTypingEl = document.getElementById('searchTyping');
const searchResults = document.getElementById('searchResults');

function typeSearch() {
  if (!searchTypingEl) return;
  const phrase = searchPhrases[searchPhraseIdx];
  let i = 0;
  searchTypingEl.textContent = '';
  if (searchResults) searchResults.classList.remove('show');

  const interval = setInterval(() => {
    if (i < phrase.length) {
      searchTypingEl.textContent += phrase[i];
      i++;
    } else {
      clearInterval(interval);
      setTimeout(() => {
        if (searchResults) searchResults.classList.add('show');
      }, 400);
      setTimeout(() => {
        searchPhraseIdx = (searchPhraseIdx + 1) % searchPhrases.length;
        typeSearch();
      }, 4000);
    }
  }, 80);
}

const searchSection = document.querySelector('.search-demo');
if (searchSection) {
  const searchObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { typeSearch(); searchObs.disconnect(); }
  }, { threshold: 0.3 });
  searchObs.observe(searchSection);
}
