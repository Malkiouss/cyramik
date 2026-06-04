import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { unwrap, useResourceList } from './useResource';

export const useMessages = (params = {}) => {
  const list = useResourceList('messages', params);
  const queryClient = useQueryClient();
  const markRead = useMutation({
    mutationFn: async (id) => unwrap(await api.patch(`/messages/${id}/read`)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['messages'] }),
  });
  const remove = useMutation({
    mutationFn: async (id) => unwrap(await api.delete(`/messages/${id}`)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['messages'] }),
  });
  return { ...list, markRead, remove };
};
