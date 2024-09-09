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

export function getTypeInfoByTid(
  data: idRequest
): Promise<commonResponse<TypeInfo>> {
  return post("/type/findTypesByTid", data);
}

export function appendType(data: TypeInfo): Promise<commonResponse<undefined>> {
  return post("/type/appendType", data);
}
