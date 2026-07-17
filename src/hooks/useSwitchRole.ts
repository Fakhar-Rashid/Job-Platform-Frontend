import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import * as profileApi from '../api/profile';
import type { Role } from '../types';

export function useSwitchRole() {
  const { user, refreshUser } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [switching, setSwitching] = useState(false);

  const otherRole: Role = user?.activeRole === 'CLIENT' ? 'FREELANCER' : 'CLIENT';

  async function switchRole() {
    if (!user || switching) return;
    setSwitching(true);
    try {
      await profileApi.updateCore({ activeRole: otherRole });
      await refreshUser();
      qc.invalidateQueries({ queryKey: ['profile'] });
      navigate('/');
    } finally {
      setSwitching(false);
    }
  }

  return { otherRole, switchRole, switching };
}
