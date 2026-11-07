// Training Recorder - Simple Web App
// Stores data in localStorage for persistence

const STORAGE_KEY = 'training_recorder_data';
let currentData = null;

const $ = id => document.getElementById(id);

const PRIORITY_EMOJI = { MUST: '🔴', CORE: '🟡', EXTRA: '🟢' };
const PRIORITY_CLASS = { MUST: 'must', CORE: 'core', EXTRA: 'extra' };

// ==== Parse JSON ====
$('parse-btn').addEventListener('click', () => {
  $('error-message').textContent = '';
  const text = $('json-input').value.trim();
  if (!text) {
    $('error-message').textContent = 'JSONを入力してください';
    return;
  }
  try {
    const parsed = JSON.parse(text);
    if (!parsed.exercises || !Array.isArray(parsed.exercises)) {
      throw new Error('exercises配列がありません');
    }
    currentData = parsed;
    currentData.exercises.forEach(ex => {
      if (!ex.sets) ex.sets = [];
      if (!ex.memo) ex.memo = '';
    });
    if (!currentData.session_memo) currentData.session_memo = '';
    renderAll();
    saveState();
  } catch (e) {
    $('error-message').textContent = 'JSON解析エラー: ' + e.message;
  }
});

// ==== Restore ====
$('restore-btn').addEventListener('click', () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    $('error-message').textContent = '保存データなし';
    return;
  }
  try {
    currentData = JSON.parse(saved);
    $('json-input').value = JSON.stringify(currentData, null, 2);
    renderAll();
    $('error-message').textContent = '';
  } catch (e) {
    $('error-message').textContent = '復元エラー: ' + e.message;
  }
});

// ==== Clear ====
$('clear-btn').addEventListener('click', () => {
  if (!confirm('本当にクリアしますか？')) return;
  currentData = null;
  $('json-input').value = '';
  $('session-info').hidden = true;
  $('exercises-section').hidden = true;
  $('memo-section').hidden = true;
  $('output-section').hidden = true;
  $('exercises-section').innerHTML = '';
  $('md-output').value = '';
  localStorage.removeItem(STORAGE_KEY);
});

// ==== Render ====
function renderAll() {
  renderSessionInfo();
  renderExercises();
  renderMemo();
  $('session-info').hidden = false;
  $('exercises-section').hidden = false;
  $('memo-section').hidden = false;
  $('output-section').hidden = false;
}

function renderSessionInfo() {
  const d = currentData;
  $('session-title').textContent =
    `Cycle ${d.cycle} ${capitalize(d.week)} Day ${d.day}${d.day_name ? ` (${d.day_name})` : ''}`;
  const parts = [];
  if (d.date) parts.push(d.date);
  if (d.location) parts.push(d.location);
  $('session-meta').textContent = parts.join(' | ');
}

function renderExercises() {
  const container = $('exercises-section');
  container.innerHTML = '';
  currentData.exercises.forEach(ex => {
    const card = document.createElement('div');
    const priorityKey = (ex.priority || 'EXTRA').toUpperCase();
    card.className = `exercise-card ${PRIORITY_CLASS[priorityKey] || 'extra'}`;

    const header = document.createElement('div');
    header.className = 'exercise-header';
    const prefix = document.createElement('span');
    prefix.className = 'exercise-prefix';
    prefix.textContent = `${PRIORITY_EMOJI[priorityKey] || '🟢'} ${ex.id}: `;
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'exercise-name-input';
    nameInput.value = ex.name;
    nameInput.placeholder = '種目名';
    nameInput.autocomplete = 'off';
    nameInput.addEventListener('input', () => {
      ex.name = nameInput.value;
      saveState();
    });
    header.appendChild(prefix);
    header.appendChild(nameInput);
    card.appendChild(header);

    if (ex.target) {
      const target = document.createElement('div');
      target.className = 'exercise-target';
      target.textContent = `目標: ${ex.target}`;
      card.appendChild(target);
    }

    const setsContainer = document.createElement('div');
    setsContainer.className = 'sets-container';
    card.appendChild(setsContainer);

    function renderSets() {
      setsContainer.innerHTML = '';
      ex.sets.forEach((set, sIdx) => {
        const row = document.createElement('div');
        row.className = 'set-row';

        const num = document.createElement('span');
        num.className = 'set-num';
        num.textContent = `S${sIdx + 1}`;
        row.appendChild(num);

        const weight = document.createElement('input');
        weight.type = 'text';
        weight.placeholder = 'kg';
        weight.inputMode = 'decimal';
        weight.pattern = '[0-9.]*';
        weight.autocomplete = 'off';
        weight.autocapitalize = 'off';
        weight.enterKeyHint = 'next';
        weight.value = set.weight || '';
        weight.addEventListener('input', () => { set.weight = weight.value; saveState(); });
        row.appendChild(weight);

        const x = document.createElement('span');
        x.className = 'multiply';
        x.textContent = '×';
        row.appendChild(x);

        const reps = document.createElement('input');
        reps.type = 'text';
        reps.placeholder = 'rep';
        reps.inputMode = 'numeric';
        reps.pattern = '[0-9]*';
        reps.autocomplete = 'off';
        reps.autocapitalize = 'off';
        reps.enterKeyHint = 'next';
        reps.value = set.reps || '';
        reps.addEventListener('input', () => { set.reps = reps.value; saveState(); });
        row.appendChild(reps);

        const del = document.createElement('button');
        del.className = 'remove-set';
        del.textContent = '×';
        del.addEventListener('click', () => {
          ex.sets.splice(sIdx, 1);
          renderSets();
          saveState();
        });
        row.appendChild(del);

        setsContainer.appendChild(row);
      });

      const addBtn = document.createElement('button');
      addBtn.className = 'add-set';
      addBtn.textContent = '+ セット追加';
      addBtn.addEventListener('click', () => {
        const lastSet = ex.sets[ex.sets.length - 1];
        ex.sets.push({
          weight: lastSet ? lastSet.weight : '',
          reps: ''
        });
        renderSets();
        saveState();
      });
      setsContainer.appendChild(addBtn);
    }
    renderSets();

    // Memo
    const memoWrap = document.createElement('div');
    memoWrap.className = 'exercise-memo';
    const memoLabel = document.createElement('label');
    memoLabel.textContent = 'メモ';
    const memoInput = document.createElement('textarea');
    memoInput.value = ex.memo || '';
    memoInput.placeholder = 'フォーム・感覚など';
    memoInput.addEventListener('input', () => { ex.memo = memoInput.value; saveState(); });
    memoWrap.appendChild(memoLabel);
    memoWrap.appendChild(memoInput);
    card.appendChild(memoWrap);

    container.appendChild(card);
  });
}

function renderMemo() {
  const memoEl = $('session-memo');
  memoEl.value = currentData.session_memo || '';
  memoEl.oninput = () => { currentData.session_memo = memoEl.value; saveState(); };
}

// ==== Save ====
function saveState() {
  if (currentData) localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
}

// ==== Auto-restore ====
window.addEventListener('load', () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      currentData = JSON.parse(saved);
      $('json-input').value = JSON.stringify(currentData, null, 2);
      renderAll();
    } catch (e) { console.warn('restore failed', e); }
  }
});

// ==== Export MD ====
$('export-btn').addEventListener('click', () => {
  if (!currentData) return;
  $('md-output').value = generateMarkdown(currentData);
});

function generateMarkdown(d) {
  const lines = [];
  lines.push('## Training Log');
  lines.push('');
  lines.push(`**Cycle**: ${d.cycle}`);
  lines.push(`**Week**: ${capitalize(d.week)}`);
  lines.push(`**Day**: ${d.day}${d.day_name ? ` (${d.day_name})` : ''}`);
  if (d.date) lines.push(`**Date**: ${d.date}`);
  if (d.location) lines.push(`**Location**: ${d.location}`);
  lines.push('');
  lines.push('### Exercises');
  lines.push('');

  d.exercises.forEach(ex => {
    const emoji = PRIORITY_EMOJI[(ex.priority || 'EXTRA').toUpperCase()] || '🟢';
    lines.push(`**${emoji} ${ex.id}: ${ex.name}**`);
    const validSets = (ex.sets || []).filter(s => (s.weight && s.weight !== '') || (s.reps && s.reps !== ''));
    if (validSets.length > 0) {
      validSets.forEach(set => {
        const w = set.weight || '-';
        const r = set.reps || '-';
        lines.push(`- ${w} × ${r}`);
      });
    } else {
      lines.push('- (未実施)');
    }
    if (ex.memo && ex.memo.trim() !== '') {
      lines.push(`- Memo: ${ex.memo.trim()}`);
    }
    lines.push('');
  });

  if (d.session_memo && d.session_memo.trim() !== '') {
    lines.push('### Session Memo');
    lines.push('');
    lines.push(d.session_memo.trim());
    lines.push('');
  }

  return lines.join('\n');
}

// ==== Copy ====
$('copy-btn').addEventListener('click', async () => {
  const text = $('md-output').value;
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    flashBtn('copy-btn', 'コピー済✓');
  } catch (e) {
    $('md-output').select();
    document.execCommand('copy');
    flashBtn('copy-btn', 'コピー済✓');
  }
});

// ==== Download ====
$('download-btn').addEventListener('click', () => {
  const text = $('md-output').value;
  if (!text || !currentData) return;
  const d = currentData;
  const filename = `${d.date || 'training'}-cycle${d.cycle}-${d.week}-day${d.day}.md`;
  const blob = new Blob([text], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
});

function flashBtn(id, msg) {
  const el = $(id);
  const original = el.textContent;
  el.textContent = msg;
  setTimeout(() => el.textContent = original, 1500);
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
