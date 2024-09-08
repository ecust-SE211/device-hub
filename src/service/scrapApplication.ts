import { post, commonResponse } from "@/libs";
import { idRequest, statusRequest } from "@/libs/type";
import { DeviceRequestList } from "./repairApplication";

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
  Devices: DeviceRequestList;
}

export type ScrapApplicationInfoList = Array<ScrapApplicationInfo>;

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
  return post("/scrap/application/appendScrapApplication", data);
}
