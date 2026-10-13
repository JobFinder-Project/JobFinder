/**
 * Formatadores de campos de formulário compartilhados entre as telas.
 *
 * Extraídos de SignupPage.jsx e PerfilEmpresaModal.jsx, que mantinham
 * cópias duplicadas de formatPhone.
 */

export const formatCPF = (val) => {
    return val.replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
        .slice(0, 14);
};

export const formatCNPJ = (val) => {
    return val.replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
        .slice(0, 18);
};

export const formatPhone = (val) => {
    return val.replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
};
