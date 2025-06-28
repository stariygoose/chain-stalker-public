import { DashboardWidget } from "@/widgets/dashboard";

export const DashboardPage = () => {
  return (
    <section className="flex w-[calc(100%-250px)] h-full">
      <DashboardWidget />
    </section>
  );
};
