# Getting Started with Flow-Lyfe

## 🚀 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open your browser to http://localhost:3000
```

## 🎯 Your First Flow Session

### 1. Capture Your Thoughts (Stream View)
- App opens to the **Stream View** by default
- Type anything in the capture bar: "Buy groceries", "Call mom", "Project idea"
- Press Enter - it's instantly captured, no categories needed
- Keep capturing! Items within 15 minutes auto-cluster together

### 2. Organize When Ready (Current View)
- Click **Current** (🎯) in the navigation
- Manually move items from Stream to Current, or they'll surface naturally
- See **Anchor Points** - items that keep resurfacing (your true priorities)
- Actions:
  - **Flow with it** → Add to Flow Board
  - **Let it drift** → Back to Stream
  - **Release** → Archive

### 3. Work Your Flow (Flow Board)
- Click **Flow Board** (📋)
- Three columns:
  - **Today's Flow** - Do these today
  - **Next Up** - Coming soon
  - **Someday** - Future ideas
- Click ✓ Complete when done

### 4. Deep Focus (Focus Mode)
- Click **Focus** (🎧)
- Choose your mode:
  - **🍅 Pomodoro** - 25 min timer
  - **🌊 Flow Mode** - Unlimited deep work
- Start session and minimize distractions

### 5. Daily Reflection (Tide)
- Click **Tide** (🌙)
- See your daily stats
- Write a reflection on patterns you noticed
- Review what wants to become an Anchor

## 💡 Pro Tips

### Energy-Based Capturing
The app detects when you capture items:
- **Morning** (6am-12pm) = High energy tasks
- **Afternoon** (12pm-6pm) = Medium energy
- **Evening** (6pm-6am) = Low energy, reflective

Use this natural rhythm to your advantage!

### The Anchor System
Items that surface 3+ times automatically become **Anchor Points**. These are your real priorities - pay attention to them!

### Clustering Magic
Capture related thoughts in bursts - they'll automatically cluster together. Example:
- "Buy milk" (captured)
- "Get bread" (+30 seconds later)
- "Grocery run Saturday" (+1 min later)

All three cluster together automatically 🌊

### Flow vs. Planning
- **Don't** spend time categorizing upfront
- **Do** capture everything quickly
- **Don't** force yourself to organize daily
- **Do** reflect weekly to find patterns

## 🛠️ Customization

### Changing Views
Use the top navigation to switch between:
- 🌊 Stream - Capture & cluster
- 🎯 Current - Action items
- 📋 Flow Board - Organized tasks
- 🎧 Focus - Deep work
- 🌙 Tide - Reflection

### Data Management
- All data stored locally in IndexedDB
- Offline-first - works without internet
- Your data never leaves your device (currently)

## 🔄 Daily Workflow

### Morning (High Energy)
1. Open to Stream View
2. Capture overnight thoughts
3. Quick glance at Current → Move important items to Flow Board
4. Start a Focus session for your top priority

### Afternoon (Medium Energy)
1. Continue capturing as thoughts arise
2. Check Flow Board progress
3. Quick wins from "Next Up"

### Evening (Low Energy)
1. Open Tide Reflection
2. Review the day's patterns
3. Notice what kept resurfacing (future Anchors)
4. Journal briefly
5. Let unfinished items drift back to Stream

## 🐛 Troubleshooting

**Items not showing up?**
- Check you're in the right view (Stream vs Current)
- Refresh the page (IndexedDB persists)

**Want to start fresh?**
- Open DevTools → Application → IndexedDB → Delete FlowLyfeDB

**Build errors?**
- Run `npm install` again
- Delete `.next` folder and rebuild

## 🎨 Philosophy Reminder

> "Capture everything. Force nothing. Let clarity emerge."

Flow-Lyfe isn't about perfect organization - it's about:
- **Capturing** without friction
- **Flowing** with what emerges
- **Trusting** the process

Don't fight your rhythm. Flow with it. 🌊
