import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { apiClient } from '../../services/api/axios-client';
import { Server, Database, Activity, Layers, CheckCircle2, RefreshCw } from 'lucide-react';

interface GatewayHealth {
  status: string;
  service: string;
  version: string;
  timestamp: string;
  uptime: number;
}

export const DashboardPage: React.FC = () => {
  const [gatewayHealth, setGatewayHealth] = useState<GatewayHealth | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/health');
      setGatewayHealth(response.data);
    } catch (err: any) {
      setError(err.message || 'Không thể lấy thông tin sức khoẻ từ API Gateway');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const microservices = [
    { name: 'api-gateway', port: 3000, desc: 'Central routing, Auth & Correlation ID' },
    { name: 'identity-service', port: 3001, desc: 'JWT & Authentication foundation (ADR-003)' },
    { name: 'product-inventory-service', port: 3002, desc: 'LOAIHANG, HANGHOA & Inventory' },
    {
      name: 'purchase-service',
      port: 3003,
      desc: 'NHACUNGCAP, PHIEUNHAP & usp_HoanThanhPhieuNhap',
    },
    { name: 'sales-service', port: 3004, desc: 'HOADON, CT_HOADON & usp_ThanhToanHoaDon' },
    { name: 'customer-loyalty-service', port: 3005, desc: 'KHACHHANG, HANGTHANHVIEN & Points' },
    { name: 'hr-service', port: 3006, desc: 'CHUCVU, NHANVIEN, CALAMVIEC, PHANCA' },
    { name: 'inventory-loss-service', port: 3007, desc: 'PHIEUHUY & Stock loss commands' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-green-700 to-emerald-600 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Hệ Thống Quản Lý QL_CuaHangTienLoi</h1>
          <p className="text-green-100 text-sm mt-1">
            Nền tảng kiến trúc Microservices Monorepo (Stage 2 → Stage 6 Technical Scaffolding).
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="secondary" size="sm" onClick={fetchHealth} isLoading={loading}>
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Làm mới trạng thái
          </Button>
        </div>
      </div>

      {/* Metrics overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Trạng Thái Gateway</p>
              <h4 className="text-lg font-bold text-gray-900 mt-1">
                {gatewayHealth
                  ? gatewayHealth.status.toUpperCase()
                  : error
                    ? 'OFFLINE'
                    : 'CHECKING...'}
              </h4>
            </div>
            <div
              className={`p-2 rounded-lg ${gatewayHealth ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            >
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-gray-400 mt-2">
            {gatewayHealth ? `Uptime: ${gatewayHealth.uptime}s` : 'Chờ khởi chạy backend'}
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Số Microservices</p>
              <h4 className="text-lg font-bold text-gray-900 mt-1">8 Services</h4>
            </div>
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <Server className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-gray-400 mt-2">1 Gateway + 7 Domain Services</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Database Schema</p>
              <h4 className="text-lg font-bold text-gray-900 mt-1">14 Tables</h4>
            </div>
            <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-gray-400 mt-2">SQL Server (Shared DB Phase 1)</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Stored Procedures & Views</p>
              <h4 className="text-lg font-bold text-gray-900 mt-1">2 SPs / 1 View</h4>
            </div>
            <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-gray-400 mt-2">Gated callers & Safe execution</p>
        </Card>
      </div>

      {/* Services status list */}
      <Card
        title="Danh Sách 8 Microservices Hệ Thống"
        subtitle="Đã scaffold đầy đủ cấu trúc domain, entities, routes và correlation tracking"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {microservices.map(svc => (
            <div
              key={svc.name}
              className="p-4 border rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors flex items-start justify-between"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-sm text-gray-900">{svc.name}</span>
                  <Badge variant="neutral">Port :{svc.port}</Badge>
                </div>
                <p className="text-xs text-gray-500 mt-1">{svc.desc}</p>
              </div>
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
