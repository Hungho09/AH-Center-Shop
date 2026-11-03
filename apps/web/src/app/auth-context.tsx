import React, { createContext, useContext, useMemo } from 'react';
import { useAuthStore, AuthUser } from '@/stores/auth.store';
import { Permission, ROLE_PERMISSIONS, UserRole } from '@ql/contracts';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  can: (permission: Permission) => boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, user, isAuthenticated, login, logout } = useAuthStore();

  const userPermissions = useMemo<Permission[]>(() => {
    if (!user || !user.role) return [];
    const roleKey = user.role.toUpperCase() as UserRole;
    return ROLE_PERMISSIONS[roleKey] || [];
  }, [user]);

  const can = (permission: Permission): boolean => {
    if (!isAuthenticated || !user) return false;
    if (user.role?.toUpperCase() === 'ADMIN') return true;
    return userPermissions.includes(permission);
  };

  const hasRole = (role: UserRole): boolean => {
    if (!user || !user.role) return false;
    return user.role.toUpperCase() === role.toUpperCase();
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (!user || !user.role) return false;
    const current = user.role.toUpperCase();
    return roles.some(r => r.toUpperCase() === current);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        logout,
        can,
        hasRole,
        hasAnyRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

