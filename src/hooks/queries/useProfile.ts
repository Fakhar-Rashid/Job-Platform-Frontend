import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as profileApi from '../../api/profile';
import { queryKeys } from '../../lib/queryKeys';

export function useProfile(id: string) {
  return useQuery({
    queryKey: queryKeys.profile(id),
    queryFn: () => profileApi.getProfile(id),
    enabled: Boolean(id),
  });
}

function useInvalidateProfile() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ['profile'] });
}

export function useUpdateCore() {
  const invalidate = useInvalidateProfile();
  return useMutation({ mutationFn: profileApi.updateCore, onSuccess: invalidate });
}

export function useUpdateSkills() {
  const invalidate = useInvalidateProfile();
  return useMutation({ mutationFn: profileApi.updateSkills, onSuccess: invalidate });
}

export function useChildMutations(path: string) {
  const invalidate = useInvalidateProfile();
  return {
    create: useMutation({ mutationFn: (data: Record<string, unknown>) => profileApi.createChild(path, data), onSuccess: invalidate }),
    update: useMutation({ mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => profileApi.updateChild(path, id, data), onSuccess: invalidate }),
    remove: useMutation({ mutationFn: (id: string) => profileApi.deleteChild(path, id), onSuccess: invalidate }),
  };
}
