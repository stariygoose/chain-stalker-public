import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

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
    cell: (info) => {
      return (
        <span
          className={`block px-3 py-1 rounded-full font-semibold text-center text-sm bg-secondary`}
        >
          {info.getValue()}
        </span>
      );
    },
  }),
  columnHelper.accessor("lastTriggered", {
    header: () => "Last Triggered",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("actions", {
    header: () => "Action",
    cell: () => (
      <button className="text-green-light font-bold hover:underline cursor-pointer">
        Manage
      </button>
    ),
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
    status: "Inactive",
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
      <div className="border rounded-lg mt-10 border-color">
        <table className="w-full border-collapse border overflow-hidden rounded-lg">
          <thead className="bg-table h-12">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="text-left px-4 py-2">
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
                  <td key={cell.id} className="border-t border-color px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
