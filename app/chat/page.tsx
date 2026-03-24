'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TopNav from '../components/TopNav'
import Sidebar from '../components/Sidebar'
import { useTaskStore } from '../../store/taskStore'

// ─── Types ────────────────────────────────────────────────────────────────────

type MessageRole = 'user' | 'assistant'

interface SuggestedTask {
  id: string
  title: string
  projectId: string
  priority: 'high' | 'medium' | 'low'
}

interface Message {
  id: number
  role: MessageRole
  text: string
  suggestedTasks?: SuggestedTask[]
}

// ─── Mock conversation ────────────────────────────────────────────────────────

const CHAT_MESSAGES: Message[] = [
  {
    id: 1,
    role: 'user',
    text: "Morning — let me catch you up on a few things. We have a landing page launch coming up and I want to make sure we do a copy review before it goes live. Last time there were typos all over the pricing page. And the onboarding wireframes need a full redesign — we're losing people at step 3.",
  },
  {
    id: 2,
    role: 'assistant',
    text: "Got it — I've identified two action items from that.\n\nThe copy review sounds time-sensitive with the launch approaching. Want to start there, or work through the onboarding redesign first?",
    suggestedTasks: [
      { id: 't1', title: 'Copy review before Webflow push', projectId: 'general', priority: 'medium' },
      { id: 't2', title: 'Onboarding flow wireframes v2', projectId: 'general', priority: 'high' },
    ],
  },
  {
    id: 3,
    role: 'user',
    text: "Actually there's something more urgent — the pagination on our recipe search results breaks after page 3 whenever the cuisine filter is applied. It just loops back to page 1.",
  },
  {
    id: 4,
    role: 'assistant',
    text: "That's a blocking bug — looks high priority, and it's already past its due date.\n\nIf you can share the recipe search component or tell me where the filter state lives, I can help track down the root cause now.",
    suggestedTasks: [
      { id: 't4', title: 'Pagination bug on recipe search results', projectId: 'foodie', priority: 'high' },
    ],
  },
]

// ─── Icons ────────────────────────────────────────────────────────────────────

function ClaudeAvatar() {
  return (
    <div className="w-7 h-7 rounded-full bg-claude-accent/15 border border-claude-accent/30 flex items-center justify-center shrink-0">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <circle cx="7" cy="7" r="6.5" stroke="#cc785c" strokeWidth="0.75" fill="none" />
        <path d="M7 2.5L8.1 5.9L11.5 7L8.1 8.1L7 11.5L5.9 8.1L2.5 7L5.9 5.9L7 2.5Z" fill="#cc785c" />
      </svg>
    </div>
  )
}

function ClaudeAsterisk() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M11 2L13 8.5L19.5 11L13 13.5L11 20L9 13.5L2.5 11L9 8.5L11 2Z" fill="#cc785c" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M2.5 4.5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ArtifactIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="1.5" y="1.5" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4 5h6M4 7.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M5 7L9.5 3M9.5 3H6.5M9.5 3V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 5H3C2.45 5 2 5.45 2 6V11C2 11.55 2.45 12 3 12H10C10.55 12 11 11.55 11 11V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2 10V3C2 2.45 2.45 2 3 2H10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function ThumbUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M5 13V7.5L7 2H8C8.55 2 9 2.45 9 3V6H12C12.55 6 13 6.45 13 7L12 12C11.85 12.55 11.35 13 10.8 13H5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M3 13H1.5V7.5H3V13Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  )
}

function ThumbDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M5 1V6.5L7 12H8C8.55 12 9 11.55 9 11V8H12C12.55 8 13 7.55 13 7L12 2C11.85 1.45 11.35 1 10.8 1H5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M3 1H1.5V6.5H3V1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  )
}

function RetryIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7C2 4.24 4.24 2 7 2C8.65 2 10.1 2.8 11 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M12 7C12 9.76 9.76 12 7 12C5.35 12 3.9 11.2 3 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M11 1.5V4.5H8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 9.5V12.5H6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CircleCheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5.5 8L7 9.5L10.5 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
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

function formatRailDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return `${d.getMonth() + 1}/${d.getDate()}/${String(d.getFullYear()).slice(2)}`
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [confirmedTaskIds, setConfirmedTaskIds] = useState<Set<string>>(new Set())
  const router = useRouter()
  const { tasks, projects, setSelectedTask } = useTaskStore()

  const railTasks = [...confirmedTaskIds]
    .map((id) => tasks.find((t) => t.id === id))
    .filter(Boolean) as typeof tasks

  function handleConfirmTask(taskId: string) {
    setConfirmedTaskIds((prev) => new Set([...prev, taskId]))
  }

  function handleTaskClick(taskId: string) {
    setSelectedTask(taskId)
    router.push('/tasks')
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans bg-claude-bg">
      <TopNav sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((v) => !v)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} activeItem="Chats" />

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden">

          {/* Chat area */}
          <div className="flex flex-col flex-1 overflow-hidden border-r border-claude-border">

            {/* Chat header */}
            <div className="flex items-center justify-between px-6 py-3.5 border-b border-claude-border shrink-0">
              <button className="flex items-center gap-1.5 text-sm font-medium text-claude-text hover:text-claude-accent transition-colors">
                Sample chat
                <ChevronDownIcon />
              </button>
              <div className="flex items-center gap-1">
                <button
                  className="p-1.5 rounded-md text-claude-secondary/60 hover:text-claude-secondary hover:bg-claude-hover transition-colors"
                  aria-label="Artifact"
                >
                  <ArtifactIcon />
                </button>
                <button
                  className="p-1.5 rounded-md text-claude-secondary/60 hover:text-claude-secondary hover:bg-claude-hover transition-colors"
                  aria-label="Share"
                >
                  <ShareIcon />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {CHAT_MESSAGES.map((msg, i) => {
                const isLast = i === CHAT_MESSAGES.length - 1
                if (msg.role === 'user') {
                  return (
                    <div key={msg.id} className="flex justify-end">
                      <div className="max-w-[520px] bg-[#f0ede8] rounded-2xl rounded-tr-sm px-4 py-3">
                        <p className="text-sm text-claude-text leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  )
                }
                return (
                  <div key={msg.id} className="flex flex-col gap-2">
                    <div className="max-w-[520px]">
                        <div className="space-y-2">
                          {msg.text.split('\n\n').map((para, pi) => (
                            <p key={pi} className="text-sm text-claude-text leading-relaxed">
                              {para}
                            </p>
                          ))}
                        </div>
                        {msg.suggestedTasks && msg.suggestedTasks.length > 0 && (
                          <div className="mt-3 space-y-2 max-w-[340px]">
                            {msg.suggestedTasks.map((suggested) => {
                              const project = projects.find((p) => p.id === suggested.projectId)
                              const confirmed = confirmedTaskIds.has(suggested.id)
                              return (
                                <div
                                  key={suggested.id}
                                  className="flex items-center justify-between gap-3 bg-claude-surface border border-claude-border rounded-lg px-3 py-2.5"
                                >
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-claude-text leading-snug truncate">
                                      {suggested.title}
                                    </p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                      {project && project.id !== 'general' && (
                                        <span
                                          className="text-xs font-medium"
                                          style={{ color: project.color }}
                                        >
                                          {project.name}
                                        </span>
                                      )}
                                      <span className="text-xs text-claude-secondary capitalize">
                                        {suggested.priority} priority
                                      </span>
                                    </div>
                                  </div>
                                  {confirmed ? (
                                    <span className="text-xs text-green-700 flex items-center gap-1 shrink-0 font-medium">
                                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                      Added
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => handleConfirmTask(suggested.id)}
                                      className="text-xs font-medium text-claude-accent border border-claude-accent/30 bg-claude-accent/8 rounded-md px-2.5 py-1 hover:bg-claude-accent/15 transition-colors shrink-0"
                                    >
                                      Add task
                                    </button>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                    </div>

                    {/* Feedback row — only on last assistant message */}
                    {isLast && (
                      <div className="flex items-center gap-0.5">
                        {[
                          { Icon: CopyIcon, label: 'Copy' },
                          { Icon: ThumbUpIcon, label: 'Good response' },
                          { Icon: ThumbDownIcon, label: 'Bad response' },
                          { Icon: RetryIcon, label: 'Retry' },
                        ].map(({ Icon, label }) => (
                          <button
                            key={label}
                            aria-label={label}
                            className="p-1.5 rounded-md text-claude-secondary/40 hover:text-claude-secondary hover:bg-claude-hover transition-colors"
                          >
                            <Icon />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Claude asterisk — bottom of conversation */}
              <div className="ml-1 pt-2">
                <ClaudeAsterisk />
              </div>
            </div>

            {/* Input area */}
            <div className="px-5 py-4 shrink-0">
              <div className="bg-claude-surface border border-claude-border rounded-2xl overflow-hidden">
                <input
                  type="text"
                  disabled
                  placeholder="Reply..."
                  className="w-full bg-transparent text-claude-text text-sm px-4 pt-3.5 pb-2.5 placeholder:text-claude-secondary/50 outline-none cursor-not-allowed"
                />
                <div className="flex items-center justify-between px-3 py-2.5 border-t border-claude-border/50">
                  <button
                    disabled
                    className="p-1.5 rounded-lg text-claude-secondary/40 cursor-not-allowed"
                    aria-label="More options"
                  >
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                      <path d="M7.5 2.5V12.5M2.5 7.5H12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      disabled
                      className="flex items-center gap-1 text-xs text-claude-secondary/50 cursor-not-allowed px-2 py-1 rounded-md"
                    >
                      Sonnet 4.6
                      <ChevronDownSmallIcon />
                    </button>
                    <button
                      disabled
                      className="p-1.5 rounded-lg text-claude-secondary/40 cursor-not-allowed"
                      aria-label="Voice input"
                    >
                      <MicIcon />
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-claude-secondary/40 mt-2 text-center">
                Claude can make mistakes. Please double-check responses.
              </p>
            </div>
          </div>

          {/* Right rail */}
          <div className="w-[300px] shrink-0 flex flex-col overflow-y-auto bg-claude-bg">

            {/* Artifacts section */}
            <div className="px-4 pt-5 pb-4 border-b border-claude-border">
              <p className="text-xs font-semibold text-claude-text mb-3">Artifacts</p>
              <div className="bg-claude-surface border border-claude-border rounded-lg p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-claude-bg border border-claude-border flex items-center justify-center shrink-0 text-claude-secondary/60">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 2h7l3 3v9H3V2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                    <path d="M10 2v4h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 8.5h5M6 11h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-claude-text leading-tight">Sample file</p>
                  <p className="text-xs text-claude-secondary mt-0.5">Code · HTML</p>
                </div>
                <button className="text-claude-secondary/50 hover:text-claude-secondary transition-colors p-1 rounded shrink-0">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                    <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
                    <rect x="7" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
                    <rect x="1" y="7" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
                    <rect x="7" y="7" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Tasks section */}
            <div className="px-4 pt-4 pb-5">
              <p className="text-xs font-semibold text-claude-text mb-3">Tasks</p>
              <div className="space-y-2">
                {railTasks.map((task) => {
                  const project = projects.find((p) => p.id === task.projectId)
                  return (
                    <button
                      key={task.id}
                      onClick={() => handleTaskClick(task.id)}
                      className="w-full text-left bg-claude-surface border border-claude-border rounded-lg px-3 py-2.5 hover:border-claude-accent/40 hover:bg-claude-hover transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-claude-text leading-snug group-hover:text-claude-accent transition-colors">
                          {task.title}
                        </p>
                        <span className="text-claude-secondary/50 group-hover:text-claude-accent/60 transition-colors shrink-0 mt-0.5">
                          <CircleCheckIcon />
                        </span>
                      </div>
                      <p className="text-xs text-claude-secondary mt-1 leading-snug">
                        {project && project.id !== 'general' && (
                          <span
                            className="font-medium mr-1.5"
                            style={{ color: project.color }}
                          >
                            {project.name}
                          </span>
                        )}
                        Priority:{' '}
                        <span className="capitalize">{task.priority}</span>
                        {task.dueDate && ` — Due ${formatRailDate(task.dueDate)}`}
                      </p>
                    </button>
                  )
                })}
              </div>
              {railTasks.length === 0 && (
                <p className="text-[11px] text-claude-secondary/40 mt-1 leading-relaxed">
                  Tasks you confirm will appear here.
                </p>
              )}
              {railTasks.length > 0 && (
                <p className="text-[11px] text-claude-secondary/40 mt-3 leading-relaxed">
                  Tasks confirmed in this conversation. Click to open in task view.
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
