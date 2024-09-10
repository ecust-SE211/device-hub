import { post, CommonResponse } from "@/libs";

export interface infoEditRequest extends Record<string, string> {
  tel: string;
  email: string;
}

export function leaderInfoEdit(
  data: infoEditRequest
): Promise<CommonResponse<undefined>> {
  return post("/leader/changeLeaderByToken", data);
}

export function managerInfoEdit(
  data: infoEditRequest
): Promise<CommonResponse<undefined>> {
  return post("/manager/changeManagerByToken", data);
}
