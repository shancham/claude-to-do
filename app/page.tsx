import Link from 'next/link'

function ClaudeAsterisk() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <circle cx="18" cy="18" r="17" stroke="#cc785c" strokeWidth="1.5" fill="none" />
      <path
        d="M18 6L20.8 14.7L29.5 18L20.8 21.3L18 30L15.2 21.3L6.5 18L15.2 14.7L18 6Z"
        fill="#cc785c"
      />
    </svg>
  )
}

const FEATURES = [
  {
    label: 'Tasks surface automatically',
    detail: 'Claude picks up on action items mid-conversation and logs them without interrupting your flow.',
  },
  {
    label: 'Context travels with every task',
    detail: 'Open any task and Claude already knows what you were working on and where you left off.',
  },
  {
    label: 'Manage on your terms',
    detail: 'Prioritize, sort, set reminders, and snooze. The task list is yours to shape.',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-claude-bg flex flex-col font-sans">
      {/* Top bar */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-claude-border shrink-0">
        <div className="flex items-center gap-2.5">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <circle cx="9" cy="9" r="8.5" stroke="#cc785c" strokeWidth="0.75" fill="none" />
            <path d="M9 3L10.4 7.4L14.8 9L10.4 10.6L9 15L7.6 10.6L3.2 9L7.6 7.4L9 3Z" fill="#cc785c" />
          </svg>
          <span className="text-sm font-semibold text-claude-text">Claude Tasks</span>
        </div>
        <Link href="/tasks" className="text-sm text-claude-secondary hover:text-claude-text transition-colors">
          Skip to task list →
        </Link>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 py-20">
        <div className="max-w-[620px] w-full">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 text-claude-accent text-xs font-medium border border-claude-accent/30 bg-claude-accent/8 px-3 py-1.5 rounded-full mb-8">
            Feature concept prototype
          </div>

          {/* Asterisk */}
          <div className="mb-7">
            <ClaudeAsterisk />
          </div>

          {/* Heading */}
          <h1 className="text-[2.6rem] font-semibold text-claude-text tracking-tight leading-tight mb-3">
            Welcome to Claude Tasks
          </h1>

          {/* Author */}
          <p className="text-sm text-claude-secondary mb-8">
            Built by Shannon Chambers. Find me on{' '}
            <a href="https://www.linkedin.com/in/shannon-chambers/" target="_blank" rel="noopener noreferrer" className="no-underline hover:underline underline-offset-2 hover:text-claude-accent transition-colors">LinkedIn</a>,{' '}
            <a href="https://shannonchambers.cv/" target="_blank" rel="noopener noreferrer" className="no-underline hover:underline underline-offset-2 hover:text-claude-accent transition-colors">my personal site</a>, and{' '}
            <a href="https://github.com/shancham" target="_blank" rel="noopener noreferrer" className="no-underline hover:underline underline-offset-2 hover:text-claude-accent transition-colors">GitHub</a>.
          </p>

          {/* Why */}
          <p className="text-xs font-semibold text-claude-accent uppercase tracking-widest mb-3">The why behind the prototype</p>
          <p className="text-base text-claude-secondary leading-relaxed mb-8">
            I kept running into the same organizational problem inside Claude Chat and decided to prototype a solve.
          </p>

          {/* Problem */}
          <p className="text-xs font-semibold text-claude-accent uppercase tracking-widest mb-3">The problem</p>
          <p className="text-base text-claude-secondary leading-relaxed mb-4">
            I keep losing my ideas and tasks inside Claude Chat. The chats directory is useful, but finding the right conversation is harder than it should be:
          </p>
          <ul className="space-y-2 mb-4 pl-1">
            {[
              'Search is hit or miss',
              "The one-liner summaries Claude generates are helpful, but they don't always match how I think about what we discussed",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-base text-claude-secondary leading-relaxed">
                <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-claude-secondary/40 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-base text-claude-secondary leading-relaxed mb-4">
            So I started asking myself: what do I actually need when I go looking for a specific chat? It&apos;s never really about the conversation. It&apos;s always because the task wasn&apos;t finished and I need to pick up where I left off.
          </p>
          <p className="text-base text-claude-secondary leading-relaxed mb-4">
            What I actually needed was a way to pull incomplete tasks out of my chats, track them, and link back to the original thread. And I wanted all of it to live in the platform where I&apos;m actually doing the work.
          </p>
          <p className="text-base text-claude-secondary leading-relaxed mb-10">
            That&apos;s where Claude Tasks comes in.
          </p>

          {/* Solution */}
          <p className="text-xs font-semibold text-claude-accent uppercase tracking-widest mb-3">The solution</p>
          <p className="text-base text-claude-secondary leading-relaxed mb-4">
            Your task and its context live together in one place, so picking something back up is effortless.
          </p>
          <p className="text-base text-claude-secondary leading-relaxed mb-4">
            Most task managers are lists you fill out manually. This prototype explores a different idea: Claude recognizing action items as they come up in conversation, tracking them automatically, and staying ready to help you pick up where you left off.
          </p>
          <p className="text-base text-claude-secondary leading-relaxed mb-8">
            This is an early concept I built to explore what AI-native task management could look like inside Claude. Not a finished feature, just a way to think through how it could work.
          </p>

          {/* Features */}
          <div className="space-y-5 mb-8">
            {FEATURES.map(({ label, detail }) => (
              <div key={label} className="flex items-start gap-4">
                <span className="text-claude-accent mt-0.5 text-lg leading-none shrink-0">✦</span>
                <div>
                  <p className="text-base font-medium text-claude-text mb-0.5">{label}</p>
                  <p className="text-base text-claude-secondary leading-relaxed">{detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Benefits for Anthropic */}
          <p className="text-xs font-semibold text-claude-accent uppercase tracking-widest mb-3">The benefits for Anthropic</p>
          <p className="text-base text-claude-secondary leading-relaxed mb-4">
            Anthropic&apos;s long-term pitch is that Claude is a useful, trustworthy collaborator. Tasks is a proof point for that. It moves Claude from a tool you query to a system that helps you follow through.
          </p>
          <p className="text-base text-claude-secondary leading-relaxed mb-4">Here&apos;s why that matters:</p>
          <ul className="space-y-4 mb-12 pl-1">
            {[
              { label: 'Stickiness.', detail: 'Tasks give users a reason to come back to Claude specifically, rather than completing work elsewhere and only returning when they need a new answer. If your to-do list lives in Claude, your workflow lives in Claude.' },
              { label: 'Accessible expansion.', detail: 'For users who haven\'t moved beyond Claude Chat, Tasks is a low-lift next step. Everyone\'s used a to-do app. And once someone starts using Tasks, they\'re that much closer to exploring everything else Claude has to offer.' },
              { label: 'A bridge to Cowork.', detail: 'Tasks is a natural onramp. Claude analyzes each task and, if Cowork can help move it forward, surfaces a \u201cStart task in Cowork\u201d button right on the task detail view.' },
              { label: 'Better signal.', detail: 'Understanding what tasks users care about, how they describe incomplete work, and what context helps them resume is valuable data for improving Claude\u2019s ability to be a long-term collaborator rather than a single-turn assistant.' },
            ].map(({ label, detail }) => (
              <li key={label} className="flex items-start gap-3 text-base text-claude-secondary leading-relaxed">
                <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-claude-secondary/40 shrink-0" />
                <span><span className="text-claude-text font-medium">{label}</span> {detail}</span>
              </li>
            ))}
          </ul>

        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-5 border-t border-claude-border shrink-0 pb-24">
        <p className="text-xs text-claude-secondary/50 text-center">
          Claude Tasks: a feature concept prototype exploring AI-native task management
        </p>
      </footer>

      {/* Sticky CTAs */}
      <div className="fixed bottom-0 inset-x-0 flex items-center justify-center gap-4 px-8 py-4 bg-claude-bg/90 backdrop-blur-sm border-t border-claude-border">
        <Link
          href="/chat"
          className="inline-flex items-center gap-2 bg-claude-accent hover:bg-claude-accent/90 text-white font-medium text-sm px-6 py-3 rounded-lg transition-colors"
        >
          Try the chat
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <Link href="/tasks" className="text-sm text-claude-secondary hover:text-claude-text transition-colors">
          Jump to task list
        </Link>
      </div>
    </div>
  )
}
