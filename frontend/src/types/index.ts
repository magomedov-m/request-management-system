export interface RequestOut {
  id: number
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export interface RequestCreate {
  title: string
  description?: string
}
