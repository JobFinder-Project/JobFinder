export const isApproved = (s) => ['aceito', 'aceita', 'aprovado', 'aprovada'].includes(s?.toLowerCase());
export const isPending = (s) => s?.toLowerCase().includes('pendente');
export const isRejected = (s) => ['rejeitado', 'rejeitada', 'cancelado', 'cancelada'].includes(s?.toLowerCase());
