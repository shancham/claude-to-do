'use client'

import { useEffect, useState } from 'react'
import { useTaskStore } from '../../store/taskStore'

function BellIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path
        d="M7.5 1.5C5.01 1.5 3 3.51 3 6V9.5L1.5 11V11.75H13.5V11L12 9.5V6C12 3.51 9.99 1.5 7.5 1.5Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M6 12.5C6 13.33 6.67 14 7.5 14C8.33 14 9 13.33 9 12.5" stroke="currentColor" strokeWidth="1.25" fill="none" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
      <path
        d="M1 1L10 10M10 1L1 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function ToastReminder() {
  const [visible, setVisible] = useState(false)
  const [dismissing, setDismissing] = useState(false)
  const { tasks, setSelectedTask } = useTaskStore()

  // Use task t4 — due today
  const reminderTask = tasks.find((t) => t.id === 't4')

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 3000)
    return () => clearTimeout(showTimer)
  }, [])

  useEffect(() => {
    if (!visible) return
    const hideTimer = setTimeout(dismiss, 8000)
    return () => clearTimeout(hideTimer)
  }, [visible])

  function dismiss() {
    setDismissing(true)
    setTimeout(() => setVisible(false), 280)
  }

  function handleViewTask() {
    if (reminderTask) {
      setSelectedTask(reminderTask.id)
    }
    dismiss()
  }

  if (!visible || !reminderTask) return null

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-50 w-80 bg-claude-surface border border-claude-border rounded-lg overflow-hidden shadow-2xl ${
        dismissing ? 'animate-fade-out' : 'animate-slide-up'
      }`}
      style={{ borderLeft: '3px solid #cc785c' }}
    >
      <div className="px-4 py-3.5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-claude-accent shrink-0">
              <BellIcon />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-claude-secondary uppercase tracking-widest mb-0.5">
                Reminder
              </p>
              <p className="text-sm text-claude-text font-medium leading-snug line-clamp-2">
                {reminderTask.title}
              </p>
              <p className="text-xs text-claude-secondary mt-0.5">is due today</p>
            </div>
          </div>
          <button
            onClick={dismiss}
            className="text-claude-secondary/60 hover:text-claude-secondary transition-colors p-0.5 shrink-0 mt-0.5"
            aria-label="Dismiss"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Action */}
        <button
          onClick={handleViewTask}
          className="mt-3 w-full text-xs font-medium bg-claude-accent/12 hover:bg-claude-accent/20 text-claude-accent border border-claude-accent/25 rounded-md px-3 py-2 transition-colors text-center"
        >
          View task
        </button>
      </div>
    </div>
  )
}
