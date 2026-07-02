export type RequestStatus = "new" | "in_progress" | "done"
export type RequestPriority = "low" | "normal" | "high"

export interface RequestOut {
  id: number
  title: string
  description?: string
  status: RequestStatus
  priority: RequestPriority
  created_at: string
  updated_at: string
}

export interface RequestCreate {
  title: string
  description?: string
  status?: RequestStatus
  priority?: RequestPriority
}
