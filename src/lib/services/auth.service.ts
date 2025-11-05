// // src/lib/services/authService.ts

// import { goto } from '$app/navigation';
// import type { Role } from '$lib/types/user';
// import {
// 	createUserWithEmailAndPassword,
// 	signOut as firebaseSignOut,
// 	signInWithEmailAndPassword,
// 	updateProfile as updateFirebaseProfile,
// 	type User as FirebaseUser
// } from 'firebase/auth';
// import { auth } from './firebase.service';
// import type { Admin, AppUser, Company, Student } from '$lib/interfaces/user.interface';
// import { userService } from './user.service';
// import { appUser, setSimulatedRoleInLocalStorage } from '$lib/stores/authStore';
// export interface RegistrationDetails {
// 	email: string;
// 	pass: string;
// 	role: Role;
// 	displayName?: string;
// 	companyName?: string; // Para empresas
// }

// export async function registerUser(
// 	details: RegistrationDetails
// ): Promise<{ user?: FirebaseUser; error?: string }> {
// 	try {
// 		const userCredential = await createUserWithEmailAndPassword(auth, details.email, details.pass);
// 		const firebaseUser = userCredential.user;

// 		// Actualizar perfil de Firebase Auth (displayName)
// 		if (details.displayName || details.companyName) {
// 			await updateFirebaseProfile(firebaseUser, {
// 				displayName: details.role === 'company' ? details.companyName : details.displayName
// 			});
// 		}

// 		// SIMULACIÓN DE ROL y creación de perfil inicial
// 		setSimulatedRoleInLocalStorage(details.role);

// 		// Crear perfil base en nuestro servicio mock (en real, sería en Firestore)
// 		const profileData: Partial<Student | Company | Admin> = {
// 			uid: firebaseUser.uid,
// 			email: firebaseUser.email,
// 			displayName: details.role === 'company' ? details.companyName : details.displayName,
// 			role: details.role,
// 			createdAt: new Date().toISOString()
// 		};

// 		if (details.role === 'company' && details.companyName) {
// 			(profileData as Partial<Company>).companyName = details.companyName;
// 		}

// 		await userService.createUserProfile(firebaseUser.uid, profileData as AppUser); // La aserción puede ser riesgosa, mejorar tipado.

// 		// El store se actualizará a través de onAuthStateChanged
// 		return { user: firebaseUser };
// 	} catch (error: any) {
// 		console.error('Registration error:', error);
// 		return { error: error.message || 'Fallo al registrar.' };
// 	}
// }

// export async function loginUser(
// 	email: string,
// 	pass: string,
// 	chosenRoleForSimulation?: Role
// ): Promise<{ user?: FirebaseUser; error?: string }> {
// 	try {
// 		const userCredential = await signInWithEmailAndPassword(auth, email, pass);
// 		// SIMULACIÓN DE ROL: Si es necesario forzar un rol para la UI en desarrollo
// 		if (chosenRoleForSimulation) {
// 			setSimulatedRoleInLocalStorage(chosenRoleForSimulation);
// 		}
// 		// El store se actualizará a través de onAuthStateChanged
// 		return { user: userCredential.user };
// 	} catch (error: any) {
// 		console.error('Login error:', error);
// 		return { error: error.message || 'Fallo al iniciar sesión.' };
// 	}
// }

// export async function signOut(): Promise<void> {
// 	try {
// 		await firebaseSignOut(auth);
// 		appUser.set(null); // Limpia el store explícitamente
// 		setSimulatedRoleInLocalStorage(null); // Limpia el rol simulado
// 		goto('/login', { replaceState: true });
// 	} catch (error) {
// 		console.error('Logout error:', error);
// 	}
// }

// export async function updateUserProfile(uid: string, data: Partial<AppUser>): Promise<void> {
// 	await userService.updateUserProfile(uid, data);
// 	// Refrescar el usuario en el store
// 	if (auth.currentUser && auth.currentUser.uid === uid) {
// 		const updatedUser = await userService.getUserProfile(uid);
// 		appUser.set(updatedUser);
// 	}
// }
// src/lib/services/authService.ts
import { appUser, setSimulatedRoleInLocalStorage } from '$lib/stores/authStore';
import { goto } from '$app/navigation'; // Importar goto para signOut
import type { Admin, AppUser, BaseUser, Company, Student } from '$lib/interfaces/user.interface';
import type { Role } from '$lib/types/user';
import { browser } from '$app/environment';

// Interfaz para usuarios mock, incluyendo contraseña (solo para simulación)
interface MockUserWithPassword extends BaseUser {
	password?: string; // Contraseña en texto plano SOLO para simulación
	// Incluir otros campos específicos si es necesario para la simulación completa del perfil
	companyName?: string; // Para Company
	bio?: string; // Para Student
	skills?: string[]; // Para Student
}

// --- USUARIOS DE PRUEBA ---
const mockUsersList: MockUserWithPassword[] = [
	{
		uid: 'mock-student-001',
		email: 'student@example.com',
		password: 'password123',
		role: 'student',
		displayName: 'Ana Estudiante',
		bio: 'Entusiasta del desarrollo web y aprendiendo Svelte.',
		skills: ['HTML', 'CSS', 'JavaScript (Básico)'],
		createdAt: new Date().toISOString()
	} as Student & { password?: string }, // Casting para incluir password y campos de Student
	{
		uid: 'mock-company-001',
		email: 'company@example.com',
		password: 'password123',
		role: 'company',
		displayName: 'Tech Innovate SRL',
		companyName: 'Tech Innovate SRL',
		description: 'Empresa líder en soluciones tecnológicas.',
		website: 'https://techinnovate.example.com',
		createdAt: new Date().toISOString()
	} as Company & { password?: string },
	{
		uid: 'mock-admin-001',
		email: 'admin@example.com',
		password: 'password123',
		role: 'admin',
		displayName: 'Admin Principal',
		createdAt: new Date().toISOString()
	} as Admin & { password?: string }
];
// --- FIN USUARIOS DE PRUEBA ---

export interface RegistrationDetails {
	email: string;
	pass: string;
	role: Role;
	displayName?: string;
	companyName?: string;
}

// --- FUNCIÓN LOGINUSER MODIFICADA PARA SIMULACIÓN ---
export async function loginUser(
	email: string,
	pass: string,
	chosenRole: Role
): Promise<{ user?: AppUser; error?: string }> {
	console.log(`Attempting mock login for: ${email}, role: ${chosenRole}`);
	await new Promise((resolve) => setTimeout(resolve, 500)); // Simular delay de red

	const foundUser = mockUsersList.find(
		(u) => u.email === email && u.password === pass && u.role === chosenRole
	);

	if (foundUser) {
		// MUY IMPORTANTE: Nunca expongas la contraseña.
		// Incluso en simulación, es buena práctica removerla antes de pasarla al store.
		const { password, ...userToStoreData } = foundUser;

		const userProfile: AppUser = userToStoreData as AppUser; // Casting después de quitar password

		setSimulatedRoleInLocalStorage(userProfile.role); // Persiste el rol para desarrollo
		appUser.set(userProfile); // Actualiza el store global con el usuario completo

		console.log('Mock login successful:', userProfile);
		return { user: userProfile };
	} else {
		console.log('Mock login failed: Incorrect credentials or role mismatch.');
		return { error: 'Credenciales incorrectas o el rol no coincide para este usuario de prueba.' };
	}
}
// --- FIN FUNCIÓN LOGINUSER MODIFICADA ---

export async function registerUser(
	details: RegistrationDetails
): Promise<{ user?: AppUser; error?: string }> {
	console.log('Attempting mock registration:', details);
	await new Promise((resolve) => setTimeout(resolve, 500));

	if (mockUsersList.find((u) => u.email === details.email)) {
		return { error: 'Este correo electrónico ya está registrado (en modo de prueba).' };
	}

	// Crear nuevo usuario mock
	const newUserBase: MockUserWithPassword = {
		uid: `mock-${details.role}-${Date.now()}`,
		email: details.email,
		password: details.pass, // Guardar contraseña para simulación de login posterior
		role: details.role,
		displayName: details.role === 'company' ? details.companyName : details.displayName,
		createdAt: new Date().toISOString()
	};

	let newUser: AppUser;

	if (details.role === 'student') {
		newUser = { ...newUserBase, bio: 'Nuevo estudiante listo para aprender.' } as Student & {
			password?: string;
		};
	} else if (details.role === 'company') {
		newUser = {
			...newUserBase,
			companyName: details.companyName || 'Nueva Empresa',
			description: 'Descripción pendiente.'
		} as Company & { password?: string };
	} else if (details.role === 'admin') {
		newUser = { ...newUserBase } as Admin & { password?: string };
	} else {
		return { error: 'Rol de usuario no válido para registro mock.' };
	}

	mockUsersList.push(newUser as MockUserWithPassword); // Añadir a la lista (incluyendo password para simulación)
	console.log('Mock user registered:', newUser);

	// Simular login automático después del registro
	const { password, ...userToStoreData } = newUser as any; // Quitar password
	setSimulatedRoleInLocalStorage(userToStoreData.role);
	appUser.set(userToStoreData as AppUser);

	return { user: userToStoreData as AppUser };
}

export async function signOut(): Promise<void> {
	console.log('Executing mock signOut');
	await new Promise((resolve) => setTimeout(resolve, 200));
	appUser.set(null);
	setSimulatedRoleInLocalStorage(null);
	goto('/auth/login', { replaceState: true }); // Redirigir al login
}

// Mantén updateUserProfile si lo necesitas, adaptándolo para que modifique mockUsersList
// y actualice el store appUser si el UID coincide.
export async function updateUserProfile(uid: string, data: Partial<AppUser>): Promise<void> {
	console.log(`Mock updateUserProfile for UID ${uid} with data:`, data);
	const userIndex = mockUsersList.findIndex((u) => u.uid === uid);
	if (userIndex !== -1) {
		// @ts-ignore - para la simulación
		mockUsersList[userIndex] = { ...mockUsersList[userIndex], ...data };

		// Si el usuario actualizado es el usuario actual en el store, actualízalo
		let currentUserInStore: AppUser = null;
		appUser.subscribe((value) => (currentUserInStore = value))(); // Obtener valor actual
		if (currentUserInStore && currentUserInStore.uid === uid) {
			const { password, ...userToStoreData } = mockUsersList[userIndex] as any;
			appUser.set(userToStoreData as AppUser);
		}
		console.log('Mock user profile updated in list:', mockUsersList[userIndex]);
	} else {
		console.warn('Mock updateUserProfile: User not found in mock list.');
	}
}
