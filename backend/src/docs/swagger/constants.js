export const areasEnum = [
  'Comercial/Vendas',
  'Administrativa',
  'Gastronomia',
  'Logística',
  'Construção Civil',
  'Industrial',
  'Serviços Gerais',
  'Finanças',
  'Saúde',
  'TI - Tecnologia da Informação',
];

export const swaggerInfo = {
  title: 'JobFinder API',
  version: '1.2.0',
  description: 'Documentação completa da API do JobFinder',
};

export const swaggerServers = [
  {
    url: 'http://localhost:3000/api',
    description: 'Ambiente local',
  },
];

export const swaggerTags = [
  { name: 'Auth' },
  { name: 'Candidato' },
  { name: 'Empresa' },
  { name: 'Vagas' },
  { name: 'Candidaturas' },
];
