interface ICommonFields {
  success: boolean;
  message: string;
}

// Upload profile
export interface IUploadProfileResponse extends ICommonFields {
  data: {
    profile_image: string
  }
}

// Login
export interface ILoginResponse extends ICommonFields {
  data: {
    accessToken: string;
  }
}

// Register
export interface IRegisterResponse extends ICommonFields { }

// Get user
export interface IUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  profile_image?: string;
}
export interface IGetUserResponse extends ICommonFields {
  data: IUser
}
