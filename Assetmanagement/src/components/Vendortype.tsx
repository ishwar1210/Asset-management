

import { useState, useEffect } from 'react';
import './Vendortype.css';
import { getVendorTypeList, addVendorType, updateVendorType } from '../api/endpoint';

interface VendorType {
  vendorTypeId?: number;
  vendorType: string;
  description: string;
}

function Vendortype() {
  const [vendorTypes, setVendorTypes] = useState<VendorType[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentVendorType, setCurrentVendorType] = useState<VendorType>({
    vendorType: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchVendorTypes();
  }, []);

  const fetchVendorTypes = async () => {
    setLoading(true);
    try {
      const response = await getVendorTypeList();
      console.log('Vendor Type API Response:', response);
      
      // Handle different response structures
      let data = [];
      if (Array.isArray(response)) {
        data = response;
      } else if (response.data && Array.isArray(response.data)) {
        data = response.data;
      } else if (response.status && Array.isArray(response.data)) {
        data = response.data;
      }
      
      console.log('Vendor Types Data:', data);
      setVendorTypes(data);
    } catch (err: any) {
      console.error('API Error:', err);
      setError(err.message || 'Failed to fetch vendor types');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (vendorType?: VendorType) => {
    if (vendorType) {
      setCurrentVendorType(vendorType);
      setEditMode(true);
    } else {
      setCurrentVendorType({ vendorType: '', description: '' });
      setEditMode(false);
    }
    setShowModal(true);
    setError('');
    setSuccessMessage('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentVendorType({ vendorType: '', description: '' });
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
      const vendorTypeData = {
        vendorTypeId: currentVendorType.vendorTypeId || 0,
        vendorType: currentVendorType.vendorType,
        description: currentVendorType.description,
      };

      if (editMode) {
        const response = await updateVendorType(vendorTypeData);
        if (response.status) {
          setSuccessMessage('Vendor Type updated successfully!');
          await fetchVendorTypes();
        } else {
          setError(response.message || 'Failed to update vendor type');
        }
      } else {
        const response = await addVendorType(vendorTypeData);
        if (response.status) {
          setSuccessMessage('Vendor Type added successfully!');
          await fetchVendorTypes();
        } else {
          setError(response.message || 'Failed to add vendor type');
        }
      }
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentVendorType({
      ...currentVendorType,
      [name]: value,
    });
  };

  return (
    <div className="vendortype-container">
      <div className="vendortype-header">
        <h1>Vendor Type Master</h1>
        <button className="btn-add" onClick={() => handleOpenModal()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Vendor Type
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-container">
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <table className="vendortype-table">
            <thead>
              <tr>
                <th>S.NO</th>
                <th>Vendor Type</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendorTypes.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center' }}>
                    No vendor types found
                  </td>
                </tr>
              ) : (
                vendorTypes.map((vendorType) => (
                  <tr key={vendorType.vendorTypeId}>
                    <td>{vendorType.vendorTypeId}</td>
                    <td>{vendorType.vendorType}</td>
                    <td>{vendorType.description}</td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => handleOpenModal(vendorType)}
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
              <h2>{editMode ? 'Edit Vendor Type' : 'Add New Vendor Type'}</h2>
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
                <label htmlFor="vendorType">
                  Vendor Type <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="vendorType"
                  name="vendorType"
                  value={currentVendorType.vendorType}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter vendor type"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">
                  Description <span className="required">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={currentVendorType.description}
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

export default Vendortype