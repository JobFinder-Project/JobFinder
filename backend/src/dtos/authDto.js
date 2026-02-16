export const toAuthUserDTO = ({ id, nome, email, role }) => ({
  id,
  nome,
  email,
  role,
});

export const toLoginResponseDTO = ({ user, role }) => ({
  success: true,
  message: 'Login realizado com sucesso',
  user: toAuthUserDTO({
    id: user._id,
    nome: user.nome,
    email: user.email,
    role,
  }),
  redirectUrl: role === 'candidato' ? '/candidato/dashboard' : '/empresa/dashboard',
});
