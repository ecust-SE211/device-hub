export interface commonResponse<T> {
  code: 200 | 400 | 401;
  msg: string;
  data?: T;
}
