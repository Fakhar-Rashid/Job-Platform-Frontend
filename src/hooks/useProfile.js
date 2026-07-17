import { useCallback, useEffect, useState } from 'react';
import * as profileApi from '../api/profile.js';
import { getErrorMessage } from '../api/client.js';

export function useProfile(id) {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  const reload = useCallback(() => {
    if (!id) return;
    profileApi.getProfile(id).then(setProfile).catch((err) => setError(getErrorMessage(err)));
  }, [id]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { profile, error, reload };
}
