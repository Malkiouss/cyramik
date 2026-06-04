import { useResourceCrud, useResourceList } from './useResource';

export const useShipping = () => {
  const crud = useResourceCrud('shipping');
  const list = useResourceList('shipping');
  return { ...list, ...crud };
};
