import { useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useLlmLinks, useUpdateLlmLink, useDeleteLlmLink, LlmLink } from '@/hooks/useLlmLinks'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { UserProfile } from '@/components/UserProfile'
import { ThemeToggle } from '@/components/ThemeToggle'
import { MoreHorizontal, ChevronDown, ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Home } from "lucide-react"

export default function LlmLinksTablePage() {
  const { data = [], isLoading, error, refetch } = useLlmLinks()
  const updateMutation = useUpdateLlmLink()
  const deleteMutation = useDeleteLlmLink()
  const { toast } = useToast()

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({ url: false })
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const columns = useMemo<ColumnDef<LlmLink>[]>(() => [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row, getValue }) => (
        <InlineTextCell
          value={getValue<string>()}
          onCommit={async (val) => handleUpdate(row.original.id, { name: val })}
        />
      )
    },
    {
      accessorKey: 'url',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            URL
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row, getValue }) => (
        <InlineTextCell
          value={getValue<string>()}
          onCommit={async (val) => handleUpdate(row.original.id, { url: val })}
        />
      )
    },
    {
      accessorKey: 'model',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Model
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row, getValue }) => (
        <InlineTextCell
          value={getValue<string>()}
          onCommit={async (val) => handleUpdate(row.original.id, { model: val })}
        />
      )
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row, getValue }) => (
        <InlineTextCell
          value={getValue<string>()}
          onCommit={async (val) => handleUpdate(row.original.id, { description: val })}
        />
      )
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row, getValue }) => (
        <InlineArrayCell
          value={(getValue<string[] | null>() ?? [])}
          placeholder="cat1, cat2"
          onCommit={async (val) => handleUpdate(row.original.id, { category: val })}
        />
      )
    },
    {
      accessorKey: 'tags',
      header: 'Tags',
      cell: ({ row, getValue }) => (
        <InlineArrayCell
          value={(getValue<string[] | null>() ?? [])}
          placeholder="tag1, tag2"
          onCommit={async (val) => handleUpdate(row.original.id, { tags: val })}
        />
      )
    },
    {
      accessorKey: 'isPopular',
      header: 'Popular',
      cell: ({ row, getValue }) => (
        <Checkbox
          checked={Boolean(getValue<boolean>())}
          onCheckedChange={async (checked) => handleUpdate(row.original.id, { isPopular: Boolean(checked) })}
        />
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(row.original.url)}
            >
              Copy URL
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => window.open(row.original.url, '_blank')}
            >
              Open Link
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={async () => handleDelete(row.original.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      enableHiding: false,
    }
  ], [])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  async function handleUpdate(id: string, updates: any) {
    try {
      await updateMutation.mutateAsync({ id, ...updates })
      toast({ title: 'Updated', description: 'Row updated successfully' })
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Update failed', description: e?.message || 'Error updating row' })
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteMutation.mutateAsync(id)
      toast({ title: 'Deleted', description: 'Row deleted successfully' })
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Delete failed', description: e?.message || 'Error deleting row' })
    }
  }

  if (isLoading) return <div className="p-6">Loading...</div>
  if (error) return <div className="p-6">Failed to load</div>

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Button variant="outline" onClick={() => window.location.href = '/'} className="w-full sm:w-auto">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold">LLM Links Table</h1>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <Button variant="outline" onClick={() => refetch()} className="flex-1 sm:flex-none">Refresh</Button>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <UserProfile />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Input
              placeholder="Filter by name..."
              value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
              onChange={(e) => table.getColumn('name')?.setFilterValue(e.target.value)}
              className="w-full sm:max-w-sm"
            />
            <Input
              placeholder="Filter by model..."
              value={(table.getColumn('model')?.getFilterValue() as string) ?? ''}
              onChange={(e) => table.getColumn('model')?.setFilterValue(e.target.value)}
              className="w-full sm:max-w-sm"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
            {Object.keys(rowSelection).length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const selectedRows = table.getFilteredSelectedRowModel().rows
                  selectedRows.forEach(row => handleDelete(row.original.id))
                  setRowSelection({})
                }}
                className="text-red-600 w-full sm:w-auto"
              >
                Delete Selected ({Object.keys(rowSelection).length})
              </Button>
            )}
          </div>
        </div>

        <div className="rounded-md border overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium hidden sm:block">Rows per page</p>
              <p className="text-sm font-medium sm:hidden">Per page</p>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value))
                }}
                className="h-8 w-[70px] rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InlineTextCell({ value, onCommit }: { value: string | null; onCommit: (v: string) => void }) {
  const [val, setVal] = useState(value ?? '')
  const [isEditing, setIsEditing] = useState(false)
  
  const handleCommit = () => {
    onCommit(val)
    setIsEditing(false)
  }
  
  if (!isEditing) {
    return (
      <div 
        onClick={() => setIsEditing(true)}
        className="cursor-pointer hover:bg-muted/50 p-2 rounded min-h-[32px] flex items-center"
      >
        {val || <span className="text-muted-foreground">Click to edit...</span>}
      </div>
    )
  }
  
  return (
    <Input
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onBlur={handleCommit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleCommit()
        if (e.key === 'Escape') {
          setVal(value ?? '')
          setIsEditing(false)
        }
      }}
      className="min-w-[150px]"
      autoFocus
    />
  )
}

function InlineArrayCell({ value, onCommit, placeholder }: { value: string[]; onCommit: (v: string[]) => void; placeholder?: string }) {
  const [text, setText] = useState((value ?? []).join(', '))
  const [isEditing, setIsEditing] = useState(false)
  
  const handleCommit = () => {
    onCommit(text.split(',').map(s => s.trim()).filter(Boolean))
    setIsEditing(false)
  }
  
  if (!isEditing) {
    return (
      <div 
        onClick={() => setIsEditing(true)}
        className="cursor-pointer hover:bg-muted/50 p-2 rounded min-h-[32px] flex items-center"
      >
        {text || <span className="text-muted-foreground">{placeholder || 'Click to edit...'}</span>}
      </div>
    )
  }
  
  return (
    <Input
      value={text}
      placeholder={placeholder}
      onChange={(e) => setText(e.target.value)}
      onBlur={handleCommit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleCommit()
        if (e.key === 'Escape') {
          setText((value ?? []).join(', '))
          setIsEditing(false)
        }
      }}
      className="min-w-[150px]"
      autoFocus
    />
  )
}


