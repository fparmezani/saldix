import { useQuery } from '@tanstack/react-query';
import { fetchOverview } from '../api/overview';

export function useOverview(months: number) {
  return useQuery({
    queryKey: ['overview', months],
    queryFn: () => fetchOverview(months),
  });
}
