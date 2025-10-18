export interface IConfiguration {
  id: string;
  key: string;
  value: string;
  description?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateConfiguration {
  key: string;
  value: string;
  description?: string;
}

export interface IUpdateConfiguration {
  value?: string;
  description?: string;
}
