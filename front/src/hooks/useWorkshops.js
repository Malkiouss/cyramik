import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { unwrap, useResourceCrud, useResourceList } from './useResource';

export const useWorkshops = (params = {}) => {
  const crud = useResourceCrud('workshops');
  const list = useResourceList('workshops', params);
  const queryClient = useQueryClient();
  const enroll = useMutation({
    mutationFn: async (id) => unwrap(await api.patch(`/workshops/${id}/enroll`)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workshops'] }),
  });
  return { ...list, ...crud, enroll };
};
