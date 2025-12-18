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
  // Common Chinese Headers
  '日期'?: number | string;
  '姓名'?: string;
  'facebook名'?: string;
  '電話'?: string | number;
  '電話號碼'?: string | number;
  [key: string]: any;
}