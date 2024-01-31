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

export type IWeeklyScheduleElement = {
  start: number,
  end: number,
  isActive: boolean
}

export interface IWeeklySchedule {
  id: string;
  name: string,
  author: string;
  schedule: IWeeklyScheduleElement[]
}

export interface IWeeklyQrCode extends IQrCode {
  schedule: IWeeklyScheduleElement[]
}

