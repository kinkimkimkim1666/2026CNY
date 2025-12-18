export interface Winner {
  id: string;
  day: number;
  name: string;
  phone: string;
}

export interface ExcelRow {
  Day?: number | string;
  Name?: string;
  FacebookName?: string;
  Phone?: string | number;
  PhoneNumber?: string | number;
  [key: string]: any;
}