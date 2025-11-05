// src/lib/types/Common.ts
export interface SelectOption {
	value: string | number;
	label: string;
}

export interface AlertMessage {
	id?: string; // Opcional, para poder removerla
	type: 'success' | 'error' | 'warning' | 'info';
	message: string;
	duration?: number; // en ms, 0 para persistente
}
