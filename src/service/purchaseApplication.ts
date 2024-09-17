import { post, CommonResponse, get } from "@/libs";
import {
  IdRequest,
  StatusRequest,
  RejectRequest,
  ApplicationStatus,
} from "@/libs/type";

export interface PurchaseApplicationInfo extends Record<string, any> {
  id: string;
  mid: string;
  lid?: string;
  status: ApplicationStatus;
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
  status: ApplicationStatus;
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
  CommonResponse<PurchaseApplicationInfoList>
> {
  return get("/purchase/application/get");
}

export function findPurchaseApplicationsByMid(
  data: IdRequest
): Promise<CommonResponse<PurchaseApplicationInfoList>> {
  return post("/purchase/application/findByMid", data);
}

export function findPurchaseApplicationsByLid(
  data: IdRequest
): Promise<CommonResponse<PurchaseApplicationInfoList>> {
  return post("/purchase/application/findByLid", data);
}

export function findPurchaseApplicationsByPid(
  data: IdRequest
): Promise<CommonResponse<PurchaseApplicationInfo>> {
  return post("/purchase/application/findByPid", data);
}

export function findPurchaseApplicationsByStatus(
  data: StatusRequest
): Promise<CommonResponse<PurchaseApplicationInfoList>> {
  return post("/purchase/application/findByStatus", data);
}

export function appendPurchaseApplication(
  data: PurchaseApplicationRequest
): Promise<CommonResponse<IdRequest>> {
  return post("/purchase/application/append", data);
}

export function approvePurchaseApplication(
  data: IdRequest
): Promise<CommonResponse<undefined>> {
  return post("/purchase/application/approve", data);
}

export function rejectPurchaseApplication(
  data: RejectRequest
): Promise<CommonResponse<undefined>> {
  return post("/purchase/application/reject", data);
}

export function finishPurchaseApplication(
  data: IdRequest
): Promise<CommonResponse<undefined>> {
  return post("/purchase/application/finish", data);
}

export function updatePurchaseApplication(
  data: updateInfo
): Promise<CommonResponse<updateInfo>> {
  return post("/purchase/application/update", data);
}

export type TypeListResponse = Array<{
  id: string;
  name: string;
  price: number;
}>;

export function getTypes(): Promise<CommonResponse<TypeListResponse>> {
  return get("/type/getTypes");
}
