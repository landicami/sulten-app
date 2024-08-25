export type Admin = {
	_id: string;
	name: string;
	photoFiles: FileList;
	email: string;
	password: string;
};

export type ForgotPasswordCredentials = {
	email: string;
};

export type LoginCredentials = {
	email: string;
	password: string;
};

export type SignupCredentials = {
	email: string;
	password: string;
	confirmPassword: string;
};

export type UpdateAdminFormData = {
	name: string;
	photoFiles: FileList;
	email: string;
	password: string;
	confirmPassword: string;
};
