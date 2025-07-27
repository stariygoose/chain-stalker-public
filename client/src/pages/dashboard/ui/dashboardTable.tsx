import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { FC } from "react";

const columnHelper = createColumnHelper<Target>();
type Target = {
  name: string;
  status: "Active" | "Inactive";
  lastTriggered: string;
  actions: "Manage";
};

const columns = [
  columnHelper.accessor("name", {
    header: () => "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("status", {
    header: () => "Status",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("lastTriggered", {
    header: () => "Last Triggered",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("actions", {
    header: () => "Action",
    cell: (info) => info.getValue(),
  }),
];

const data: Target[] = [
  {
    name: "BTC",
    status: "Active",
    lastTriggered: "2023-01-01",
    actions: "Manage",
  },
  {
    name: "ETH",
    status: "Active",
    lastTriggered: "2023-01-01",
    actions: "Manage",
  },
  {
    name: "Snackgang",
    status: "Active",
    lastTriggered: "2023-01-01",
    actions: "Manage",
  },
];

export const DashboardTable = () => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full mt-10">
      <h2 className="font-bold text-3xl">Last Alerts</h2>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
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
                <td key={cell.id} className="border px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
