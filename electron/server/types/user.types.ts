export interface IUploadProfileImagePayload {
  buffer: Buffer,
  name: string,
  type: string,
}

export interface IUserResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  profile_image?: string;
  last_login_at?: string;
}
