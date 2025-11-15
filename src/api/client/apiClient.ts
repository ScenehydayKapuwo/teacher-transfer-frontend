import Router from "next/router";

export const apiClient = async <T>(
  url: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> => {
  if (!token) {
    Router.push("/");
    throw new Error("No authentication token found");
  }

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    Router.push("/");
    throw new Error("Unauthorized access");
  }

  // Handle payload too large
  if (res.status === 413) {
    return Promise.reject({
      status: 413,
      message: "Payload too large. Please reduce file size or data.",
    });
  }

  // Handle other errors
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    return Promise.reject({
      status: res.status,
      message: errorData.message || "Request failed",
    });
  }

  // Return JSON if available
  return res.json() as Promise<T>;
};
