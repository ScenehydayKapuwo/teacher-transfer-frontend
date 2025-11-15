import { API_BASE_URL } from "../base/base";
import { API_REGISTER_URL } from "../base/base";
import { API_LOGIN_URL } from "../base/base";
import axios from "axios";

export const login = async (username: string, password: string, role: string) => {
  try {
    const response = await fetch(`${API_LOGIN_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData || { message: "Login failed" };
    }

    return await response.json();
  } catch (error: any) {
    throw error?.message ? error : { message: "Login failed" };
  }
};

export const register = async (form: any) => {
  const res = await fetch(`${API_REGISTER_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ form }),
  } );
  const data = await res.json();
  console.log(data);
  return data;
};
