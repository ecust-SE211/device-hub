import { post, commonResponse } from "@/libs";

interface idRequest {
  id: number;
}

export interface infoEditRequest extends Record<string, string> {
  tel: string;
  email: string;
}
export interface TypeInfo {
  id: string;
  name: string;
  price: string;
  explain?: string;
}
export type TypeInfoList = Array<TypeInfo>;

export function getTypeInfoListById(
  data: idRequest
): Promise<commonResponse<TypeInfoList>> {
  return post("/type/findTypesByCid", data);
}
