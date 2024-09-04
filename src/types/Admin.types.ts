export type Admin = {
	_id: string;
	uid: string;
	name: string | null;
	photoFiles: FileList;
	email: string;
	password: string;
};

export type ForgotPasswordInfo = {
	email: string;
};

export type LoginInfo = {
	email: string;
	password: string;
};

export type SignupInfo = {
	email: string;
	password: string;
	confirmPassword: string;
};

export type CreateAdmin = {
	email: string;
};

export type UpdateAdminFormData = {
	uid: string;
	name: string;
	photoFiles: FileList;
	email: string;
	password: string;
	confirmPassword: string;
};
