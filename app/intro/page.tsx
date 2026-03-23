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
    detail: 'Open any task and Claude already knows what you were working on and why it matters.',
  },
  {
    label: 'Manage on your terms',
    detail: 'Prioritize, sort, set reminders, and snooze — the task list is yours to shape.',
  },
]

export default function IntroPage() {
  return (
    <div className="min-h-screen bg-claude-bg flex flex-col font-sans">
      {/* Top bar */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-claude-border shrink-0">
        <div className="flex items-center gap-2.5">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <circle cx="9" cy="9" r="8.5" stroke="#cc785c" strokeWidth="0.75" fill="none" />
            <path d="M9 3L10.4 7.4L14.8 9L10.4 10.6L9 15L7.6 10.6L3.2 9L7.6 7.4L9 3Z" fill="#cc785c" />
          </svg>
          <span className="text-sm font-semibold text-claude-text">Claude To Do</span>
        </div>
        <Link
          href="/"
          className="text-sm text-claude-secondary hover:text-claude-text transition-colors"
        >
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
          <h1 className="text-[2.6rem] font-semibold text-claude-text tracking-tight leading-tight mb-5">
            What if your AI assistant never lost track of what you needed to do?
          </h1>

          {/* Description */}
          <p className="text-base text-claude-secondary leading-relaxed mb-4">
            Most task managers are lists you fill out manually. This prototype explores a different idea: Claude
            recognizing action items as they come up in conversation, tracking them automatically, and staying
            ready to help you pick up where you left off.
          </p>
          <p className="text-base text-claude-secondary leading-relaxed mb-10">
            This is an early concept I built to explore what AI-native task management could look like inside
            Claude — not as a finished feature, but as a way to think through how it could work.
          </p>

          {/* Features */}
          <div className="space-y-5 mb-12">
            {FEATURES.map(({ label, detail }) => (
              <div key={label} className="flex items-start gap-4">
                <span className="text-claude-accent mt-0.5 text-lg leading-none shrink-0">✦</span>
                <div>
                  <p className="text-sm font-medium text-claude-text mb-0.5">{label}</p>
                  <p className="text-sm text-claude-secondary leading-relaxed">{detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-4">
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 bg-claude-accent hover:bg-claude-accent/90 text-white font-medium text-sm px-6 py-3 rounded-lg transition-colors"
            >
              Try the chat
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/"
              className="text-sm text-claude-secondary hover:text-claude-text transition-colors"
            >
              Jump to task list
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-5 border-t border-claude-border shrink-0">
        <p className="text-xs text-claude-secondary/50 text-center">
          Claude To Do — a feature concept prototype exploring AI-native task management
        </p>
      </footer>
    </div>
  )
}
