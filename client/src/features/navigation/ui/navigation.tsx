import DashboardIcon from "@/features/navigation/assets/dashboard.svg?react";
import SubscriptionsIcon from "@/features/navigation/assets/subscriptions.svg?react";
import SettingsIcon from "@/features/navigation/assets/settings.svg?react";
import { SVGIcon } from "@/shared/ui";
import { NavLink } from "react-router-dom";

const Navigation = [
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

export const SidebarNavigation = () => {
  const defaultClasses = "flex gap-3 py-2 px-3 items-center";

  return (
    <ul className="flex justify-between flex-col gap-3 cursor-pointer">
      {Navigation.map(({ to, icon, label }) => (
        <NavLink
          to={to}
          className={({ isActive }) =>
            isActive
              ? defaultClasses + " bg-secondary rounded-xl"
              : defaultClasses
          }
        >
          <SVGIcon
            Icon={icon}
            width={24}
            height={24}
            className="text-primary fill-current"
          />
          <p className="text-lg">{label}</p>
        </NavLink>
      ))}
    </ul>
  );
};
