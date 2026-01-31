

import { useState, useEffect } from 'react';
import './Assetallocation.css';
import { getAssetTaggingList, getAreaTypeList, addAssetAllocation, getAssetAllocationList } from '../api/endpoint';


interface Area {
  areaTypeId: number;
  areaTypeName: string;
}

interface RFIDAsset {
  assetTaggingId: number;
  assetId: number;
  assetName: string;
  serialNo: string;
  rfidNo: string;
  qrCode: string;
  status: number;
  assetStatus: string;
  selected?: boolean;
}

function Assetallocation() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [assetNames, setAssetNames] = useState<string[]>([]);
  const [rfidAssets, setRfidAssets] = useState<RFIDAsset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<RFIDAsset[]>([]);

  const [assetType, setAssetType] = useState('');
  const [selectedArea, setSelectedArea] = useState('');

  const [rfidSearch] = useState('');
  const [, setRfidMatch] = useState<RFIDAsset | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  // Search RFID handler
  useEffect(() => {
    if (rfidSearch.trim() === '') {
      setRfidMatch(null);
      return;
    }
    const match = rfidAssets.find(asset => asset.rfidNo === rfidSearch.trim());
    setRfidMatch(match || null);
  }, [rfidSearch, rfidAssets]);

  useEffect(() => {
    fetchAreas();
    fetchRFIDAssets();
  }, []);

  const fetchAreas = async () => {
    try {
      const response = await getAreaTypeList();
      console.log('AreaTypeList API Response:', response);
      
      let data = [];
      if (Array.isArray(response)) {
        data = response;
      } else if (response.data && Array.isArray(response.data)) {
        data = response.data;
      }
      
      console.log('Areas data:', data);
      setAreas(data);
    } catch (err: any) {
      console.error('Failed to fetch areas:', err);
    }
  };

  const fetchRFIDAssets = async () => {
    try {
      // Fetch all allocations
      const allocationResponse = await getAssetAllocationList();
      let allocatedData = [];
      if (Array.isArray(allocationResponse)) {
        allocatedData = allocationResponse;
      } else if (allocationResponse?.data && Array.isArray(allocationResponse.data)) {
        allocatedData = allocationResponse.data;
      }
      // Get all allocated assetTaggingIds
      const allocatedTaggingIds = new Set(allocatedData.map((item: any) => item.assetTaggingId));

      // Fetch all RFID assets
      const response = await getAssetTaggingList();
      console.log('AssetTaggingList API Response:', response);
      let data = [];
      if (Array.isArray(response)) {
        data = response;
      } else if (response.data && Array.isArray(response.data)) {
        data = response.data;
      }
      console.log('Extracted data:', data);

      // Filter out assets that are already allocated
      const unallocatedAssets = data.filter((asset: any) => !allocatedTaggingIds.has(asset.assetTaggingId))
        .map((asset: any) => ({
          ...asset,
          selected: false
        }));

      // Log all unique assetStatus values for debugging
      const allStatuses = Array.from(new Set(data.map((asset: any) => asset.assetStatus)));
      console.log('All unique assetStatus values:', allStatuses);

      // Extract unique asset names for dropdown
      const uniqueAssetNames = Array.from(new Set(unallocatedAssets.map((asset: any) => asset.assetName))) as string[];

      setAssetNames(uniqueAssetNames);
      setRfidAssets(unallocatedAssets);
      setFilteredAssets(unallocatedAssets);
    } catch (err: any) {
      console.error('Failed to fetch RFID assets:', err);
    }
  };

  const handleAssetTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setAssetType(value);
    
    // Filter assets by selected asset name
    if (value.trim() === '') {
      setFilteredAssets(rfidAssets.map(asset => ({ ...asset, selected: false })));
    } else {
      const filtered = rfidAssets.filter(asset => 
        asset.assetName === value
      ).map(asset => ({ ...asset, selected: false }));
      setFilteredAssets(filtered);
    }
  };

  const handleCheckboxChange = (index: number) => {
    const updated = [...filteredAssets];
    updated[index].selected = !updated[index].selected;
    setFilteredAssets(updated);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    const updated = filteredAssets.map(asset => ({
      ...asset,
      selected: checked
    }));
    setFilteredAssets(updated);
  };

  const handleCancel = () => {
    setAssetType('');
    setSelectedArea('');
    setFilteredAssets(rfidAssets.map(asset => ({ ...asset, selected: false })));
  };

  const handleAssignToArea = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');

    // Validate inputs
    if (!selectedArea) {
      setError('Please select an Area');
      setLoading(false);
      return;
    }

    const selectedAssets = filteredAssets.filter(asset => asset.selected);
    if (selectedAssets.length === 0) {
      setError('Please select at least one RFID asset');
      setLoading(false);
      return;
    }

    try {
      const currentDate = new Date().toISOString();
      
      // Call API for each selected asset
      const allocationPromises = selectedAssets.map(asset => {
        const allocationData = {
          areaId: parseInt(selectedArea),
          assetId: asset.assetId,
          assetTaggingId: asset.assetTaggingId,
          allocationDate: currentDate
        };
        return addAssetAllocation(allocationData);
      });

      await Promise.all(allocationPromises);

      setSuccessMessage(`Successfully assigned ${selectedAssets.length} assets to area!`);
      
      // Reset form
      setTimeout(() => {
        handleCancel();
        setSuccessMessage('');
        fetchRFIDAssets();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to assign assets');
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    return status === 'Active' ? 'Ready for Deployment' : status;
  };

  const allSelected = filteredAssets.length > 0 && filteredAssets.every(asset => asset.selected);
  const selectedCount = filteredAssets.filter(asset => asset.selected).length;

  return (
    <div className="asset-allocation-container">
      <div className="asset-allocation-header">
        <h1>Assign RFID Assets to Area</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <div className="asset-allocation-content">
        {/* Form Section */}
        <div className="form-section">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="assetType">Asset Type</label>
              <select
                id="assetType"
                value={assetType}
                onChange={handleAssetTypeChange}
                className="form-control"
              >
                <option value="">Select Asset Type</option>
                {assetNames.map((name, idx) => (
                  <option key={idx} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="area">
                Area <span className="required">*</span>
              </label>
              <select
                id="area"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="form-control"
              >
                <option value="">Select Area</option>
                {areas.map((area) => (
                  <option key={area.areaTypeId} value={area.areaTypeId}>
                    {area.areaTypeName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="allocationDate">Allocation Date</label>
              <input
                id="allocationDate"
                type="text"
                value={new Date().toLocaleDateString('en-GB')}
                className="form-control"
                readOnly
                disabled
                style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
              />
            </div>
          </div>
        </div>

        {/* RFID Assets Selection Section */}
        <div className="rfid-selection-section">
          <h3>Select RFID Assets to Assign</h3>
          {selectedCount > 0 && (
            <div style={{ marginBottom: '12px', color: '#2563eb', fontSize: '14px' }}>
              {selectedCount} asset(s) selected
            </div>
          )}
          <div className="selection-table-container">
            <table className="selection-table">
              <thead>
                <tr>
                  <th className="checkbox-cell">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>System Serial No</th>
                  <th>RFID Tag</th>
                  <th>Asset Name</th>
                  <th>Current Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>
                      No available RFID assets found
                    </td>
                  </tr>
                ) : (
                  filteredAssets.map((asset, index) => (
                    <tr key={asset.assetTaggingId}>
                      <td className="checkbox-cell">
                        <input
                          type="checkbox"
                          checked={asset.selected || false}
                          onChange={() => handleCheckboxChange(index)}
                        />
                      </td>
                      <td>{asset.serialNo}</td>
                      <td>{asset.rfidNo || 'N/A'}</td>
                      <td>{asset.assetName}</td>
                      <td className="status-ready">
                        {getStatusText(asset.assetStatus)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            type="button"
            className="btn-cancel"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-assign"
            onClick={handleAssignToArea}
            disabled={loading}
          >
            {loading ? 'Assigning...' : 'Assign to Area'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Assetallocation;