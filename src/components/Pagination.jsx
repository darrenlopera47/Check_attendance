import { useMemo } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import PageSizeSelector from './PageSizeSelector'
import PaginationInfo from './PaginationInfo'

const buildPageWindow = (currentPage, totalPages) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const pages = new Set([1, totalPages, currentPage])

  for (let page = currentPage - 2; page <= currentPage + 2; page += 1) {
    if (page > 1 && page < totalPages) {
      pages.add(page)
    }
  }

  const sorted = [...pages].sort((a, b) => a - b)

  const output = []
  for (let index = 0; index < sorted.length; index += 1) {
    const page = sorted[index]
    const previous = sorted[index - 1]

    if (previous && page > previous + 1) {
      output.push('ellipsis')
    }

    output.push(page)
  }

  return output
}

export default function Pagination({
  currentPage,
  totalPages,
  totalRecords,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
  compact = false,
}) {
  const pages = useMemo(() => buildPageWindow(currentPage, totalPages), [currentPage, totalPages])

  if (compact) {
    return (
      <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-2">
        <div className="mb-2 flex items-center justify-between text-[11px] text-slate-300">
          <span>Showing {totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalRecords)} of {totalRecords}</span>
          <span className="text-slate-400">{totalPages} pages</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onPageChange(1)}
              disabled={loading || currentPage === 1}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronsLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={loading || currentPage === 1}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 overflow-hidden">
            {pages.map((page, index) =>
              page === 'ellipsis' ? (
                <span key={`ellipsis-${index}`} className="px-0.5 text-[10px] text-slate-500">...</span>
              ) : (
                <button
                  key={page}
                  type="button"
                  onClick={() => onPageChange(page)}
                  disabled={loading}
                  className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-1.5 text-[11px] font-medium ${
                    page === currentPage
                      ? 'bg-sky-500 text-slate-950 shadow-[0_0_0_2px_rgba(14,165,233,0.18)]'
                      : 'border border-slate-700 bg-slate-900 text-slate-200'
                  }`}
                >
                  {page}
                </button>
              ),
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={loading || currentPage >= totalPages}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onPageChange(totalPages)}
              disabled={loading || currentPage >= totalPages}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronsRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-end">
          <label className="flex items-center gap-1.5 text-[10px] text-slate-300">
            <span>Rows</span>
            <select
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              className="rounded-lg border border-slate-700 bg-slate-900 px-1.5 py-1 text-[10px] text-slate-100 outline-none"
            >
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-5 flex flex-col gap-4 border-t border-slate-800 pt-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between lg:flex-1">
        <PaginationInfo currentPage={currentPage} pageSize={pageSize} totalRecords={totalRecords} totalPages={totalPages} />
        <PageSizeSelector value={pageSize} onChange={onPageSizeChange} className="justify-end" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={loading || currentPage === 1}
          className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-950 px-2.5 py-2 text-xs font-medium text-slate-200 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={loading || currentPage === 1}
          className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-950 px-2.5 py-2 text-xs font-medium text-slate-200 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map((page, index) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="px-1 text-sm text-slate-500">...</span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              disabled={loading}
              className={`inline-flex h-9 min-w-9 items-center justify-center rounded-xl px-2 text-sm font-medium transition ${
                page === currentPage ? 'bg-sky-500 text-slate-950' : 'border border-slate-700 bg-slate-950 text-slate-200 hover:border-slate-500'
              }`}
            >
              {page}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={loading || currentPage >= totalPages}
          className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-950 px-2.5 py-2 text-xs font-medium text-slate-200 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={loading || currentPage >= totalPages}
          className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-950 px-2.5 py-2 text-xs font-medium text-slate-200 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
