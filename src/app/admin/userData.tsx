import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { createContext, useContext, useEffect } from "react";

type UserData = {
  email: string;
  name: string;
  token: string;
};

const UserDataContext = createContext<UserData | null>(null);

export const userDataStorageKey = "auth-jwt";

// const userDataAtomTransient = atom(
//   JSON.parse(
//     (typeof window !== "undefined" &&
//       localStorage.getItem(userDataStorageKey)) ||
//       "null"
//   ) as UserData | null
// );

// export const userDataAtom = atom(
//   (get) => get(userDataAtomTransient),
//   (get, set, value: UserData | null) => {
//     set(userDataAtomTransient, value);
//     if (typeof window !== "undefined") {
//       localStorage.setItem(userDataStorageKey, JSON.stringify(value));
//     }
//   }
// );

const userDataAtom = atomWithStorage<{
  name: string;
  email: string;
  token: string;
} | null>(userDataStorageKey, null);

const isLoadingAtom = atomWithStorage<boolean>("is_loading", true);

export const useUserData = () => {
  const [userData, setUserData] = useAtom(userDataAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);

  useEffect(() => {
    if (isLoading) {
      setIsLoading(false);
    }
  }, [isLoading]);

  return [userData, setUserData, isLoading && !userData] as const;
};

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
