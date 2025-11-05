import type { AppUser, Company, Student } from '$lib/interfaces/user.interface';
import type { Role } from '$lib/types/user';

// Mock Database
let mockUsers: AppUser[] = [
	{
		uid: 'admin-001',
		email: 'admin@example.com',
		displayName: 'Admin User',
		role: 'admin',
		createdAt: new Date().toISOString()
	},
	{
		uid: 'student-001',
		email: 'student1@example.com',
		displayName: 'Alex Torrico',
		role: 'student',
		cvUrl: 'mock_cvs/alice.pdf',
		cvFileName: 'alice_cv.pdf',
		bio: 'Future Svelte Developer',
		skills: ['HTML', 'CSS'],
		createdAt: new Date().toISOString()
	},
	{
		uid: 'student-002',
		email: 'student2@example.com',
		displayName: 'Nohemi Vedia',
		role: 'student',
		bio: 'Data Science Enthusiast',
		skills: ['Python', 'SQL'],
		createdAt: new Date().toISOString()
	},
	{
		uid: 'company-001',
		email: 'hr@techcorp.com',
		displayName: 'Meta Company',
		role: 'company',
		companyName: 'Meta Company',
		description: 'Innovative tech solutions.',
		website: 'https://techcorp.example.com',
		createdAt: new Date().toISOString()
	},
	{
		uid: 'company-002',
		email: 'contact@startupx.com',
		displayName: 'Sotfai',
		role: 'company',
		companyName: 'Sotfai consulting',
		description: 'Consultoria en desarrollo de software con integración de IA.',
		createdAt: new Date().toISOString()
	}
];

async function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const userService = {
	async getUserProfile(uid: string): Promise<AppUser | null> {
		await delay(300);
		const user = mockUsers.find((u) => u?.uid === uid) || null;
		// console.log(`MockDB: Fetched profile for UID ${uid}:`, user);
		return user;
	},

	async createUserProfile(uid: string, profileData: AppUser): Promise<AppUser> {
		await delay(400);
		if (mockUsers.find((u) => u?.uid === uid)) {
			// throw new Error('User profile already exists'); // O actualizar si esa es la lógica
			return this.updateUserProfile(uid, profileData);
		}
		const newUser = { ...profileData, uid }; // Asegurar que el UID esté
		mockUsers.push(newUser);
		console.log('MockDB: Created profile:', newUser);
		return newUser;
	},

	async updateUserProfile(uid: string, updates: Partial<AppUser>): Promise<AppUser> {
		await delay(400);
		let userIndex = mockUsers.findIndex((u) => u?.uid === uid);
		if (userIndex === -1) {
			throw new Error('User profile not found for update.');
		}
		// @ts-ignore // Ignoramos para la simulación de mock, en real sería más seguro
		mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates, uid }; // Asegurar que el UID y rol no se sobrescriban accidentalmente con undefined
		console.log('MockDB: Updated profile:', mockUsers[userIndex]);
		return mockUsers[userIndex];
	},

	async getAllUsersByRole(role: Role): Promise<AppUser[]> {
		await delay(500);
		return mockUsers.filter((u) => u?.role === role);
	},

	async getStudents(): Promise<Student[]> {
		await delay(500);
		return mockUsers.filter((u) => u?.role === 'student') as Student[];
	},

	async getCompanies(): Promise<Company[]> {
		await delay(500);
		return mockUsers.filter((u) => u?.role === 'company') as Company[];
	},

	async deleteUser(uid: string): Promise<void> {
		await delay(300);
		mockUsers = mockUsers.filter((u) => u?.uid !== uid);
		console.log(`MockDB: Deleted user ${uid}`);
	},

	async getStudentCount(): Promise<number> {
		await delay(100);
		return mockUsers.filter((u) => u?.role === 'student').length;
	},

	async getCompanyCount(): Promise<number> {
		await delay(100);
		return mockUsers.filter((u) => u?.role === 'company').length;
	}
};
