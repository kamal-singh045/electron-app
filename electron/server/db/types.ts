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

export interface TodoSchema {
  id: number;
  user_id: number;
  text: string;
  completed: boolean;
  image?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}
