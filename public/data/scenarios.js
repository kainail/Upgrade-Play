(function () {
  'use strict';

  window.SCENARIOS = {

    // =========================================================
    // SCENARIO 1 — IN-SESSION PITCH (5 turns, 50 pts max)
    // =========================================================
    in_session: {
      title: 'IN-SESSION PITCH',
      subtitle: 'Scenario 01',
      maxScore: 50,
      totalTurns: 5,
      turns: [
        {
          id: 1,
          getNpcLine: () => "Hey coach — what's up? You've got that look like you're about to ask me something.",
          getChoices: () => [
            {
              text: "Hey, got a sec? You're on a short list for something we're rolling out.",
              points: 10, moodDelta: 5, category: 'DISARM', quality: 'best',
              feedback: "Hook + curiosity gap + 'short list' exclusivity — perfect disarm."
            },
            {
              text: "I wanted to ask if you'd be interested in adding another session each week.",
              points: 2, moodDelta: -1, category: 'DISARM', quality: 'mediocre',
              feedback: "Logistics framing, no curiosity gap. Easy to say no immediately."
            },
            {
              text: "We're doing a sale on personal training, want in?",
              points: -3, moodDelta: -7, category: 'DISARM', quality: 'bad',
              feedback: "'Sale' kills exclusivity and rapport. Never open with a discount."
            },
            {
              text: "Quick thing — I was actually about to text you. Got 90 seconds?",
              points: 10, moodDelta: 5, category: 'DISARM', quality: 'best',
              feedback: "Permission ask + curiosity. They lean in before you've said anything."
            }
          ]
        },
        {
          id: 2,
          getNpcLine: (gs) => gs.mood >= 60
            ? "Yeah, what is it?"
            : "Uhh, I don't know, I'm pretty busy.",
          getChoices: () => [
            {
              text: "We're picking 20 of our top members for an 8-week Upgrade Challenge starting next month. You're on the list.",
              points: 10, moodDelta: 5, category: 'DISARM', quality: 'best',
              feedback: "Exclusivity frame + specific number + they're on the list. All three triggers."
            },
            {
              text: "It's a really good deal we're offering for 3x/week training.",
              points: 2, moodDelta: -1, category: 'DISARM', quality: 'mediocre',
              feedback: "Leading with 'deal' undermines the exclusivity frame."
            },
            {
              text: "Want to upgrade your training package?",
              points: -3, moodDelta: -7, category: 'DISARM', quality: 'bad',
              feedback: "Logistics, not identity. 'Upgrade your package' is pure sales-speak."
            },
            {
              text: "You've been crushing it. We're running a free 8-week thing for our top members and I want you in.",
              points: 10, moodDelta: 5, category: 'DISARM', quality: 'best',
              feedback: "Compliment + exclusivity + 'free' + personal invitation. Four triggers fired."
            }
          ]
        },
        {
          id: 3,
          getNpcLine: () => "What is it?",
          getChoices: () => [
            {
              text: "Free 3rd session every week for 8 weeks, body scan Week 1, re-scan Week 6, cohort competes on attendance, winner gets a month of Herculean meals. No cost, no contract.",
              points: 10, moodDelta: 5, category: 'DISARM', quality: 'best',
              feedback: "Full offer in one breath. Specific, concrete, no strings. They visualize the prize."
            },
            {
              text: "It's basically more training and a competition with prizes.",
              points: 2, moodDelta: -1, category: 'DISARM', quality: 'mediocre',
              feedback: "Vague. No specifics means no visualization, no excitement."
            },
            {
              text: "It's $45 extra a week to do 3x instead of 2x.",
              points: -3, moodDelta: -10, category: 'DISARM', quality: 'bad',
              feedback: "Pitched price during the FREE trial offer. Never lead with cost."
            },
            {
              text: "Free extra session every week for 8 weeks, plus body scans and a chance to win a month of meals.",
              points: 6, moodDelta: 3, category: 'DISARM', quality: 'good',
              feedback: "Hits the key points without full detail. Gets the job done."
            }
          ]
        },
        {
          id: 4,
          getNpcLine: () => "Hmm, interesting. So what do I have to do?",
          getChoices: () => [
            {
              text: "Just show up. You in?",
              points: 10, moodDelta: 5, category: 'CLOSE', quality: 'best',
              feedback: "Assumed close. Momentum frame. Zero friction. Perfect."
            },
            {
              text: "Do you want to do it?",
              points: -3, moodDelta: -5, category: 'CLOSE', quality: 'bad',
              feedback: "Yes/no question — the easiest way to hear 'no'."
            },
            {
              text: "You can think about it and let me know.",
              points: -3, moodDelta: -7, category: 'CLOSE', quality: 'bad',
              feedback: "Giving them an out. A yes that isn't booked is a maybe."
            },
            {
              text: "Nothing — just show up to your sessions like normal, plus the bonus one I'll book you into. You in?",
              points: 10, moodDelta: 5, category: 'CLOSE', quality: 'best',
              feedback: "Zero barrier + assumed close. They're already doing everything except showing up one extra time."
            }
          ]
        },
        {
          id: 5,
          getNpcLine: (gs) => gs.mood >= 60
            ? "Yeah okay, I'm in."
            : "I'll think about it.",
          getChoices: (gs) => gs.mood >= 60
            ? [
              {
                text: "Sweet. Phone out — what's better for your Week 1 scan, Tuesday at 6 or Thursday at 7?",
                points: 10, moodDelta: 5, category: 'CLOSE', quality: 'best',
                feedback: "BAMFAM. Books on the spot. A/B not yes/no — never give them an escape hatch."
              },
              {
                text: "Awesome, I'll send you the details later.",
                points: -3, moodDelta: -5, category: 'CLOSE', quality: 'bad',
                feedback: "A yes that isn't on the calendar is a maybe. They won't show up."
              },
              {
                text: "Cool, just come in next week and we'll figure it out.",
                points: 2, moodDelta: -1, category: 'CLOSE', quality: 'mediocre',
                feedback: "Vague. 'Figure it out' appointments don't happen."
              },
              {
                text: "Let me grab my phone — can we book your Week 1 scan right now? I've got Tuesday at 6 or Thursday at 7.",
                points: 10, moodDelta: 5, category: 'CLOSE', quality: 'best',
                feedback: "BAMFAM with A/B close. Calendar is king."
              }
            ]
            : [
              {
                text: "Totally — what's the thing you need to check? Because if it's just schedule, I can work around your standing times.",
                points: 10, moodDelta: 5, category: 'OBJECTION', quality: 'best',
                feedback: "NEPQ objection handler. Surface the real concern. Don't fold."
              },
              {
                text: "Okay, let me know.",
                points: -3, moodDelta: -7, category: 'OBJECTION', quality: 'bad',
                feedback: "Lets them disappear. This conversation never picks back up."
              },
              {
                text: "Want me to text you the details so you've got them in writing? Just give me a yes or no by Friday.",
                points: 10, moodDelta: 5, category: 'OBJECTION', quality: 'best',
                feedback: "Soft deadline + written copy + BAMFAM. Keeps the door open without chasing."
              },
              {
                text: "No worries, I'll ask again next week.",
                points: 2, moodDelta: -1, category: 'OBJECTION', quality: 'mediocre',
                feedback: "Non-committal. Better than folding but no urgency."
              }
            ]
        }
      ]
    },

    // =========================================================
    // SCENARIO 2 — CONSULT 1 (8 turns, 80 pts max)
    // =========================================================
    consult_1: {
      title: 'CONSULT 1: WEEK 1',
      subtitle: 'Scenario 02',
      maxScore: 80,
      totalTurns: 8,
      turns: [
        {
          id: 1,
          getNpcLine: () => "Hey, thanks for setting this up. What did you want to go over?",
          getChoices: () => [
            {
              text: "Before we get into the scan — what made you say yes when you first signed up here?",
              points: 10, moodDelta: 5, category: 'DISARM', quality: 'best',
              feedback: "NEPQ disarm. Forces them to articulate their own motivation before you say a word."
            },
            {
              text: "Let me show you our 3x training package and what it does.",
              points: -3, moodDelta: -10, category: 'DISARM', quality: 'bad',
              feedback: "Selling in Consult 1. Burns rapport immediately. Cardinal sin."
            },
            {
              text: "How are you doing today? Anything new with you?",
              points: 2, moodDelta: -1, category: 'DISARM', quality: 'mediocre',
              feedback: "Small talk is safe but wastes the opening. You need their 'why' in this session."
            },
            {
              text: "Thanks for coming in — let's just talk for a few minutes about your training history before we dig into anything.",
              points: 6, moodDelta: 3, category: 'DISARM', quality: 'good',
              feedback: "Low-pressure framing. Good but misses the chance to anchor on their 'why'."
            }
          ]
        },
        {
          id: 2,
          getNpcLine: () => "Honestly, I just wanted to feel better. I had a kid two years ago and I haven't really felt like myself since.",
          getChoices: () => [
            {
              text: "That makes total sense. Tell me more about that — when you say 'feel like yourself,' what does that look like?",
              points: 10, moodDelta: 5, category: 'DISARM', quality: 'best',
              feedback: "NEPQ — peels the onion. They keep talking. You keep learning."
            },
            {
              text: "Got it. So our 3x program is perfect for that.",
              points: -3, moodDelta: -10, category: 'DISARM', quality: 'bad',
              feedback: "Pivoting to pitch before understanding the full 'why'. Kills trust."
            },
            {
              text: "Yeah, a lot of moms feel that way.",
              points: 2, moodDelta: -1, category: 'DISARM', quality: 'mediocre',
              feedback: "Generalizes — kills the personal moment. They need to feel seen, not categorized."
            },
            {
              text: "What does 'feeling like yourself' mean specifically — is it energy, body comp, mood, all three?",
              points: 10, moodDelta: 5, category: 'DISARM', quality: 'best',
              feedback: "Specificity question. Forces them to define the target in their own words."
            }
          ]
        },
        {
          id: 3,
          getNpcLine: () => "All three honestly. I just want to feel strong again. Have energy for my kid. Like the body part is real but it's almost like a side effect.",
          getChoices: () => [
            {
              text: "If we did a scan today and another in 8 weeks, what specifically would have to change for you to say it was worth it?",
              points: 10, moodDelta: 5, category: 'GAP', quality: 'best',
              feedback: "THE money question. Capture their answer verbatim — you'll use it in Consult 2."
            },
            {
              text: "Cool, our program will get you there.",
              points: -3, moodDelta: -7, category: 'GAP', quality: 'bad',
              feedback: "Empty promise with no evidence. They don't believe you yet."
            },
            {
              text: "What's your goal weight?",
              points: 2, moodDelta: -1, category: 'GAP', quality: 'mediocre',
              feedback: "Reduces a holistic 'feel like myself' answer to a number. Reductive."
            },
            {
              text: "So in 8 weeks, what would make you say 'this was worth it'? Numbers, feelings, both?",
              points: 10, moodDelta: 5, category: 'GAP', quality: 'best',
              feedback: "Same money question, slightly different frame. Still perfect."
            }
          ]
        },
        {
          id: 4,
          getNpcLine: () => "Energy and strength I think. Fitting back in my old jeans wouldn't hurt either.",
          getChoices: () => [
            {
              text: "How long have you been training overall, and what's worked best historically?",
              points: 10, moodDelta: 3, category: 'DISARM', quality: 'best',
              feedback: "Training history question. Sets up the reframe in Turn 5."
            },
            {
              text: "Have you tried other programs?",
              points: 2, moodDelta: 0, category: 'DISARM', quality: 'mediocre',
              feedback: "Too vague. Doesn't open up the conversation usefully."
            },
            {
              text: "Cool, let me tell you about our nutrition program.",
              points: -3, moodDelta: -10, category: 'DISARM', quality: 'bad',
              feedback: "Off-topic pitch. They just shared something personal and you pivoted to a product."
            },
            {
              text: "What's worked for you in the past — and what hasn't?",
              points: 10, moodDelta: 3, category: 'DISARM', quality: 'best',
              feedback: "The 'what hasn't worked' half is gold — sets up your differentiation perfectly."
            }
          ]
        },
        {
          id: 5,
          getNpcLine: () => "I did some bootcamps before kids, lost a bunch of weight, but it always came back.",
          getChoices: () => [
            {
              text: "That makes sense — bootcamps are great for cardio but don't build the lean mass that keeps you metabolically strong long-term. What we're doing here is different. And realistically what you're after is a 1-2 year arc.",
              points: 10, moodDelta: 5, category: 'ANCHOR', quality: 'best',
              feedback: "Reframes expectation, separates from past failures. Truth-tells on the timeline."
            },
            {
              text: "Bootcamps are the worst, glad you found us.",
              points: -3, moodDelta: -5, category: 'ANCHOR', quality: 'bad',
              feedback: "Shit-talking the competition. Juvenile and unprofessional."
            },
            {
              text: "Yeah that's normal.",
              points: 2, moodDelta: -1, category: 'ANCHOR', quality: 'mediocre',
              feedback: "Dismissive. They shared something vulnerable and you said 'yeah that's normal.'"
            },
            {
              text: "Got it. So this 8 weeks is your kickoff — not the whole journey. Realistic timeline is a year or two. Today's scan is just the baseline. Sound fair?",
              points: 10, moodDelta: 5, category: 'ANCHOR', quality: 'best',
              feedback: "Anchors the timeline, lowers pressure. 'Sound fair?' gets a micro-yes."
            }
          ]
        },
        {
          id: 6,
          getNpcLine: () => "Okay, that's actually a relief to hear. So what does the scan show?",
          getChoices: () => [
            {
              text: "Let's go through it together. None of these numbers mean anything in isolation — what matters is how they move over the next 6-8 weeks. This is your baseline.",
              points: 10, moodDelta: 5, category: 'ANCHOR', quality: 'best',
              feedback: "Removes shame from the numbers. 'Baseline' is the most important word here."
            },
            {
              text: "Your body fat is elevated — we need to bring that down.",
              points: -3, moodDelta: -10, category: 'ANCHOR', quality: 'bad',
              feedback: "Shame-based framing. Destroys rapport in one sentence."
            },
            {
              text: "You're a little overweight but we'll fix it.",
              points: -3, moodDelta: -10, category: 'ANCHOR', quality: 'bad',
              feedback: "Never say 'overweight.' Ever."
            },
            {
              text: "Here's where you're starting today. Don't worry if the numbers look 'good' or 'bad' — the only thing that matters is the delta between now and Week 6. This is our starting line.",
              points: 10, moodDelta: 5, category: 'ANCHOR', quality: 'best',
              feedback: "'Starting line' is the frame. They're a runner at the start, not a patient with a problem."
            }
          ]
        },
        {
          id: 7,
          getNpcLine: () => "Got it. So what now?",
          getChoices: () => [
            {
              text: "Now you just train. Show up. The 3rd bonus session each week is on us — that's the demo. Week 6 we re-scan and walk through what changed and what's possible from there.",
              points: 10, moodDelta: 5, category: 'ANCHOR', quality: 'best',
              feedback: "Trust the process. No selling. Just show up + we scan again. Low pressure = high trust."
            },
            {
              text: "Now you sign up for our 6-month program.",
              points: -3, moodDelta: -15, category: 'ANCHOR', quality: 'bad',
              feedback: "SELLING IN CONSULT 1. Burns the entire relationship you just spent 7 turns building."
            },
            {
              text: "You should add another session each week.",
              points: -3, moodDelta: -10, category: 'ANCHOR', quality: 'bad',
              feedback: "Selling with no value foundation. They don't have the evidence yet."
            },
            {
              text: "Honestly? Just train. Don't change anything else. Let the scan talk in 6 weeks. That's all we're doing today.",
              points: 10, moodDelta: 5, category: 'ANCHOR', quality: 'best',
              feedback: "Radical simplicity. Zero sales pressure. They'll trust you completely."
            }
          ]
        },
        {
          id: 8,
          getNpcLine: () => "Sounds good. What do I do next?",
          getChoices: () => [
            {
              text: "Let's lock in your Week 6 results session right now while we're here. Tuesday at 6 or Thursday at 7 — which works?",
              points: 10, moodDelta: 5, category: 'CLOSE', quality: 'best',
              feedback: "BAMFAM. Book Consult 2 before they leave. A/B close. Textbook."
            },
            {
              text: "I'll text you to schedule when we get closer.",
              points: -3, moodDelta: -5, category: 'CLOSE', quality: 'bad',
              feedback: "50% of 'I'll text you later' appointments never get booked."
            },
            {
              text: "Just keep training and we'll meet again in 6 weeks.",
              points: 2, moodDelta: -1, category: 'CLOSE', quality: 'mediocre',
              feedback: "No calendar = no meeting. Good intent, bad execution."
            },
            {
              text: "Quick thing before you go — let's get your Week 6 results session on the calendar right now. Tuesday at 6 or Thursday at 7?",
              points: 10, moodDelta: 5, category: 'CLOSE', quality: 'best',
              feedback: "'Quick thing before you go' is a beautiful soft lead-in. Then BAMFAM."
            }
          ]
        }
      ]
    },

    // =========================================================
    // SCENARIO 3 — CONSULT 2: THE CLOSE (15 turns, 150 pts max)
    // =========================================================
    consult_2: {
      title: 'CONSULT 2: THE CLOSE',
      subtitle: 'Scenario 03',
      maxScore: 150,
      totalTurns: 15,
      turns: [
        {
          id: 1,
          getNpcLine: () => "Hey, thanks for blocking off the time.",
          getChoices: () => [
            {
              text: "Hey, thanks for coming in. Before we even look at the scan — how have these last six weeks felt compared to the six before that?",
              points: 10, moodDelta: 5, category: 'DISARM', quality: 'best',
              feedback: "NEPQ disarm. Don't lead with numbers — lead with how they feel."
            },
            {
              text: "Let's pull up the scan and see what changed.",
              points: 2, moodDelta: -1, category: 'DISARM', quality: 'mediocre',
              feedback: "Not bad, but loses the qualitative frame. Data without feeling is just numbers."
            },
            {
              text: "Are you ready to upgrade your training?",
              points: -3, moodDelta: -10, category: 'DISARM', quality: 'bad',
              feedback: "Pitched in Turn 1. Way too early. You haven't earned it."
            },
            {
              text: "Before we get into the data — how have these six weeks compared to the six before? Honestly.",
              points: 10, moodDelta: 5, category: 'DISARM', quality: 'best',
              feedback: "'Honestly' invites a real answer instead of a polite one. Great opener."
            }
          ]
        },
        {
          id: 2,
          getNpcLine: () => "Honestly? Better. Like noticeably. I've got more energy at the end of the day, my kid wore me out less this week, and my husband actually said something about how I look. Which never happens.",
          getChoices: () => [
            {
              text: "That's huge — say more about that. What feels most different?",
              points: 10, moodDelta: 5, category: 'DISARM', quality: 'best',
              feedback: "Peels the onion. Don't pivot to the close yet. Let them keep selling themselves."
            },
            {
              text: "Awesome, glad to hear it. So let's talk about keeping that going.",
              points: 6, moodDelta: 3, category: 'DISARM', quality: 'good',
              feedback: "Acceptable but skips the deepening. You're leaving emotion on the table."
            },
            {
              text: "Great. Let's pull up the scan.",
              points: 2, moodDelta: -1, category: 'DISARM', quality: 'mediocre',
              feedback: "They gave you emotional gold and you moved on to a spreadsheet."
            },
            {
              text: "That's exactly what we want to hear. What part of that feels most different to you day-to-day?",
              points: 10, moodDelta: 5, category: 'DISARM', quality: 'best',
              feedback: "Anchors the emotional win and extracts the specific feeling. They'll remember this moment."
            }
          ]
        },
        {
          id: 3,
          getNpcLine: () => "I think it's the energy. I just don't crash at 3pm anymore.",
          getChoices: () => [
            {
              text: "Walk me back to Week 1 — when you sat here you said your why was feeling strong and having energy for your kid. Where would you rate yourself on that today, on a 1-10?",
              points: 10, moodDelta: 5, category: 'GAP', quality: 'best',
              feedback: "Anchors to their own words. They rate themselves and feel the gap themselves."
            },
            {
              text: "So you should keep going at this pace.",
              points: 2, moodDelta: -1, category: 'GAP', quality: 'mediocre',
              feedback: "Tells them what to do. Loses the NEPQ frame entirely."
            },
            {
              text: "Want to keep doing 3x sessions?",
              points: -3, moodDelta: -7, category: 'GAP', quality: 'bad',
              feedback: "Yes/no question. Closes too early. Fumbles the NEPQ sequence."
            },
            {
              text: "When we sat here Week 1, you told me your why was feeling strong and having energy for your kid. On a 1-10, where are you on that today?",
              points: 10, moodDelta: 5, category: 'GAP', quality: 'best',
              feedback: "Their words. Their scale. Their gap. They'll feel the distance without you pushing."
            }
          ]
        },
        {
          id: 4,
          getNpcLine: () => "I'd say like a 6 maybe?",
          getChoices: () => [
            {
              text: "Okay — what's keeping it from being a 10?",
              points: 10, moodDelta: 5, category: 'GAP', quality: 'best',
              feedback: "They sell themselves. Wait. Don't fill the silence. The answer that follows closes the deal."
            },
            {
              text: "That's great progress!",
              points: 2, moodDelta: -1, category: 'GAP', quality: 'mediocre',
              feedback: "Closes the gap they were about to articulate. Disaster move."
            },
            {
              text: "What can we do to get you to a 10?",
              points: 6, moodDelta: 3, category: 'GAP', quality: 'good',
              feedback: "Acceptable, but slightly trainer-centric ('we'). Let them own the gap."
            },
            {
              text: "Hmm — what's keeping it from being an 8 or a 9?",
              points: 10, moodDelta: 5, category: 'GAP', quality: 'best',
              feedback: "Lower bar than 10 — easier for them to identify what's missing. Smart framing."
            }
          ]
        },
        {
          id: 5,
          getNpcLine: () => "Honestly? I think I just need to be in here more. I feel like the days I don't train I'm flat.",
          getChoices: () => [
            {
              text: "And if you stayed exactly where you've been — same frequency, same everything — where do you see yourself six months from now? Honestly.",
              points: 10, moodDelta: 5, category: 'GAP', quality: 'best',
              feedback: "Consequence question. THE NEPQ move. Make them imagine the negative future."
            },
            {
              text: "So you should add another session a week.",
              points: -3, moodDelta: -10, category: 'GAP', quality: 'bad',
              feedback: "Tells them what to do. Skips the consequence frame entirely."
            },
            {
              text: "Sounds like 3x is the right number for you.",
              points: 2, moodDelta: -1, category: 'GAP', quality: 'mediocre',
              feedback: "Too much of a tell. They need to say it, not hear it."
            },
            {
              text: "Real question — if you stayed at 2x for the next six months, where do you honestly see yourself?",
              points: 10, moodDelta: 5, category: 'GAP', quality: 'best',
              feedback: "'Real question' signals you're about to ask something important. They lean in."
            }
          ]
        },
        {
          id: 6,
          getNpcLine: () => "Probably... about where I was. Maybe a little better. But not where I want to be.",
          getChoices: () => [
            {
              text: "What would it cost you — not financially, I mean personally — if a year from now you were still where you are today?",
              points: 10, moodDelta: 5, category: 'GAP', quality: 'best',
              feedback: "Deepest NEPQ frame. Hold the silence after this. Whoever speaks first loses."
            },
            {
              text: "So we should keep you at 3x.",
              points: -3, moodDelta: -10, category: 'GAP', quality: 'bad',
              feedback: "Pivoted too fast. They were about to feel something real."
            },
            {
              text: "That makes sense, the science says you need 3x for compound results.",
              points: 2, moodDelta: -1, category: 'GAP', quality: 'mediocre',
              feedback: "Lecturing kills the moment. They were about to feel the cost themselves."
            },
            {
              text: "What would it actually cost you — not money, life-wise — if a year from now you were exactly where you are right now?",
              points: 10, moodDelta: 5, category: 'GAP', quality: 'best',
              feedback: "'Not money, life-wise' is a beautiful redirect. Goes straight to identity cost."
            }
          ]
        },
        {
          id: 7,
          getNpcLine: () => "...A lot. I don't want to be that person.",
          getChoices: () => [
            {
              text: "Let's actually look at what happened. Week 1 to today — body fat down, lean mass up, visceral down. You did that in six weeks. Want to know what the variable was?",
              points: 10, moodDelta: 5, category: 'ANCHOR', quality: 'best',
              feedback: "Hormozi associate move. Tie the win to the variable. Suspense close."
            },
            {
              text: "Great, so let me show you our 3x package.",
              points: -3, moodDelta: -10, category: 'ANCHOR', quality: 'bad',
              feedback: "Skipped the anchor. Premature pitch. You just wasted the best emotional moment."
            },
            {
              text: "Yeah, this is why we need to keep you at 3x.",
              points: 2, moodDelta: -1, category: 'ANCHOR', quality: 'mediocre',
              feedback: "Tells them. Doesn't show them. Lead with data, then draw the conclusion."
            },
            {
              text: "Look at this. Six weeks. Body fat down, lean mass up, visceral down. Want to know what changed?",
              points: 10, moodDelta: 5, category: 'ANCHOR', quality: 'best',
              feedback: "'Want to know what changed?' — curiosity gap before the reveal. Textbook."
            }
          ]
        },
        {
          id: 8,
          getNpcLine: () => "What?",
          getChoices: () => [
            {
              text: "You added one session a week. That's it. Same coach, same intensity, same nutrition advice. The only variable was frequency. Your body adapted to 3x in six weeks. Drop back to 2x and the body comp regresses — not because you got worse, because the input got smaller.",
              points: 10, moodDelta: 10, category: 'ANCHOR', quality: 'best',
              feedback: "THIS IS THE LINE. Causal claim, stated like physics. They cannot argue with it."
            },
            {
              text: "More training works.",
              points: 2, moodDelta: -1, category: 'ANCHOR', quality: 'mediocre',
              feedback: "Technically true. Completely fails to create urgency or specificity."
            },
            {
              text: "You started eating better.",
              points: -3, moodDelta: -7, category: 'ANCHOR', quality: 'bad',
              feedback: "Wrong attribution. The whole point is frequency was the variable. Don't undermine it."
            },
            {
              text: "One thing. You added a third session each week. Everything else stayed the same — coach, intensity, food. The ONLY variable was frequency. Your body adapted to 3x. Drop back to 2x and you'll regress — not because you got worse, but because the input got smaller.",
              points: 10, moodDelta: 10, category: 'ANCHOR', quality: 'best',
              feedback: "Word-for-word the script. Causal. Inevitable. Irrefutable."
            }
          ]
        },
        {
          id: 9,
          getNpcLine: () => "Huh. I didn't realize that.",
          getChoices: () => [
            {
              text: "So here's the question — would it help if we just kept you on the schedule that produced these numbers, instead of dropping back?",
              points: 10, moodDelta: 5, category: 'CLOSE', quality: 'best',
              feedback: "NEPQ 'would it help' frame. They answer yes. You haven't asked them to buy anything yet."
            },
            {
              text: "So you need to sign up for 3x.",
              points: -3, moodDelta: -7, category: 'CLOSE', quality: 'bad',
              feedback: "Forced. Breaks the NEPQ frame at the worst moment."
            },
            {
              text: "Do you want to upgrade?",
              points: -3, moodDelta: -7, category: 'CLOSE', quality: 'bad',
              feedback: "Yes/no question kills the momentum you just built."
            },
            {
              text: "Real question — would it help if we just kept doing what we just proved works?",
              points: 10, moodDelta: 5, category: 'CLOSE', quality: 'best',
              feedback: "'What we just proved' references the data you just showed. Closes with evidence."
            }
          ]
        },
        {
          id: 10,
          getNpcLine: () => "Yeah, I mean obviously. What does that look like?",
          getChoices: () => [
            {
              text: "Here's what The Ascent — our 3x semi-private tier — includes. Three sessions a week, quarterly Evolt re-scans, programming reviews every 6 weeks, member-only group chat, priority booking, one free guest pass a month. Stacked à la carte that's $300+/month. Ascent rate is $195 a week. You're already at $150 — the actual differential is $45 a week. That's $5.13 a day to keep doing what we just proved works.",
              points: 10, moodDelta: 10, category: 'CLOSE', quality: 'best',
              feedback: "Hormozi stack + per-day landing. Every element justifies the price before you say it."
            },
            {
              text: "It's $195 a week.",
              points: -3, moodDelta: -10, category: 'CLOSE', quality: 'bad',
              feedback: "Led with price. No stack. The number hits before they understand the value."
            },
            {
              text: "It's basically 3x a week instead of 2x.",
              points: 2, moodDelta: -1, category: 'CLOSE', quality: 'mediocre',
              feedback: "Logistics framing, no value stack. No excitement."
            },
            {
              text: "Let me lay this out — three sessions from your coach, quarterly re-scans, programming reviews, group chat, priority booking, free monthly guest pass. À la carte that's over $300. Ascent rate is $195/week, you're at $150, so the differential is $45/week — that's $5.13 a day.",
              points: 10, moodDelta: 10, category: 'CLOSE', quality: 'best',
              feedback: "Same stack, tighter delivery. $5.13/day is the number that lands."
            }
          ]
        },
        {
          id: 11,
          getNpcLine: () => "Hmm. So what are my options?",
          getChoices: () => [
            {
              text: "Two ways to do this. Option A — pay in full today, save 20%. That's $936 instead of $1,170, you don't think about billing again until next year. Option B — split into two payments 30 days apart, save 10%, $1,053 total. Either way, you pick a free MyZone belt or a gym tee. Which feels better — A or B?",
              points: 10, moodDelta: 10, category: 'CLOSE', quality: 'best',
              feedback: "Assumed which-pile close. A or B — not yes or no. This is the exact move."
            },
            {
              text: "You can pay all at once or split it up. Want to do this?",
              points: -3, moodDelta: -10, category: 'CLOSE', quality: 'bad',
              feedback: "Yes/no question kills the close. Never ask 'want to do this.'"
            },
            {
              text: "It's $1,170 over six months.",
              points: -3, moodDelta: -7, category: 'CLOSE', quality: 'bad',
              feedback: "Led with the highest number, no PIF anchor, no stack, no bonus."
            },
            {
              text: "Two paths. A: pay in full, 20% off — $936. B: split into two payments, 10% off — $1,053 total. Free MyZone belt or gym tee either way. Which feels better — A or B?",
              points: 10, moodDelta: 10, category: 'CLOSE', quality: 'best',
              feedback: "Clean, tight. A or B is the only question that matters now."
            }
          ]
        },
        {
          id: 12,
          getNpcLine: () => "Hmm. I want to do this, but $45 a week is real money. I need to think about it.",
          getChoices: () => [
            {
              text: "Totally fair. When you say 'think about it' — what specifically are you weighing? Because if there's something I missed, I'd rather solve it now than have you walk out without the full picture.",
              points: 10, moodDelta: 5, category: 'OBJECTION', quality: 'best',
              feedback: "NEPQ objection handler. Surface the real concern. Don't fold, don't push — ask."
            },
            {
              text: "Take all the time you need.",
              points: -3, moodDelta: -7, category: 'OBJECTION', quality: 'bad',
              feedback: "'Take all the time you need' is a polite goodbye."
            },
            {
              text: "It's only $5 a day, that's a coffee.",
              points: 2, moodDelta: -1, category: 'OBJECTION', quality: 'mediocre',
              feedback: "True but lectures them. Doesn't address the actual concern."
            },
            {
              text: "I get it. Real question — when you say 'think about it,' what's the actual thing you're weighing? Money, schedule, something else?",
              points: 10, moodDelta: 5, category: 'OBJECTION', quality: 'best',
              feedback: "Categorizes the objection for them. Forces specificity."
            }
          ]
        },
        {
          id: 13,
          getNpcLine: () => "It's the money honestly. I'd have to talk to my husband.",
          getChoices: () => [
            {
              text: "I get that, my wife is the same way. Let me ask — if your husband said 'do whatever you think is best,' what would you do?",
              points: 10, moodDelta: 5, category: 'OBJECTION', quality: 'best',
              feedback: "NEPQ qualifier. Reveals if the spouse is real or a stall. Often they say 'I'd do it.'"
            },
            {
              text: "$45 a week is nothing for what you'll get.",
              points: -3, moodDelta: -10, category: 'OBJECTION', quality: 'bad',
              feedback: "Arguing price. The cardinal NEPQ sin. You just made her feel stupid for raising it."
            },
            {
              text: "Okay, talk to him and let me know.",
              points: -3, moodDelta: -7, category: 'OBJECTION', quality: 'bad',
              feedback: "Lets the deal die. 70% of 'I'll talk to my spouse' conversations never happen."
            },
            {
              text: "Totally fair. Can I ask — if your husband said 'I trust you, do what you think,' what would you actually do?",
              points: 10, moodDelta: 5, category: 'OBJECTION', quality: 'best',
              feedback: "'What would you actually do?' isolates their real desire."
            }
          ]
        },
        {
          id: 14,
          getNpcLine: () => "Honestly? I'd probably do Option A.",
          getChoices: () => [
            {
              text: "Then here's what I'd suggest — let's get you started today on Option A, and if for any reason your husband isn't on board within 48 hours, we void it. Zero risk. The PIF rate locks at today's number. If we wait, you're outside that window. Sound fair?",
              points: 10, moodDelta: 10, category: 'OBJECTION', quality: 'best',
              feedback: "Reverses the spouse stall + adds urgency + 48-hour out. Zero-risk close."
            },
            {
              text: "Then sign up for Option A.",
              points: 2, moodDelta: -1, category: 'OBJECTION', quality: 'mediocre',
              feedback: "Skips the spouse concern. She still has to go home and explain it."
            },
            {
              text: "Let me know once you talk to him.",
              points: -3, moodDelta: -10, category: 'OBJECTION', quality: 'bad',
              feedback: "Lets the deal die. Again."
            },
            {
              text: "Then let's start you on A today. If your husband isn't on board in 48 hours, we cancel — no questions. The discount only locks in this week. Sound fair?",
              points: 10, moodDelta: 10, category: 'OBJECTION', quality: 'best',
              feedback: "'Sound fair?' is the micro-yes that seals it."
            }
          ]
        },
        {
          id: 15,
          getNpcLine: () => "Okay yeah, let's do A.",
          getChoices: () => [
            {
              text: "Awesome. Welcome to Ascent. Quick thing before I write this up — most of our top performers end up at Herculean within six months anyway. That's 4x plus meals included. Bump from Ascent is small per week, and the meals save you way more. If I write you in at Herculean now you skip the upgrade fee later. Want me to swap it?",
              points: 10, moodDelta: 5, category: 'CLOSE', quality: 'best',
              feedback: "Post-close upsell while the pen is hot. Textbook Hormozi. The pen is still in their hand."
            },
            {
              text: "Cool, see you at the front desk to pay.",
              points: 2, moodDelta: -1, category: 'CLOSE', quality: 'mediocre',
              feedback: "Misses the easiest upsell of the year. The pen was still in their hand."
            },
            {
              text: "Want to also add the 4x package?",
              points: 6, moodDelta: 3, category: 'CLOSE', quality: 'good',
              feedback: "Asks but doesn't stack the value. Still catches a few takers."
            },
            {
              text: "Awesome — welcome to Ascent. Real quick — most of our high-performers end up at Herculean within six months. That's 4x plus meals. Bump from Ascent is small, meals save you more. Write you in at Herculean now and you skip the upgrade fee. Swap it?",
              points: 10, moodDelta: 5, category: 'CLOSE', quality: 'best',
              feedback: "'Swap it?' is gentler than 'want to upgrade?' — key difference in tonality."
            }
          ]
        }
      ]
    }
  };
})();
