

import { useState, useEffect } from 'react';
import { getAssetTypeList, addAssetType, updateAssetType } from '../api/endpoint';
import './Assettype.css';

interface AssetType {
  assetTypeId?: number;
  assetTypeName: string;
  assetDescription: string;
}

function Assettype() {
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentAssetType, setCurrentAssetType] = useState<AssetType>({
    assetTypeName: '',
    assetDescription: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch asset types on component mount
  useEffect(() => {
    fetchAssetTypes();
  }, []);

  const fetchAssetTypes = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAssetTypeList();
      setAssetTypes(response.data || response || []);
    } catch (err: any) {
      setError('Failed to fetch asset types: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (assetType?: AssetType) => {
    if (assetType) {
      setCurrentAssetType(assetType);
      setEditMode(true);
    } else {
      setCurrentAssetType({ assetTypeName: '', assetDescription: '' });
      setEditMode(false);
    }
    setShowModal(true);
    setError('');
    setSuccessMessage('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentAssetType({ assetTypeName: '', assetDescription: '' });
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
      if (editMode) {
        await updateAssetType(currentAssetType);
        setSuccessMessage('Asset Type updated successfully!');
      } else {
        await addAssetType(currentAssetType);
        setSuccessMessage('Asset Type added successfully!');
      }
      await fetchAssetTypes();
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentAssetType({
      ...currentAssetType,
      [name]: value,
    });
  };

  return (
    <div className="assettype-container">
      <div className="assettype-header">
        <h1>Asset Type Master</h1>
        <button className="btn-add" onClick={() => handleOpenModal()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Asset Type
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-container">
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <table className="assettype-table">
            <thead>
              <tr>
                <th>Sr.NO</th>
                <th>Asset Type Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assetTypes.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center' }}>
                    No asset types found
                  </td>
                </tr>
              ) : (
                assetTypes.map((assetType) => (
                  <tr key={assetType.assetTypeId}>
                    <td>{assetType.assetTypeId}</td>
                    <td>{assetType.assetTypeName}</td>
                    <td>{assetType.assetDescription}</td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => handleOpenModal(assetType)}
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
              <h2>{editMode ? 'Edit Asset Type' : 'Add New Asset Type'}</h2>
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
              <div className="form-group">
                <label htmlFor="assetTypeName">
                  Asset Type Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="assetTypeName"
                  name="assetTypeName"
                  value={currentAssetType.assetTypeName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter asset type name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="assetDescription">
                  Description <span className="required">*</span>
                </label>
                <textarea
                  id="assetDescription"
                  name="assetDescription"
                  value={currentAssetType.assetDescription}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter description"
                  rows={3}
                />
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

export default Assettype