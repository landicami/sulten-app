/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_GOOGLE_API_KEY: string;
	// Add more custom environment variables here
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
