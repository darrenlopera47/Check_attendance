export default function PaginationInfo({ currentPage, pageSize, totalRecords, totalPages }) {
  const start = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const end = Math.min(currentPage * pageSize, totalRecords)

  return (
    <div className="text-sm text-slate-300">
      {totalRecords === 0 ? (
        <span>No records found</span>
      ) : (
        <span>
          Showing {start}-{end} of {totalRecords} records
        </span>
      )}
      <span className="ml-2 text-slate-500">({totalPages} pages)</span>
    </div>
  )
}
