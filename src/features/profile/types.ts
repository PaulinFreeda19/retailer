// types.ts
export interface Profile {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  address: string;
  image?: string;
}

export interface Settings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  alerts: boolean;
  theme: 'light' | 'dark';
  language: string;
  timezone: string;
}