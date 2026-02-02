

import React, { useEffect, useState } from 'react';
import './Reconciliation.css';
import { getAssetList, getAreaTypeList, getReconciliationList } from '../api/endpoint';

interface ReconciliationItem {
  assetReconciliationId: number;
  assetId: number;
  rfidNo: string;
  qrCode: string;
  status: string;
  reconciliationDate: string;
  reconciliationStatus: number;
  assetCondition: string;
  areaId: number;
  areaName: string;
}


const Reconciliation: React.FC = () => {
  const [data, setData] = useState<ReconciliationItem[]>([]);
  const [filtered, setFiltered] = useState<ReconciliationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [area, setArea] = useState('');
  const [asset, setAsset] = useState('');
  const [assetMap, setAssetMap] = useState<{ [id: number]: string }>({});
  const [areaList, setAreaList] = useState<{ areaTypeId: number, areaTypeName: string }[]>([]);
  const [assetList, setAssetList] = useState<{ assetId: number, assetName: string }[]>([]);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  // Helper to format dates as dd/mm/yyyy (handles empty/null)
  const formatDate = (value?: string | null) => {
    if (!value) return 'N/A';
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    const day = `${d.getDate()}`.padStart(2, '0');
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };
  // Download Excel (CSV)
  const downloadExcel = () => {
    const headers = ['S.No', 'Asset', 'Area', 'RFID No', 'Date', 'Condition', 'Status'];
    const csvRows = [headers.join(',')];
    filtered.forEach((item, idx) => {
      const row = [
        idx + 1,
        assetMap[item.assetId] || 'N/A',
        item.areaName || 'N/A',
        item.rfidNo || 'N/A',
        formatDate(item.reconciliationDate),
        item.assetCondition || 'N/A',
        item.status || 'N/A'
      ];
      csvRows.push(row.join(','));
    });
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Reconciliation_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download PDF (print)
  const downloadPDF = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Reconciliation Report</title>
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
        <h1>Reconciliation Report</h1>
        <div class="report-info">
          <p><strong>Generated on:</strong> ${new Date().toLocaleDateString('en-IN')} ${new Date().toLocaleTimeString('en-IN')}</p>
          <p><strong>Total Records:</strong> ${filtered.length}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Sr.No</th>
              <th>Asset</th>
              <th>Area</th>
              <th>RFID No</th>
              <th>Date</th>
              <th>Condition</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map((item, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td>${assetMap[item.assetId] || 'N/A'}</td>
                <td>${item.areaName || 'N/A'}</td>
                <td>${item.rfidNo || 'N/A'}</td>
                <td>${formatDate(item.reconciliationDate)}</td>
                <td>${item.assetCondition || 'N/A'}</td>
                <td>${item.status || 'N/A'}</td>
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch reconciliation data using centralized endpoint
        const reconResponse = await getReconciliationList();
        let reconArray = [];
        if (Array.isArray(reconResponse)) {
          reconArray = reconResponse;
        } else if (reconResponse?.data && Array.isArray(reconResponse.data)) {
          reconArray = reconResponse.data;
        }
        setData(reconArray);
        setFiltered(reconArray);

        // Fetch asset list and build assetId to assetName map
        const assetResponse = await getAssetList();
        let assetArray = [];
        if (Array.isArray(assetResponse)) {
          assetArray = assetResponse;
        } else if (assetResponse?.data && Array.isArray(assetResponse.data)) {
          assetArray = assetResponse.data;
        }
        setAssetList(assetArray);
        const map: { [id: number]: string } = {};
        assetArray.forEach((a: any) => {
          map[a.assetId] = a.assetName;
        });
        setAssetMap(map);

        // Fetch area list
        const areaResponse = await getAreaTypeList();
        let areaArray = [];
        if (Array.isArray(areaResponse)) {
          areaArray = areaResponse;
        } else if (areaResponse?.data && Array.isArray(areaResponse.data)) {
          areaArray = areaResponse.data;
        }
        setAreaList(areaArray);
      } catch (err: any) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Use areaList and assetList for dropdowns

  // Filter handler
  useEffect(() => {
    let filteredData = data;
    
    if (fromDate) {
      filteredData = filteredData.filter(d => {
        if (!d.reconciliationDate) return false;
        const itemDate = new Date(d.reconciliationDate);
        const filterFromDate = new Date(fromDate);
        // Set time to start of day for accurate comparison
        itemDate.setHours(0, 0, 0, 0);
        filterFromDate.setHours(0, 0, 0, 0);
        return itemDate >= filterFromDate;
      });
    }
    
    if (toDate) {
      filteredData = filteredData.filter(d => {
        if (!d.reconciliationDate) return false;
        const itemDate = new Date(d.reconciliationDate);
        const filterToDate = new Date(toDate);
        // Set time to end of day for accurate comparison
        itemDate.setHours(0, 0, 0, 0);
        filterToDate.setHours(23, 59, 59, 999);
        return itemDate <= filterToDate;
      });
    }
    
    if (area && area !== 'All Areas') {
      filteredData = filteredData.filter(d => d.areaId === Number(area));
    }
    
    if (asset && asset !== 'All Assets') {
      filteredData = filteredData.filter(d => d.assetId === Number(asset));
    }
    
    setFiltered(filteredData);
  }, [fromDate, toDate, area, asset, data]);

  return (
    <div className="reconciliation-container">
      <div className="reconciliation-header">
        <h2>Reconciliation Report</h2>
      </div>
      <div className="reconciliation-content">
        <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
          <div className="filter-group" style={{ flex: 1 }}>
            <label>From Date</label>
            <input
              type="date"
              className="filter-control"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              placeholder="dd-mm-yyyy"
            />
          </div>
          <div className="filter-group" style={{ flex: 1 }}>
            <label>To Date</label>
            <input
              type="date"
              className="filter-control"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              placeholder="dd-mm-yyyy"
            />
          </div>
          <div className="filter-group" style={{ flex: 1 }}>
            <label>Area</label>
            <select
              className="filter-control"
              value={area}
              onChange={e => setArea(e.target.value)}
            >
              <option value="">All Areas</option>
              {areaList.length === 0 && <option value="N/A">N/A</option>}
              {areaList.map(a => (
                <option key={a.areaTypeId} value={a.areaTypeId}>{a.areaTypeName || 'N/A'}</option>
              ))}
            </select>
          </div>
          <div className="filter-group" style={{ flex: 1 }}>
            <label>Asset</label>
            <select
              className="filter-control"
              value={asset}
              onChange={e => setAsset(e.target.value)}
            >
              <option value="">All Assets</option>
              {assetList.length === 0 && <option value="N/A">N/A</option>}
              {assetList.map(a => (
                <option key={a.assetId} value={a.assetId}>{a.assetName || 'N/A'}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              className="btn-download"
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
                  onMouseOver={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}
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
                  onMouseOver={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}
                >
                  📄 PDF
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="table-container">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : (
            <table className="reconciliation-table">
              <thead>
                <tr>
                  <th>Sr.No</th>
                  <th>Asset</th>
                  <th>Area</th>
                  <th>RFID No</th>
                  <th>Date</th>
                  <th>Condition</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, idx) => (
                  <tr key={item.assetReconciliationId}>
                    <td>{idx + 1}</td>
                    <td>{assetMap[item.assetId] || 'N/A'}</td>
                    <td>{item.areaName || 'N/A'}</td>
                    <td>{item.rfidNo || 'N/A'}</td>
                    <td>{formatDate(item.reconciliationDate)}</td>
                    <td>{item.assetCondition || 'N/A'}</td>
                    <td>{item.status || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reconciliation;