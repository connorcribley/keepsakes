"use client";

import { createContext, useContext, useState } from "react";

type BlockContextType = {
  isBlocked: boolean;
  hasBlocked: boolean;
  setIsBlocked: (value: boolean) => void;
  setHasBlocked: (value: boolean) => void;
};

const ProfileBlockContext = createContext<BlockContextType | undefined>(undefined);

const ProfileBlockProvider = ({
  children,
  initialIsBlocked,
  initialHasBlocked,
}: {
  children: React.ReactNode;
  initialIsBlocked: boolean;
  initialHasBlocked: boolean;
}) => {
  const [isBlocked, setIsBlocked] = useState(initialIsBlocked);
  const [hasBlocked, setHasBlocked] = useState(initialHasBlocked);

  return (
    <ProfileBlockContext.Provider
      value={{ isBlocked, hasBlocked, setIsBlocked, setHasBlocked }}
    >
      {children}
    </ProfileBlockContext.Provider>
  );
};

export const useProfileBlock = () => {
  const context = useContext(ProfileBlockContext);
  if (!context) {
    throw new Error("useProfileBlock must be used within a ProfileBlockProvider");
  }
  return context;
};


export default ProfileBlockProvider;