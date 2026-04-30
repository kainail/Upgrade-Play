(function () {
  'use strict';

  // Keyword configs for every turn in every scenario.
  // getFreeText(gameState) returns { mustHit, watchOut, fullPts, penaltyPts, fallbackPts,
  //   fullMood, penaltyMood, fallbackMood, feedbackPositive, feedbackNegative, feedbackFallback }
  //
  // Scoring priority: watchOut check first (penalty), then mustHit (full), then fallback.

  window.FREE_TEXT = {

    // =========================================================
    // SCENARIO 1 — IN-SESSION PITCH
    // =========================================================
    in_session: [
      // Turn 1
      {
        getFreeText: () => ({
          mustHit:  ['short list', '90 seconds', 'about to text', 'got a sec', 'rolling out', 'quick thing'],
          watchOut: ['sale', 'interested in adding', 'adding another session', 'want in', 'deal'],
          feedbackPositive: "Good — you opened with a hook or permission ask. Curiosity gap is open.",
          feedbackNegative: "Watch out — 'sale' or 'adding another session' kills exclusivity before you've pitched anything.",
          feedbackFallback:  "They heard you. Try anchoring with 'short list' or a permission ask next time for max impact."
        })
      },
      // Turn 2
      {
        getFreeText: () => ({
          mustHit:  ['top members', 'upgrade challenge', 'crushing', 'on the list', '8-week', 'free', 'want you in'],
          watchOut: ['deal', 'upgrade your training', 'upgrade your package', 'package'],
          feedbackPositive: "Good — exclusivity + personal invitation. They're leaning in.",
          feedbackNegative: "Watch out — 'deal' or 'package' is sales-speak that undercuts the personal invite.",
          feedbackFallback:  "Decent. Amp up the exclusivity — 'you're on the list' hits harder than a general offer."
        })
      },
      // Turn 3
      {
        getFreeText: () => ({
          mustHit:  ['free', 'body scan', 'no cost', 'no contract', 'herculean', 'week 1', '8 weeks', 'competition', 'attendance', 're-scan'],
          watchOut: ['$45', '$', 'cost', 'price per week', 'extra per week'],
          feedbackPositive: "Good — you led with the offer, not the price. They're picturing the prize.",
          feedbackNegative: "Watch out — never mention price during the free trial offer. Lead with value, not cost.",
          feedbackFallback:  "Got the message across. Be more specific: body scans, no contract, prize details close deals."
        })
      },
      // Turn 4
      {
        getFreeText: () => ({
          mustHit:  ['just show up', 'you in', 'book you in', 'nothing', 'like normal', 'assumed'],
          watchOut: ['do you want', 'think about it', 'let me know', 'interested in', 'would you like'],
          feedbackPositive: "Good — assumed close with zero friction. 'Just show up' is the perfect ask.",
          feedbackNegative: "Watch out — 'do you want to' or 'think about it' gives them an easy out. Assume the yes.",
          feedbackFallback:  "Decent. Land on 'you in?' or 'just show up' — assumed close removes the decision entirely."
        })
      },
      // Turn 5 — mood-dependent (high = BAMFAM, low = objection)
      {
        getFreeText: (gs) => gs.mood >= 60
          ? {
              mustHit:  ['tuesday', 'thursday', 'right now', 'book', 'phone', 'scan', 'lock in', 'calendar', 'today'],
              watchOut: ['later', "i'll send", 'figure it out', 'next week', "i'll text"],
              feedbackPositive: "Good — BAMFAM. You booked on the spot. A/B close.",
              feedbackNegative: "Watch out — 'later' or 'figure it out' means no appointment. Calendar is king.",
              feedbackFallback:  "Close. The booking needs to happen NOW — give two specific times, A or B."
            }
          : {
              mustHit:  ['what do you need to check', 'need to check', 'text you', 'in writing', 'by friday', 'deadline', 'friday', 'what is it'],
              watchOut: ['okay let me know', "no worries", "i'll ask again", 'ask you later'],
              feedbackPositive: "Good — you surfaced the concern and created a soft deadline.",
              feedbackNegative: "Watch out — 'okay let me know' is the polite way to lose this deal forever.",
              feedbackFallback:  "Try asking 'what specifically do you need to check?' — isolate the real objection."
            }
      }
    ],

    // =========================================================
    // SCENARIO 2 — CONSULT 1
    // =========================================================
    consult_1: [
      // Turn 1
      {
        getFreeText: () => ({
          mustHit:  ['what made you', 'say yes', 'signed up', 'training history', 'before we get into', 'few minutes', 'talk first'],
          watchOut: ['3x package', 'show you our', 'program', 'deal', 'upgrade'],
          feedbackPositive: "Good — you anchored on their 'why' before touching the scan or program.",
          feedbackNegative: "Watch out — jumping straight to program details in Consult 1 burns rapport fast.",
          feedbackFallback:  "Decent opener. Next time anchor directly on their 'why' — 'what made you say yes?'"
        })
      },
      // Turn 2
      {
        getFreeText: () => ({
          mustHit:  ['tell me more', 'feel like yourself', 'what does that look like', 'specifically', 'what does that mean', 'energy', 'mood', 'all three'],
          watchOut: ['3x', 'program is perfect', 'we can help with', 'great for that'],
          feedbackPositive: "Good — you peeled the onion. They're going deeper into their why.",
          feedbackNegative: "Watch out — pivoting to the program here kills the NEPQ momentum you just built.",
          feedbackFallback:  "Solid. Try 'tell me more about that' — keeps them talking, which is all you need right now."
        })
      },
      // Turn 3
      {
        getFreeText: () => ({
          mustHit:  ['what would have to change', 'worth it', 'in 8 weeks', 'scan again', 'numbers', 'feelings', 'specifically', 'make you say'],
          watchOut: ['program will get', 'goal weight', 'weight', 'we can get you'],
          feedbackPositive: "Good — you captured the 'worth it' benchmark in their exact words. Use it in Consult 2.",
          feedbackNegative: "Watch out — 'goal weight' reduces a holistic answer to one number. Reductive.",
          feedbackFallback:  "Good direction. Push for specifics: 'numbers, feelings, or both?' anchors the benchmark."
        })
      },
      // Turn 4
      {
        getFreeText: () => ({
          mustHit:  ["what's worked", "worked for you", "in the past", "what hasn't", "hasn't worked", 'training history', 'before', 'historically'],
          watchOut: ['nutrition program', 'tell you about our', 'let me tell you', 'we have a'],
          feedbackPositive: "Good — training history opens the differentiation door perfectly.",
          feedbackNegative: "Watch out — pivoting to a program pitch here is an off-topic move that loses trust.",
          feedbackFallback:  "Decent. Ask specifically about what's worked AND what hasn't — the second half is gold."
        })
      },
      // Turn 5
      {
        getFreeText: () => ({
          mustHit:  ['lean mass', 'long-term', 'kickoff', '1-2 year', 'one to two year', 'baseline', 'metabolic', 'different', 'arc'],
          watchOut: ['bootcamp', 'worst', 'glad you found us', 'those are bad'],
          feedbackPositive: "Good — you reframed the timeline and differentiated without trashing their past.",
          feedbackNegative: "Watch out — trash-talking bootcamps is juvenile. Differentiate by explaining, not attacking.",
          feedbackFallback:  "Good angle. Anchor the expectation: '8 weeks is the kickoff, not the whole journey.'"
        })
      },
      // Turn 6
      {
        getFreeText: () => ({
          mustHit:  ['baseline', 'starting line', 'in isolation', 'delta', 'how they move', 'week 6', "doesn't mean", 'starting point'],
          watchOut: ['overweight', 'elevated', 'high body fat', 'need to bring it down', 'a little overweight'],
          feedbackPositive: "Good — 'baseline' and 'starting line' remove all shame from the numbers.",
          feedbackNegative: "Watch out — shame-based language destroys rapport in one sentence. Never say 'overweight.'",
          feedbackFallback:  "Solid. Land on 'baseline' — it's the most important word in this turn."
        })
      },
      // Turn 7
      {
        getFreeText: () => ({
          mustHit:  ['just train', 'just show up', 'bonus session', 'week 6', 're-scan', 'demo', "don't change", 'nothing else'],
          watchOut: ['6-month program', 'sign up', 'add another session', 'upgrade'],
          feedbackPositive: "Good — zero pressure. 'Just train' builds more trust than any pitch.",
          feedbackNegative: "Watch out — SELLING IN CONSULT 1. You burned 7 turns of trust in one sentence.",
          feedbackFallback:  "Good instinct. Keep it simpler: 'just train, let the scan talk in 6 weeks.'"
        })
      },
      // Turn 8
      {
        getFreeText: () => ({
          mustHit:  ['right now', 'tuesday', 'thursday', 'lock in', 'calendar', 'week 6', 'results session', 'before you go', 'quick thing'],
          watchOut: ["i'll text", 'text you to schedule', 'when we get closer', 'figure it out'],
          feedbackPositive: "Good — BAMFAM. Consult 2 is locked before they leave the building.",
          feedbackNegative: "Watch out — 'I'll text you later' appointments have a 50% no-show rate. Book it now.",
          feedbackFallback:  "Close. The booking needs to happen in this conversation — give two specific times."
        })
      }
    ],

    // =========================================================
    // SCENARIO 3 — CONSULT 2: THE CLOSE
    // =========================================================
    consult_2: [
      // Turn 1
      {
        getFreeText: () => ({
          mustHit:  ['six weeks', 'before we', 'how have', 'felt', 'compared to', 'honestly', 'how were these'],
          watchOut: ['upgrade', 'ready to', 'pull up the scan', 'let\'s look at'],
          feedbackPositive: "Good — qualitative frame before the data. NEPQ disarm executed.",
          feedbackNegative: "Watch out — leading with scan or upgrade language skips the disarm entirely.",
          feedbackFallback:  "Good direction. Anchor on feeling before data: 'how have these six weeks felt compared to before?'"
        })
      },
      // Turn 2
      {
        getFreeText: () => ({
          mustHit:  ['say more', 'what feels', 'most different', 'tell me more', 'what part', 'day-to-day', 'what feels different'],
          watchOut: ["let's pull up", 'pull up the scan', 'keeping that going', 'great, so'],
          feedbackPositive: "Good — you kept them talking. More emotion now means easier close later.",
          feedbackNegative: "Watch out — pulling up the scan cuts off emotional momentum you need for the close.",
          feedbackFallback:  "Decent. One more layer: 'what part of that feels most different to you day-to-day?'"
        })
      },
      // Turn 3
      {
        getFreeText: () => ({
          mustHit:  ['walk me back', 'week 1', '1-10', '1 to 10', 'rate yourself', 'where are you on', 'scale of', 'on that today', 'your why was'],
          watchOut: ['keep going', 'should keep', 'upgrade', 'want to keep doing', 'sign up', 'ready to commit'],
          feedbackPositive: "Good — you anchored to Week 1 and asked them to rate their own gap. They'll feel it.",
          feedbackNegative: "Watch out — closing this early fumbles the NEPQ sequence. The gap must come from them.",
          feedbackFallback:  "Good approach. Get more specific: reference their exact Week 1 why, then ask for a 1-10."
        })
      },
      // Turn 4
      {
        getFreeText: () => ({
          mustHit:  ['keeping it from', 'from being', 'from a 10', 'from an 8', "what's missing", "what would it take", "keeping you from"],
          watchOut: ['great progress', 'fantastic', 'amazing', 'well done', "you're doing great"],
          feedbackPositive: "Good — they sell themselves. That answer is the close.",
          feedbackNegative: "Watch out — affirming a '6' closes the gap they were about to articulate for you.",
          feedbackFallback:  "On track. Sharpen it: 'what's keeping it from being a 10?' and then wait."
        })
      },
      // Turn 5
      {
        getFreeText: () => ({
          mustHit:  ['six months', 'same frequency', 'stayed at 2x', 'where do you see yourself', 'honestly', 'exactly where you', 'if nothing changed'],
          watchOut: ['should add', 'need to add', 'right number', 'another session', 'obviously 3x'],
          feedbackPositive: "Good — consequence question. You made them imagine staying stuck.",
          feedbackNegative: "Watch out — telling them what they need skips the consequence frame they need to feel.",
          feedbackFallback:  "Good instinct. Make it more vivid: 'if you stayed at 2x for 6 months, where do you honestly see yourself?'"
        })
      },
      // Turn 6
      {
        getFreeText: () => ({
          mustHit:  ['cost you', 'not financially', 'life-wise', 'year from now', 'personally', 'exactly where you are', 'what would it cost'],
          watchOut: ['keep you at 3x', 'science says', 'compound results', 'you should', 'you need'],
          feedbackPositive: "Good — deepest NEPQ frame landed. Now hold the silence.",
          feedbackNegative: "Watch out — lecturing after they were about to feel something real kills the moment.",
          feedbackFallback:  "Powerful direction. Land on 'what would it cost you — not money, life-wise — if nothing changed?'"
        })
      },
      // Turn 7
      {
        getFreeText: () => ({
          mustHit:  ['what happened', 'variable', 'want to know', 'body fat', 'lean mass', 'six weeks', 'changed', 'look at this', 'look at what'],
          watchOut: ['3x package', 'let me show you our', 'show you the program', 'our offer'],
          feedbackPositive: "Good — Hormozi associate move. Tie the win to the variable with curiosity.",
          feedbackNegative: "Watch out — pitching before anchoring throws away the best emotional moment of the session.",
          feedbackFallback:  "Good setup. Build the suspense: 'want to know what the variable was?' then pause."
        })
      },
      // Turn 8
      {
        getFreeText: () => ({
          mustHit:  ['only variable', 'frequency', 'same coach', 'same intensity', 'input got smaller', 'adapted to 3x', 'regress', 'drop back', 'one thing'],
          watchOut: ['more training works', 'eating better', 'nutrition', 'started eating', 'diet changed'],
          feedbackPositive: "Good — THE line. Causal claim, stated like physics. Irrefutable.",
          feedbackNegative: "Watch out — wrong attribution. The variable was frequency, not food or effort. Don't undermine it.",
          feedbackFallback:  "Close. The key phrase: 'the ONLY variable was frequency' — say it like it's a law of nature."
        })
      },
      // Turn 9
      {
        getFreeText: () => ({
          mustHit:  ['would it help', 'schedule that produced', 'proved works', 'kept doing', 'instead of dropping', 'dropping back'],
          watchOut: ['need to sign up', 'do you want to upgrade', 'ready to upgrade', 'want to commit'],
          feedbackPositive: "Good — 'would it help' is NEPQ gold. They answer yes without being asked to buy anything.",
          feedbackNegative: "Watch out — yes/no or direct pitch breaks the NEPQ frame right at the tipping point.",
          feedbackFallback:  "Almost there. Use 'would it help if we just kept you on the schedule that produced these numbers?'"
        })
      },
      // Turn 10
      {
        getFreeText: () => ({
          mustHit:  ['5.13', '$5', 'per day', 'ascent', 'differential', '$45', 'quarterly', 'programming review', 'priority booking', 'guest pass', 'a la carte', 'à la carte', 'stack'],
          watchOut: ["it's $195", '$195 a week', 'basically 3x', 'just 3 sessions'],
          feedbackPositive: "Good — Hormozi stack delivered. $5.13/day is the number that sticks.",
          feedbackNegative: "Watch out — leading with price before the stack is the fastest way to make them balk.",
          feedbackFallback:  "Decent. Build the full stack before landing on price: each item justifies the next."
        })
      },
      // Turn 11
      {
        getFreeText: () => ({
          mustHit:  ['option a', 'option b', 'pay in full', 'which feels better', 'a or b', 'split into', 'myzone', 'mezone', 'tee', 'belt', 'two ways'],
          watchOut: ['want to do this', 'would you like to', 'do you want', 'ready to sign up', 'yes or no'],
          feedbackPositive: "Good — assumed which-pile close. A or B is the only question that matters now.",
          feedbackNegative: "Watch out — 'want to do this?' is a yes/no kill shot at the worst possible moment.",
          feedbackFallback:  "Solid. Tighten it: two options (A and B), include the PIF discount, and end with 'which feels better?'"
        })
      },
      // Turn 12
      {
        getFreeText: () => ({
          mustHit:  ['specifically', 'weighing', 'full picture', 'solve it now', 'real concern', "what is it", "what's the actual", 'walk out without'],
          watchOut: ['take all the time', 'whenever you\'re ready', "it's only $5", 'just a coffee'],
          feedbackPositive: "Good — NEPQ objection handler. You surfaced the concern instead of folding or lecturing.",
          feedbackNegative: "Watch out — 'take all the time you need' is a polite goodbye. They won't come back.",
          feedbackFallback:  "Good instinct. Push for specificity: 'what specifically are you weighing — money, schedule, something else?'"
        })
      },
      // Turn 13
      {
        getFreeText: () => ({
          mustHit:  ['if your husband said', 'do whatever you think', 'what would you', 'actually do', 'trust you', 'if he said'],
          watchOut: ['nothing for what you', "$45 is not much", 'talk to him and', "let me know what he says"],
          feedbackPositive: "Good — NEPQ qualifier. If they say 'I'd do it,' the spouse was a stall all along.",
          feedbackNegative: "Watch out — arguing price is the cardinal NEPQ sin. You just made her feel judged for bringing it up.",
          feedbackFallback:  "Good direction. Ask: 'if your husband said do whatever you think is best — what would you do?'"
        })
      },
      // Turn 14
      {
        getFreeText: () => ({
          mustHit:  ['48 hours', 'void', 'zero risk', 'cancel', 'locks in', 'discount locks', 'today', 'sound fair', 'this week'],
          watchOut: ["once you talk", 'let me know what he says', 'whenever you', "talk to him first"],
          feedbackPositive: "Good — 48-hour out + urgency + zero-risk close. You removed every barrier.",
          feedbackNegative: "Watch out — 'let the deal die' is not a close strategy. The 48-hour out removes all the risk for them.",
          feedbackFallback:  "Almost. Add the 48-hour cancel window + urgency: 'the PIF rate only locks in this week.'"
        })
      },
      // Turn 15
      {
        getFreeText: () => ({
          mustHit:  ['herculean', 'swap', '4x', 'upgrade fee', 'meals', 'before i write', 'high-performers', 'six months anyway', 'swap it'],
          watchOut: ["see you at the front desk", 'pay at the desk', 'all set'],
          feedbackPositive: "Good — post-close upsell while the pen is hot. Textbook Hormozi.",
          feedbackNegative: "Watch out — 'see you at the front desk' misses the easiest upsell of the year. The pen is still in their hand.",
          feedbackFallback:  "Missed the upsell window. Next time: 'real quick before I write this up — most high-performers end up at Herculean anyway...'"
        })
      }
    ]
  };
})();
