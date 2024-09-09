import { post, commonResponse, get } from "@/libs";
import { idRequest, rejectRequest, statusRequest } from "@/libs/type";
import { DeviceList } from "./repairApplication";

export interface ScrapApplicationInfo extends Record<string, any> {
  id: string;
  mid: string;
  lid?: string;
  status: number;
  rtime: string;
  atime?: string;
  ftime?: string;
  brief: string;
  note?: string;
}

export interface ScrapApplicationRequest {
  mid: string;
  brief: string;
  Devices: DeviceList;
}

interface updateInfo extends Record<string, any> {
  id: string;
  mid: string;
  lid?: string;
  status: number;
  rtime: string;
  atime?: string;
  ftime?: string;
  brief: string;
  note?: string;
  Devices: DeviceList;
}

export type ScrapApplicationInfoList = Array<ScrapApplicationInfo>;

export function getScrapApplications(): Promise<
  commonResponse<ScrapApplicationInfoList>
> {
  return get("/scrap/application/get");
}
export function findScrapApplicationsByMid(
  data: idRequest
): Promise<commonResponse<ScrapApplicationInfoList>> {
  return post("/scrap/application/findByMid", data);
}

export function findScrapApplicationsByLid(
  data: idRequest
): Promise<commonResponse<ScrapApplicationInfoList>> {
  return post("/scrap/application/findByLid", data);
}

export function findScrapApplicationsByStatus(
  data: statusRequest
): Promise<commonResponse<ScrapApplicationInfoList>> {
  return post("/scrap/application/findByStatus", data);
}

export function appendScrapApplication(
  data: ScrapApplicationRequest
): Promise<commonResponse<any>> {
  return post("/scrap/application/append", data);
}

export function approveScrapApplication(
  data: idRequest
): Promise<commonResponse<undefined>> {
  return post("/scrap/application/approve", data);
}

export function rejectScrapApplication(
  data: rejectRequest
): Promise<commonResponse<undefined>> {
  return post("/scrap/application/reject", data);
}

export function finishScrapApplication(
  data: idRequest
): Promise<commonResponse<undefined>> {
  return post("/scrap/application/finish", data);
}

export function updateScrapApplication(
  data: updateInfo
): Promise<commonResponse<updateInfo>> {
  return post("/scrap/application/update", data);
}
