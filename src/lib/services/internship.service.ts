// src/lib/services/internshipService.ts

import type { Internship, InternshipApplication } from '$lib/interfaces/internship.interface';
import type { Student } from '$lib/interfaces/user.interface';
import { userService } from './user.service';

// Mock Database para Pasantías y Aplicaciones
let mockInternships: Internship[] = [
	{
		id: 'intern-1',
		companyId: 'company-001',
		companyName: 'TechCorp Inc.',
		title: 'Desarrollador Frontend Jr (React)',
		description:
			'Únete a nuestro equipo ágil para crear interfaces de usuario modernas y responsivas para nuestros productos SaaS. Trabajarás de cerca con diseñadores UX/UI y desarrolladores backend.',
		requirements: [
			'HTML5, CSS3, JavaScript ES6+',
			'React (Hooks, Context API)',
			'Git',
			'Inglés intermedio'
		],
		responsibilities: [
			'Desarrollar nuevas funcionalidades.',
			'Mantener y mejorar código existente.',
			'Participar en code reviews.'
		],
		location: 'Remoto',
		modality: 'Full-time',
		duration: '6 meses',
		paid: true,
		salaryRange: '$600 - $800 USD',
		postedDate: new Date(Date.now() - 86400000 * 2).toISOString(),
		closingDate: new Date(Date.now() + 86400000 * 30).toISOString(),
		status: 'open',
		tags: ['React', 'Frontend', 'Remoto'],
		applicationsCount: 1
	},
	{
		id: 'intern-2',
		companyId: 'company-002',
		companyName: 'StartupX',
		title: 'Analista de Marketing Digital (SEO/SEM)',
		description:
			'Buscamos un estudiante proactivo para apoyar en la creación y optimización de campañas de marketing digital, con foco en SEO y SEM. Oportunidad de aprendizaje y crecimiento.',
		requirements: [
			'Conocimiento de Google Ads y Analytics',
			'Interés en SEO',
			'Buenas habilidades de comunicación'
		],
		location: 'Presencial, Ciudad Capital',
		modality: 'Part-time',
		duration: '3 meses',
		paid: false,
		postedDate: new Date(Date.now() - 86400000 * 5).toISOString(),
		status: 'open',
		tags: ['Marketing', 'SEO', 'Presencial'],
		applicationsCount: 0
	},
	{
		id: 'intern-3',
		companyId: 'company-001',
		companyName: 'TechCorp Inc.',
		title: 'Diseñador UX/UI (Pasantía)',
		description:
			'Colabora en el diseño de experiencias de usuario intuitivas y atractivas para aplicaciones web y móviles.',
		requirements: [
			'Portafolio de diseño UX/UI',
			'Figma o Adobe XD',
			'Conocimiento de principios de usabilidad'
		],
		location: 'Híbrido',
		modality: 'Flexible',
		duration: '4 meses',
		paid: true,
		salaryRange: '$500',
		postedDate: new Date(Date.now() - 86400000 * 10).toISOString(),
		status: 'open',
		tags: ['UX', 'UI', 'Figma', 'Híbrido'],
		applicationsCount: 0
	}
];

const mockApplications: InternshipApplication[] = [
	{
		id: 'app-1',
		internshipId: 'intern-1',
		internshipTitle: 'Desarrollador Frontend Jr (React)',
		studentId: 'student-001',
		studentName: 'Alex Torrico',
		studentEmail: 'student1@example.com',
		cvUrl: 'mock_cvs/alice.pdf',
		applicationDate: new Date().toISOString(),
		status: 'pending',
		coverLetter: 'Muy interesado en esta oportunidad con React.'
	}
];

// Simulación de CVs de estudiantes (obtenidos de userService, pero mantenemos una copia local por si acaso o para más detalles)
const mockStudentProfilesForCVView: Pick<
	Student,
	| 'uid'
	| 'displayName'
	| 'email'
	| 'cvUrl'
	| 'cvFileName'
	| 'bio'
	| 'skills'
	| 'education'
	| 'experience'
>[] = [
	{
		uid: 'student-001',
		displayName: 'Alice Smith',
		email: 'student1@example.com',
		cvUrl: 'mock_cvs/alice.pdf',
		cvFileName: 'alice_cv.pdf',
		bio: 'Future Svelte Developer',
		skills: ['HTML', 'CSS', 'JavaScript', 'Svelte'],
		education: [{ institution: 'Universidad Ejemplo', degree: 'Ing. en Sistemas', year: '2024' }]
	},
	{
		uid: 'student-002',
		displayName: 'Nohemi Vedia',
		email: 'student2@example.com',
		cvUrl: 'mock_cvs/bob.pdf',
		cvFileName: 'bob_cv.pdf',
		bio: 'Data Science Enthusiast',
		skills: ['Python', 'SQL', 'R'],
		education: [{ institution: 'Instituto ABC', degree: 'Técnico en Datos', year: '2023' }]
	}
];

async function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const internshipService = {
	async getAllInternships(filters?: {
		query?: string;
		location?: string;
		modality?: string;
		paid?: boolean;
	}): Promise<Internship[]> {
		await delay(500);
		let results = mockInternships.filter((i) => i.status === 'open');
		if (filters) {
			if (filters.query) {
				const q = filters.query.toLowerCase();
				results = results.filter(
					(i) =>
						i.title.toLowerCase().includes(q) ||
						i.companyName.toLowerCase().includes(q) ||
						i.description.toLowerCase().includes(q) ||
						i.tags?.some((tag) => tag.toLowerCase().includes(q))
				);
			}
			if (filters.location && filters.location !== 'all') {
				results = results.filter(
					(i) =>
						i.location.toLowerCase().includes(filters.location!.toLowerCase()) ||
						(filters.location === 'Remoto' && i.location === 'Remoto')
				);
			}
			if (filters.modality && filters.modality !== 'all') {
				results = results.filter((i) => i.modality === filters.modality);
			}
			if (typeof filters.paid === 'boolean') {
				results = results.filter((i) => i.paid === filters.paid);
			}
		}
		return [...results];
	},

	async getInternshipById(id: string): Promise<Internship | undefined> {
		await delay(300);
		return mockInternships.find((p) => p.id === id);
	},

	async createInternship(
		internshipData: Omit<Internship, 'id' | 'postedDate' | 'applicationsCount' | 'status'>
	): Promise<Internship> {
		await delay(700);
		const newInternship: Internship = {
			...internshipData,
			id: `intern-${Date.now()}`,
			postedDate: new Date().toISOString(),
			applicationsCount: 0,
			status: 'open'
		};
		mockInternships.unshift(newInternship);
		return newInternship;
	},

	async updateInternship(
		id: string,
		updates: Partial<Internship>
	): Promise<Internship | undefined> {
		await delay(600);
		const index = mockInternships.findIndex((i) => i.id === id);
		if (index !== -1) {
			mockInternships[index] = { ...mockInternships[index], ...updates };
			return mockInternships[index];
		}
		return undefined;
	},

	async deleteInternship(id: string, companyId: string): Promise<void> {
		await delay(400);
		mockInternships = mockInternships.filter((i) => !(i.id === id && i.companyId === companyId));
		// También eliminar aplicaciones asociadas (no implementado en mock)
	},

	async getInternshipsByCompany(companyId: string): Promise<Internship[]> {
		await delay(500);
		return mockInternships.filter((p) => p.companyId === companyId);
	},

	async applyForInternship(
		applicationData: Omit<InternshipApplication, 'id' | 'applicationDate' | 'status'>
	): Promise<InternshipApplication> {
		await delay(600);
		const internship = mockInternships.find((p) => p.id === applicationData.internshipId);
		if (internship) {
			internship.applicationsCount = (internship.applicationsCount || 0) + 1;
		}
		const newApplication: InternshipApplication = {
			...applicationData,
			id: `app-${Date.now()}`,
			applicationDate: new Date().toISOString(),
			status: 'pending'
		};
		mockApplications.push(newApplication);
		console.log(
			`MockDB: Student ${applicationData.studentId} applied for internship ${applicationData.internshipId}.`
		);
		return newApplication;
	},

	async getApplicationsByStudent(studentId: string): Promise<InternshipApplication[]> {
		await delay(400);
		return mockApplications.filter((app) => app.studentId === studentId);
	},
	async getApplicantsForInternship(internshipId: string): Promise<InternshipApplication[]> {
		await delay(400);
		return mockApplications.filter((app) => app.internshipId === internshipId);
	},
	async getApplicationsForInternship(internshipId: string): Promise<InternshipApplication[]> {
		await delay(400);
		return mockApplications.filter((app) => app.internshipId === internshipId);
	},

	async updateApplicationStatus(
		applicationId: string,
		status: InternshipApplication['status']
	): Promise<InternshipApplication | undefined> {
		await delay(300);
		const appIndex = mockApplications.findIndex((app) => app.id === applicationId);
		if (appIndex !== -1) {
			mockApplications[appIndex].status = status;
			return mockApplications[appIndex];
		}
		return undefined;
	},

	// Simulación de subida de CV (esto normalmente interactuaría con Firebase Storage)
	// En esta simulación, actualizamos el perfil del estudiante en userService's mock.
	async uploadStudentCV(
		studentId: string,
		file: File
	): Promise<{ cvUrl: string; cvFileName: string }> {
		await delay(1000);
		const mockUrl = `mock_cvs/${studentId}/${file.name}`; // URL simulada
		console.log(
			`MockService: CV "${file.name}" uploaded for student ${studentId}. Mock URL: ${mockUrl}`
		);

		// Actualizar el perfil del estudiante en userService (o directamente en el appUser store si es más simple para UI)
		const studentUser = (await userService.getUserProfile(studentId)) as Student;
		if (studentUser) {
			await userService.updateUserProfile(studentId, { cvUrl: mockUrl, cvFileName: file.name });
		}
		return { cvUrl: mockUrl, cvFileName: file.name };
	},

	async getPublicStudentProfilesForCompanyView(): Promise<
		Pick<
			Student,
			| 'uid'
			| 'displayName'
			| 'email'
			| 'cvUrl'
			| 'cvFileName'
			| 'bio'
			| 'skills'
			| 'education'
			| 'experience'
		>[]
	> {
		await delay(500);
		// En una app real, esto consultaría perfiles de estudiantes que han optado por ser visibles
		// y solo devolvería campos públicos.
		// Aquí usamos nuestro mock `mockStudentProfilesForCVView`
		return [...mockStudentProfilesForCVView.filter((s) => s.cvUrl)]; // Solo estudiantes con CV
	}
};
