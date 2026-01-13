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
  subtotal?: number;
  tax_amount?: number;
  discount?: number;
  notes?: string;
  subscription_period?: string;
  usage_summary?: { label: string; value: string }[];
  currency_code?: string;
  currency_symbol?: string;
  renewal_date?: string;
  plan_name?: string;
  registration_number?: string;
  tax_id?: string;
  regulatory_reference?: string;
}

export interface InvoiceTemplateProps {
  data: InvoiceData;
  client: Client;
}
