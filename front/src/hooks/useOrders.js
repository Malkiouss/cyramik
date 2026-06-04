import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { unwrap, useResourceCrud, useResourceList } from './useResource';

export const useOrders = (params = {}) => {
  const crud = useResourceCrud('orders');
  const list = useResourceList('orders', params);
  const queryClient = useQueryClient();
  const updateStatus = useMutation({
    mutationFn: async ({ id, status }) => unwrap(await api.patch(`/orders/${id}/status`, { status })),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  });
  return { ...list, ...crud, updateStatus };
};
