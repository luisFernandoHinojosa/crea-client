// // src/lib/stores/authStore.ts
// import { writable, derived, type Writable, type Readable } from 'svelte/store';
// import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
// import type { Admin, AppUser, BaseUser, Company, Student } from '$lib/interfaces/user.interface';
// import type { Role } from '$lib/types/user';
// import { userService } from '$lib/services/user.service';
// import { auth } from '$lib/services/firebase.service';

// export const firebaseUid: Writable<string | null> = writable(null);
// export const appUser: Writable<AppUser> = writable(null);
// export const isLoadingAuth: Writable<boolean> = writable(true);
// export const userRole: Readable<Role> = derived(appUser, ($appUser) => $appUser?.role ?? null);
// import { browser } from '$app/environment';

// // Mapeo para obtener detalles del usuario desde el servicio mock
// // En una app real, esto vendría de Firestore o Custom Claims + Firestore.
// async function fetchAppUserDetails(firebaseUser: FirebaseUser): Promise<AppUser> {
// 	const baseDetails: BaseUser = {
// 		uid: firebaseUser.uid,
// 		email: firebaseUser.email,
// 		displayName: firebaseUser.displayName,
// 		photoURL: firebaseUser.photoURL,
// 		role: null, // El rol se determinará desde userService
// 		createdAt: firebaseUser.metadata.creationTime
// 	};

// 	// Esta es la parte crucial que necesita ser segura en producción.
// 	// Aquí estamos simulando obtener el rol y perfil desde userService.
// 	// En Firebase real, los custom claims se leen así:
// 	// const idTokenResult = await firebaseUser.getIdTokenResult(true); // true para forzar refresco
// 	// const roleFromClaims = idTokenResult.claims.role as Role;
// 	// Y luego se buscaría el perfil en Firestore usando el UID.

// 	const userProfile = await userService.getUserProfile(firebaseUser.uid);

// 	if (userProfile) {
// 		return { ...baseDetails, ...userProfile, role: userProfile.role } as AppUser;
// 	}

// 	// Si no hay perfil (ej. nuevo usuario que no completó el registro de perfil),
// 	// podría tener un rol base asignado durante el signup (ej. 'student')
// 	// que se guarda temporalmente o se le pide seleccionar.
// 	// Por ahora, si no hay perfil, es un BaseUser con rol 'unknown' o null.
// 	// El localStorage es solo para simulación de desarrollo.
// 	const simulatedRole = browser && (localStorage.getItem('simulatedRole') as Role);
// 	if (simulatedRole) {
// 		baseDetails.role = simulatedRole;
// 		// Aquí deberías crear un perfil básico si no existe con ese rol
// 		if (simulatedRole === 'student') return { ...baseDetails, role: 'student' } as Student;
// 		if (simulatedRole === 'company')
// 			return { ...baseDetails, companyName: 'Empresa Pendiente', role: 'company' } as Company;
// 		if (simulatedRole === 'admin') return { ...baseDetails, role: 'admin' } as Admin;
// 	}

// 	return { ...baseDetails, role: null }; // Usuario autenticado pero sin perfil/rol completo
// }

// onAuthStateChanged(auth, async (firebaseUser) => {
// 	isLoadingAuth.set(true);
// 	if (firebaseUser) {
// 		firebaseUid.set(firebaseUser.uid);
// 		const userDetails = await fetchAppUserDetails(firebaseUser);
// 		appUser.set(userDetails);
// 		if (!userDetails?.role && !window.location.pathname.includes('/auth/complete-profile')) {
// 			// Si no tiene rol y no está en la página de completar perfil, redirigir
// 			// Esto es un ejemplo, ajusta la lógica de redirección según tus flujos
// 			// goto('/auth/complete-profile');
// 		}
// 	} else {
// 		firebaseUid.set(null);
// 		appUser.set(null);
// 		if (browser) localStorage.removeItem('simulatedRole');
// 	}
// 	isLoadingAuth.set(false);
// });

// export function setSimulatedRoleInLocalStorage(role: Role) {
// 	if (role) {
// 		if (browser) localStorage.setItem('simulatedRole', role);
// 	} else {
// 		if (browser) localStorage.removeItem('simulatedRole');
// 	}
// 	// Forzar una actualización del appUser si ya está logueado
// 	const currentFirebaseUser = auth.currentUser;
// 	if (currentFirebaseUser) {
// 		fetchAppUserDetails(currentFirebaseUser).then((details) => appUser.set(details));
// 	}
// }

// // Helper para verificar si el usuario es de un tipo específico (para UI)
// export const isStudent: Readable<boolean> = derived(appUser, ($user) => $user?.role === 'student');
// export const isCompany: Readable<boolean> = derived(appUser, ($user) => $user?.role === 'company');
// export const isAdmin: Readable<boolean> = derived(appUser, ($user) => $user?.role === 'admin');
// src/lib/stores/authStore.ts
import { browser } from '$app/environment';
import type { AppUser } from '$lib/interfaces/user.interface';
import type { Role } from '$lib/types/user';
import { writable, derived, type Writable, type Readable } from 'svelte/store';
// Quita la importación de Firebase `onAuthStateChanged` si NO la usas en modo mock
// import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
// import { auth } from '$lib/services/firebaseService'; // No necesario si Firebase está desactivado
// import { userService } from '$lib/services/userService'; // Puedes mantenerlo si cargas perfiles desde un mock service

export const appUser: Writable<AppUser> = writable(null);
export const isLoadingAuth: Writable<boolean> = writable(true); // Podrías setearlo a false más rápido en modo mock
export const userRole: Readable<Role> = derived(appUser, ($appUser) => $appUser?.role ?? null);

// --- SIMULACIÓN DE CARGA INICIAL ---
// En modo completamente mock, podrías intentar cargar desde localStorage al inicio.
// Esto simula la persistencia de sesión entre recargas de página (solo para desarrollo).
function loadUserFromLocalStorageMock(): AppUser | null {
	const simulatedRole = browser && (localStorage.getItem('simulatedRole') as Role);
	const storedUserString = browser && localStorage.getItem('mockAppUser'); // Guardaríamos el AppUser aquí

	if (simulatedRole && storedUserString) {
		try {
			const storedUser = JSON.parse(storedUserString) as AppUser;
			if (storedUser && storedUser.role === simulatedRole) {
				console.log('Mock mode: Loaded user from localStorage', storedUser);
				return storedUser;
			}
		} catch (e) {
			console.error('Error parsing mockAppUser from localStorage', e);
			if (browser) {
				localStorage.removeItem('mockAppUser');
				localStorage.removeItem('simulatedRole');
			}
		}
	}
	return null;
}

const initialUser = loadUserFromLocalStorageMock();
if (initialUser) {
	appUser.set(initialUser);
}
isLoadingAuth.set(false); // En modo mock, la carga es "instantánea" o desde localStorage

// Observador para guardar en localStorage cuando appUser cambie (para persistencia mock)
appUser.subscribe((currentUser) => {
	if (browser && currentUser) {
		localStorage.setItem('mockAppUser', JSON.stringify(currentUser));
	} else {
		if (browser) localStorage.removeItem('mockAppUser');
	}
});
// --- FIN SIMULACIÓN DE CARGA INICIAL ---

// Esta función sigue siendo útil para el LoginForm/RegisterForm que la usa
export function setSimulatedRoleInLocalStorage(role: Role) {
	if (browser && role) {
		localStorage.setItem('simulatedRole', role);
	} else {
		if (browser) localStorage.removeItem('simulatedRole');
	}
	// No es necesario forzar la actualización de appUser aquí si loginUser/registerUser ya lo hacen.
}

// Helpers (sin cambios)
export const isStudent: Readable<boolean> = derived(appUser, ($user) => $user?.role === 'student');
export const isCompany: Readable<boolean> = derived(appUser, ($user) => $user?.role === 'company');
export const isAdmin: Readable<boolean> = derived(appUser, ($user) => $user?.role === 'admin');
