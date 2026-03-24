import { create } from 'zustand'

export type TaskStatus = 'todo' | 'in-progress' | 'done'
export type TaskPriority = 'high' | 'medium' | 'low'

export interface Project {
  id: string
  name: string
  color: string
}

export interface Task {
  id: string
  title: string
  projectId: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  summary: string
  sourceContext: string
  claudeMessage: string
  sourceChatTitle?: string
  reminder?: string
  notes?: string
  coworkSuggested?: boolean
}

interface TaskStore {
  tasks: Task[]
  projects: Project[]
  selectedTaskId: string | null
  projectFilter: string
  statusFilter: TaskStatus | 'all'
  isNewTaskModalOpen: boolean
  unvisitedItems: string[]

  setSelectedTask: (id: string | null) => void
  setProjectFilter: (filter: string) => void
  setStatusFilter: (filter: TaskStatus | 'all') => void
  updateTaskStatus: (id: string, status: TaskStatus) => void
  updateTaskTitle: (id: string, title: string) => void
  setReminder: (id: string, reminder: string | undefined) => void
  reorderTask: (dragId: string, targetId: string) => void
  addTask: (task: Omit<Task, 'id'>) => void
  deleteTask: (id: string) => void
  openNewTaskModal: () => void
  closeNewTaskModal: () => void
  markItemVisited: (label: string) => void
}

export const useTaskStore = create<TaskStore>((set) => ({
  projects: [
    { id: 'general', name: 'None', color: '#91918D' },
    { id: 'foodie', name: 'Cowork', color: '#697955' },
    { id: 'questlog', name: 'Code', color: '#8E779A' },
    { id: 'chat', name: 'Chat', color: '#D9C357' },
  ],

  tasks: [
    {
      id: 't1',
      title: 'Copy review — claude.ai pricing page',
      projectId: 'general',
      status: 'in-progress',
      priority: 'medium',
      dueDate: '2026-03-22',
      summary: 'Review and tighten UI copy across the pricing page before the next release.',
      sourceContext: '...we should do a pass on the pricing page copy before the release — some of the plan descriptions are still pretty confusing',
      claudeMessage: "I've got the pricing page context ready. Want to start with the plan descriptions, or work top to bottom through the page?",
      sourceChatTitle: 'Claude.ai pricing page launch',
      coworkSuggested: true,
    },
    {
      id: 't2',
      title: 'New user onboarding — v2 wireframes',
      projectId: 'general',
      status: 'todo',
      priority: 'high',
      dueDate: '2026-03-24',
      summary: 'Redesign the onboarding wireframes based on drop-off data and the last usability study.',
      sourceContext: '...the onboarding drop-off is still too high at the API key step — need to redesign that part of the flow before the next sprint',
      claudeMessage: "Ready to work through the v2 onboarding wireframes. Should we start at the API key step where people are dropping off, or map the full happy path first?",
      sourceChatTitle: 'Onboarding UX review',
      coworkSuggested: true,
    },
    {
      id: 't3',
      title: 'User research synthesis — Cowork async flows',
      projectId: 'foodie',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2026-03-23',
      summary: 'Synthesize findings from 8 user interviews on how teams use Cowork for async collaboration.',
      sourceContext: '...we have 8 Cowork interviews to synthesize before the strategy session on Thursday',
      claudeMessage: "I can help synthesize those research findings. Want a thematic analysis, or a highlight reel for Thursday's strategy session?",
      sourceChatTitle: 'Cowork research strategy session',
    },
    {
      id: 't4',
      title: 'Cowork — PRD for shared project templates',
      projectId: 'foodie',
      status: 'todo',
      priority: 'high',
      dueDate: '2026-03-21',
      summary: 'Define requirements for shared project templates so teams can standardize how they start new Cowork projects.',
      sourceContext: '...we need the templates PRD written before the design kickoff next week — the design team needs it to start wireframing',
      claudeMessage: "Happy to help draft the PRD. Should we start with the template types users would need, or work through the creation and sharing flow first?",
      sourceChatTitle: 'Cowork feature planning',
    },
    {
      id: 't5',
      title: 'Code tool — sandbox architecture design doc',
      projectId: 'questlog',
      status: 'todo',
      priority: 'medium',
      dueDate: '2026-03-26',
      summary: 'Write the architecture design doc for the sandboxed code execution environment before sprint planning.',
      sourceContext: '...we need a design doc for the code execution sandbox before sprint planning next week — eng team is blocked on this',
      claudeMessage: "Happy to help draft the architecture doc. Should we start with the execution environment, the security model, or the API spec?",
      sourceChatTitle: 'Code tool sprint planning',
      coworkSuggested: true,
    },
    {
      id: 't6',
      title: 'Code tool beta — internal session notes',
      projectId: 'questlog',
      status: 'done',
      priority: 'low',
      dueDate: '2026-03-19',
      summary: "Compile and clean up notes from the internal beta session before the context goes stale.",
      sourceContext: '...those beta session notes need to be written up while the context is fresh — a lot of good edge cases came up',
      claudeMessage: "Let's get those beta session notes organised. I can structure them into bugs, UX observations, and follow-up action items.",
      sourceChatTitle: 'Code tool beta recap',
    },
    {
      id: 't7',
      title: 'Cowork weekly digest — notification copy A/B',
      projectId: 'foodie',
      status: 'done',
      priority: 'low',
      dueDate: '2026-03-20',
      summary: 'Write two copy variants for the Cowork weekly digest notification to A/B test.',
      sourceContext: '...we should A/B test the digest notification copy — variant B was punchier but we need a proper control to compare against',
      claudeMessage: "I can help draft and compare both notification variants. What's the main action you want users to take from the digest?",
      sourceChatTitle: 'Cowork notification strategy',
    },
    {
      id: 't8',
      title: 'claude.ai — accessibility audit review',
      projectId: 'general',
      status: 'todo',
      priority: 'medium',
      dueDate: '2026-03-22',
      summary: 'Review the automated accessibility audit for claude.ai and put together a prioritized fix plan by severity.',
      sourceContext: '...the accessibility audit came back with 14 items on claude.ai — some look serious, we should go through them before the next release',
      claudeMessage: "I can help you work through the audit. Want to start with the critical WCAG violations, or go component by component?",
      sourceChatTitle: 'claude.ai accessibility review',
      coworkSuggested: true,
    },
  ],

  selectedTaskId: null,
  projectFilter: 'all',
  statusFilter: 'all',
  isNewTaskModalOpen: false,
  unvisitedItems: ['Chats', 'Projects', 'Tasks'],

  setSelectedTask: (id) => set({ selectedTaskId: id }),
  setProjectFilter: (filter) => set({ projectFilter: filter }),
  setStatusFilter: (filter) => set({ statusFilter: filter }),

  updateTaskStatus: (id, status) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
    })),

  updateTaskTitle: (id, title) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, title } : t)),
    })),

  setReminder: (id, reminder) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, reminder } : t)),
    })),

  reorderTask: (dragId, targetId) =>
    set((state) => {
      const tasks = [...state.tasks]
      const di = tasks.findIndex((t) => t.id === dragId)
      const ti = tasks.findIndex((t) => t.id === targetId)
      if (di === -1 || ti === -1 || di === ti) return {}
      tasks.splice(ti, 0, tasks.splice(di, 1)[0])
      return { tasks }
    }),

  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, { ...task, id: `t${Date.now()}` }],
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
      selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId,
    })),

  openNewTaskModal: () => set({ isNewTaskModalOpen: true }),
  closeNewTaskModal: () => set({ isNewTaskModalOpen: false }),
  markItemVisited: (label) =>
    set((state) => ({
      unvisitedItems: state.unvisitedItems.filter((l) => l !== label),
    })),
}))
