import { post, CommonResponse, get } from "@/libs";
import {
  DeviceStatus,
  IdPageRequest,
  IdRequest,
  PageResponse,
  StatusPageRequest,
  StatusRequest,
} from "@/libs/type";

export interface DeviceInfo extends Record<string, any> {
  id: string;
  tid: string;
  status: DeviceStatus;
  purchaseApplicationId: string;
  scrapApplicationId?: string;
  manufacter?: string;
  storageTime: string;
  scrapTime?: string;
  note?: string;
}

export interface DeviceRequest extends Record<string, any> {
  id: string;
  purchaseApplicationId: string;
  manufacturer?: string;
  note?: string;
}

export type DeviceInfoList = Array<DeviceInfo>;
export type DeviceInfoPage = PageResponse<DeviceInfo>;
// export async function findDevicesByCid(
//   data: idRequest
// ): Promise<commonResponse<DeviceInfoList>> {
//   return post("/device/findDevicesByCid", data);
// }

export async function findDeviceByDid(
  data: IdRequest
): Promise<CommonResponse<{ type: string } & DeviceInfo>> {
  return post("/device/findDeviceByDid", data);
}

export async function findDevicePageByTid(
  data: IdPageRequest
): Promise<CommonResponse<DeviceInfoPage>> {
  return post("/device/findDevicesByTid/page", data);
}

export async function findDevicePageByPid(
  data: IdPageRequest
): Promise<CommonResponse<DeviceInfoPage>> {
  return post("/device/findDevicesByPid/page", data);
}

export async function findDevicePageBySid(
  data: IdPageRequest
): Promise<CommonResponse<DeviceInfoPage>> {
  return post("/device/findDevicesBySid/page", data);
}

export async function findDevicePageByStatus(
  data: StatusPageRequest
): Promise<CommonResponse<DeviceInfoPage>> {
  return post("/device/findDevicesByStatus/page", data);
}

export async function findDevicesByTid(
  data: IdRequest
): Promise<CommonResponse<DeviceInfoList>> {
  return post("/device/findDevicesByTid", data);
}

export async function findDevicesByPid(
  data: IdRequest
): Promise<CommonResponse<DeviceInfoList>> {
  return post("/device/findDevicesByPid", data);
}

export async function findDevicesBySid(
  data: IdRequest
): Promise<CommonResponse<DeviceInfoList>> {
  return post("/device/findDevicesBySid", data);
}

export async function findDevicesByStatus(
  data: StatusRequest
): Promise<CommonResponse<DeviceInfoList>> {
  return post("/device/findDevicesByStatus", data);
}

export async function updateDevice(
  data: DeviceInfo
): Promise<CommonResponse<DeviceInfo>> {
  return post("/device/updateDevice", data);
}

export async function appendDevice(
  data: DeviceRequest
): Promise<CommonResponse<undefined>> {
  return post("/device/appendDevice", data);
}

export async function appendDevices(
  data: DeviceRequest & { num: number }
): Promise<CommonResponse<undefined>> {
  return post("/device/appendDevices", data);
}

export async function getDeviceIds(): Promise<CommonResponse<Array<string>>> {
  return get("/device/getDeviceIds");
}
