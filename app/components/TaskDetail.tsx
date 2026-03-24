'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Task, TaskStatus, useTaskStore } from '../../store/taskStore'
import ChatPanel from './ChatPanel'

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To do' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
]

const SNOOZE_OPTIONS = [
  { label: '1 day', days: 1 },
  { label: '1 week', days: 7 },
  { label: '1 month', days: 30 },
]

function BackArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path d="M9.5 3L5 7.5L9.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChatLinkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M1.5 3C1.5 2.17 2.17 1.5 3 1.5H10C10.83 1.5 11.5 2.17 11.5 3V8C11.5 8.83 10.83 9.5 10 9.5H5L1.5 12V3Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

function ClaudeAsteriskIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 1L8.5 5.5L13 7L8.5 8.5L7 13L5.5 8.5L1 7L5.5 5.5L7 1Z" fill="#cc785c" />
    </svg>
  )
}

function DotsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="2.5" cy="7" r="1.25" fill="currentColor" />
      <circle cx="7" cy="7" r="1.25" fill="currentColor" />
      <circle cx="11.5" cy="7" r="1.25" fill="currentColor" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M6.5 1C4.57 1 3 2.57 3 4.5V7.5L1.5 9V9.75H11.5V9L10 7.5V4.5C10 2.57 8.43 1 6.5 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" fill="none" />
      <path d="M5.25 10.5C5.25 11.19 5.81 11.75 6.5 11.75C7.19 11.75 7.75 11.19 7.75 10.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
    </svg>
  )
}

interface TaskDetailProps {
  task: Task
}

export default function TaskDetail({ task }: TaskDetailProps) {
  const { projects, updateTaskStatus, updateTaskTitle, setReminder, deleteTask, addTask, setSelectedTask } =
    useTaskStore()
  const router = useRouter()

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [draftTitle, setDraftTitle] = useState(task.title)
  const [moreActionsOpen, setMoreActionsOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(true)
  const moreActionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.innerWidth < 768) setChatOpen(false)
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreActionsRef.current && !moreActionsRef.current.contains(e.target as Node)) {
        setMoreActionsOpen(false)
      }
    }
    if (moreActionsOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [moreActionsOpen])

  const project = projects.find((p) => p.id === task.projectId)

  const handleTitleSave = () => {
    const trimmed = draftTitle.trim()
    if (trimmed && trimmed !== task.title) {
      updateTaskTitle(task.id, trimmed)
    } else {
      setDraftTitle(task.title)
    }
    setIsEditingTitle(false)
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleTitleSave()
    if (e.key === 'Escape') {
      setDraftTitle(task.title)
      setIsEditingTitle(false)
    }
  }

  function handleSnooze(days: number) {
    const base = task.reminder ? new Date(task.reminder) : new Date()
    base.setDate(base.getDate() + days)
    setReminder(task.id, base.toISOString().slice(0, 16))
  }

  function handleAddReminder() {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(9, 0, 0, 0)
    setReminder(task.id, tomorrow.toISOString().slice(0, 16))
  }

  return (
    <div className="flex flex-1 h-full animate-slide-in-right overflow-hidden">
      {/* Left panel — task info */}
      <div className={`shrink-0 flex flex-col h-full border-r border-claude-border bg-claude-surface ${chatOpen ? 'hidden md:flex md:w-[55%]' : 'w-full'}`}>
        {/* Back navigation */}
        <div className="px-5 py-4 border-b border-claude-border shrink-0 flex items-center justify-between">
          <button
            onClick={() => setSelectedTask(null)}
            className="flex items-center gap-1.5 text-sm text-claude-secondary hover:text-claude-text transition-colors"
          >
            <BackArrowIcon />
            All tasks
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setChatOpen((v) => !v)}
              className={`flex items-center gap-1.5 text-xs border rounded-full px-3 py-1.5 transition-colors ${
                chatOpen
                  ? 'text-claude-accent border-claude-accent/30 bg-claude-accent/8 hover:bg-claude-accent/15'
                  : 'text-claude-secondary border-claude-border hover:text-claude-text hover:border-claude-text/30'
              }`}
            >
              <ChatLinkIcon />
              {chatOpen ? 'Hide chat' : 'Chat about this task'}
            </button>
            {task.sourceChatTitle && (
              <button
                title="Go to source conversation"
                className="hidden sm:flex items-center gap-1.5 text-xs text-claude-secondary hover:text-claude-text border border-claude-border hover:border-claude-text/30 rounded-full px-3 py-1.5 transition-colors"
              >
                <ChatLinkIcon />
                Go to original chat
              </button>
            )}

            <div className="relative" ref={moreActionsRef}>
              <button
                onClick={() => setMoreActionsOpen((v) => !v)}
                className={`p-1.5 rounded-md border transition-colors ${moreActionsOpen ? 'border-claude-text/30 text-claude-text bg-claude-hover' : 'border-claude-border text-claude-secondary hover:text-claude-text hover:border-claude-text/30'}`}
                aria-label="More actions"
              >
                <DotsIcon />
              </button>
              {moreActionsOpen && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-claude-border rounded-lg shadow-md overflow-hidden z-10">
                  <button
                    onClick={() => {
                      const { id, ...rest } = task
                      addTask({ ...rest, title: `${task.title} (copy)` })
                      setMoreActionsOpen(false)
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-sm text-claude-text hover:bg-claude-hover transition-colors"
                  >
                    Duplicate task
                  </button>
                  <button
                    onClick={() => {
                      deleteTask(task.id)
                      setMoreActionsOpen(false)
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-sm hover:bg-claude-hover transition-colors"
                    style={{ color: '#D97757' }}
                  >
                    Delete task
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 px-5 py-5 flex flex-col gap-5 overflow-y-auto">
          {/* Title */}
          <div>
            {isEditingTitle ? (
              <input
                autoFocus
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={handleTitleKeyDown}
                className="text-base font-semibold text-claude-text bg-transparent border-b border-claude-accent outline-none w-full pb-0.5 leading-snug"
              />
            ) : (
              <h2
                onClick={() => {
                  setDraftTitle(task.title)
                  setIsEditingTitle(true)
                }}
                title="Click to edit"
                className="text-base font-semibold text-claude-text leading-snug cursor-text hover:text-claude-accent transition-colors"
              >
                {task.title}
              </h2>
            )}
          </div>

          {/* Cowork suggestion */}
          {task.coworkSuggested && (
            <div className="flex items-center justify-between gap-3 bg-claude-accent/6 border border-claude-accent/20 rounded-lg px-3 py-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className="shrink-0"><ClaudeAsteriskIcon /></span>
                <p className="text-xs text-claude-secondary leading-snug">
                  Claude thinks this is a good fit for Cowork
                </p>
              </div>
              <button
                onClick={() => router.push('/projects')}
                className="text-xs font-medium text-claude-accent border border-claude-accent/30 bg-white rounded-md px-2.5 py-1.5 hover:bg-claude-accent/8 transition-colors shrink-0 whitespace-nowrap"
              >
                Start task in Cowork
              </button>
            </div>
          )}

          {/* Project + Status row */}
          <div className="grid grid-cols-2 gap-4">
            {project && (
              <div>
                <label className="text-[10px] font-semibold text-claude-secondary uppercase tracking-widest block mb-1.5">
                  Project
                </label>
                <span
                  className="inline-flex items-center text-sm px-2.5 py-1 rounded-full font-medium border"
                  style={{ backgroundColor: `${project.color}15`, color: project.color, borderColor: `${project.color}40` }}
                >
                  {project.name}
                </span>
              </div>
            )}

            <div>
              <label className="text-[10px] font-semibold text-claude-secondary uppercase tracking-widest block mb-1.5">
                Status
              </label>
              <select
                value={task.status}
                onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                className="bg-claude-bg border border-claude-border text-claude-text text-sm rounded-md px-3 py-1.5 outline-none focus:border-claude-accent w-full transition-colors cursor-pointer"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due date */}
          <div>
            <label className="text-[10px] font-semibold text-claude-secondary uppercase tracking-widest block mb-1.5">
              Due date
            </label>
            <input
              type="date"
              defaultValue={task.dueDate}
              className="bg-claude-bg border border-claude-border text-claude-text text-sm rounded-md px-3 py-1.5 outline-none focus:border-claude-accent w-full transition-colors"
            />
          </div>

          {/* Reminder */}
          <div>
            <label className="text-[10px] font-semibold text-claude-secondary uppercase tracking-widest block mb-1.5">
              <span className="inline-flex items-center gap-1.5">
                <BellIcon />
                Reminder
              </span>
            </label>
            {task.reminder ? (
              <div className="space-y-2">
                <input
                  type="datetime-local"
                  value={task.reminder}
                  onChange={(e) => setReminder(task.id, e.target.value)}
                  className="bg-claude-bg border border-claude-border text-claude-text text-sm rounded-md px-3 py-1.5 outline-none focus:border-claude-accent w-full transition-colors"
                />
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-claude-secondary">Snooze:</span>
                  {SNOOZE_OPTIONS.map(({ label, days }) => (
                    <button
                      key={label}
                      onClick={() => handleSnooze(days)}
                      className="text-xs px-2.5 py-1 rounded-full border border-claude-border text-claude-secondary hover:text-claude-text hover:border-claude-text/30 transition-colors"
                    >
                      +{label}
                    </button>
                  ))}
                  <button
                    onClick={() => setReminder(task.id, undefined)}
                    className="ml-auto text-xs text-red-500/60 hover:text-red-500 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleAddReminder}
                className="flex items-center gap-1.5 text-sm text-claude-secondary hover:text-claude-text border border-dashed border-claude-border hover:border-claude-text/30 rounded-md px-3 py-2 transition-colors w-full"
              >
                <span className="text-base leading-none">+</span>
                Add reminder
              </button>
            )}
          </div>

          {/* Claude's summary */}
          <div>
            <label className="text-[10px] font-semibold text-claude-secondary uppercase tracking-widest block mb-1.5">
              Claude&apos;s summary
            </label>
            <div className="text-sm text-claude-text bg-claude-bg rounded-md px-3 py-2.5 border border-claude-border leading-relaxed space-y-2">
              {task.summary.split('\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          {/* Source context */}
          <div>
            <label className="text-[10px] font-semibold text-claude-secondary uppercase tracking-widest block mb-1.5">
              From conversation
            </label>
            <p className="text-sm text-claude-secondary italic bg-claude-bg rounded-md px-3 py-2.5 border border-claude-border leading-relaxed">
              {task.sourceContext}
            </p>
          </div>
        </div>

      </div>

      {/* Right panel — chat (~45%) */}
      {chatOpen && <ChatPanel task={task} onClose={() => setChatOpen(false)} />}
    </div>
  )
}
