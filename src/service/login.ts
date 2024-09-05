import { post, commonResponse } from "@/libs";

export interface loginRequest extends Record<string, string> {
  id: string;
  pwd: string;
}
export interface loginResponse extends Record<string, string> {
  id: string;
  name: string;
  pwd: string;
  tel: string;
  email: string;
  token: string;
}

export function leaderLogin(
  data: loginRequest
): Promise<commonResponse<loginResponse>> {
  return post("/login/leader", data);
}

export function managerLogin(
  data: loginRequest
): Promise<commonResponse<loginResponse>> {
  return post("/login/manager", data);
}
