import { createContext, ReactNode } from "react";

export interface UserProps {
  name: string;
  avatarUrl: string;
}

export interface AuthContextDataProps {
  user: UserProps;
  signIn: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthProviderProps) {
  async function signIn() {
    console.log("Logado");
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        user: {
          name: "Claudio",
          avatarUrl: "https://github.com/cHenrique0.png",
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
