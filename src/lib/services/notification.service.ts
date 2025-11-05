// src/lib/services/notificationService.ts

import type { Company, Student } from '$lib/interfaces/user.interface';

async function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const notificationService = {
	async sendInterestNotificationToStudent(
		company: Pick<Company, 'companyName'>,
		student: Pick<Student, 'email' | 'displayName'>
	): Promise<void> {
		await delay(500);
		const message = `Simulación de Email:
    Para: ${student.email} (${student.displayName})
    De: ${company.companyName}
    Asunto: Interés en tu perfil para Pasantías

    Estimado/a ${student.displayName || 'estudiante'},

    Hemos visto tu perfil en nuestra plataforma de pasantías y estamos interesados en tu candidatura.
    Te invitamos a revisar nuestras ofertas actuales.

    Saludos cordiales,
    El equipo de ${company.companyName}`;

		console.log('--- INICIO NOTIFICACIÓN SIMULADA ---');
		console.log(message);
		console.log('--- FIN NOTIFICACIÓN SIMULADA ---');
		// En una app real, esto llamaría a una Firebase Function que usa SendGrid, Nodemailer, etc.
	},

	async notifyStudentApplicationUpdate(
		studentEmail: string,
		internshipTitle: string,
		newStatus: string
	): Promise<void> {
		await delay(300);
		const message = `Simulación de Email:
    Para: ${studentEmail}
    Asunto: Actualización de tu postulación: ${internshipTitle}

    Estimado/a estudiante,

    El estado de tu postulación para la pasantía "${internshipTitle}" ha sido actualizado a: ${newStatus}.
    Puedes revisar los detalles en la plataforma.

    Saludos.`;
		console.log('--- INICIO NOTIFICACIÓN SIMULADA (ESTADO APP) ---');
		console.log(message);
		console.log('--- FIN NOTIFICACIÓN SIMULADA (ESTADO APP) ---');
	}
};
