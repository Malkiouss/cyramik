import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { unwrap, useResourceCrud, useResourceList } from './useResource';

export const useGiftCards = () => {
  const crud = useResourceCrud('gift-cards');
  const list = useResourceList('gift-cards');
  const queryClient = useQueryClient();
  const validate = useMutation({
    mutationFn: async (code) => unwrap(await api.post('/gift-cards/validate', { code })),
  });
  return {
    ...list,
    ...crud,
    validate,
    update: useMutation({
      mutationFn: async ({ id, payload }) => unwrap(await api.patch(`/gift-cards/${id}`, payload)),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gift-cards'] }),
    }),
  };
};
