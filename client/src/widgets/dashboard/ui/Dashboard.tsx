import { DashboardStats, DashboardTable } from "@/features/dashboard";

export const DashboardWidget = () => {
  return (
    <section className="flex w-full h-full">
      <div className="w-full">
        <h1 className="text-bold text-5xl mb-7">Dashboard</h1>
        <DashboardStats />

        <h2 className="font-bold text-3xl mt-10">Last Alerts</h2>
        <DashboardTable />
      </div>
    </section>
  );
};
