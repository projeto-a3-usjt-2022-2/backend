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
