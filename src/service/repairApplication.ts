import { post, CommonResponse, get } from "@/libs";
import {
  IdRequest,
  StatusRequest,
  RejectRequest,
  ApplicationStatus,
} from "@/libs/type";

export interface RepairApplicationInfo extends Record<string, any> {
  id: string;
  mid: string;
  lid?: string;
  status: ApplicationStatus;
  manufacturer: string;
  cost: number;
  rtime: string;
  atime?: string;
  ftime?: string;
  brief: string;
  note?: string;
}

export type DeviceList = Array<IdRequest>;

export interface RepairApplicationRequest {
  mid: string;
  brief: string;
  manufacturer: string;
  cost: number;
  devices: DeviceList;
}

export type RepairApplicationInfoList = Array<RepairApplicationInfo>;

interface UpdateInfo extends Record<string, any> {
  id: string;
  mid: string;
  lid?: string;
  status: ApplicationStatus;
  manufacturer: string;
  cost: number;
  rtime: string;
  atime?: string;
  ftime?: string;
  brief: string;
  note?: string;
  Devices: DeviceList;
}
export function getRepairApplications(): Promise<
  CommonResponse<RepairApplicationInfoList>
> {
  return get("/repair/application/get");
}

export function findRepairApplicationsByMid(
  data: IdRequest
): Promise<CommonResponse<RepairApplicationInfoList>> {
  return post("/repair/application/findByMid", data);
}

export function findRepairApplicationsByRid(
  data: IdRequest
): Promise<CommonResponse<RepairApplicationInfo>> {
  return post("/repair/application/findByRid", data);
}

export function findRepairApplicationsByStatus(
  data: StatusRequest
): Promise<CommonResponse<RepairApplicationInfoList>> {
  return post("/repair/application/findByStatus", data);
}

export function appendRepairApplication(
  data: RepairApplicationRequest
): Promise<CommonResponse<IdRequest>> {
  return post("/repair/application/append", data);
}

export function approveRepairApplication(
  data: IdRequest
): Promise<CommonResponse<undefined>> {
  return post("/repair/application/approve", data);
}

export function rejectRepairApplication(
  data: RejectRequest
): Promise<CommonResponse<undefined>> {
  return post("/repair/application/reject", data);
}

export function finishRepairApplication(
  data: IdRequest
): Promise<CommonResponse<undefined>> {
  return post("/repair/application/finish", data);
}

export function updateRepairApplication(
  data: UpdateInfo
): Promise<CommonResponse<UpdateInfo>> {
  return post("/repair/application/update", data);
}
