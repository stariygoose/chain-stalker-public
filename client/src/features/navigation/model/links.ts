import DashboardIcon from "@/features/navigation/assets/dashboard.svg?react";
import SubscriptionsIcon from "@/features/navigation/assets/subscriptions.svg?react";
import SettingsIcon from "@/features/navigation/assets/settings.svg?react";

export const Navigation = [
  {
    icon: DashboardIcon,
    label: "Dashboard",
    to: "/dashboard",
  },
  {
    icon: SubscriptionsIcon,
    label: "Subscriptions",
    to: "/subscriptions",
  },
  {
    icon: SettingsIcon,
    label: "Settings",
    to: "/settings",
  },
];
