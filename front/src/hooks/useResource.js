import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

const unwrap = ({ data }) => data.data;
const unwrapList = (payload) => Array.isArray(payload) ? payload : payload.items || [];

export const useResourceList = (resource, params = {}, options = {}) => useQuery({
  queryKey: [resource, params],
  queryFn: async () => unwrapList(unwrap(await api.get(`/${resource}`, { params }))),
  ...options,
});

export const useResourceCrud = (resource) => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: [resource] });

  return {
    create: useMutation({
      mutationFn: async (payload) => unwrap(await api.post(`/${resource}`, payload)),
      onSuccess: invalidate,
    }),
    update: useMutation({
      mutationFn: async ({ id, payload }) => unwrap(await api.put(`/${resource}/${id}`, payload)),
      onSuccess: invalidate,
    }),
    patch: useMutation({
      mutationFn: async ({ id, payload }) => unwrap(await api.patch(`/${resource}/${id}`, payload)),
      onSuccess: invalidate,
    }),
    remove: useMutation({
      mutationFn: async (id) => unwrap(await api.delete(`/${resource}/${id}`)),
      onSuccess: invalidate,
    }),
  };
};

export { unwrap };
