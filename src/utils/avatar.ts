export function avatarFor(
  user: { id?: string; avatarUrl?: string | null } | null | undefined,
  size = 160,
): string {
  return user?.avatarUrl || `https://i.pravatar.cc/${size}?u=${user?.id ?? 'guest'}`;
}
