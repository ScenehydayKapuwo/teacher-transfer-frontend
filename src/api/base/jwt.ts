export interface JwtPayload {
  id: number;
  username: string;
  role: string;
  teacherProfileId?: number;
  tsno: string;
  iat: number;
  exp: number;
}

export function getTokenFromLocalStorage(): string | null {
  if (typeof window === "undefined") return null; 
  return localStorage.getItem("token");
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const base64Payload = token.split(".")[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload) as JwtPayload;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}
export function getCurrentUser(): JwtPayload | null {
  const token = getTokenFromLocalStorage();
  if (!token) return null;
  return decodeJwt(token);
}
