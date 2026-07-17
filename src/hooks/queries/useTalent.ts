import { useQuery } from '@tanstack/react-query';
import * as usersApi from '../../api/users';
import { queryKeys } from '../../lib/queryKeys';

export function useTalent() {
  return useQuery({ queryKey: queryKeys.talent(), queryFn: usersApi.listTalent });
}
