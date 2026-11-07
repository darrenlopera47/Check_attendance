import { useEffect, useMemo, useState } from 'react'

export const DEFAULT_PAGE_SIZE = 10
export const PAGE_SIZES = [10, 25, 50, 100]

export function usePagination({
  totalItems = 0,
  pageSize = DEFAULT_PAGE_SIZE,
  initialPage = 1,
} = {}) {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [pageSizeState, setPageSizeState] = useState(pageSize)

  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalItems / Math.max(pageSizeState, 1))), [totalItems, pageSizeState])

  useEffect(() => {
    setCurrentPage((previousPage) => Math.min(previousPage, totalPages))
  }, [totalPages])

  const updatePage = (nextPage) => {
    setCurrentPage(Math.min(Math.max(1, Number(nextPage) || 1), totalPages))
  }

  const setPageSize = (nextSize) => {
    const safeSize = Number(nextSize) || DEFAULT_PAGE_SIZE
    setPageSizeState(safeSize)
    setCurrentPage(1)
  }

  const resetToFirstPage = () => setCurrentPage(1)

  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * pageSizeState + 1
  const endIndex = Math.min(currentPage * pageSizeState, totalItems)

  return {
    currentPage,
    pageSize: pageSizeState,
    totalItems,
    totalPages,
    startIndex,
    endIndex,
    updatePage,
    setPageSize,
    resetToFirstPage,
  }
}
