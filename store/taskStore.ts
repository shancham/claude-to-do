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
      title: 'Copy review before Webflow push',
      projectId: 'general',
      status: 'in-progress',
      priority: 'medium',
      dueDate: '2026-03-22',
      summary: 'Review all UI copy for tone and consistency before the Webflow site goes live.',
      sourceContext: '...we should probably do a copy review before the Webflow push goes live, last time there were typos on the pricing page',
      claudeMessage: "I've pulled up the copy review context. Want to start with the pricing page, or work top-to-bottom through the site?",
      sourceChatTitle: 'Landing page launch prep',
      coworkSuggested: true,
    },
    {
      id: 't2',
      title: 'Onboarding flow wireframes v2',
      projectId: 'general',
      status: 'todo',
      priority: 'high',
      dueDate: '2026-03-24',
      summary: 'Redesign the onboarding wireframes based on feedback from the last user test.',
      sourceContext: '...the v2 onboarding needs fresh wireframes — the current flow is losing people at step 3',
      claudeMessage: "Ready to work through the v2 onboarding wireframes. Should we map out the happy path first, or tackle the drop-off at step 3?",
      sourceChatTitle: 'Onboarding UX redesign',
      coworkSuggested: true,
    },
    {
      id: 't3',
      title: 'User research synthesis — restaurant discovery',
      projectId: 'foodie',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2026-03-23',
      summary: 'Synthesize findings from 8 user interviews on how people discover new restaurants.',
      sourceContext: '...we have 8 interviews to synthesize before the strategy session on Thursday',
      claudeMessage: "I can help you synthesize those research findings. Want a thematic analysis, or a highlight reel for the strategy session?",
      sourceChatTitle: 'Foodie research strategy session',
    },
    {
      id: 't4',
      title: 'Pagination bug on recipe search results',
      projectId: 'foodie',
      status: 'todo',
      priority: 'high',
      dueDate: '2026-03-21',
      summary: 'Pagination breaks after page 3 when filtering by cuisine type.',
      sourceContext: '...the pagination is definitely broken when you combine it with the cuisine filter — it just loops back to page 1',
      claudeMessage: "Let's track down the pagination issue. Can you share the recipe search component, or tell me where the filter state lives?",
      sourceChatTitle: 'Foodie bug triage',
    },
    {
      id: 't5',
      title: 'Quest system design doc',
      projectId: 'questlog',
      status: 'todo',
      priority: 'medium',
      dueDate: '2026-03-26',
      summary: 'Write the architecture design doc for the quest tracking system before sprint planning.',
      sourceContext: '...we need a design doc for the quest system before sprint planning next week, the eng team is blocked',
      claudeMessage: "Happy to help draft the quest system design doc. Should we start with the data model, the API spec, or the user-facing requirements?",
      sourceChatTitle: 'Questlog sprint planning',
      coworkSuggested: true,
    },
    {
      id: 't6',
      title: 'Playtest session notes — dungeon crawler',
      projectId: 'questlog',
      status: 'done',
      priority: 'low',
      dueDate: '2026-03-19',
      summary: "Compile and clean up notes from last Friday's internal playtest session.",
      sourceContext: '...those playtest notes need to be written up before we lose the context — a lot of good edge cases came up',
      claudeMessage: "Let's get those playtest notes organised. I can help structure them into bug reports, UX observations, and action items.",
      sourceChatTitle: 'Dungeon crawler playtest recap',
    },
    {
      id: 't7',
      title: 'Push notification copy — A/B variants',
      projectId: 'foodie',
      status: 'done',
      priority: 'low',
      dueDate: '2026-03-20',
      summary: 'Write two copy variants for the weekly recipe push notification feature.',
      sourceContext: '...we should A/B test the notification copy, variant B felt more urgent but we need a control',
      claudeMessage: "I can help draft and compare the two notification copy variants. What's the core action you want users to take?",
      sourceChatTitle: 'Foodie notification strategy',
    },
    {
      id: 't8',
      title: 'Accessibility audit triage',
      projectId: 'general',
      status: 'todo',
      priority: 'medium',
      dueDate: '2026-03-22',
      summary: 'Review the automated accessibility audit and prioritise fixes by severity.',
      sourceContext: '...the accessibility audit came back with 14 issues — some look serious, we should go through them',
      claudeMessage: "I can help you triage the accessibility issues. Want to start with the critical WCAG violations, or work through them component by component?",
      sourceChatTitle: 'Accessibility review',
      coworkSuggested: true,
    },
  ],

  selectedTaskId: null,
  projectFilter: 'all',
  statusFilter: 'all',
  isNewTaskModalOpen: false,

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
}))
