import type { Role } from '$lib/types/user';

// src/lib/types/User.ts
export interface BaseUser {
	uid: string;
	email: string | null;
	displayName?: string | null;
	photoURL?: string | null;
	role: Role;
	createdAt?: string; // Fecha de creación
}

export interface StudentProfile {
	bio?: string;
	skills?: string[];
	education?: Array<{ institution: string; degree: string; year: string }>;
	experience?: Array<{ company: string; role: string; years: string }>;
	cvUrl?: string; // URL al CV en Firebase Storage (simulado)
	cvFileName?: string;
}

export interface Student extends BaseUser, StudentProfile {
	role: 'student';
}

export interface CompanyProfile {
	companyName: string;
	website?: string;
	description?: string;
	industry?: string;
	address?: string;
}

export interface Company extends BaseUser, CompanyProfile {
	role: 'company';
}

export interface Admin extends BaseUser {
	role: 'admin';
}

export type AppUser = Student | Company | Admin | BaseUser | null;
