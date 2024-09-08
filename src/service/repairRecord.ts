import { post, commonResponse } from "@/libs";
import { idRequest, statusRequest } from "@/libs/type";
import { DeviceInfoList } from "./device";
import { RepairApplicationInfoList } from "./repairApplication";

export function findDevicesByRid(
  data: idRequest
): Promise<commonResponse<DeviceInfoList>> {
  return post("repairrecord/findDevicesByRid", data);
}

export function findRepairApplicationsByDid(
  data: idRequest
): Promise<commonResponse<RepairApplicationInfoList>> {
  return post("repairrecord/findRepairApplicationsByDid", data);
}
