'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TopNav from '../components/TopNav'
import Sidebar from '../components/Sidebar'
import { useTaskStore } from '../../store/taskStore'

// ─── Config ───────────────────────────────────────────────────────────────────

const PROJECT_ID = 'foodie' // Cowork

const RECENT_CHATS = [
  { id: 1, title: 'Cowork research strategy session', time: '2 hours ago' },
  { id: 2, title: 'New user onboarding UX review', time: '1 day ago' },
  { id: 3, title: 'Cowork feature planning', time: '3 days ago' },
]

// ─── Icons ────────────────────────────────────────────────────────────────────

function BackArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path d="M9.5 3L5 7.5L9.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="3" cy="8" r="1.25" fill="currentColor" />
      <circle cx="8" cy="8" r="1.25" fill="currentColor" />
      <circle cx="13" cy="8" r="1.25" fill="currentColor" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 2L9.5 6H14L10.5 8.5L12 12.5L8 10L4 12.5L5.5 8.5L2 6H6.5L8 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function ExternalTaskIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M5.5 2.5H3C2.17 2.5 1.5 3.17 1.5 4V11C1.5 11.83 2.17 12.5 3 12.5H10C10.83 12.5 11.5 11.83 11.5 11V8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.5 1.5H12.5V5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.5 1.5L6.5 7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <rect x="2" y="5.5" width="8" height="5.5" rx="1.25" stroke="currentColor" strokeWidth="1.1" />
      <path d="M4 5.5V3.5C4 2.4 4.9 1.5 6 1.5C7.1 1.5 8 2.4 8 3.5V5.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}

function MicIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <rect x="5" y="1" width="5" height="8" rx="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2.5 7.5C2.5 10.26 4.74 12.5 7.5 12.5C10.26 12.5 12.5 10.26 12.5 7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M7.5 12.5V14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function ChevronDownSmallIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDueDate(dateStr: string): { text: string; overdue: boolean } {
  const date = new Date(dateStr + 'T00:00:00')
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const diffDays = Math.round((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  const overdue = diffDays < 0
  let text: string
  if (diffDays === 0) text = 'Due today'
  else if (diffDays === 1) text = 'Due tomorrow'
  else if (diffDays < 0) text = `${Math.abs(diffDays)}d overdue`
  else if (diffDays < 7) text = `Due in ${diffDays}d`
  else text = `Due ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
  return { text, overdue }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProjectsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()
  const { tasks, projects, setSelectedTask, setProjectFilter } = useTaskStore()

  const project = projects.find((p) => p.id === PROJECT_ID)

  const openTasks = tasks
    .filter((t) => t.projectId === PROJECT_ID && t.status !== 'done')
    .slice(0, 3)

  function handleTaskClick(taskId: string) {
    setSelectedTask(taskId)
    router.push('/tasks')
  }

  function handleViewAllTasks() {
    setProjectFilter(PROJECT_ID)
    router.push('/tasks')
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans bg-claude-bg">
      <TopNav sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((v) => !v)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} activeItem="Projects" />

        <main className="flex-1 overflow-y-auto bg-claude-bg">
          <div className="max-w-[740px] mx-auto px-10 py-8">

            {/* Back link */}
            <button className="flex items-center gap-1.5 text-sm text-[#999] hover:text-claude-text transition-colors mb-8">
              <BackArrowIcon />
              All projects
            </button>

            {/* Project header */}
            <div className="flex items-start justify-between mb-7">
              <div className="flex-1 min-w-0 pr-4">
                <h1 className="text-[30px] font-bold text-claude-text tracking-tight leading-tight mb-2">
                  {project?.name ?? 'Project'}
                </h1>
                <p className="text-sm text-[#999] leading-relaxed">
                  Team collaboration, shared reviews, and active workflows.
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0 mt-1">
                <button className="p-1.5 rounded-md text-[#bbb] hover:text-[#888] hover:bg-gray-100 transition-colors" aria-label="More options">
                  <DotsIcon />
                </button>
                <button className="p-1.5 rounded-md text-[#bbb] hover:text-[#888] hover:bg-gray-100 transition-colors" aria-label="Star project">
                  <StarIcon />
                </button>
                <button className="text-sm font-medium text-claude-text border border-gray-200 rounded-lg px-4 py-1.5 hover:bg-gray-50 transition-colors ml-1">
                  Share
                </button>
              </div>
            </div>

            {/* Chat input */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden mb-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] bg-claude-surface">
              <input
                type="text"
                disabled
                placeholder="How can I help you today?"
                className="w-full bg-transparent text-claude-text text-sm px-5 pt-4 pb-3 placeholder:text-[#bbb] outline-none cursor-not-allowed"
              />
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100">
                <button disabled className="p-1.5 rounded-lg text-[#ccc] cursor-not-allowed" aria-label="Attach">
                  <PlusIcon />
                </button>
                <div className="flex items-center gap-2">
                  <button disabled className="flex items-center gap-1 text-xs text-[#bbb] cursor-not-allowed px-2 py-1 rounded-md">
                    Sonnet 4.6
                    <ChevronDownSmallIcon />
                  </button>
                  <button disabled className="p-1.5 rounded-lg text-[#ccc] cursor-not-allowed" aria-label="Voice input">
                    <MicIcon />
                  </button>
                </div>
              </div>
            </div>

            {/* Start a task */}
            <div className="border-b border-gray-100 pb-5 mb-0">
              <button
                onClick={handleViewAllTasks}
                className="flex items-center gap-2 text-sm text-[#999] hover:text-claude-text transition-colors"
              >
                <ExternalTaskIcon />
                Start a task in {project?.name}
              </button>
            </div>

            {/* Tasks section */}
            {openTasks.length > 0 && (
              <section className="py-5 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-claude-text">Tasks</h2>
                  <button
                    onClick={handleViewAllTasks}
                    className="flex items-center gap-1 text-xs text-[#999] hover:text-claude-text transition-colors"
                  >
                    View all tasks
                    <ArrowRightIcon />
                  </button>
                </div>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  {openTasks.map((task, i) => {
                    const { text: dueText, overdue } = task.dueDate
                      ? formatDueDate(task.dueDate)
                      : { text: '', overdue: false }
                    return (
                      <button
                        key={task.id}
                        onClick={() => handleTaskClick(task.id)}
                        className={`w-full text-left px-4 py-3.5 hover:bg-gray-50 transition-colors flex items-center justify-between gap-4 group ${
                          i < openTasks.length - 1 ? 'border-b border-gray-100' : ''
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-claude-text leading-snug truncate group-hover:text-claude-accent transition-colors">
                            {task.title}
                          </p>
                          <p className="text-xs text-[#aaa] mt-0.5">
                            <span style={task.status === 'in-progress' ? { color: '#697955' } : undefined}>
                              {task.status === 'in-progress' ? 'In progress' : 'To do'}
                            </span>
                            {task.priority === 'high' && (
                              <span style={{ color: '#D97757' }}> · High priority</span>
                            )}
                          </p>
                        </div>
                        {task.dueDate && (
                          <span className="text-xs shrink-0" style={{ color: overdue ? '#D97757' : '#aaa' }}>
                            {dueText}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Recent chats */}
            <section className="mb-8">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-claude-text">Chats</h2>
              </div>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                {RECENT_CHATS.map((chat, i) => (
                  <button
                    key={chat.id}
                    onClick={() => router.push('/chat')}
                    className={`w-full text-left px-4 py-3.5 hover:bg-gray-50 transition-colors flex items-start justify-between gap-4 ${
                      i < RECENT_CHATS.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium text-claude-text">{chat.title}</p>
                      <p className="text-xs text-[#aaa] mt-0.5">Last message {chat.time}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Memory */}
            <section className="mb-3">
              <div className="border border-gray-200 rounded-xl px-5 py-4 bg-gray-50">
                <div className="flex items-center justify-between mb-1.5">
                  <h2 className="text-sm font-semibold text-claude-text">Memory</h2>
                  <span className="flex items-center gap-1 text-xs text-[#aaa]">
                    <LockIcon />
                    Only you
                  </span>
                </div>
                <p className="text-sm text-[#aaa]">
                  Project memory will show here after a few chats.
                </p>
              </div>
            </section>

            {/* Instructions */}
            <section className="mb-10">
              <div className="border border-gray-200 rounded-xl px-5 py-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-claude-text">Instructions</h2>
                  <button className="p-1 rounded text-[#bbb] hover:text-[#888] transition-colors" aria-label="Add instructions">
                    <PlusIcon />
                  </button>
                </div>
                <p className="text-sm text-[#aaa] mt-1">
                  Add instructions to tailor Claude&apos;s responses
                </p>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  )
}
