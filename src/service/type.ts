import { post, commonResponse } from "@/libs";
import { idRequest } from "@/libs/type";

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
