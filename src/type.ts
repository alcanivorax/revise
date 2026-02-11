export interface Revision {
  day: number
  date: string
  done: boolean
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
}
