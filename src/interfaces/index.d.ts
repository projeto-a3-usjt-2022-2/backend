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
}

export interface IConsult {

  clinic: string;
  modality: string;
  cep: string;
  date: string;
  hour: string;
  doctor: { name: string, id: string };
  user: { name: string, id: string };
}