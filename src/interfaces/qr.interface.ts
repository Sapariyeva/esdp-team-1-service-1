export interface IQrCode {
  _id: number;
  uuid: string;
  svg: string;
  locks: string[];
  phone: string;
  valid_from: number;
  valid_to: number;
}

export interface IValidateQr {
  lock: string;
  hash: string;
}

export interface ILog {
  access_uuid: string | null;
  lock: string;
  phone: string | null;
  attempted_at: number | null;
  attempt_status: boolean;
}