import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { unwrap } from './useResource';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const me = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => unwrap(await api.get('/auth/me')).user,
    retry: false,
  });

  const login = useMutation({
    mutationFn: async (credentials) => unwrap(await api.post('/auth/login', credentials)).user,
    onSuccess: (user) => queryClient.setQueryData(['auth', 'me'], user),
  });

  const logout = useMutation({
    mutationFn: async () => unwrap(await api.post('/auth/logout')),
    onSuccess: () => queryClient.removeQueries({ queryKey: ['auth'] }),
  });

  return { user: me.data, getMe: me, login, logout };
};
