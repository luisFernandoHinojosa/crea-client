export function timeAgo(isoDateString: string): string {
	const date = new Date(isoDateString);
	const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

	let interval = seconds / 31536000; // Años
	if (interval > 1) return `hace ${Math.floor(interval)} años`;
	interval = seconds / 2592000; // Meses
	if (interval > 1) return `hace ${Math.floor(interval)} meses`;
	interval = seconds / 86400; // Días
	if (interval > 1) return `hace ${Math.floor(interval)} días`;
	interval = seconds / 3600; // Horas
	if (interval > 1) return `hace ${Math.floor(interval)} horas`;
	interval = seconds / 60; // Minutos
	if (interval > 1) return `hace ${Math.floor(interval)} minutos`;
	return `hace ${Math.floor(seconds)} segundos`;
}

// Para el plugin de line-clamp, debes instalarlo: npm install -D @tailwindcss/line-clamp
// y agregarlo a tu tailwind.config.js:
// plugins: [
//   require('@tailwindcss/line-clamp'),
// ],
