

// Removed duplicate Deploymentreport function

import { useState, useEffect } from 'react';
import './Assetallocation.css';
import { getDistributedAssetsByArea } from '../api/endpoint';

interface DistributionReport {
  assetId: number;
  assetReconciliationId: number;
  assetName: string;
  assetType: string;
  categoryId: number;
  categoryName: string;
  areaId: number;
  areaName: string;
  serialNumber: string;
  rfidNo: string;
  qrCode: string;
  assetStatus: string;
  distributionDate?: string; // fallback if present
}

interface Area {
  areaTypeId: number;
  areaTypeName: string;
}

function Deploymentreport() {
  const [distributions, setDistributions] = useState<DistributionReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('');
  const [areas, setAreas] = useState<Area[]>([]);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  useEffect(() => {
    fetchDistributionData();
  }, []);

  const fetchDistributionData = async () => {
    try {
      setLoading(true);
      // areaId: 0 means all areas
      const response = await getDistributedAssetsByArea(0);
      let data = [];
      if (Array.isArray(response)) {
        data = response;
      } else if (response?.data && Array.isArray(response.data)) {
        data = response.data;
      }
      setDistributions(data);
      // Extract unique areas
      const areaMap = new Map();
      data.forEach((item: any) => {
        if (item.areaId && item.areaName) {
          areaMap.set(item.areaId, item.areaName);
        }
      });
      setAreas(Array.from(areaMap, ([areaTypeId, areaTypeName]) => ({ areaTypeId, areaTypeName })));
    } catch (err: any) {
      setError('Failed to load distribution report');
    } finally {
      setLoading(false);
    }
  };

  const filteredDistributions = distributions.filter((distribution) => {
    // Filter by date range (if distributionDate is present)
    const dateStr = distribution.distributionDate || '';
    if (fromDate && dateStr) {
      const distributionDate = new Date(dateStr);
      const filterFromDate = new Date(fromDate);
      if (distributionDate < filterFromDate) return false;
    }
    if (toDate && dateStr) {
      const distributionDate = new Date(dateStr);
      const filterToDate = new Date(toDate);
      filterToDate.setHours(23, 59, 59, 999);
      if (distributionDate > filterToDate) return false;
    }
    // Filter by area
    if (selectedArea && distribution.areaId) {
      if (distribution.areaId.toString() !== selectedArea) return false;
    }
    // Filter by asset
    if (selectedAsset && distribution.assetName) {
      if (distribution.assetName !== selectedAsset) return false;
    }
    return true;
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN');
    } catch {
      return dateString;
    }
  };

  const downloadExcel = () => {
    const headers = ['S.No', 'Asset Name', 'Area Name', 'Distribution Date', 'Serial Number'];
    const csvRows = [headers.join(',')];
    filteredDistributions.forEach((distribution, index) => {
      const row = [
        index + 1,
        distribution.assetName || 'N/A',
        distribution.areaName || 'N/A',
        formatDate(distribution.distributionDate || ''),
        distribution.serialNumber || 'N/A'
      ];
      csvRows.push(row.join(','));
    });
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Asset_Distribution_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Asset Distribution Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #FF7043; color: white; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .report-info { margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <h1>Asset Distribution Report</h1>
        <div class="report-info">
          <p><strong>Generated on:</strong> ${new Date().toLocaleDateString('en-IN')} ${new Date().toLocaleTimeString('en-IN')}</p>
          <p><strong>Total Records:</strong> ${filteredDistributions.length}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Sr.No</th>
              <th>Asset Name</th>
              <th>Area Name</th>
              <th>Distribution Date</th>
              <th>Serial Number</th>
            </tr>
          </thead>
          <tbody>
            ${filteredDistributions.map((distribution, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${distribution.assetName || 'N/A'}</td>
                <td>${distribution.areaName || 'N/A'}</td>
                <td>${formatDate(distribution.distributionDate || '')}</td>
                <td>${distribution.serialNumber || 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  if (loading) {
    return (
      <div className="asset-allocation-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="asset-allocation-container">
        <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>{error}</div>
      </div>
    );
  }

  return (
    <div className="asset-allocation-container">
      <div className="asset-allocation-header">
        <h1>Asset Deploy Report</h1>
      </div>
      <div className="asset-allocation-content">
        <div className="form-row" style={{ marginBottom: '20px' }}>
          <div className="form-group">
            <label>From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Area</label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="form-control"
            >
              <option value="">All Areas</option>
              {areas.map((area) => (
                <option key={area.areaTypeId} value={area.areaTypeId}>
                  {area.areaTypeName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Asset</label>
            <select
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
              className="form-control"
            >
              <option value="">All Assets</option>
              {Array.from(new Set(distributions.map(a => a.assetName).filter(Boolean))).map((assetName) => (
                <option key={assetName} value={assetName}>
                  {assetName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <div style={{ position: 'relative', minWidth: 160 }}>
            <button
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              className="btn-primary btn-download"
              style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span>Download</span>
              <span>▼</span>
            </button>
            {showDownloadMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                width: 180,
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                marginTop: '4px',
                zIndex: 100
              }}>
                <button
                  onClick={() => {
                    downloadExcel();
                    setShowDownloadMenu(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    border: 'none',
                    background: 'white',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    borderBottom: '1px solid #e5e7eb'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  📊 Excel (CSV)
                </button>
                <button
                  onClick={() => {
                    downloadPDF();
                    setShowDownloadMenu(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    border: 'none',
                    background: 'white',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    borderRadius: '0 0 6px 6px'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  📄 PDF
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="table-container">
          <table className="allocation-table">
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>Asset Name</th>
                <th>Area Name</th>
                <th>Distribution Date</th>
                <th>Serial Number</th>
              </tr>
            </thead>
            <tbody>
              {filteredDistributions.length > 0 ? (
                filteredDistributions.map((distribution, index) => (
                  <tr key={distribution.assetReconciliationId || index}>
                    <td>{index + 1}</td>
                    <td>{distribution.assetName || 'N/A'}</td>
                    <td>{distribution.areaName || 'N/A'}</td>
                    <td>{formatDate(distribution.distributionDate || '')}</td>
                    <td>{distribution.serialNumber || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>
                    No distributions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
          Total Records: {filteredDistributions.length}
        </div>
      </div>
    </div>
  );
}

export default Deploymentreport