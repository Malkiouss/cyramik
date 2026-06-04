import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { unwrap, useResourceList } from './useResource';

export const useUsers = (params = {}) => {
  const list = useResourceList('users', params);
  const queryClient = useQueryClient();
  const update = useMutation({
    mutationFn: async ({ id, payload }) => unwrap(await api.patch(`/users/${id}`, payload)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
  return { ...list, update };
};
