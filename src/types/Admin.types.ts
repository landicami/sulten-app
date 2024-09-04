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
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
};

export type CreateAdmin = {
	_id: string;
	name: string;
	email: string;
	uid: string;
};

export type UpdateAdminFormData = {
	uid: string;
	name: string;
	photoFiles: FileList;
	email: string;
	password: string;
	confirmPassword: string;
};
