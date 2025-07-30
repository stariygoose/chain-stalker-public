import { Button } from "@/shared";
import { createColumnHelper } from "@tanstack/react-table";

export type Target = {
  name: string;
  status: "Active" | "Inactive";
  lastTriggered: string;
  actions: "Manage";
};

const columnHelper = createColumnHelper<Target>();

export const columns = [
  columnHelper.accessor("name", {
    header: () => "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("status", {
    header: () => "Status",
    cell: (info) => (
      <span className="block px-3 py-1 rounded-full font-semibold text-center text-sm bg-secondary">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("lastTriggered", {
    header: () => "Last Triggered",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("actions", {
    header: () => "Action",
    cell: () => (
      <Button className="text-green-light font-bold hover:underline">
        Manage
      </Button>
    ),
  }),
];
