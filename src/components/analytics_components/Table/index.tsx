import {
  Column,
  Table as ReactTable,
  PaginationState,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  OnChangeFn,
  flexRender,
} from '@tanstack/react-table'
import Link from 'next/link'

import { type Transaction } from '@/analyticsApi'


function Table({ data, columns }: {
  data: Transaction[]
  columns: ColumnDef<Transaction>[]
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="relative w-full max-w-full overflow-x-auto flex flex-col">
      <table className="w-full">
        <thead className="sticky top-0 left-0">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <th key={header.id} colSpan={header.colSpan} className="text-left group font-medium border-b text-sm border-brandDark/10 py-4 whitespace-nowrap first:rounded-l-full last:rounded-r-full">
                    {header.isPlaceholder ? null : (
                      <div className="py-1 inline rounded-full mr-4 group-last:mr-0 opacity-70">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => {
            return (
              <tr key={row.id} className="hover:bg-brandDark/5 hover:border-b-transparent transition border-b border-brandDark/10">
                  {row.getVisibleCells().map(cell => {
                    return (
                      <td key={cell.id} className="min-w-[120px] whitespace-nowrap font-medium text-sm">
                        <Link className="py-4 px-1 block" href={process.env.NEXT_PUBLIC_SPACESCAN_BASE_URL + data[cell.row.index].coin_id} target='_blank'>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Link>
                    </td>
                    )
                  })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="h-2" />
      <div className="flex items-center gap-2 font-medium text-sm">
        <button
          className=""
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        
        <span className="flex items-center gap-1 mx-4">
          <div>Page</div>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
        </span>
        
        <select
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default Table;