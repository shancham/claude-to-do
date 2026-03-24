'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTaskStore } from '../../store/taskStore'

// ─── Icons ────────────────────────────────────────────────────────────────────

function ComposeIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <path d="M7.5 2.5H3.5C2.67 2.5 2 3.17 2 4V13C2 13.83 2.67 14.5 3.5 14.5H12.5C13.33 14.5 14 13.83 14 13V9" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 1.5L15.5 7L9.5 13L6.5 13.5L7 10.5L10 1.5Z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <circle cx="7.5" cy="7.5" r="5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M11.5 11.5L14.5 14.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  )
}

function SlidersIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <path d="M2 4.5h13M2 8.5h13M2 12.5h13" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <circle cx="5.5" cy="4.5" r="2" fill="currentColor" />
      <circle cx="11" cy="8.5" r="2" fill="currentColor" />
      <circle cx="7" cy="12.5" r="2" fill="currentColor" />
    </svg>
  )
}

function ChatBubbleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <path d="M2 4C2 3.17 2.67 2.5 3.5 2.5H13.5C14.33 2.5 15 3.17 15 4V10C15 10.83 14.33 11.5 13.5 11.5H6L2 15V4Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

function FolderIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <path d="M2 5C2 4.17 2.67 3.5 3.5 3.5H6.5L8 5.5H13.5C14.33 5.5 15 6.17 15 7V12C15 12.83 14.33 13.5 13.5 13.5H3.5C2.67 13.5 2 12.83 2 12V5Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="5.5" height="5.5" rx="1.25" stroke="currentColor" strokeWidth="1.25" />
      <rect x="9.5" y="2" width="5.5" height="5.5" rx="1.25" stroke="currentColor" strokeWidth="1.25" />
      <rect x="2" y="9.5" width="5.5" height="5.5" rx="1.25" stroke="currentColor" strokeWidth="1.25" />
      <rect x="9.5" y="9.5" width="5.5" height="5.5" rx="1.25" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  )
}

function CircleCheckIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="6.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M5.5 8.5L7.5 10.5L11.5 6.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path d="M7.5 2v8M4.5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 12h11" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  )
}

function ChevronUpDownIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M3 5L6.5 2L10 5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 8L6.5 11L10 8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const TOP_ACTIONS = [
  { icon: <ComposeIcon />, label: 'New chat' },
  { icon: <SearchIcon />, label: 'Search' },
  { icon: <SlidersIcon />, label: 'Customize' },
]

const MAIN_NAV = [
  { icon: <ChatBubbleIcon />, label: 'Chats', href: '/chat' },
  { icon: <FolderIcon />, label: 'Projects', href: '/projects' },
  { icon: <GridIcon />, label: 'Artifacts', href: null },
  { icon: <CircleCheckIcon />, label: 'Tasks', href: '/tasks' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function NavBtn({
  icon,
  label,
  active = false,
  isOpen,
  onClick,
  hasUnread = false,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
  isOpen: boolean
  onClick?: () => void
  hasUnread?: boolean
}) {
  const activeClass = active
    ? 'bg-white text-claude-text shadow-sm'
    : 'text-claude-secondary hover:text-claude-text hover:bg-claude-hover'

  if (!isOpen) {
    return (
      <button
        title={label}
        onClick={onClick}
        className={`relative w-9 h-9 flex items-center justify-center rounded-lg transition-colors mx-auto ${activeClass}`}
      >
        {icon}
        {hasUnread && (
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-claude-accent" />
        )}
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors ${activeClass} ${active ? 'font-medium' : ''}`}
    >
      <span className="shrink-0">{icon}</span>
      {label}
      {hasUnread && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-claude-accent shrink-0" />
      )}
    </button>
  )
}

function SidebarLink({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-2.5 py-1.5 text-sm text-claude-secondary hover:text-claude-text transition-colors rounded-md truncate"
    >
      {label}
    </button>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

interface SidebarProps {
  isOpen: boolean
  activeItem?: string
}

export default function Sidebar({ isOpen, activeItem = 'Tasks' }: SidebarProps) {
  const router = useRouter()
  const { unvisitedItems, markItemVisited } = useTaskStore()

  useEffect(() => {
    markItemVisited(activeItem)
  }, [activeItem])

  return (
    <aside
      className={`flex flex-col h-full bg-claude-bg border-r border-claude-border shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out ${
        isOpen ? 'w-[260px]' : 'w-[52px]'
      }`}
    >
      {/* Top actions */}
      <div className={`pt-4 pb-1 space-y-0.5 ${isOpen ? 'px-3' : 'px-1.5'}`}>
        {TOP_ACTIONS.map(({ icon, label }) => (
          <NavBtn key={label} icon={icon} label={label} isOpen={isOpen} />
        ))}
      </div>

      {/* Divider */}
      <div className={`my-2 h-px bg-claude-border ${isOpen ? 'mx-3' : 'mx-1.5'}`} />

      {/* Main nav */}
      <div className={`space-y-0.5 ${isOpen ? 'px-3' : 'px-1.5'}`}>
        {MAIN_NAV.map(({ icon, label, href }) => (
          <NavBtn
            key={label}
            icon={icon}
            label={label}
            active={label === activeItem}
            isOpen={isOpen}
            hasUnread={unvisitedItems.includes(label)}
            onClick={href ? () => { markItemVisited(label); router.push(href) } : undefined}
          />
        ))}
      </div>

      {/* Starred + Recents — only when expanded */}
      {isOpen && (
        <>
          <div className="px-3 mt-5">
            <p className="px-2.5 pb-1 text-xs text-claude-secondary font-medium tracking-wide">
              Starred
            </p>
            <SidebarLink label="Claude.ai Q2 roadmap planning" />
            <SidebarLink label="Animations for landing page" />
          </div>
          <div className="px-3 mt-3">
            <p className="px-2.5 pb-1 text-xs text-claude-secondary font-medium tracking-wide">
              Recents
            </p>
            <SidebarLink label="Upcoming landing page launch" onClick={() => router.push('/chat')} />
          </div>
        </>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* User profile */}
      <div className={`py-3 border-t border-claude-border ${isOpen ? 'px-3' : 'px-1.5'}`}>
        {isOpen ? (
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-claude-hover transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-claude-text flex items-center justify-center shrink-0">
              <span className="text-sm font-semibold text-white">S</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-claude-text leading-tight">Shannon</p>
              <p className="text-xs text-claude-secondary leading-tight">Pro plan</p>
            </div>
            <button className="text-claude-secondary/70 hover:text-claude-secondary p-1 transition-colors">
              <DownloadIcon />
            </button>
            <button className="text-claude-secondary/70 hover:text-claude-secondary p-1 transition-colors">
              <ChevronUpDownIcon />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <button
              title="Download"
              className="w-9 h-9 flex items-center justify-center text-claude-secondary hover:text-claude-text rounded-lg hover:bg-claude-hover transition-colors"
            >
              <DownloadIcon />
            </button>
            <button
              title="Shannon — Pro plan"
              className="w-9 h-9 flex items-center justify-center"
            >
              <div className="w-8 h-8 rounded-full bg-claude-text flex items-center justify-center">
                <span className="text-sm font-semibold text-white">S</span>
              </div>
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
