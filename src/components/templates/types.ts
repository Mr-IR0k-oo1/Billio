export interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
}

export interface Client {
  name: string;
  email: string;
  address: string;
}

export interface InvoiceData {
  id?: string | number;
  date?: string;
  due_date: string;
  items: LineItem[];
  total: number;
}

export interface InvoiceTemplateProps {
  data: InvoiceData;
  client: Client;
}
