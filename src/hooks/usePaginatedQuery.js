import { useEffect, useMemo } from 'react'
import { usePagination, DEFAULT_PAGE_SIZE } from './usePagination'

export function usePaginatedQuery({
  data = [],
  pageSize = DEFAULT_PAGE_SIZE,
  initialPage = 1,
  fetchPage,
} = {}) {
  const totalItems = Array.isArray(data) ? data.length : 0

  const pagination = usePagination({ totalItems, pageSize, initialPage })

  useEffect(() => {
    if (fetchPage && typeof fetchPage === 'function') {
      fetchPage({ page: pagination.currentPage, pageSize: pagination.pageSize })
    }
  }, [fetchPage, pagination.currentPage, pagination.pageSize])

  const paginatedData = useMemo(() => {
    if (!Array.isArray(data)) {
      return []
    }

    const start = (pagination.currentPage - 1) * pagination.pageSize
    return data.slice(start, start + pagination.pageSize)
  }, [data, pagination.currentPage, pagination.pageSize])

  return {
    ...pagination,
    paginatedData,
    totalRecords: totalItems,
    isEmpty: totalItems === 0,
  }
}

export async function fetchSupabasePage({
  supabase,
  table,
  page,
  pageSize,
  queryBuilder,
}) {
  if (!supabase || !table) {
    return { data: [], count: 0, error: null }
  }

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let builder = supabase.from(table).select('*', { count: 'exact' }).range(from, to)

  if (typeof queryBuilder === 'function') {
    builder = queryBuilder(builder)
  }

  const { data, count, error } = await builder
  return { data: data ?? [], count: count ?? 0, error }
}
