import { post, commonResponse } from "@/libs";

export interface infoEditRequest extends Record<string, string> {
  tel: string;
  email: string;
}

export function leaderInfoEdit(
  data: infoEditRequest
): Promise<commonResponse<undefined>> {
  return post("/leader/changeLeaderByToken", data);
}

export function managerInfoEdit(
  data: infoEditRequest
): Promise<commonResponse<undefined>> {
  return post("/manager/changeManagerByToken", data);
}
