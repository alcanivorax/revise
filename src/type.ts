export interface Revision {
  day: number
  date: string
  done: boolean
  completedOn?: string
}

export interface Topic {
  id: string
  title: string
  createdOn: string
  schedule: Revision[]
  completed: boolean
}

export interface Store {
  topics: Topic[]
  history?: HistoryEntry[]
}

export interface DoneHistoryEntry {
  type: 'done'
  topicId: string
  revisionDay: number
  completedBefore: boolean
  date: string
}

export type HistoryEntry = DoneHistoryEntry
