'use strict';

// ============================================================
// STATE
// ============================================================
const state = {
  trainerName: '',
  selectedScenario: null,
  selectedArchetype: null,
  selectedMode: 'mc',
  lbTab: 'weekly',
  lbScenario: ''
};

const SCENARIO_LABELS = {
  in_session: 'IN-SESSION PITCH',
  consult_1:  'CONSULT 1: WEEK 1',
  consult_2:  'CONSULT 2: THE CLOSE'
};

// ============================================================
// SCREEN NAVIGATION
// ============================================================
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

// ============================================================
// HOME SCREEN
// ============================================================
function initHome() {
  const nameInput = document.getElementById('trainer-name');

  // Restore name from localStorage
  const saved = localStorage.getItem('trainerName');
  if (saved) {
    nameInput.value = saved;
    state.trainerName = saved;
  }

  nameInput.addEventListener('input', () => {
    state.trainerName = nameInput.value.trim();
    localStorage.setItem('trainerName', state.trainerName);
  });

  // Scenario card clicks
  document.querySelectorAll('.scenario-card').forEach(card => {
    card.querySelector('.btn-play').addEventListener('click', (e) => {
      e.stopPropagation();
      const scenario = card.dataset.scenario;
      if (!state.trainerName) {
        nameInput.focus();
        nameInput.style.borderColor = 'var(--crimson)';
        setTimeout(() => nameInput.style.borderColor = '', 1500);
        return;
      }
      openSetup(scenario);
    });

    card.addEventListener('click', () => {
      if (!state.trainerName) {
        nameInput.focus();
        return;
      }
      openSetup(card.dataset.scenario);
    });
  });

  // Leaderboard tabs
  document.querySelectorAll('.lb-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.lb-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.lbTab = tab.dataset.tab;
      loadLeaderboard();
    });
  });

  document.getElementById('lb-scenario-filter').addEventListener('change', (e) => {
    state.lbScenario = e.target.value;
    loadLeaderboard();
  });

  loadLeaderboard();
}

// ============================================================
// LEADERBOARD
// ============================================================
async function loadLeaderboard() {
  const body = document.getElementById('leaderboard-body');
  body.innerHTML = '<div class="lb-skeleton"></div><div class="lb-skeleton"></div><div class="lb-skeleton"></div>';

  const endpoint = state.lbTab === 'weekly' ? '/api/leaderboard/weekly' : '/api/leaderboard/all_time';
  const params = state.lbScenario ? `?scenario=${state.lbScenario}` : '';

  try {
    const res = await fetch(endpoint + params);
    const rows = await res.json();

    if (!rows.length) {
      body.innerHTML = '<p class="lb-empty">No scores yet — be the first.</p>';
      return;
    }

    body.innerHTML = rows.map((r, i) => {
      const gradeColor = r.best_grade === 'A+' ? 'var(--lime)' : r.best_grade === 'A' ? 'var(--lime)' : r.best_grade === 'B' ? '#F4D03F' : 'var(--muted)';
      return `
        <div class="lb-row">
          <span class="lb-rank ${i < 3 ? 'top' : ''}">#${i + 1}</span>
          <span class="lb-name">${escapeHtml(r.trainer_name)}</span>
          <span class="lb-pct">${r.avg_pct}%</span>
          <span class="lb-grade" style="color:${gradeColor}">${r.best_grade}</span>
          <span class="lb-attempts">${r.attempts} runs</span>
        </div>`;
    }).join('');
  } catch {
    body.innerHTML = '<p class="lb-empty">Couldn\'t reach the leaderboard. Score saved locally.</p>';
  }
}

// ============================================================
// SETUP SCREEN
// ============================================================
function openSetup(scenario) {
  state.selectedScenario = scenario;
  state.selectedArchetype = null;
  state.selectedMode = 'mc';

  document.getElementById('setup-scenario-label').textContent = SCENARIO_LABELS[scenario] || scenario;

  // Reset selections
  document.querySelectorAll('.archetype-card').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('.btn-mode').forEach(b => {
    b.classList.toggle('active', b.dataset.mode === 'mc');
  });

  showScreen('screen-setup');
}

function initSetup() {
  document.getElementById('back-to-home').addEventListener('click', () => showScreen('screen-home'));

  // Archetype selection
  document.querySelectorAll('.archetype-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.archetype-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.selectedArchetype = card.dataset.archetype;
    });
  });

  // Random archetype
  document.getElementById('btn-random').addEventListener('click', () => {
    const cards = [...document.querySelectorAll('.archetype-card')];
    const pick = cards[Math.floor(Math.random() * cards.length)];
    document.querySelectorAll('.archetype-card').forEach(c => c.classList.remove('selected'));
    pick.classList.add('selected');
    state.selectedArchetype = pick.dataset.archetype;
  });

  // Mode selection
  document.querySelectorAll('.btn-mode').forEach(btn => {
    btn.addEventListener('click', () => {
      // Check voice availability
      if (btn.dataset.mode === 'voice') {
        const hasVoice = ('speechSynthesis' in window) &&
                         ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
        if (!hasVoice) {
          alert('Voice mode requires Chrome, Edge, or Safari. Please switch browsers or use text mode.');
          return;
        }
      }
      document.querySelectorAll('.btn-mode').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.selectedMode = btn.dataset.mode;
    });
  });

  // Start session
  document.getElementById('btn-start').addEventListener('click', () => {
    if (!state.selectedArchetype) {
      document.querySelector('.archetypes').style.outline = '1px solid var(--crimson)';
      setTimeout(() => document.querySelector('.archetypes').style.outline = '', 1500);
      return;
    }
    // Scenario engine comes in Step 3 — placeholder for now
    alert(`Coming in Step 3!\n\nScenario: ${SCENARIO_LABELS[state.selectedScenario]}\nOpponent: ${state.selectedArchetype}\nMode: ${state.selectedMode}`);
  });
}

// ============================================================
// UTILS
// ============================================================
function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initHome();
  initSetup();
});
