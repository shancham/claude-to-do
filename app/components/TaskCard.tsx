'use client'

import { Task, TaskStatus, useTaskStore } from '../../store/taskStore'

function formatDueDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const diffMs = date.getTime() - now.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Due today'
  if (diffDays === 1) return 'Due tomorrow'
  if (diffDays === -1) return 'Due yesterday'
  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`
  if (diffDays < 7) return `Due in ${diffDays}d`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const STATUS_CONFIG: Record<TaskStatus, { label: string; className: string }> = {
  todo: {
    label: 'To do',
    className: 'text-claude-secondary border border-claude-border bg-transparent',
  },
  'in-progress': {
    label: 'In progress',
    className: 'text-claude-accent border border-claude-accent/30 bg-claude-accent/8',
  },
  done: {
    label: 'Done',
    className: 'text-green-700 border border-green-600/25 bg-green-500/8',
  },
}

const STATUS_DOT_CONFIG: Record<
  TaskStatus,
  { active: string; hover: string; inactive: string }
> = {
  todo: {
    active: 'bg-claude-secondary border-claude-secondary',
    hover: 'hover:border-claude-secondary',
    inactive: 'bg-transparent border-claude-border',
  },
  'in-progress': {
    active: 'bg-claude-accent border-claude-accent',
    hover: 'hover:border-claude-accent',
    inactive: 'bg-transparent border-claude-border',
  },
  done: {
    active: 'bg-green-500 border-green-500',
    hover: 'hover:border-green-500',
    inactive: 'bg-transparent border-claude-border',
  },
}

interface TaskCardProps {
  task: Task
}

export default function TaskCard({ task }: TaskCardProps) {
  const { projects, selectedTaskId, setSelectedTask, updateTaskStatus } = useTaskStore()
  const project = projects.find((p) => p.id === task.projectId)
  const isSelected = selectedTaskId === task.id
  const isDone = task.status === 'done'
  const isOverdue =
    !isDone && new Date(task.dueDate + 'T00:00:00') < new Date(new Date().setHours(0, 0, 0, 0))

  const statusConfig = STATUS_CONFIG[task.status]

  return (
    <div
      className={`group relative rounded-lg border p-3.5 cursor-pointer transition-colors ${
        isSelected
          ? 'border-claude-accent/40 bg-claude-hover'
          : 'border-claude-border bg-claude-surface hover:bg-claude-hover'
      } ${isDone ? 'opacity-50' : ''}`}
      onClick={() => setSelectedTask(isSelected ? null : task.id)}
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <h3
          className={`text-sm font-medium text-claude-text leading-snug ${
            isDone ? 'line-through text-claude-secondary' : ''
          }`}
        >
          {task.title}
        </h3>

        {/* Status quick-toggle dots — visible on hover */}
        <div
          className="hidden group-hover:flex items-center gap-1.5 shrink-0 mt-0.5"
          onClick={(e) => e.stopPropagation()}
          title="Change status"
        >
          {(['todo', 'in-progress', 'done'] as TaskStatus[]).map((s) => {
            const dotConfig = STATUS_DOT_CONFIG[s]
            const isCurrentStatus = task.status === s
            return (
              <button
                key={s}
                onClick={() => updateTaskStatus(task.id, s)}
                title={STATUS_CONFIG[s].label}
                className={`w-2.5 h-2.5 rounded-full border-2 transition-all ${
                  isCurrentStatus
                    ? dotConfig.active
                    : `${dotConfig.inactive} ${dotConfig.hover}`
                }`}
              />
            )
          })}
        </div>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-2 flex-wrap">
        {project && (
          <span
            className="inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              backgroundColor: `${project.color}18`,
              color: project.color,
            }}
          >
            {project.name}
          </span>
        )}

        <span
          className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full ${statusConfig.className}`}
        >
          {statusConfig.label}
        </span>

        {task.dueDate && (
          <span
            className={`text-xs ${
              isOverdue ? 'text-red-600' : 'text-claude-secondary'
            }`}
          >
            {formatDueDate(task.dueDate)}
          </span>
        )}
      </div>

      {/* Summary */}
      <p className="text-xs text-claude-secondary mt-2 line-clamp-1 leading-relaxed">
        {task.summary}
      </p>
    </div>
  )
}
