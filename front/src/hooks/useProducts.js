import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { unwrap, useResourceCrud, useResourceList } from './useResource';

const asFormData = (payload) => {
  if (payload instanceof FormData) return payload;
  const formData = new FormData();
  Object.entries(payload || {}).forEach(([key, value]) => {
    if (Array.isArray(value)) value.forEach((item) => formData.append(key, item));
    else if (value !== undefined && value !== null) formData.append(key, value);
  });
  return formData;
};

export const useProducts = (params = {}) => {
  const crud = useResourceCrud('products');
  const list = useResourceList('products', params);
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['products'] });
  return {
    ...list,
    ...crud,
    createWithImages: useMutation({
      mutationFn: async (payload) => unwrap(await api.post('/products', asFormData(payload), { headers: { 'Content-Type': 'multipart/form-data' } })),
      onSuccess: invalidate,
    }),
    updateWithImages: useMutation({
      mutationFn: async ({ id, payload }) => unwrap(await api.put(`/products/${id}`, asFormData(payload), { headers: { 'Content-Type': 'multipart/form-data' } })),
      onSuccess: invalidate,
    }),
    toggle: useMutation({
      mutationFn: async (id) => unwrap(await api.patch(`/products/${id}/toggle`)),
      onSuccess: invalidate,
    }),
  };
};
