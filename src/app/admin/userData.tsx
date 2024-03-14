import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { createContext, useContext } from "react";

type UserData = {
  email: string;
  name: string;
  token: string;
};

const UserDataContext = createContext<UserData | null>(null);

export const userDataAtom = atomWithStorage<{
  name: string;
  email: string;
  token: string;
} | null>("auth-jwt", null);

export const UserDataProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: UserData;
}) => {
  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};
