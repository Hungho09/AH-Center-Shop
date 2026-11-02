import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useAuthStore } from '../../stores/auth.store';
import { apiClient } from '../../services/api/axios-client';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin@123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post('/auth/login', { username, password });
      const { accessToken, user } = response.data.data;
      login(accessToken, user);
      navigate('/');
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Không thể kết nối đến Identity Service. Vui lòng kiểm tra API Gateway.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-700 rounded-xl mb-3">
            <Store className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">AH-Center-Shop</h2>
          <p className="text-sm text-gray-500 mt-1">Đăng nhập cổng quản lý cửa hàng tiện lợi</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Tên đăng nhập"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="admin / cashier"
            required
          />

          <Input
            label="Mật khẩu"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 space-y-1">
            <div className="flex items-center space-x-1.5 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Tài khoản kiểm thử (Scaffold):</span>
            </div>
            <p>
              Admin: <code className="bg-white/70 px-1 py-0.5 rounded">admin</code> /{' '}
              <code className="bg-white/70 px-1 py-0.5 rounded">Admin@123456</code>
            </p>
            <p>
              Thu ngân: <code className="bg-white/70 px-1 py-0.5 rounded">cashier</code> /{' '}
              <code className="bg-white/70 px-1 py-0.5 rounded">Cashier@123456</code>
            </p>
          </div>

          <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
            Đăng nhập
          </Button>
        </form>
      </div>
    </div>
  );
};
