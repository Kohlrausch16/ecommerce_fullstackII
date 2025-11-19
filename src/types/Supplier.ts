export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  cnpj: string;
  adressId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSupplierData {
  name: string;
  email: string;
  phone: string;
  cnpj: string;
  adressId: string;
}

export interface UpdateSupplierData {
  name?: string;
  email?: string;
  phone?: string;
  cnpj?: string;
  adressId?: string;
}
