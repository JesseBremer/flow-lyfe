# 🌊 Flow-Lyfe

> **Stop planning. Start flowing.**

A zero-friction productivity app that helps you capture thoughts instantly and organize them later. Flow with your natural rhythm instead of fighting against it.

## ✨ Core Philosophy

Flow-Lyfe combines two productivity approaches:

1. **Capture. Flow. Reflect.** - Structured features with smart organization
2. **The Drift Method™** - Natural emergence, minimal friction, rhythm recognition

Unlike traditional productivity apps that force you to categorize and plan upfront, Flow-Lyfe lets you:
- **Capture** everything instantly without decisions
- **Surface** items when you're naturally ready
- **Flow** with what emerges instead of rigid schedules
- **Reflect** to identify true priorities (Anchor Points)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## 🎯 Key Features

### 1. 🌊 Stream View
- Instant capture with zero friction
- Auto-clustering (items within 15min group together)
- Energy detection (morning/afternoon/evening vibes)
- Swipe to organize or archive

### 2. 🎯 Current View
- Items naturally surfaced for action
- **Anchor Points**: Items that resurface 3+ times (your true priorities)
- Actions: "Flow with it" / "Let it drift" / "Release"

### 3. 📋 Flow Board
- Minimal Kanban: Today's Flow / Next Up / Someday
- Quick task completion
- No overwhelming lists

### 4. 🎧 Focus Mode
- **Pomodoro**: 25-minute deep focus sessions
- **Flow Mode**: Unlimited deep work
- Ambient timer with calming animations

### 5. 🌙 Tide Reflection
- Daily stats and patterns
- Journaling & gratitude
- Historical reflections

## 🏗️ Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: TailwindCSS v4 + Shadcn/UI
- **State**: Zustand
- **Database**: IndexedDB (Dexie.js) - Offline-first
- **Animations**: Framer Motion
- **Utils**: date-fns, nanoid

## 📱 Data Flow

```
Capture → Auto-Cluster → Stream → Surface → Current → Flow Board → Complete
                                     ↓
                            (Energy/Time/Context)
```

## 🔑 Key Concepts

### Energy Detection
Items are automatically tagged based on when you capture them:
- **Morning (6am-12pm)**: High energy
- **Afternoon (12pm-6pm)**: Medium energy
- **Evening (6pm-6am)**: Low energy

### Natural Clustering
Items captured within 15 minutes automatically group together - no manual organization needed.

### Anchor Points
Items that surface 3+ times become "Anchors" - these are your true priorities that keep calling for attention.

### Temperature Score
Items gain "temperature" over time - natural urgency emerges without due dates.

## 🛣️ Roadmap

### Phase 1 (Current - MVP)
- ✅ Instant capture interface
- ✅ Stream with clustering
- ✅ Current view with anchors
- ✅ Flow Board (Kanban)
- ✅ Focus Mode (Pomodoro + Flow)
- ✅ Tide Reflection

### Phase 2 (Next)
- [ ] Voice capture (Web Speech API)
- [ ] Bill tracking with date extraction
- [ ] Smart surfacing algorithm (AI)
- [ ] Mobile PWA support
- [ ] Cross-device sync (optional cloud)

### Phase 3 (Future)
- [ ] AI-powered categorization
- [ ] Natural language date parsing
- [ ] Calendar integration
- [ ] Habit tracking
- [ ] Team/shared flows

## 🎨 Design Philosophy

- **Warm neutrals** with accent gradients (blue → purple)
- **Gentle animations** that feel natural
- **Minimal decisions** - the app adapts to you
- **Offline-first** - works without internet
- **Privacy-focused** - your data stays local

## 🧘 The Flow-Lyfe Way

Unlike other productivity systems:

- **GTD** says "What's the next action?" → Flow-Lyfe asks **"What's naturally ready?"**
- **Pomodoro** says "Focus for 25 minutes" → Flow-Lyfe says **"Ride the wave as long as it carries you"**
- **Bullet Journal** says "Migrate tasks monthly" → Flow-Lyfe says **"Let tasks find their moment"**

This isn't about doing more - it's about doing what matters, when it matters, without the friction of deciding what matters.

## 📄 License

MIT

---

**Flow-Lyfe** transforms productivity from an upstream swim into a downstream float, where effort is replaced by intelligence, and stress is replaced by trust.

*Capture everything. Force nothing. Let clarity emerge.*
