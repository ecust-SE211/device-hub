import { post, CommonResponse, get } from "@/libs";
import {
  ApplicationStatus,
  IdRequest,
  RejectRequest,
  StatusRequest,
} from "@/libs/type";
import { DeviceList } from "./repairApplication";

export interface ScrapApplicationInfo extends Record<string, any> {
  id: string;
  mid: string;
  lid?: string;
  status: ApplicationStatus;
  rtime: string;
  atime?: string;
  ftime?: string;
  brief: string;
  note?: string;
}

export interface ScrapApplicationRequest {
  mid: string;
  brief: string;
  devices: DeviceList;
}

interface updateInfo extends Record<string, any> {
  id: string;
  mid: string;
  lid?: string;
  status: ApplicationStatus;
  rtime: string;
  atime?: string;
  ftime?: string;
  brief: string;
  note?: string;
  devices: DeviceList;
}

export type ScrapApplicationInfoList = Array<ScrapApplicationInfo>;

export function getScrapApplications(): Promise<
  CommonResponse<ScrapApplicationInfoList>
> {
  return get("/scrap/application/get");
}
export function findScrapApplicationsByMid(
  data: IdRequest
): Promise<CommonResponse<ScrapApplicationInfoList>> {
  return post("/scrap/application/findByMid", data);
}

export function findScrapApplicationsByLid(
  data: IdRequest
): Promise<CommonResponse<ScrapApplicationInfoList>> {
  return post("/scrap/application/findByLid", data);
}

export function findScrapApplicationsBySid(
  data: IdRequest
): Promise<CommonResponse<ScrapApplicationInfo>> {
  return post("/scrap/application/findBySid", data);
}

export function findScrapApplicationsByStatus(
  data: StatusRequest
): Promise<CommonResponse<ScrapApplicationInfoList>> {
  return post("/scrap/application/findByStatus", data);
}

export function appendScrapApplication(
  data: ScrapApplicationRequest
): Promise<CommonResponse<any>> {
  return post("/scrap/application/append", data);
}

export function approveScrapApplication(
  data: IdRequest
): Promise<CommonResponse<IdRequest>> {
  return post("/scrap/application/approve", data);
}

export function rejectScrapApplication(
  data: RejectRequest
): Promise<CommonResponse<undefined>> {
  return post("/scrap/application/reject", data);
}

export function finishScrapApplication(
  data: IdRequest
): Promise<CommonResponse<undefined>> {
  return post("/scrap/application/finish", data);
}

export function updateScrapApplication(
  data: updateInfo
): Promise<CommonResponse<updateInfo>> {
  return post("/scrap/application/update", data);
}
