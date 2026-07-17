export function avatarFor(user, size = 160) {
  return user?.avatarUrl || `https://i.pravatar.cc/${size}?u=${user?.id ?? 'guest'}`;
}
