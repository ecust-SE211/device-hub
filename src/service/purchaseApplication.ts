import { post, commonResponse } from "@/libs";
import { idRequest, statusRequest } from "@/libs/type";

export interface PurchaseApplicationInfo extends Record<string, any> {
  id: string;
  mid: string;
  lid?: string;
  status: number;
  cost: number;
  rtime: string;
  atime?: string;
  ftime?: string;
  brief: string;
  note?: string;
}

export interface TypeRequest extends Record<string, any> {
  id: string;
  num: number;
}

export type TypeRequestList = Array<TypeRequest>;

export interface PurchaseApplicationRequest {
  mid: string;
  brief: string;
  cost: number;
  types: TypeRequestList;
}

export type PurchaseApplicationInfoList = Array<PurchaseApplicationInfo>;

export function findPurchaseApplicationsByMid(
  data: idRequest
): Promise<commonResponse<PurchaseApplicationInfoList>> {
  return post("/purchase/application/findByMid", data);
}

export function findPurchaseApplicationsByLid(
  data: idRequest
): Promise<commonResponse<PurchaseApplicationInfoList>> {
  return post("/purchase/application/findByLid", data);
}

export function findPurchaseApplicationsByStatus(
  data: statusRequest
): Promise<commonResponse<PurchaseApplicationInfoList>> {
  return post("/purchase/application/findByStatus", data);
}

export function appendPurchaseApplication(
  data: PurchaseApplicationRequest
): Promise<commonResponse<any>> {
  return post("/purchase/application/appendPurchaseApplication", data);
}
