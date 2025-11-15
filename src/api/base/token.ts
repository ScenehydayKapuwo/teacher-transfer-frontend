// utils/auth.ts
import { useRouter } from "next/router";

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const requireToken = (router: ReturnType<typeof useRouter>): string | null => {
  const token = getToken();
  if (!token) {
    router.push("/");
    return null;
  }
  return token;
};
