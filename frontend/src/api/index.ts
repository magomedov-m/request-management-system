import axios from 'axios'
import type { RequestCreate, RequestOut, RequestPriority } from '../types'

const api = axios.create({
  baseURL: '/api',
})

export interface GetRequestsParams {
  search?: string
  status?: string
  priority?: RequestPriority
  sort_by?: 'created_at' | 'priority'
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface PaginatedResponse {
  items: RequestOut[]
  page: number
  limit: number
  total: number
}

export interface LoginRequest {
  username: string
  password: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

export const login = (data: LoginRequest) =>
  api.post<TokenResponse>('/auth/login', data).then((r) => r.data)

export const getRequests = (params?: GetRequestsParams) => {
  const qs = new URLSearchParams()
  if (params?.search) qs.set('search', params.search)
  if (params?.status) qs.set('status', params.status)
  if (params?.priority) qs.set('priority', params.priority)
  if (params?.sort_by) qs.set('sort_by', params.sort_by)
  if (params?.order) qs.set('order', params.order)
  if (params?.page) qs.set('page', params.page.toString())
  if (params?.limit) qs.set('limit', params.limit.toString())
  return api
    .get<PaginatedResponse>('/requests/' + (qs.toString() ? '?' + qs.toString() : ''))
    .then((r) => r.data)
}

export const createRequest = (data: RequestCreate) =>
  api.post<RequestOut>('/requests/', data).then((r) => r.data)

export const updateStatus = (id: number, status: RequestOut['status']) =>
  api.patch<RequestOut>(`/requests/${id}/status`, null, { params: { status } }).then((r) => r.data)

export const deleteRequest = (id: number) => api.delete(`/requests/${id}`)
