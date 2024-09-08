import { post, commonResponse } from "@/libs";
import { idRequest, statusRequest, rejectRequest } from "@/libs/type";

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

export type DeviceList = Array<idRequest>;

export interface RepairApplicationRequest {
  mid: string;
  brief: string;
  manufacturer: string;
  cost: number;
  Devices: DeviceList;
}

export type RepairApplicationInfoList = Array<RepairApplicationInfo>;

interface updateInfo extends Record<string, any> {
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
  Devices: DeviceList;
}

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
): Promise<commonResponse<undefined>> {
  return post("/repair/application/append", data);
}

export function approveRepairApplication(
  data: idRequest
): Promise<commonResponse<undefined>> {
  return post("/repair/application/approve", data);
}

export function rejectRepairApplication(
  data: rejectRequest
): Promise<commonResponse<undefined>> {
  return post("/repair/application/reject", data);
}

export function finishRepairApplication(
  data: idRequest
): Promise<commonResponse<undefined>> {
  return post("/repair/application/finish", data);
}

export function updateRepairApplication(
  data: updateInfo
): Promise<commonResponse<updateInfo>> {
  return post("/repair/application/update", data);
}
