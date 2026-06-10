import { useQuery } from '@tanstack/react-query';
import { getAppGraph, getApps } from '../api/mock-api';

export function useAppsQuery() {
  return useQuery({
    queryKey: ['apps'],
    queryFn: getApps,
  });
}

export function useAppGraphQuery(appId: string | null, shouldFail: boolean) {
  return useQuery({
    queryKey: ['apps', appId, 'graph', shouldFail],
    queryFn: () => getAppGraph(appId!, shouldFail),
    enabled: Boolean(appId),
  });
}
