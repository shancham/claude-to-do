'use client'

import { Task } from '../../store/taskStore'


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

interface ChatPanelProps {
  task: Task
  onClose?: () => void
}

export default function ChatPanel({ task, onClose }: ChatPanelProps) {
  return (
    <div className="flex-1 flex flex-col h-full bg-claude-bg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-claude-border shrink-0">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-semibold text-claude-secondary uppercase tracking-widest">
            Task chat
          </p>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded text-claude-secondary/50 hover:text-claude-secondary hover:bg-claude-hover transition-colors"
              aria-label="Collapse panel"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
        <div className="inline-flex items-center gap-2 bg-claude-surface border border-claude-border rounded-full px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-claude-accent shrink-0" />
          <span className="text-xs text-claude-secondary">
            Working on:{' '}
            <span className="text-claude-text font-medium">{task.title}</span>
          </span>
        </div>
      </div>

      {/* Chat history */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {/* Claude's opening message */}
        <div className="max-w-[420px]">
          <div className="bg-claude-surface border border-claude-border rounded-lg px-4 py-3">
            <p className="text-sm text-claude-text leading-relaxed">{task.claudeMessage}</p>
          </div>
          <p className="text-[11px] text-claude-secondary/60 mt-1.5 ml-1">Claude</p>
        </div>

        {/* Empty state hint */}
        <div className="flex items-center justify-center mt-12">
          <p className="text-xs text-claude-secondary/40 text-center max-w-[240px] leading-relaxed">
            Claude has pulled in context from your original conversation. Pick up where you left off.
          </p>
        </div>
      </div>

      {/* Input area — Claude chat style */}
      <div className="px-5 py-4 shrink-0">
        <div className="bg-claude-surface border border-claude-border rounded-2xl overflow-hidden">
          <input
            type="text"
            disabled
            placeholder="Reply..."
            className="w-full bg-transparent text-claude-text text-sm px-4 pt-3.5 pb-2.5 placeholder:text-claude-secondary/50 outline-none cursor-not-allowed"
          />
          <div className="flex items-center justify-end px-3 py-2.5 border-t border-claude-border/50">
            <div className="flex items-center gap-2">
              <button
                disabled
                className="flex items-center gap-1 text-xs text-claude-secondary/50 cursor-not-allowed px-2 py-1 rounded-md hover:bg-claude-hover transition-colors"
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
  )
}
