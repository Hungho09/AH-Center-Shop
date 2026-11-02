import React, { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { apiClient } from '../../services/api/axios-client';
import { Server, Database, CheckCircle2, AlertCircle } from 'lucide-react';

export interface FeaturePlaceholderProps {
  title: string;
  description: string;
  serviceName: string;
  servicePort: number;
  apiEndpoint: string;
  tables: string[];
}

export const FeaturePlaceholder: React.FC<FeaturePlaceholderProps> = ({
  title,
  description,
  serviceName,
  servicePort,
  apiEndpoint,
  tables,
}) => {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const response = await apiClient.get(apiEndpoint);
      setTestResult({
        success: true,
        message: `Kết nối thành công tới ${serviceName} thông qua API Gateway! (HTTP ${response.status})`,
        details: response.data,
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Lỗi kết nối: ${err.response?.data?.message || err.message}`,
        details: err.response?.data,
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <Badge variant="warning">Chờ triển khai nghiệp vụ</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Microservice Phụ Trách">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <Server className="w-4 h-4 text-green-600" />
              <span className="font-semibold">{serviceName}</span>
            </div>
            <p className="text-xs text-gray-500">Cổng nội bộ: :{servicePort}</p>
            <p className="text-xs text-gray-500">
              Endpoint kiểm tra:{' '}
              <code className="bg-gray-100 px-1 py-0.5 rounded">{apiEndpoint}</code>
            </p>
          </div>
        </Card>

        <Card title="Bảng Dữ Liệu Sở Hữu">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-700 mb-2">
              <Database className="w-4 h-4 text-blue-600" />
              <span>Database: QL_CuaHangTienLoi</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {tables.map(t => (
                <span
                  key={t}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-mono rounded border"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Card>

        <Card title="Trạng Thái Nền Tảng">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs text-green-700">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Gateway Route & Downstream Configured</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-green-700">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>TypeORM Entities & Boundary Mapped</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={handleTestConnection}
              isLoading={testing}
            >
              Kiểm tra kết nối Gateway
            </Button>
          </div>
        </Card>
      </div>

      {testResult && (
        <div
          className={`p-4 rounded-xl border flex items-start space-x-3 ${
            testResult.success
              ? 'bg-green-50 border-green-200 text-green-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          {testResult.success ? (
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          )}
          <div className="text-xs">
            <p className="font-semibold">{testResult.message}</p>
            {testResult.details && (
              <pre className="mt-2 p-2 bg-white/70 rounded text-[11px] font-mono overflow-x-auto max-h-40">
                {JSON.stringify(testResult.details, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
