'use client'

import { useState } from 'react'
import { TaskPriority, TaskStatus, useTaskStore } from '../../store/taskStore'

function CloseIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path
        d="M1 1L12 12M12 1L1 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function NewTaskModal() {
  const { projects, addTask, closeNewTaskModal } = useTaskStore()

  const [title, setTitle] = useState('')
  const [projectId, setProjectId] = useState('general')
  const [status, setStatus] = useState<TaskStatus>('todo')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [dueDate, setDueDate] = useState('')
  const [notes, setNotes] = useState('')

  const handleSave = () => {
    if (!title.trim()) return
    addTask({
      title: title.trim(),
      projectId,
      status,
      priority,
      dueDate: dueDate ? dueDate.split('T')[0] : '',
      summary: notes.trim() || title.trim(),
      sourceContext: '',
      claudeMessage:
        "I'm ready to help with this task. What would you like to work on first?",
      notes,
    })
    closeNewTaskModal()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeNewTaskModal()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      onKeyDown={handleKeyDown}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/55"
        onClick={closeNewTaskModal}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative z-10 bg-claude-surface border border-claude-border rounded-lg w-full max-w-md mx-4">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <h2 className="text-sm font-semibold text-claude-text">New task</h2>
          <button
            onClick={closeNewTaskModal}
            className="text-claude-secondary hover:text-claude-text transition-colors p-1 rounded-md hover:bg-claude-hover"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="px-6 pb-6 flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="text-[10px] font-semibold text-claude-secondary uppercase tracking-widest block mb-1.5">
              Title
            </label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave()
                if (e.key === 'Escape') closeNewTaskModal()
              }}
              placeholder="What needs to be done?"
              className="w-full bg-claude-bg border border-claude-border text-claude-text text-sm rounded-md px-3 py-2 outline-none focus:border-claude-accent placeholder:text-claude-secondary/40 transition-colors"
            />
          </div>

          {/* Project */}
          <div>
            <label className="text-[10px] font-semibold text-claude-secondary uppercase tracking-widest block mb-1.5">
              Project
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full bg-claude-bg border border-claude-border text-claude-text text-sm rounded-md px-3 py-2 outline-none focus:border-claude-accent cursor-pointer transition-colors"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status + Priority row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold text-claude-secondary uppercase tracking-widest block mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full bg-claude-bg border border-claude-border text-claude-text text-sm rounded-md px-3 py-2 outline-none focus:border-claude-accent cursor-pointer transition-colors"
              >
                <option value="todo">To do</option>
                <option value="in-progress">In progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-claude-secondary uppercase tracking-widest block mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full bg-claude-bg border border-claude-border text-claude-text text-sm rounded-md px-3 py-2 outline-none focus:border-claude-accent cursor-pointer transition-colors"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Due date */}
          <div>
            <label className="text-[10px] font-semibold text-claude-secondary uppercase tracking-widest block mb-1.5">
              Due date
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-claude-bg border border-claude-border text-claude-text text-sm rounded-md px-3 py-2 outline-none focus:border-claude-accent transition-colors"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-[10px] font-semibold text-claude-secondary uppercase tracking-widest block mb-1.5">
              Notes{' '}
              <span className="normal-case font-normal text-claude-secondary/60">
                (optional)
              </span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Any additional context…"
              className="w-full bg-claude-bg border border-claude-border text-claude-text text-sm rounded-md px-3 py-2 outline-none focus:border-claude-accent placeholder:text-claude-secondary/40 resize-none transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5 justify-end pt-1">
            <button
              onClick={closeNewTaskModal}
              className="text-sm text-claude-secondary hover:text-claude-text px-4 py-2 rounded-md hover:bg-claude-hover transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className="text-sm bg-claude-accent hover:bg-claude-accent/90 text-white font-medium px-4 py-2 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Add task
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
