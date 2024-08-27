import Table from "react-bootstrap/Table";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
	SortDirection,
	SortingState,
	getSortedRowModel,
} from "@tanstack/react-table";
import { useState } from "react";

interface TanstackTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

const sortingEmoji = {
	asc: "⬆️",
	desc: "⬇️",
};

const TanstackTable = <TData, TValue>({ columns, data }: TanstackTableProps<TData, TValue>) => {
	const [sorting, setSorting] = useState<SortingState>([]);

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
		},
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div>
			<Table bordered hover responsive striped>
				<thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th key={header.id} colSpan={header.colSpan}>
									{header.isPlaceholder ? null : (
										<div
											className={header.column.getCanSort() ? "cursor-pointer" : ""}
											onClick={header.column.getToggleSortingHandler()}
										>
											{flexRender(header.column.columnDef.header, header.getContext())}

											{sortingEmoji[header.column.getIsSorted() as SortDirection] ?? null}
										</div>
									)}
								</th>
							))}
						</tr>
					))}
				</thead>

				<tbody>
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
							))}
						</tr>
					))}
				</tbody>
			</Table>
		</div>
	);
};

export default TanstackTable;
