export const parseList = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data.filter(item => item && typeof item === 'string' && item.trim() !== '');
    if (typeof data === 'string') return data.split(',').map(i => i.trim()).filter(i => i !== '');
    return [];
};
