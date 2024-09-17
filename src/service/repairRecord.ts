import { post, CommonResponse } from "@/libs";
import { IdRequest, StatusRequest } from "@/libs/type";
import { DeviceInfoList } from "./device";
import { RepairApplicationInfoList } from "./repairApplication";

export function findDevicesByRid(
  data: IdRequest
): Promise<CommonResponse<DeviceInfoList>> {
  return post("repair/record/findDevicesByRid", data);
}

export function findRepairApplicationsByDid(
  data: IdRequest
): Promise<CommonResponse<RepairApplicationInfoList>> {
  return post("repair/record/findRepairApplicationsByDid", data);
}
