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
    // Pipeline
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    //
  })

  return (
    <div className="w-full max-w-full overflow-x-auto flex flex-col">
      <ul className="flex gap-2 pb-4 sm:px-4 text-xl sticky left-0">
        <li className="cursor-pointer hover:opacity-80 font-medium bg-black text-brandLight rounded-full px-8 py-2 border border-transparent">Swaps</li>
        <li className="cursor-pointer hover:opacity-80 font-medium text-black/80 rounded-full px-8 py-2 border">Add</li>
        <li className="cursor-pointer hover:opacity-80 font-medium text-black/80 rounded-full px-8 py-2 border">Remove</li>
      </ul>
      <table className="w-full">
        <thead className="sticky top-0 left-0">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <th key={header.id} colSpan={header.colSpan} className="text-left text-xl text-brandDark font-medium p-4 px-0 sm:px-4 whitespace-nowrap first:rounded-l-full last:rounded-r-full">
                    {header.isPlaceholder ? null : (
                      <div className="bg-brandDark/10 px-8 py-2 text-center rounded-full mr-4 last:mr-0">
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
              <tr key={row.id} className="hover:bg-brandDark/10 transition border-b border-neutral-100">
                  {row.getVisibleCells().map(cell => {
                    return (
                      <td key={cell.id} className="min-w-[120px] whitespace-nowrap first:rounded-l-full last:rounded-r-full font-medium">
                        <Link className="px-4 sm:px-8 py-6 block" href={process.env.NEXT_PUBLIC_SPACESCAN_BASE_URL + data[cell.row.index].coin_id} target='_blank'>
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
      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
            className="border p-1 rounded w-16"
          />
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
      <div>{table.getRowModel().rows.length} Rows</div>
      <pre>{JSON.stringify(table.getState().pagination, null, 2)}</pre>
    </div>
  )
}

export default Table;