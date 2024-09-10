import { post, CommonResponse, get } from "@/libs";
import {
  IdRequest,
  StatusRequest,
  RejectRequest,
  ApplicationStatus,
} from "@/libs/type";
export enum ApplicationType {
  Purchase = 1,
  Repair = 2,
  Scrap = 3,
}
export interface ApplicationInfo extends Record<string, any> {
  id: string;
  mid: string;
  lid?: string;
  status: ApplicationStatus;
  cost?: number;
  rtime: string;
  atime?: string;
  ftime?: string;
  brief: string;
  note?: string;
  type: ApplicationType;
}

export type ApplicationInfoList = Array<ApplicationInfo>;

export function getApplications(): Promise<
  CommonResponse<ApplicationInfoList>
> {
  return get("/application/get");
}

export function findApplicationsByMid(
  data: IdRequest
): Promise<CommonResponse<ApplicationInfoList>> {
  return post("/application/findByMid", data);
}

export function findApplicationsByLid(
  data: IdRequest
): Promise<CommonResponse<ApplicationInfoList>> {
  return post("/application/findByLid", data);
}
export function findApplicationsByDid(
  data: IdRequest
): Promise<CommonResponse<ApplicationInfoList>> {
  return post("/application/findByLid", data);
}
export function findApplicationsByStatus(
  data: StatusRequest
): Promise<CommonResponse<ApplicationInfoList>> {
  return post("/application/findByStatus", data);
}
