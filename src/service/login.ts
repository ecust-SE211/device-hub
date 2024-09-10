import { post, CommonResponse } from "@/libs";

export interface LoginRequest extends Record<string, string> {
  id: string;
  pwd: string;
}
export interface LoginResponse extends Record<string, string> {
  id: string;
  name: string;
  pwd: string;
  tel: string;
  email: string;
  token: string;
}

export function leaderLogin(
  data: LoginRequest
): Promise<CommonResponse<LoginResponse>> {
  return post("/login/leader", data);
}

export function managerLogin(
  data: LoginRequest
): Promise<CommonResponse<LoginResponse>> {
  return post("/login/manager", data);
}
