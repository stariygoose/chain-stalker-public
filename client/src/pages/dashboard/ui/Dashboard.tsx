import { DashboardWidget } from "@/widgets/sidebar";

export const DashboardPage = () => {
  return (
    <section className="flex w-[calc(100%-250px)] h-full glass-bg-effect p-2 border-l-1 border-brand">
      <DashboardWidget />
    </section>
  );
};
