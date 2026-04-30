'use strict';

// ============================================================
// STATE
// ============================================================
const appState = {
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

const GRADE_LABELS = {
  'A+': 'CLOSER',
  'A':  'PRO',
  'B':  'SOLID',
  'C':  'ROUGH BUT BREATHING',
  'D':  'BACK TO THE TAPE'
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

  const saved = localStorage.getItem('trainerName');
  if (saved) {
    nameInput.value = saved;
    appState.trainerName = saved;
  }

  nameInput.addEventListener('input', () => {
    appState.trainerName = nameInput.value.trim();
    localStorage.setItem('trainerName', appState.trainerName);
  });

  document.querySelectorAll('.scenario-card').forEach(card => {
    const openSetupFn = () => {
      if (!appState.trainerName) {
        nameInput.focus();
        nameInput.style.borderColor = 'var(--crimson)';
        setTimeout(() => nameInput.style.borderColor = '', 1500);
        return;
      }
      openSetup(card.dataset.scenario);
    };
    card.querySelector('.btn-play').addEventListener('click', (e) => { e.stopPropagation(); openSetupFn(); });
    card.addEventListener('click', openSetupFn);
  });

  document.querySelectorAll('.lb-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.lb-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      appState.lbTab = tab.dataset.tab;
      loadLeaderboard();
    });
  });

  document.getElementById('lb-scenario-filter').addEventListener('change', (e) => {
    appState.lbScenario = e.target.value;
    loadLeaderboard();
  });

  loadLeaderboard();
}

// ============================================================
// LEADERBOARD
// ============================================================
const MEDAL_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];

function timeAgo(dateStr) {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60)   return mins + 'm ago';
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)    return hrs + 'h ago';
  return Math.floor(hrs / 24) + 'd ago';
}

async function loadLeaderboard() {
  const body = document.getElementById('leaderboard-body');
  body.innerHTML = '<div class="lb-skeleton"></div><div class="lb-skeleton"></div><div class="lb-skeleton"></div>';

  const endpoint = appState.lbTab === 'weekly' ? '/api/leaderboard/weekly' : '/api/leaderboard/all_time';
  const params = appState.lbScenario ? `?scenario=${appState.lbScenario}` : '';

  try {
    const res = await fetch(endpoint + params);
    const rows = await res.json();

    if (!rows.length) {
      const minRuns = appState.lbTab === 'weekly' ? 3 : 5;
      body.innerHTML = `<p class="lb-empty">No scores yet — be the first.<br><span style="font-size:11px;opacity:0.5">Requires ${minRuns}+ runs to qualify.</span></p>`;
    } else {
      body.innerHTML = rows.map((r, i) => {
        const rankColor  = i < 3 ? MEDAL_COLORS[i] : 'var(--muted)';
        const gradeColor = ['A+','A'].includes(r.best_grade) ? 'var(--lime)'
                         : r.best_grade === 'B' ? '#F4D03F'
                         : r.best_grade === 'C' ? 'var(--orange)'
                         : 'var(--muted)';
        const isMe = r.trainer_name === appState.trainerName;
        return `
          <div class="lb-row ${isMe ? 'lb-row-me' : ''}">
            <span class="lb-rank" style="color:${rankColor}">${i < 3 ? '●' : '#' + (i+1)}</span>
            <span class="lb-name">${escapeHtml(r.trainer_name)}${isMe ? ' <span class="lb-you">YOU</span>' : ''}</span>
            <span class="lb-pct">${r.avg_pct}%</span>
            <span class="lb-grade" style="color:${gradeColor}">${r.best_grade}</span>
            <span class="lb-attempts">${r.attempts}</span>
            <span class="lb-last">${timeAgo(r.last_active)}</span>
          </div>`;
      }).join('');
    }
  } catch {
    body.innerHTML = '<p class="lb-empty">Couldn\'t reach the leaderboard. Score saved locally.</p>';
  }

  if (appState.trainerName) loadPersonalStats();
}

async function loadPersonalStats() {
  const el = document.getElementById('personal-stats');
  try {
    const res = await fetch('/api/leaderboard/me?trainer_name=' + encodeURIComponent(appState.trainerName));
    const { stats } = await res.json();
    if (!stats || !stats.attempts) { el.style.display = 'none'; return; }

    const gradeColor = ['A+','A'].includes(stats.best_grade) ? 'var(--lime)'
                     : stats.best_grade === 'B' ? '#F4D03F'
                     : stats.best_grade === 'C' ? 'var(--orange)'
                     : 'var(--muted)';

    el.innerHTML = `
      <div class="ps-title">YOUR STATS — ${escapeHtml(appState.trainerName).toUpperCase()}</div>
      <div class="ps-grid">
        <div class="ps-cell"><span class="ps-val">${stats.attempts}</span><span class="ps-label">RUNS</span></div>
        <div class="ps-cell"><span class="ps-val">${stats.avg_pct}%</span><span class="ps-label">AVG SCORE</span></div>
        <div class="ps-cell"><span class="ps-val">${stats.best_pct}%</span><span class="ps-label">BEST RUN</span></div>
        <div class="ps-cell"><span class="ps-val" style="color:${gradeColor}">${stats.best_grade}</span><span class="ps-label">BEST GRADE</span></div>
      </div>`;
    el.style.display = 'block';
  } catch {
    el.style.display = 'none';
  }
}

// ============================================================
// SETUP SCREEN
// ============================================================
function openSetup(scenario) {
  appState.selectedScenario = scenario;
  appState.selectedArchetype = null;
  appState.selectedMode = 'mc';

  document.getElementById('setup-scenario-label').textContent = SCENARIO_LABELS[scenario] || scenario;
  document.querySelectorAll('.archetype-card').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('.btn-mode').forEach(b => b.classList.toggle('active', b.dataset.mode === 'mc'));

  showScreen('screen-setup');
}

function initSetup() {
  document.getElementById('back-to-home').addEventListener('click', () => {
    window.speechSynthesis && window.speechSynthesis.cancel();
    showScreen('screen-home');
  });

  document.querySelectorAll('.archetype-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.archetype-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      appState.selectedArchetype = card.dataset.archetype;
    });
  });

  document.getElementById('btn-random').addEventListener('click', () => {
    const cards = [...document.querySelectorAll('.archetype-card')];
    const pick = cards[Math.floor(Math.random() * cards.length)];
    document.querySelectorAll('.archetype-card').forEach(c => c.classList.remove('selected'));
    pick.classList.add('selected');
    appState.selectedArchetype = pick.dataset.archetype;
  });

  document.querySelectorAll('.btn-mode').forEach(btn => {
    btn.addEventListener('click', () => {
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
      appState.selectedMode = btn.dataset.mode;
    });
  });

  document.getElementById('btn-start').addEventListener('click', () => {
    if (!appState.selectedArchetype) {
      const arc = document.querySelector('.archetypes');
      arc.style.outline = '1px solid var(--crimson)';
      setTimeout(() => arc.style.outline = '', 1500);
      return;
    }
    game.start(
      appState.selectedScenario,
      appState.selectedArchetype,
      appState.selectedMode,
      appState.trainerName
    );
  });
}

// ============================================================
// GAME ENGINE
// ============================================================
const game = {
  scenario: null,
  archetype: null,
  archetypeId: null,
  scenarioId: null,
  mode: null,
  trainerName: '',
  turnIndex: 0,
  mood: 0,
  score: 0,
  scoreByCategory: null,
  walkedOut: false,

  start(scenarioId, archetypeId, mode, trainerName) {
    window.speechSynthesis && window.speechSynthesis.cancel();

    this.scenario    = window.SCENARIOS[scenarioId];
    this.archetype   = window.ARCHETYPES[archetypeId];
    this.scenarioId  = scenarioId;
    this.archetypeId = archetypeId;
    this.mode        = mode;
    this.trainerName = trainerName;
    this.turnIndex   = 0;
    this.mood        = this.archetype.startingMood;
    this.score       = 0;
    this.scoreByCategory = { DISARM: 0, GAP: 0, ANCHOR: 0, CLOSE: 0, OBJECTION: 0 };
    this.walkedOut   = false;

    const sil = document.getElementById('npc-silhouette');
    sil.style.background = `radial-gradient(circle at 35% 35%, ${this.archetype.color}, rgba(0,0,0,0.8))`;
    document.getElementById('npc-archetype-name').textContent = this.archetype.name.toUpperCase();

    showScreen('screen-play');
    this.renderTurn();
  },

  get currentTurn() {
    return this.scenario.turns[this.turnIndex];
  },

  gameState() {
    return { mood: this.mood, turnIndex: this.turnIndex };
  },

  renderTurn() {
    const turn = this.currentTurn;
    const gs   = this.gameState();

    document.getElementById('turn-number').textContent = this.turnIndex + 1;
    document.getElementById('turn-total').textContent  = this.scenario.totalTurns;

    const npcLine = turn.getNpcLine(gs);
    document.getElementById('npc-dialogue-text').textContent = `"${npcLine}"`;
    document.getElementById('feedback-area').style.display = 'none';

    // Animate dialogue box entrance each turn
    const dialogBox = document.getElementById('npc-dialogue-box');
    dialogBox.classList.remove('npc-fresh');
    void dialogBox.offsetWidth;
    dialogBox.classList.add('npc-fresh');

    const area = document.getElementById('choices-area');
    area.innerHTML = '';

    if (this.mode === 'voice') {
      this.startVoiceTurn(npcLine, area);
    } else {
      const choices = turn.getChoices(gs);
      this.renderChoices(choices);
    }

    this.updateMoodDisplay(false);
    this.updateScoreDisplay();
    this.updateBreakdown();
  },

  renderChoices(choices) {
    const area = document.getElementById('choices-area');
    area.innerHTML = '';

    if (this.mode === 'free_text') {
      this.renderFreeTextInput(area);
      return;
    }

    choices.forEach((choice, i) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.style.animationDelay = (i * 0.05) + 's';
      btn.textContent = choice.text;
      btn.addEventListener('click', () => this.selectChoice(choice, btn));
      area.appendChild(btn);
    });
  },

  renderFreeTextInput(area) {
    area.innerHTML = `
      <textarea class="ft-textarea" id="ft-textarea"
        placeholder="Type your response..." rows="4"></textarea>
      <div class="ft-hint">Keywords matched against the model answer — be specific.</div>
      <button class="btn-submit-ft" id="btn-submit-ft">SUBMIT RESPONSE</button>
    `;
    const ta  = area.querySelector('#ft-textarea');
    const btn = area.querySelector('#btn-submit-ft');

    ta.focus();

    const submit = () => {
      const text = ta.value.trim();
      if (!text) { ta.classList.add('ft-empty'); return; }
      ta.classList.remove('ft-empty');
      btn.disabled = true;
      ta.disabled  = true;
      this.scoreFreeText(text);
    };

    btn.addEventListener('click', submit);
    ta.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) submit();
    });
  },

  // ---- VOICE MODE ----

  getVoiceConfig() {
    const map = {
      skeptic:      { pitch: 0.9, rate: 0.95 },
      price_shopper: { pitch: 0.9, rate: 0.95 },
      dream_client:  { pitch: 1.1, rate: 1.05 },
      ghost_spouse:  { pitch: 1.0, rate: 1.0  },
      overthinker:   { pitch: 1.0, rate: 1.0  }
    };
    return map[this.archetypeId] || { pitch: 1.0, rate: 1.0 };
  },

  startVoiceTurn(npcLine, area) {
    area.innerHTML = `
      <div class="npc-speaking-state" id="npc-speaking-state">
        <div class="speaker-bars"><span></span><span></span><span></span><span></span></div>
        <p class="speaking-label">NPC speaking...</p>
        <button class="btn-skip-voice" id="btn-skip-voice">SKIP ↓</button>
      </div>
    `;

    const proceed = () => {
      if (area.contains(document.getElementById('npc-speaking-state'))) {
        this.renderVoiceMicInput(area);
      }
    };

    document.getElementById('btn-skip-voice').addEventListener('click', () => {
      window.speechSynthesis.cancel();
      proceed();
    });

    const utter   = new SpeechSynthesisUtterance(npcLine);
    const cfg     = this.getVoiceConfig();
    utter.pitch   = cfg.pitch;
    utter.rate    = cfg.rate;
    utter.onend   = proceed;
    utter.onerror = proceed; // fallback on error

    // Fallback: some browsers never fire onend for long utterances
    const timeout = setTimeout(proceed, (npcLine.length / 12) * 1000 + 4000);
    utter.onend = () => { clearTimeout(timeout); proceed(); };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  },

  renderVoiceMicInput(area) {
    area.innerHTML = `
      <div class="voice-input-wrap">
        <div class="voice-transcript-box" id="voice-transcript-box" style="display:none">
          <p class="vt-label">YOU SAID:</p>
          <p class="vt-text" id="vt-text"></p>
        </div>
        <div class="mic-wrap" id="mic-wrap">
          <button class="btn-mic" id="btn-mic" aria-label="Press and hold to record">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1 1.93c-3.94-.49-7-3.85-7-7.93H2c0 4.97 3.53 9.11 8 9.9V22h4v-4.07c4.47-.79 8-4.93 8-9.9h-2c0 4.07-3.06 7.43-7 7.93V16h-2v-.07z"/>
            </svg>
          </button>
          <p class="mic-hint" id="mic-hint">PRESS & HOLD TO SPEAK</p>
          <p class="mic-listening" id="mic-listening" style="display:none">LISTENING...</p>
        </div>
        <div class="voice-actions" id="voice-actions" style="display:none">
          <button class="btn-rerecord" id="btn-rerecord">↺ RE-RECORD</button>
          <button class="btn-use-voice" id="btn-use-voice">USE THIS →</button>
        </div>
      </div>
    `;

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      area.innerHTML = '<p class="voice-error">Voice mode requires Chrome, Edge, or Safari.</p>';
      return;
    }

    let recognition   = null;
    let finalText     = '';
    let isHolding     = false;

    const micBtn      = document.getElementById('btn-mic');
    const hint        = document.getElementById('mic-hint');
    const listening   = document.getElementById('mic-listening');
    const vtBox       = document.getElementById('voice-transcript-box');
    const vtText      = document.getElementById('vt-text');
    const actions     = document.getElementById('voice-actions');

    const startRec = () => {
      if (isHolding) return;
      isHolding   = true;
      finalText   = '';
      vtText.textContent = '';

      recognition = new SpeechRec();
      recognition.continuous      = true;
      recognition.interimResults  = true;
      recognition.lang            = 'en-US';

      recognition.onresult = (e) => {
        let interim = '';
        let fin     = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) fin    += e.results[i][0].transcript;
          else                      interim += e.results[i][0].transcript;
        }
        if (fin) finalText += fin;
        vtText.textContent = (finalText + interim).trim();
        if (vtText.textContent) { vtBox.style.display = 'block'; }
      };

      recognition.onerror = () => { if (isHolding) stopRec(); };
      // Auto-restart if browser ends early while still holding
      recognition.onend   = () => { if (isHolding) recognition.start(); };

      recognition.start();
      micBtn.classList.add('recording');
      hint.style.display      = 'none';
      listening.style.display = 'block';
    };

    const stopRec = () => {
      if (!isHolding) return;
      isHolding = false;
      if (recognition) { recognition.onend = null; recognition.stop(); recognition = null; }

      micBtn.classList.remove('recording');
      listening.style.display = 'none';

      if (finalText.trim()) {
        actions.style.display = 'flex';
        micBtn.style.display  = 'none';
      } else {
        hint.style.display    = 'block';
      }
    };

    micBtn.addEventListener('mousedown',  (e) => { e.preventDefault(); startRec(); });
    micBtn.addEventListener('mouseup',    stopRec);
    micBtn.addEventListener('mouseleave', stopRec);
    micBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startRec(); }, { passive: false });
    micBtn.addEventListener('touchend',   stopRec);

    document.getElementById('btn-rerecord').addEventListener('click', () => {
      finalText              = '';
      vtText.textContent     = '';
      vtBox.style.display    = 'none';
      actions.style.display  = 'none';
      micBtn.style.display   = '';
      hint.style.display     = 'block';
    });

    document.getElementById('btn-use-voice').addEventListener('click', () => {
      const text = finalText.trim();
      if (text) this.scoreFreeText(text);
    });
  },

  // ---- END VOICE MODE ----

  scoreFreeText(text) {
    const lower   = text.toLowerCase();
    const ftCfg   = window.FREE_TEXT[this.scenarioId][this.turnIndex];
    const cfg     = ftCfg.getFreeText(this.gameState());

    const hitWatch = cfg.watchOut.some(kw => lower.includes(kw.toLowerCase()));
    const hitMust  = cfg.mustHit.some(kw  => lower.includes(kw.toLowerCase()));

    let points, moodDelta, quality, feedback;

    if (hitWatch) {
      points    = -3;
      moodDelta = -7;
      quality   = 'bad';
      feedback  = cfg.feedbackNegative;
    } else if (hitMust) {
      points    = 10;
      moodDelta = 5;
      quality   = 'best';
      feedback  = cfg.feedbackPositive;
    } else {
      points    = 3;
      moodDelta = 1;
      quality   = 'mediocre';
      feedback  = cfg.feedbackFallback;
    }

    // Show what was matched
    const matched = hitWatch
      ? cfg.watchOut.filter(kw => lower.includes(kw.toLowerCase()))
      : hitMust
        ? cfg.mustHit.filter(kw => lower.includes(kw.toLowerCase()))
        : [];

    const matchNote = matched.length
      ? ` [matched: "${matched[0]}"]`
      : '';

    // Apply to game state
    const raw = moodDelta;
    const modded = raw >= 0
      ? Math.round(raw * this.archetype.posMult)
      : Math.round(raw * this.archetype.negMult);

    this.score += points;
    const cat = this.currentTurn.getChoices(this.gameState())[0]?.category || 'DISARM';
    this.scoreByCategory[cat] = (this.scoreByCategory[cat] || 0) + points;
    this.mood = Math.max(0, Math.min(100, this.mood + modded));

    spawnScoreFloat(points, document.getElementById('btn-submit-ft') || document.getElementById('choices-area'));
    if (quality === 'bad') shakeNpc();
    this.updateMoodDisplay(true);
    this.updateScoreDisplay();
    this.updateBreakdown();

    if (this.mood <= 0) {
      this.walkedOut = true;
      this.showFreeTextFeedback(points, quality, feedback + matchNote, true);
      return;
    }

    this.showFreeTextFeedback(points, quality, feedback + matchNote, false);
  },

  showFreeTextFeedback(points, quality, feedback, walkedOut) {
    const area  = document.getElementById('feedback-area');
    const badge = document.getElementById('feedback-score-badge');
    const text  = document.getElementById('feedback-text');
    const cont  = document.getElementById('btn-continue');

    badge.textContent = (points >= 0 ? '+' : '') + points + ' pts';
    badge.className   = `feedback-score-badge quality-${quality}`;
    text.textContent  = walkedOut ? feedback + ' — They walked out.' : feedback;

    const isLast = this.turnIndex >= this.scenario.turns.length - 1;
    cont.textContent = walkedOut || isLast ? 'SEE RESULTS' : 'CONTINUE →';
    cont.onclick = () => walkedOut ? this.endScenario() : this.advance();

    area.style.display = 'flex';
  },

  selectChoice(choice, btn) {
    document.querySelectorAll('.choice-btn').forEach(b => { b.disabled = true; });
    btn.classList.add('selected', `quality-${choice.quality}`);

    // Apply archetype mood modifier
    const raw = choice.moodDelta;
    const modded = raw >= 0
      ? Math.round(raw * this.archetype.posMult)
      : Math.round(raw * this.archetype.negMult);

    this.score += choice.points;
    this.scoreByCategory[choice.category] =
      (this.scoreByCategory[choice.category] || 0) + choice.points;
    this.mood = Math.max(0, Math.min(100, this.mood + modded));

    // Animations
    spawnScoreFloat(choice.points, btn);
    if (choice.quality === 'bad') shakeNpc();
    this.updateMoodDisplay(true);
    this.updateScoreDisplay();
    this.updateBreakdown();

    // Walked out gate
    if (this.mood <= 0) {
      this.walkedOut = true;
      this.showFeedback(choice, true);
      return;
    }

    this.showFeedback(choice, false);
  },

  showFeedback(choice, walkedOut) {
    const area  = document.getElementById('feedback-area');
    const badge = document.getElementById('feedback-score-badge');
    const text  = document.getElementById('feedback-text');
    const cont  = document.getElementById('btn-continue');

    const pts = choice.points;
    badge.textContent = (pts >= 0 ? '+' : '') + pts + ' pts';
    badge.className   = `feedback-score-badge quality-${choice.quality}`;
    text.textContent  = walkedOut
      ? choice.feedback + ' — They walked out.'
      : choice.feedback;

    const isLast = this.turnIndex >= this.scenario.turns.length - 1;
    cont.textContent = walkedOut || isLast ? 'SEE RESULTS' : 'CONTINUE →';
    cont.onclick = () => walkedOut ? this.endScenario() : this.advance();

    area.style.display = 'flex';
  },

  advance() {
    this.turnIndex++;
    if (this.turnIndex >= this.scenario.turns.length) {
      this.endScenario();
    } else {
      this.renderTurn();
    }
  },

  endScenario() {
    window.speechSynthesis && window.speechSynthesis.cancel();
    showEndScreen(this);
    this.submitScore();
  },

  updateMoodDisplay(animate) {
    const pct   = this.mood;
    const fill  = document.getElementById('mood-bar-fill');
    const label = document.getElementById('mood-label');
    const val   = document.getElementById('mood-value');
    const sil   = document.getElementById('npc-silhouette');
    const play  = document.getElementById('screen-play');

    fill.style.height = pct + '%';
    // Mobile horizontal bar uses CSS var --mood-w
    fill.parentElement.style.setProperty('--mood-w', pct + '%');

    const color = pct <= 25  ? 'var(--crimson)'
                : pct <= 50  ? 'var(--orange)'
                : pct <= 75  ? '#F4D03F'
                : 'var(--lime)';
    fill.style.background = color;

    label.textContent = pct <= 25  ? 'Skeptical'
                      : pct <= 50  ? 'Mildly interested'
                      : pct <= 75  ? 'Bought in'
                      : 'Ready to sign';
    label.style.color = color;
    val.textContent   = pct;
    val.style.color   = color;

    // NPC silhouette state
    sil.className = 'npc-silhouette';
    if      (pct <= 25) sil.classList.add('npc-mood-low');
    else if (pct <= 50) sil.classList.add('npc-mood-neutral');
    else if (pct <= 75) sil.classList.add('npc-mood-warm');
    else                sil.classList.add('npc-mood-hot');

    // 95+ lime glow on whole screen
    play.classList.toggle('mood-glow', pct >= 95);

    if (animate) {
      fill.classList.remove('mood-pulse');
      void fill.offsetWidth;
      fill.classList.add('mood-pulse');
    }
  },

  updateScoreDisplay() {
    const el = document.getElementById('live-score');
    el.textContent = Math.max(0, this.score);
    el.classList.remove('score-flash');
    void el.offsetWidth;
    el.classList.add('score-flash');
  },

  updateBreakdown() {
    Object.keys(this.scoreByCategory).forEach(cat => {
      const el = document.getElementById('bd-' + cat);
      if (el) el.textContent = Math.max(0, this.scoreByCategory[cat] || 0);
    });
  },

  async submitScore() {
    const maxScore  = this.scenario.maxScore;
    const finalScore = Math.max(0, this.score);
    try {
      await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trainer_name: this.trainerName,
          scenario:     this.scenarioId,
          archetype:    this.archetypeId,
          mode:         this.mode,
          score:        finalScore,
          max_score:    maxScore,
          walked_out:   this.walkedOut ? 1 : 0
        })
      });
    } catch {
      // Silently fail — leaderboard is a nice-to-have
    }
  }
};

// ============================================================
// ANIMATIONS
// ============================================================
function spawnScoreFloat(points, anchorEl) {
  const float = document.createElement('div');
  float.className = 'score-float';
  float.style.position = 'fixed';
  float.style.zIndex = '9000';
  float.style.fontFamily = 'var(--font-mono)';
  float.style.fontSize = '20px';
  float.style.fontWeight = '700';
  float.style.pointerEvents = 'none';
  float.style.color = points >= 0 ? 'var(--lime)' : 'var(--crimson)';
  float.textContent = (points >= 0 ? '+' : '') + points;

  const rect = anchorEl.getBoundingClientRect();
  float.style.left = (rect.left + rect.width / 2) + 'px';
  float.style.top  = (rect.top) + 'px';
  float.style.transform = 'translateX(-50%)';

  document.body.appendChild(float);

  if (float.animate) {
    float.animate(
      [{ opacity: 1, transform: 'translateX(-50%) translateY(0)' },
       { opacity: 0, transform: 'translateX(-50%) translateY(-40px)' }],
      { duration: 800, easing: 'ease-out' }
    ).onfinish = () => float.remove();
  } else {
    setTimeout(() => float.remove(), 800);
  }
}

function shakeNpc() {
  const box = document.getElementById('npc-dialogue-box');
  box.classList.remove('shake');
  void box.offsetWidth;
  box.classList.add('shake');
  setTimeout(() => box.classList.remove('shake'), 300);
}

// ============================================================
// END SCREEN
// ============================================================
function computeGrade(pct) {
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B';
  if (pct >= 60) return 'C';
  return 'D';
}

// Coaching tips per category (good vs bad performance)
const TIPS = {
  DISARM: {
    good: "Your disarm was sharp — you built curiosity before they could resist.",
    bad:  "Work on your disarm. Lead with a hook or permission ask, not logistics."
  },
  GAP: {
    good: "You surfaced the gap well — they felt the cost of staying where they are.",
    bad:  "Use consequence questions to let them feel the gap themselves. Don't tell them — ask them."
  },
  ANCHOR: {
    good: "You anchored the data perfectly — frequency as the variable, scan as proof.",
    bad:  "Anchor the result to the variable. 'The ONLY thing that changed was frequency' — say it like physics."
  },
  CLOSE: {
    good: "Clean close — BAMFAM executed, A/B not yes/no, no escape hatches.",
    bad:  "Your close leaked. A or B, never 'do you want to.' Always book on the spot."
  },
  OBJECTION: {
    good: "Objection handling was on point — you surfaced the real concern instead of folding.",
    bad:  "Don't argue price. Surface the real objection with NEPQ, then solve it."
  }
};

function buildCoachingTip(scoreByCategory) {
  const entries = Object.entries(scoreByCategory).filter(([, v]) => v !== 0);
  if (!entries.length) return '';

  const best  = entries.reduce((a, b) => a[1] > b[1] ? a : b);
  const worst = entries.reduce((a, b) => a[1] < b[1] ? a : b);

  const praise = TIPS[best[0]]?.good  || '';
  const fix    = TIPS[worst[0]]?.bad  || '';

  if (best[0] === worst[0]) return praise;
  return [praise, fix].filter(Boolean).join(' ');
}

function showEndScreen(g) {
  // Remove any lingering mood glow
  document.getElementById('screen-play').classList.remove('mood-glow');

  const maxScore   = g.scenario.maxScore;
  const finalScore = Math.max(0, g.score);
  const pct        = g.walkedOut ? 0 : Math.round((finalScore / maxScore) * 100);
  const grade      = g.walkedOut ? 'D' : computeGrade(pct);

  document.getElementById('end-walked-out-banner').style.display =
    g.walkedOut ? 'block' : 'none';

  const gradeEl = document.getElementById('end-grade');
  gradeEl.textContent = grade;
  gradeEl.style.color = ['A+','A'].includes(grade) ? 'var(--lime)'
                      : grade === 'B' ? '#F4D03F'
                      : grade === 'C' ? 'var(--orange)'
                      : 'var(--crimson)';

  document.getElementById('end-grade-label').textContent = GRADE_LABELS[grade] || '';
  document.getElementById('end-score-max').textContent   = maxScore;
  document.getElementById('end-pct').textContent         = pct + '%';

  // Count-up animation
  const numEl = document.getElementById('end-score-num');
  numEl.textContent = '0';
  countUp(numEl, finalScore, 1200);

  // Breakdown
  const bdEl = document.getElementById('end-breakdown');
  bdEl.innerHTML = Object.entries(g.scoreByCategory).map(([cat, pts]) => {
    const clamped = Math.max(0, pts);
    const color = clamped > 0 ? 'var(--lime)' : pts < 0 ? 'var(--crimson)' : 'var(--muted)';
    return `
      <div class="end-bd-item">
        <span class="end-bd-cat">${cat}</span>
        <span class="end-bd-pts" style="color:${color}">${clamped}</span>
      </div>`;
  }).join('');

  // Coaching tip
  const tip = buildCoachingTip(g.scoreByCategory);
  document.getElementById('end-tip').textContent = tip;
  document.getElementById('end-tip').style.display = tip ? 'block' : 'none';

  showScreen('screen-end');
}

function countUp(el, target, duration) {
  const start = performance.now();
  function frame(now) {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(t * target);
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function initEndScreen() {
  document.getElementById('btn-replay').addEventListener('click', () => {
    game.start(
      game.scenarioId,
      game.archetypeId,
      game.mode,
      game.trainerName
    );
  });

  document.getElementById('btn-new').addEventListener('click', () => {
    showScreen('screen-home');
    loadLeaderboard();
  });

  document.getElementById('btn-lb').addEventListener('click', () => {
    showScreen('screen-home');
    loadLeaderboard();
    setTimeout(() => {
      document.querySelector('.leaderboard-section')
        .scrollIntoView({ behavior: 'smooth' });
    }, 100);
  });
}

// ============================================================
// UTILS
// ============================================================
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initHome();
  initSetup();
  initEndScreen();
});
