import { post, CommonResponse } from "@/libs";

export interface InfoEditRequest extends Record<string, string> {
  tel: string;
  email: string;
}

export function leaderInfoEdit(
  data: InfoEditRequest
): Promise<CommonResponse<undefined>> {
  return post("/leader/changeLeaderByToken", data);
}

export function managerInfoEdit(
  data: InfoEditRequest
): Promise<CommonResponse<undefined>> {
  return post("/manager/changeManagerByToken", data);
}
