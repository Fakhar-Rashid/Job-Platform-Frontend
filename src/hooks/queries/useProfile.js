import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as profileApi from '../../api/profile.js';
import { queryKeys } from '../../lib/queryKeys.js';

export function useProfile(id) {
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

export function useChildMutations(path) {
  const invalidate = useInvalidateProfile();
  return {
    create: useMutation({ mutationFn: (data) => profileApi.createChild(path, data), onSuccess: invalidate }),
    update: useMutation({ mutationFn: ({ id, data }) => profileApi.updateChild(path, id, data), onSuccess: invalidate }),
    remove: useMutation({ mutationFn: (id) => profileApi.deleteChild(path, id), onSuccess: invalidate }),
  };
}
