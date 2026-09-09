export const toAuthUserDTO = ({ nome, email, role }) => ({
  nome,
  email,
  role,
});

export const toLoginResponseDTO = ({ user, role }) => ({
  success: true,
  message: 'Login realizado com sucesso',
  user: toAuthUserDTO({
    nome: user.nome,
    email: user.email,
    role,
  }),
  redirectUrl: role === 'candidato' ? '/candidato/dashboard' : '/empresa/dashboard',
});
