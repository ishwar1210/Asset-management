
import { useState, useEffect } from 'react';
import './Assetmaster.css';
import { getAssetList, addAsset, updateAsset, getCategoryList, getAssetTypeList, getUomList } from '../api/endpoint';

interface Asset {
  assetId?: number;
  assetName: string;
  categoryId: number;
  categoryName?: string;
  assetTypeId: number;
  assetTypeName?: string;
  unitOfMeasure: string;
  assetSerialNo: string;
}

interface Category {
  categoryId: number;
  categoryName: string;
}

interface AssetType {
  assetTypeId: number;
  assetTypeName: string;
}

interface UnitOfMeasure {
  unitId: number;
  unitName: string;
}

function Assetmaster() {
  const [refreshTable, setRefreshTable] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);
  const [units, setUnits] = useState<UnitOfMeasure[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentAsset, setCurrentAsset] = useState<Asset>({
    assetName: '',
    categoryId: 0,
    assetTypeId: 0,
    unitOfMeasure: '',
    assetSerialNo: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchAssets();
    fetchCategories();
    fetchAssetTypes();
    fetchUnits();
  }, []);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const response = await getAssetList();
      console.log('Asset API Response:', response);
      
      let data = [];
      if (Array.isArray(response)) {
        data = response;
      } else if (response.data && Array.isArray(response.data)) {
        data = response.data;
      } else if (response.status && Array.isArray(response.data)) {
        data = response.data;
      }
      
      console.log('Assets Data:', data);
      setAssets(data);
    } catch (err: any) {
      console.error('Asset API Error:', err);
      setError(err.message || 'Failed to fetch assets');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategoryList();
      let data = [];
      if (Array.isArray(response)) {
        data = response;
      } else if (response.data && Array.isArray(response.data)) {
        data = response.data;
      } else if (response.status && Array.isArray(response.data)) {
        data = response.data;
      }
      setCategories(data);
    } catch (err: any) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchAssetTypes = async () => {
    try {
      const response = await getAssetTypeList();
      let data = [];
      if (Array.isArray(response)) {
        data = response;
      } else if (response.data && Array.isArray(response.data)) {
        data = response.data;
      } else if (response.status && Array.isArray(response.data)) {
        data = response.data;
      }
      setAssetTypes(data);
    } catch (err: any) {
      console.error('Failed to fetch asset types:', err);
    }
  };

  const fetchUnits = async () => {
    try {
      const response = await getUomList();
      console.log('UOM API Response:', response);
      
      let data = [];
      if (Array.isArray(response)) {
        data = response;
      } else if (response.data && Array.isArray(response.data)) {
        data = response.data;
      } else if (response.status && Array.isArray(response.data)) {
        data = response.data;
      }
      
      console.log('Units Data:', data);
      setUnits(data);
    } catch (err: any) {
      console.error('Failed to fetch units:', err);
    }
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.categoryId === categoryId);
    return category ? category.categoryName : 'N/A';
  };

  const getAssetTypeName = (assetTypeId: number) => {
    const assetType = assetTypes.find((at) => at.assetTypeId === assetTypeId);
    return assetType ? assetType.assetTypeName : 'N/A';
  };



  const handleOpenModal = (asset?: Asset) => {
    if (asset) {
      setCurrentAsset(asset);
      setEditMode(true);
    } else {
      setCurrentAsset({
        assetName: '',
        categoryId: 0,
        assetTypeId: 0,
        unitOfMeasure: '',
        assetSerialNo: '',
      });
      setEditMode(false);
    }
    setShowModal(true);
    setError('');
    setSuccessMessage('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentAsset({
      assetName: '',
      categoryId: 0,
      assetTypeId: 0,
      unitOfMeasure: '',
      assetSerialNo: '',
    });
    setEditMode(false);
    setError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const assetData = {
        assetName: currentAsset.assetName,
        categoryId: currentAsset.categoryId,
        assetTypeId: currentAsset.assetTypeId,
        unitOfMeasure: currentAsset.unitOfMeasure,
        assetSerialNo: currentAsset.assetSerialNo,
      };

      let success = false;
      let message = '';
      if (editMode) {
        const updateData = { ...assetData, assetId: currentAsset.assetId };
        const response = await updateAsset(updateData);
        if (response.status) {
          message = 'Asset updated successfully!';
          success = true;
        } else {
          setError(response.message || 'Failed to update asset');
        }
      } else {
        const response = await addAsset(assetData);
        if (response.status) {
          message = 'Asset added successfully!';
          success = true;
        } else {
          setError(response.message || 'Failed to add asset');
        }
      }
      if (success) {
        await fetchAssets();
        setSuccessMessage(message);
        setTimeout(() => {
          setSuccessMessage('');
          handleCloseModal();
          setRefreshTable(prev => !prev);
        }, 1200);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'categoryId' || name === 'assetTypeId') {
      setCurrentAsset({
        ...currentAsset,
        [name]: Number(value),
      });
    } else {
      setCurrentAsset({
        ...currentAsset,
        [name]: value,
      });
    }
  };

  return (
    <div className="assetmaster-container" key={refreshTable ? 'refresh1' : 'refresh0'}>
      <div className="assetmaster-header">
        <h1>Asset Master</h1>
        <button className="btn-add" onClick={() => handleOpenModal()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Asset
        </button>
      </div>

      {error && !showModal && <div className="error-message">{error}</div>}

      <div className="table-container">
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <table className="assetmaster-table">
            <thead>
              <tr>
                <th>Sr.NO</th>
                <th>Category</th>
                <th>Asset Name</th>
                <th>Asset Type</th>
                <th>Unit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assets.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center' }}>
                    No assets found
                  </td>
                </tr>
              ) : (
                assets.map((asset, index) => (
                  <tr key={asset.assetId}>
                    <td data-label="S.NO">{index + 1}</td>
                    <td data-label="Category">{getCategoryName(asset.categoryId)}</td>
                    <td data-label="Asset Name">{asset.assetName}</td>
                    <td data-label="Asset Type">{getAssetTypeName(asset.assetTypeId)}</td>
                    <td data-label="Unit">{asset.unitOfMeasure || 'N/A'}</td>
                    <td data-label="Actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleOpenModal(asset)}
                        title="Edit"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editMode ? 'Edit Asset' : 'Add New Asset'}</h2>
              <button className="btn-close" onClick={handleCloseModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="assetName">
                    Asset Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="assetName"
                    name="assetName"
                    value={currentAsset.assetName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter asset name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="categoryId">
                    Category <span className="required">*</span>
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={currentAsset.categoryId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value={0}>Select Category</option>
                    {categories.map((category) => (
                      <option key={category.categoryId} value={category.categoryId}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="assetTypeId">
                    Asset Type <span className="required">*</span>
                  </label>
                  <select
                    id="assetTypeId"
                    name="assetTypeId"
                    value={currentAsset.assetTypeId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value={0}>Select Asset Type</option>
                    {assetTypes.map((type) => (
                      <option key={type.assetTypeId} value={type.assetTypeId}>
                        {type.assetTypeName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="unitOfMeasureId">
                    Unit of Measure <span className="required">*</span>
                  </label>
                  <select
                    id="unitOfMeasureId"
                    name="unitOfMeasure"
                    value={currentAsset.unitOfMeasure}
                    onChange={handleInputChange}
                    required
                  >
                    <option value={0}>Select Unit</option>
                    {units.map((unit) => (
                      <option key={unit.unitId} value={unit.unitId}>
                        {unit.unitName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCloseModal}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? 'Saving...' : editMode ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Assetmaster