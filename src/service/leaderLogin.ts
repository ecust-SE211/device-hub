import { post, commonResponse } from "@/libs";

export type leaderLoginRequest = {
  id: "string";
  password: "string";
};
export type leaderLoginResponse = {
  id: "string";
  name: "string";
  pwd: "string";
  phone_number: "string";
  email: "string";
};
export function leaderLogin(
  data: leaderLoginRequest
): Promise<commonResponse<leaderLoginRequest>> {
  return post("/login/leader", data);
}
