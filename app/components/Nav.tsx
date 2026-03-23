'use client'

function ClaudeLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-label="Claude">
      <circle cx="11" cy="11" r="10.5" stroke="#cc785c" strokeWidth="1" fill="none" />
      <path
        d="M11 4.5L12.8 9.2L17.5 11L12.8 12.8L11 17.5L9.2 12.8L4.5 11L9.2 9.2L11 4.5Z"
        fill="#cc785c"
      />
    </svg>
  )
}

export default function Nav() {
  const tabs = [
    { label: 'Chats', badge: null },
    { label: 'Projects', badge: null },
    { label: 'Tasks', badge: '2' },
  ]

  return (
    <header className="h-12 bg-claude-nav border-b border-claude-border flex items-center px-4 gap-4 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 mr-2">
        <ClaudeLogo />
        <span className="text-claude-text font-medium text-sm tracking-tight">Claude</span>
      </div>

      {/* Divider */}
      <div className="w-px h-4 bg-claude-border" />

      {/* Tabs */}
      <nav className="flex items-center gap-0.5">
        {tabs.map((tab) => {
          const isActive = tab.label === 'Tasks'
          return (
            <button
              key={tab.label}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${
                isActive
                  ? 'text-claude-text bg-claude-hover'
                  : 'text-claude-secondary hover:text-claude-text hover:bg-claude-hover'
              }`}
            >
              {tab.label}
              {tab.badge && (
                <span className="flex items-center justify-center w-4 h-4 text-[10px] font-semibold bg-claude-accent text-white rounded-full leading-none">
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User avatar placeholder */}
      <div className="w-7 h-7 rounded-full bg-claude-surface border border-claude-border flex items-center justify-center">
        <span className="text-xs text-claude-secondary font-medium">S</span>
      </div>
    </header>
  )
}
