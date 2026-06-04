import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { unwrap, useResourceCrud, useResourceList } from './useResource';
import { isBlogItem } from '../utils/catalog';

export const useBlogs = (params = {}) => {
  const crud = useResourceCrud('blogs');
  const list = useResourceList('blogs', params);
  const queryClient = useQueryClient();
  const publish = useMutation({
    mutationFn: async (id) => unwrap(await api.patch(`/blogs/${id}/publish`)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] }),
  });
  return { ...list, data: (list.data || []).filter(isBlogItem), ...crud, publish };
};

export const useBlog = (id) => useQuery({
  queryKey: ['blogs', id],
  queryFn: async () => {
    const blog = unwrap(await api.get(`/blogs/${id}`));
    return isBlogItem(blog) ? blog : null;
  },
  enabled: Boolean(id),
});
