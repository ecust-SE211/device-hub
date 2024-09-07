import { post, commonResponse } from "@/libs";
import { idRequest, statusRequest } from "@/libs/type";

export interface deviceResponse extends Record<string, any> {
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

export async function findDevicesByCid(
  data: idRequest
): Promise<commonResponse<deviceResponse[]>> {
  return post("/device/findDevicesByCid", data);
}

export async function findDevicesByTid(
  data: idRequest
): Promise<commonResponse<deviceResponse[]>> {
  return post("/device/findDevicesByTid", data);
}

export async function findDevicesByPid(
  data: idRequest
): Promise<commonResponse<deviceResponse[]>> {
  return post("/device/findDevicesByPid", data);
}

export async function findDevicesBySid(
  data: idRequest
): Promise<commonResponse<deviceResponse[]>> {
  return post("/device/findDevicesBySid", data);
}

export async function findDevicesByStatus(
  data: statusRequest
): Promise<commonResponse<deviceResponse[]>> {
  return post("/device/findDevicesByStatus", data);
}
