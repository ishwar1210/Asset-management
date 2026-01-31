

import { useState, useEffect } from 'react';
import './Assetallocation.css';
import { getAssetTaggingList, getAreaTypeList } from '../api/endpoint';

interface RfidbindingReport {
  rfidBindingId: number;
  rfidBindingDate?: string;
  assetAllocationId: number;
  assetName: string;
  areaTypeName: string;
  areaTypeId?: number;
  allocationDate: string;
  serialNo?: string;
  rfidNo?: string;
  status?: number;
}

interface Area {
  areaTypeId: number;
  areaTypeName: string;
}

function Rfidbindingreport() {
  const [allocations, setAllocations] = useState<RfidbindingReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedArea] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('');
  const [, setAreas] = useState<Area[]>([]);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  useEffect(() => {
    fetchAreas();
    fetchAllocationData();
  }, []);

  const fetchAreas = async () => {
    try {
      const response = await getAreaTypeList();
      console.log('Area Type List Response:', response);
      
      let data = [];
      if (Array.isArray(response)) {
        data = response;
      } else if (response?.data && Array.isArray(response.data)) {
        data = response.data;
      }
      
      setAreas(data);
    } catch (err: any) {
      console.error('Failed to fetch areas:', err);
    }
  };

  const fetchAllocationData = async () => {
    try {
      setLoading(true);

      // Use Asset Tagging list (RFID bindings) as primary source for this report
      const response = await getAssetTaggingList();
      console.log('Asset Tagging List Response:', response);

      let data = [];
      if (Array.isArray(response)) {
        data = response;
      } else if (response?.data && Array.isArray(response.data)) {
        data = response.data;
      }

      console.log('RFID Tagging Data:', data);

      // Map tagging records to report shape, normalizing possible date fields
      const mapped = data.map((item: any) => {
        const dateField = item.rfidBindingDate || item.bindingDate || item.taggingDate || item.createdDate || item.createdOn || item.date || item.timestamp || null;
        return {
          rfidBindingId: item.assetTaggingId || item.rfidBindingId || 0,
          rfidBindingDate: dateField ? new Date(dateField).toISOString() : undefined,
          assetAllocationId: item.assetAllocationId || item.allocationId || 0,
          assetName: item.assetName || item.asset || 'N/A',
          areaTypeName: item.areaTypeName || item.areaName || 'N/A',
          areaTypeId: item.areaTypeId || item.areaId,
          allocationDate: item.allocationDate || item.date || undefined,
          serialNo: item.serialNo || item.serialNumber || 'N/A',
          rfidNo: item.rfidNo || item.rfidTag || 'N/A',
          status: item.status
        } as RfidbindingReport;
      });

      setAllocations(mapped);
    } catch (err: any) {
      console.error('Failed to fetch RFID binding data:', err);
      setError('Failed to load RFID binding report');
    } finally {
      setLoading(false);
    }
  };

  const filteredAllocations = allocations.filter((allocation) => {
    // Filter by date range (use rfidBindingDate if available)
    const dateStr = allocation.rfidBindingDate || allocation.allocationDate || '';
    if (fromDate && dateStr) {
      const allocationDate = new Date(dateStr);
      const filterFromDate = new Date(fromDate);
      if (allocationDate < filterFromDate) return false;
    }

    if (toDate && dateStr) {
      const allocationDate = new Date(dateStr);
      const filterToDate = new Date(toDate);
      filterToDate.setHours(23, 59, 59, 999); // End of day
      if (allocationDate > filterToDate) return false;
    }
    
    // Filter by area
    if (selectedArea && allocation.areaTypeId) {
      if (allocation.areaTypeId.toString() !== selectedArea) return false;
    }
    
    // Filter by asset
    if (selectedAsset && allocation.assetName) {
      if (allocation.assetName !== selectedAsset) return false;
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
    // Create CSV content
    const headers = ['S.No', 'Asset Name', 'RFID Binding Date', 'Serial Number', 'RFID Number'];
    const csvRows = [headers.join(',')];
    
    filteredAllocations.forEach((allocation, index) => {
      const row = [
        index + 1,
        allocation.assetName || 'N/A',
        formatDate(allocation.rfidBindingDate || allocation.allocationDate),
        allocation.serialNo || 'N/A',
        allocation.rfidNo || 'N/A'
      ];
      csvRows.push(row.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Asset_Allocation_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    // Create a simple table structure for PDF
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Asset Allocation Report</title>
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
        <h1>Asset Allocation Report</h1>
        <div class="report-info">
          <p><strong>Generated on:</strong> ${new Date().toLocaleDateString('en-IN')} ${new Date().toLocaleTimeString('en-IN')}</p>
          <p><strong>Total Records:</strong> ${filteredAllocations.length}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Asset Name</th>
              <th>RFID Binding Date</th>
              <th>Serial Number</th>
              <th>RFID Number</th>
            </tr>
          </thead>
          <tbody>
            ${filteredAllocations.map((allocation, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${allocation.assetName || 'N/A'}</td>
                <td>${formatDate(allocation.rfidBindingDate || allocation.allocationDate)}</td>
                <td>${allocation.serialNo || 'N/A'}</td>
                <td>${allocation.rfidNo || 'N/A'}</td>
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
        <h1>Asset Registration Report</h1>
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
            <label>Asset</label>
            <select
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
              className="form-control"
            >
              <option value="">All Assets</option>
              {Array.from(new Set(allocations.map(a => a.assetName).filter(Boolean))).map((assetName) => (
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
                <th>RFID Binding Date</th>
                <th>Serial Number</th>
                <th>RFID Number</th>
              </tr>
            </thead>
            <tbody>
              {filteredAllocations.length > 0 ? (
                filteredAllocations.map((allocation, index) => (
                  <tr key={allocation.rfidBindingId || index}>
                    <td>{index + 1}</td>
                    <td>{allocation.assetName || 'N/A'}</td>
                    <td>{formatDate(allocation.rfidBindingDate || '')}</td>
                    <td>{allocation.serialNo || 'N/A'}</td>
                    <td>{allocation.rfidNo || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>
                    No RFID bindings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
          Total Records: {filteredAllocations.length}
        </div>
      </div>
    </div>
  );
}

export default Rfidbindingreport;