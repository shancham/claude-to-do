'use client'

function SidebarToggleIcon() {
  return (
    <svg width="18" height="16" viewBox="0 0 18 16" fill="none" aria-hidden="true">
      <rect x="0.75" y="0.75" width="16.5" height="14.5" rx="2.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M6 0.75V15.25" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  )
}

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ForwardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

interface TopNavProps {
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

export default function TopNav({ sidebarOpen, onToggleSidebar }: TopNavProps) {
  return (
    <div className="h-11 flex items-center px-4 gap-2 bg-claude-bg border-b border-claude-border shrink-0">
      {/* Left section */}
      <div className="flex items-center gap-2 flex-1">
        {/* macOS window controls — decorative */}
        <div className="flex items-center gap-1.5 mr-1">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>

        {/* Sidebar toggle */}
        <button
          onClick={onToggleSidebar}
          title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          className="p-1.5 rounded-md text-claude-secondary hover:text-claude-text hover:bg-claude-hover transition-colors"
        >
          <SidebarToggleIcon />
        </button>

        {/* Back / Forward — decorative */}
        <div className="flex items-center gap-0.5">
          <button
            disabled
            className="p-1.5 rounded-md text-claude-secondary/40 cursor-default"
            aria-label="Back"
          >
            <BackIcon />
          </button>
          <button
            disabled
            className="p-1.5 rounded-md text-claude-secondary/40 cursor-default"
            aria-label="Forward"
          >
            <ForwardIcon />
          </button>
        </div>
      </div>

      {/* Chat / Cowork / Code segment — centered */}
      <div className="flex items-center bg-black/6 rounded-full p-0.5 gap-0.5">
        {(['Chat', 'Cowork', 'Code'] as const).map((tab) => (
          <button
            key={tab}
            className={`text-sm px-4 py-1 rounded-full transition-colors ${
              tab === 'Chat'
                ? 'bg-white text-claude-text font-medium shadow-sm'
                : 'text-claude-secondary hover:text-claude-text'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Right spacer — balances left section to keep pills centered */}
      <div className="flex-1" />
    </div>
  )
}
