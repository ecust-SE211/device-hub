import { post, commonResponse } from "@/libs";
import { idRequest, statusRequest } from "@/libs/type";

export interface DeviceInfo extends Record<string, any> {
  id: string;
  tid: string;
  status: number;
  purchaseApplicationId: string;
  scrapapplicationId?: string;
  manufacter?: string;
  storageTime: string;
  scrapTime?: string;
  note?: string;
}

export interface DeviceRequest extends Record<string, any> {
  id: string;
  purchaseApplicationId: string;
  note?: string;
}

export type DeviceInfoList = Array<DeviceInfo>;

export async function findDevicesByCid(
  data: idRequest
): Promise<commonResponse<DeviceInfoList>> {
  return post("/device/findDevicesByCid", data);
}

export async function findDevicesByTid(
  data: idRequest
): Promise<commonResponse<DeviceInfoList>> {
  return post("/device/findDevicesByTid", data);
}

export async function findDevicesByPid(
  data: idRequest
): Promise<commonResponse<DeviceInfoList>> {
  return post("/device/findDevicesByPid", data);
}

export async function findDevicesBySid(
  data: idRequest
): Promise<commonResponse<DeviceInfoList>> {
  return post("/device/findDevicesBySid", data);
}

export async function findDevicesByStatus(
  data: statusRequest
): Promise<commonResponse<DeviceInfoList>> {
  return post("/device/findDevicesByStatus", data);
}

export async function appendDevice(
  data: DeviceRequest
): Promise<commonResponse<undefined>> {
  return post("/device/appendDevice", data);
}

export async function updateDevice(
  data: DeviceInfo
): Promise<commonResponse<DeviceInfo>> {
  return post("/device/updateDevice", data);
}
