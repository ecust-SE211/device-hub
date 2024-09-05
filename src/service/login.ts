import { post, commonResponse } from "@/libs";

export type leaderLoginRequest = {
  id: "string";
  pwd: "string";
};
export type leaderLoginResponse = {
  id: "string";
  name: "string";
  pwd: "string";
  tel: "string";
  email: "string";
};
export type managerLoginRequest = {
  id: "string";
  pwd: "string";
};
export type managerLoginResponse = {
  id: "string";
  name: "string";
  pwd: "string";
  tel: "string";
  email: "string";
};

export function leaderLogin(
  data: leaderLoginRequest
): Promise<commonResponse<leaderLoginRequest>> {
  return post("/login/leader", data);
}

export function managerLogin(
  data: managerLoginRequest
): Promise<commonResponse<managerLoginRequest>> {
  return post("/login/manager", data);
}
