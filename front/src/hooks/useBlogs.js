import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { unwrap, useResourceCrud, useResourceList } from './useResource';

export const useBlogs = (params = {}) => {
  const crud = useResourceCrud('blogs');
  const list = useResourceList('blogs', params);
  const queryClient = useQueryClient();
  const publish = useMutation({
    mutationFn: async (id) => unwrap(await api.patch(`/blogs/${id}/publish`)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] }),
  });
  return { ...list, ...crud, publish };
};
