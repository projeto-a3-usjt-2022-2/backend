export interface IUser {
  name: string;
  lastName: string;
  birthDate: string; // needs to be into toISOString;
  sex: string;
  cpf: string;
  crm: null | string;
  email: string;
  password: string;
  clinic: string;
  modality?: string;
  doctorSchedule?: string[];
}

export interface IConsult {
  clinic: string;
  modality: string;
  date: string;
  hour: string;
  doctorId: string;
  userId: string;
}

export interface IAvaliableSchedule {
  doctorId: string;
  clinic: string;
  doctorSchedule: any[];
  date: string;
}

export interface IGetConsults {
  clinic: string;
  userId: string;
  crm: string | null;
}
