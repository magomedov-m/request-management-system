import axios from 'axios'
import type { RequestCreate, RequestOut } from '../types'

const api = axios.create({
  baseURL: '/api',
})

export const getAllRequests = () => api.get<RequestOut[]>('/requests/').then((r) => r.data)

export const createRequest = (data: RequestCreate) =>
  api.post<RequestOut>('/requests/', data).then((r) => r.data)

export const deleteRequest = (id: number) => api.delete(`/requests/${id}`)
