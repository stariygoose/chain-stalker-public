import type { FC } from "react";

interface MiniProfileProps {
  name: string;
  username: string;
}

export const UserMiniProfile: FC<MiniProfileProps> = ({ name, username }) => {
  return (
    <div className="flex items-center">
      <div className="w-12 h-12 bg-red-500 mr-2.5"></div>
      <div className="flex flex-col">
        <p className="text-xl">{name}</p>
        <p className="text-sm  text-secondary">{username}</p>
      </div>
    </div>
  );
};
