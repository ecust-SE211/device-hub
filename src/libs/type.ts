export interface CommonResponse<T> {
  code: "200" | "400" | "401";
  msg: string;
  data?: T;
}
export enum ApplicationStatus {
  Waiting = 1,
  Approved = 2,
  Finished = 3,
  Canceled = 4,
}
export enum DeviceStatus {
  Purchasing = 0,
  Normal = 1,
  Repairing = 2,
  Scraped = 3,
}
export interface PageResponse<T> {
  countId?: string;
  current: number;
  maxLimit?: number;
  optimizeCountSql: boolean;
  orders: Array<unknown>;
  pages: number;
  records: Array<T>;
  length: number;
  searchCount: boolean;
  size: number;
  total: number;
}
export interface IdRequest extends Record<string, string> {
  id: string;
}
export interface IdPageRequest extends Record<string, string | number> {
  id: string;
  page: number;
  size: number;
}
export interface StatusRequest extends Record<string, number> {
  status: number;
}
export interface StatusPageRequest extends Record<string, number> {
  status: ApplicationStatus;
  page: number;
  size: number;
}
export interface RejectRequest extends Record<string, string> {
  id: string;
  note: string;
}
