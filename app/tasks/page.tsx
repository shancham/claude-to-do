'use client'

import React, { useEffect, useRef, useState } from 'react'
import { TaskPriority, TaskStatus, useTaskStore } from '../../store/taskStore'
import TopNav from '../components/TopNav'
import Sidebar from '../components/Sidebar'
import TaskDetail from '../components/TaskDetail'
import NewTaskModal from '../components/NewTaskModal'
import ToastReminder from '../components/ToastReminder'

const STATUS_CONFIG: Record<TaskStatus, { label: string; className: string; style?: React.CSSProperties }> = {
  todo: { label: 'To do', className: 'text-claude-secondary border border-claude-border' },
  'in-progress': { label: 'In progress', className: 'border', style: { color: '#697955', borderColor: '#69795540', backgroundColor: '#69795515' } },
  done: { label: 'Done', className: 'border', style: { color: '#91918D', borderColor: '#91918D40', backgroundColor: '#91918D15' } },
}

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; className: string; style?: React.CSSProperties }> = {
  high: { label: 'High', className: 'border', style: { color: '#D97757', borderColor: '#D9775740', backgroundColor: '#D9775715' } },
  medium: { label: 'Medium', className: 'border', style: { color: '#D9C357', borderColor: '#D9C35740', backgroundColor: '#D9C35715' } },
  low: { label: 'Low', className: 'text-claude-secondary border border-claude-border' },
}

function formatDueDate(dateStr: string): { text: string; overdue: boolean } {
  const date = new Date(dateStr + 'T00:00:00')
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const diffDays = Math.round((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  const overdue = diffDays < 0
  let text: string
  if (diffDays === 0) text = 'Today'
  else if (diffDays === 1) text = 'Tomorrow'
  else if (diffDays === -1) text = 'Yesterday'
  else if (diffDays < 0) text = `${Math.abs(diffDays)}d overdue`
  else if (diffDays < 7) text = `In ${diffDays}d`
  else text = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return { text, overdue }
}

function DragHandleIcon() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
      <circle cx="4" cy="2.5" r="1.25" fill="currentColor" />
      <circle cx="8" cy="2.5" r="1.25" fill="currentColor" />
      <circle cx="4" cy="7" r="1.25" fill="currentColor" />
      <circle cx="8" cy="7" r="1.25" fill="currentColor" />
      <circle cx="4" cy="11.5" r="1.25" fill="currentColor" />
      <circle cx="8" cy="11.5" r="1.25" fill="currentColor" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  )
}

const STATUS_FILTERS: { label: string; value: TaskStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'To do', value: 'todo' },
  { label: 'In progress', value: 'in-progress' },
  { label: 'Done', value: 'done' },
]

type SortBy = 'priority' | 'due-date' | 'status' | 'manual'

const SORT_OPTIONS: { label: string; value: SortBy }[] = [
  { label: 'Priority', value: 'priority' },
  { label: 'Due date', value: 'due-date' },
  { label: 'Status', value: 'status' },
  { label: 'Manual', value: 'manual' },
]

const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 }
const STATUS_ORDER: Record<string, number> = { 'in-progress': 0, todo: 1, done: 2 }

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sortBy, setSortBy] = useState<SortBy>('priority')
  const [dragId, setDragId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  const prevSelectedIdRef = useRef<string | null>(null)

  const {
    tasks,
    projects,
    selectedTaskId,
    projectFilter,
    statusFilter,
    isNewTaskModalOpen,
    setSelectedTask,
    setProjectFilter,
    setStatusFilter,
    reorderTask,
    openNewTaskModal,
  } = useTaskStore()

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) ?? null

  useEffect(() => {
    if (selectedTaskId && prevSelectedIdRef.current === null) {
      setSidebarOpen(false)
    }
    prevSelectedIdRef.current = selectedTaskId
  }, [selectedTaskId])

  const filteredTasks = tasks.filter((task) => {
    const matchProject = projectFilter === 'all' || task.projectId === projectFilter
    const matchStatus = statusFilter === 'all' || task.status === statusFilter
    const matchSearch =
      !searchQuery || task.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchProject && matchStatus && matchSearch
  })

  const sortedTasks = sortBy === 'manual' ? filteredTasks : [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        return (PRIORITY_ORDER[a.priority] ?? 99) - (PRIORITY_ORDER[b.priority] ?? 99)
      case 'due-date': {
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return a.dueDate.localeCompare(b.dueDate)
      }
      case 'status':
        return (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99)
    }
  })

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans bg-claude-bg">
      <TopNav sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((v) => !v)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} />

        <div className="flex flex-1 overflow-hidden bg-claude-bg">
          {!selectedTask && <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex items-center justify-between px-8 pt-8 pb-5 shrink-0">
              <h1 className="text-2xl font-semibold text-claude-text tracking-tight">Tasks</h1>
              <button
                onClick={openNewTaskModal}
                className="flex items-center gap-1.5 bg-claude-text hover:bg-claude-text/85 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <span className="text-base leading-none">+</span>
                New task
              </button>
            </div>

            <div className="px-8 pb-4 shrink-0">
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-claude-secondary pointer-events-none">
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-claude-surface border border-claude-border rounded-lg text-sm text-claude-text placeholder:text-claude-secondary/60 outline-none focus:border-claude-accent/60 transition-colors"
                />
              </div>
            </div>

            <div className="px-8 pb-4 flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-1 flex-wrap">
                {STATUS_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setStatusFilter(f.value)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      statusFilter === f.value
                        ? 'bg-claude-text text-white border-claude-text'
                        : 'border-claude-border text-claude-secondary hover:text-claude-text hover:border-claude-text/30'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-claude-secondary whitespace-nowrap">Filter by project</span>
                  <select
                    value={projectFilter}
                    onChange={(e) => setProjectFilter(e.target.value)}
                    className="text-xs text-claude-text border border-claude-border bg-claude-surface rounded-full pl-2.5 py-1 outline-none focus:border-claude-accent/60 cursor-pointer transition-colors"
                  >
                    <option value="all">All</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-claude-secondary whitespace-nowrap">Sort by</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                    className="text-xs text-claude-text border border-claude-border bg-claude-surface rounded-full pl-2.5 py-1 outline-none focus:border-claude-accent/60 cursor-pointer transition-colors"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-8 pb-4">
              {sortedTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 gap-2 text-center">
                  <p className="text-sm text-claude-secondary">No tasks found</p>
                  {(searchQuery || projectFilter !== 'all' || statusFilter !== 'all') && (
                    <p className="text-xs text-claude-secondary/60">Try adjusting your filters</p>
                  )}
                </div>
              ) : (
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-claude-border">
                      <th className="w-6 pb-2.5 pr-2" />
                      <th className="text-left text-xs font-medium text-claude-secondary pb-2.5 pr-4 w-28">Project</th>
                      <th className="text-left text-xs font-medium text-claude-secondary pb-2.5 pr-4">Task</th>
                      <th className="text-left text-xs font-medium text-claude-secondary pb-2.5 pr-4 w-28">Status</th>
                      <th className="text-left text-xs font-medium text-claude-secondary pb-2.5 pr-4 w-24">Priority</th>
                      <th className="text-left text-xs font-medium text-claude-secondary pb-2.5 w-28">Due date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTasks.map((task) => {
                      const project = projects.find((p) => p.id === task.projectId)
                      const statusCfg = STATUS_CONFIG[task.status]
                      const priorityCfg = PRIORITY_CONFIG[task.priority]
                      const isDone = task.status === 'done'
                      const { text: dueDateText, overdue } = task.dueDate
                        ? formatDueDate(task.dueDate)
                        : { text: '—', overdue: false }
                      const isDragging = dragId === task.id
                      const isDragOver = dragOverId === task.id

                      return (
                        <tr
                          key={task.id}
                          draggable
                          onDragStart={() => { setDragId(task.id); setSortBy('manual') }}
                          onDragOver={(e) => { e.preventDefault(); setDragOverId(task.id) }}
                          onDrop={() => {
                            if (dragId && dragId !== task.id) reorderTask(dragId, task.id)
                            setDragId(null); setDragOverId(null)
                          }}
                          onDragEnd={() => { setDragId(null); setDragOverId(null) }}
                          onClick={() => setSelectedTask(task.id)}
                          className={`border-b border-claude-border cursor-pointer transition-colors
                            ${isDragging ? 'opacity-40' : ''}
                            ${isDragOver && !isDragging ? 'bg-claude-accent/6 border-t-2 border-t-claude-accent/40' : 'hover:bg-claude-hover'}
                            ${isDone ? 'opacity-50' : ''}
                          `}
                        >
                          <td className="py-3 pr-2 w-6" onClick={(e) => e.stopPropagation()}>
                            <span className="text-claude-secondary/30 hover:text-claude-secondary/60 transition-colors cursor-grab active:cursor-grabbing flex justify-center">
                              <DragHandleIcon />
                            </span>
                          </td>
                          <td className="py-3 pr-4">
                            {project && (
                              <span
                                className="inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap border"
                                style={{ backgroundColor: `${project.color}15`, color: project.color, borderColor: `${project.color}40` }}
                              >
                                {project.name}
                              </span>
                            )}
                          </td>
                          <td className="py-3 pr-4">
                            <p className={`font-medium text-claude-text leading-snug ${isDone ? 'line-through text-claude-secondary' : ''}`}>
                              {task.title}
                            </p>
                            <p className="text-xs text-claude-secondary mt-0.5 leading-snug line-clamp-1">
                              {task.summary}
                            </p>
                          </td>
                          <td className="py-3 pr-4">
                            <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full ${statusCfg.className}`} style={statusCfg.style}>
                              {statusCfg.label}
                            </span>
                          </td>
                          <td className="py-3 pr-4">
                            <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full ${priorityCfg.className}`} style={priorityCfg.style}>
                              {priorityCfg.label}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className={`text-xs ${overdue ? '' : 'text-claude-secondary'}`} style={overdue ? { color: '#D97757' } : undefined}>
                              {dueDateText}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>

            <div className="shrink-0 h-8 flex items-center justify-center border-t border-claude-border">
              <p className="text-xs text-claude-secondary/50">
                Claude Tasks: a feature concept prototype
              </p>
            </div>
          </div>}

          {selectedTask && <TaskDetail key={selectedTask.id} task={selectedTask} />}
        </div>
      </div>

      {isNewTaskModalOpen && <NewTaskModal />}
      <ToastReminder />
    </div>
  )
}
