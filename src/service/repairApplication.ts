import { post, commonResponse } from "@/libs";
import { idRequest, statusRequest } from "@/libs/type";

export interface RepairApplicationInfo extends Record<string, any> {
  id: string;
  mid: string;
  lid?: string;
  status: number;
  manufacturer: string;
  cost: number;
  rtime: string;
  atime?: string;
  ftime?: string;
  brief: string;
  note?: string;
}

export interface DeviceRequest extends Record<string, string> {
  id: string;
}

export type DeviceRequestList = Array<DeviceRequest>;

export interface RepairApplicationRequest {
  mid: string;
  brief: string;
  manufacturer: string;
  cost: number;
  Devices: DeviceRequestList;
}

export type RepairApplicationInfoList = Array<RepairApplicationInfo>;

export function findRepairApplicationsByMid(
  data: idRequest
): Promise<commonResponse<RepairApplicationInfoList>> {
  return post("/repair/application/findByMid", data);
}

export function findRepairApplicationsByLid(
  data: idRequest
): Promise<commonResponse<RepairApplicationInfoList>> {
  return post("/repair/application/findByLid", data);
}

export function findRepairApplicationsByStatus(
  data: statusRequest
): Promise<commonResponse<RepairApplicationInfoList>> {
  return post("/repair/application/findByStatus", data);
}

export function appendRepairApplication(
  data: RepairApplicationRequest
): Promise<commonResponse<any>> {
  return post("/repair/application/appendRepairApplication", data);
}
