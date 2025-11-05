// src/lib/types/Internship.ts
export interface Internship {
	id: string;
	companyId: string;
	companyName: string; // Denormalized for easier display
	title: string;
	description: string;
	requirements: string[];
	responsibilities?: string[];
	location: string; // 'Remoto', 'Híbrido', 'Presencial, Ciudad'
	modality?: 'Full-time' | 'Part-time' | 'Flexible';
	duration?: string; // ej. "3 meses", "6 meses"
	paid: boolean;
	salaryRange?: string; // ej. "$500 - $700 USD"
	postedDate: string; // ISO Date string
	closingDate?: string; // ISO Date string
	status: 'open' | 'closed' | 'filled';
	tags?: string[];
	applicationsCount?: number;
}

export interface InternshipApplication {
	id: string;
	internshipId: string;
	internshipTitle: string; // Denormalized
	studentId: string;
	studentName: string; // Denormalized
	studentEmail?: string; // Denormalized
	cvUrl: string;
	coverLetter?: string;
	applicationDate: string; // ISO Date string
	status: 'pending' | 'viewed' | 'shortlisted' | 'interviewing' | 'rejected' | 'offered' | 'hired';
	notes?: string; // Notas de la empresa
}
