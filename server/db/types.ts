export interface UserSchema {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  profile_image?: string;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}
