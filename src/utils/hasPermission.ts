import type { UserData } from "@/store/useAuthStore";

export const hasPermission = (user: UserData | null, permission: string) => {
  if (!user) return false;
  return user.permissions.some(
    (userPermission) => userPermission.name === permission,
  );
};
