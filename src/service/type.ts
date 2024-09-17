import { post, CommonResponse } from "@/libs";
import { IdRequest } from "@/libs/type";

export interface TypeInfo {
  id: string;
  name: string;
  price: number;
  category: string;
  explain?: string;
}
export type TypeInfoList = Array<TypeInfo>;

export function getTypeInfoListByCId(
  data: IdRequest
): Promise<CommonResponse<TypeInfoList>> {
  return post("/type/findTypesByCid", data);
}

export function getTypeInfoByTid(
  data: IdRequest
): Promise<CommonResponse<TypeInfo>> {
  return post("/type/findTypeByTid", data);
}

export function appendType(data: TypeInfo): Promise<CommonResponse<IdRequest>> {
  return post("/type/appendType", data);
}
