import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { unwrap } from './useResource';

export const useDashboard = () => useQuery({
  queryKey: ['dashboard', 'stats'],
  queryFn: async () => unwrap(await api.get('/dashboard/stats')),
});
