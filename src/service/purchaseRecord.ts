import { post, CommonResponse } from "@/libs";
import { IdRequest, StatusRequest } from "@/libs/type";

export interface PurchaseRecord extends Record<string, any> {
  id: string;
  name: string;
  price: number;
  explain?: string;
  num: number;
  remain: number;
}

export type PurchaseRecordList = Array<PurchaseRecord>;

// export function findTypesByPid(
//   data: IdRequest
// ): Promise<CommonResponse<TypeWithNumList>> {
//   return post("/type/findTypesByPid", data);
// }

// export function findRequiredQuantityOfTypesByPid(
//   data: IdRequest
// ): Promise<CommonResponse<TypeWithNumList>> {
//   return post("/type/findRequiredQuantityOfTypesByPid", data);
// }

export function findPurchaseRecordListByPid(
  data: IdRequest
): Promise<CommonResponse<PurchaseRecordList>> {
  return post("/purchase/record/findTypesByPid", data);
}
