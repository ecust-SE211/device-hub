import { post, commonResponse, get } from "@/libs";
import { idRequest, statusRequest, rejectRequest } from "@/libs/type";

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

interface updateInfo extends Record<string, any> {
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
  types: TypeRequestList;
}

export type PurchaseApplicationInfoList = Array<PurchaseApplicationInfo>;

export function getPurchaseApplications(): Promise<
  commonResponse<PurchaseApplicationInfoList>
> {
  return get("/purchase/application/get");
}

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
): Promise<commonResponse<undefined>> {
  return post("/purchase/application/append", data);
}

export function approvePurchaseApplication(
  data: idRequest
): Promise<commonResponse<undefined>> {
  return post("/purchase/application/approve", data);
}

export function rejectPurchaseApplication(
  data: rejectRequest
): Promise<commonResponse<undefined>> {
  return post("/purchase/application/reject", data);
}

export function finishPurchaseApplication(
  data: idRequest
): Promise<commonResponse<undefined>> {
  return post("/purchase/application/finish", data);
}

export function updatePurchaseApplication(
  data: updateInfo
): Promise<commonResponse<updateInfo>> {
  return post("/purchase/application/update", data);
}
