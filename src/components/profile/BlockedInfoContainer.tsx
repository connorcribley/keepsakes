"use client";

import { useProfileBlock } from "@/context/ProfileBlockContext";

const BlockedInfoContainer = () => {
  const { isBlocked, hasBlocked } = useProfileBlock();

  if (hasBlocked) {
    return (
      <div className="flex text-center justify-center items-center mt-4">
        <h2 className="text-yellow-500 font-semibold">You have blocked this user</h2>
      </div>
    );
  }

  if (isBlocked) {
    return (
      <div className="flex text-center justify-center items-center mt-4">
        <h2 className="text-red-500 font-semibold">This user has blocked you</h2>
      </div>
    );
  }

  return null;
};

export default BlockedInfoContainer;