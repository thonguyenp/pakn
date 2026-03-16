export interface Pagination<T> {
  data: T[]
  current_page: number
  last_page: number
  total: number
  from: number
  to: number
}