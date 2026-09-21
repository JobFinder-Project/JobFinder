export const toAuthUserDTO = ({ nome, email, role, consentimentosPendentes = [] }) => ({
  nome,
  email,
  role,
  consentimentosPendentes,
});

export const toLoginResponseDTO = ({ user, role, consentimentosPendentes = [] }) => ({
  success: true,
  message: 'Login realizado com sucesso',
  user: toAuthUserDTO({
    nome: user.nome,
    email: user.email,
    role,
    consentimentosPendentes,
  }),
  redirectUrl:
    consentimentosPendentes.length > 0
      ? '/consentimentos-pendentes'
      : role === 'candidato'
        ? '/candidato/dashboard'
        : '/empresa/dashboard',
});
