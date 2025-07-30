import { Card } from "@/shared";

const cards = [
  {
    title: "Total Subscriptions",
    description: "1000",
    footer: "+10%",
  },
  {
    title: "Active Alerts",
    description: "1000",
    footer: "-10%",
  },
  {
    title: "Notifications Count",
    description: "1000",
    footer: "+120%",
  },
];

export const DashboardStats = () => {
  return (
    <div className="grid [grid-template-columns:repeat(auto-fit,_minmax(200px,_1fr))] gap-4">
      {cards.map(({ title, description, footer }) => {
        return <Card title={title} description={description} footer={footer} />;
      })}
    </div>
  );
};
