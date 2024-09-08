export interface commonResponse<T> {
  code: "200" | "400" | "401";
  msg: string;
  data?: T;
}

export interface idRequest extends Record<string, string> {
  id: string;
}

export interface statusRequest extends Record<string, number> {
  status: number;
}

export interface rejectRequest extends Record<string, string> {
  id: string;
  note: string;
}
