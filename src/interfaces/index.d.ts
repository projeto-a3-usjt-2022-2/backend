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
  cep: string;
  date: string;
  hour: string;
  doctor: { name: string; crm: string };
  user: { name: string; id: string };
}
