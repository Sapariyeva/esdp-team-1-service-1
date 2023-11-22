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