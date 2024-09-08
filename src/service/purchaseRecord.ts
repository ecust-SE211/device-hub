import { post, commonResponse } from "@/libs";
import { idRequest, statusRequest } from "@/libs/type";

interface TypeWithNum extends Record<string, any> {
  id: string;
  name: string;
  price: string;
  explain?: string;
  num: number;
}

export type TypeWithNumList = Array<TypeWithNum>;

export function findTypesByPid(
  data: idRequest
): Promise<commonResponse<TypeWithNumList>> {
  return post("/type/findTypesByPid", data);
}

export function findRequiredQuantityOfTypesByPid(
  data: idRequest
): Promise<commonResponse<TypeWithNumList>> {
  return post("/type/findRequiredQuantityOfTypesByPid", data);
}
