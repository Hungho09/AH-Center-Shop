import { create } from 'zustand';

export interface AuthUser {
  maNhanVien: string;
  tenNhanVien: string;
  role: string;
  maChucVu: string | number;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  token: localStorage.getItem('ql_access_token'),
  user: localStorage.getItem('ql_user') ? JSON.parse(localStorage.getItem('ql_user')!) : null,
  isAuthenticated: !!localStorage.getItem('ql_access_token'),
  login: (token, user) => {
    localStorage.setItem('ql_access_token', token);
    localStorage.setItem('ql_user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('ql_access_token');
    localStorage.removeItem('ql_user');
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
