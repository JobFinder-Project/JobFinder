import { useQuery } from '@tanstack/react-query';
import { vagasService } from '../../services/vagasService';

export const useVagasQuery = (filtros) => {
    return useQuery({
        queryKey: ['vagas', filtros],
        queryFn: () => vagasService.buscar(filtros),
        staleTime: 1000 * 60 * 5,
    });
};
