import { post, CommonResponse } from "@/libs";
import { IdRequest, StatusRequest } from "@/libs/type";

interface TypeWithNum extends Record<string, any> {
  id: string;
  name: string;
  price: string;
  explain?: string;
  num: number;
}

export type TypeWithNumList = Array<TypeWithNum>;

export function findTypesByPid(
  data: IdRequest
): Promise<CommonResponse<TypeWithNumList>> {
  return post("/type/findTypesByPid", data);
}

export function findRequiredQuantityOfTypesByPid(
  data: IdRequest
): Promise<CommonResponse<TypeWithNumList>> {
  return post("/type/findRequiredQuantityOfTypesByPid", data);
}
