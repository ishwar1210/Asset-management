import { useState, useEffect } from 'react';
import './Vendormaster.css';
import { getVendorList, addVendor, updateVendor, getVendorTypeList } from '../api/endpoint';

interface Vendor {
  vendorId?: number;
  vendorName: string;
  vendorTypeName?: string;
  gstNo: string;
  contactPerson: string;
  mobileNo: string;
  email: string;
  identityProof: string;
  address: string;
  status: boolean;
}

function Vendormaster() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentVendor, setCurrentVendor] = useState<Vendor>({
    vendorName: '',
    gstNo: '',
    contactPerson: '',
    mobileNo: '',
    email: '',
    identityProof: '',
    address: '',
    status: true,
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [refreshTable, setRefreshTable] = useState(false);

  useEffect(() => {
    fetchVendors();
    fetchVendorTypes();
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const response = await getVendorList();
      console.log('Vendor API Response:', response);
      
      let data = [];
      if (Array.isArray(response)) {
        data = response;
      } else if (response.data && Array.isArray(response.data)) {
        data = response.data;
      } else if (response.status && Array.isArray(response.data)) {
        data = response.data;
      }
      
      console.log('Vendors Data:', data);
      setVendors(data);
    } catch (err: any) {
      console.error('Vendor API Error:', err);
      setError(err.message || 'Failed to fetch vendors');
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorTypes = async () => {
    try {
      const response = await getVendorTypeList();
      console.log('Vendor Type API Response (from Vendormaster):', response);
      
      let data = [];
      if (Array.isArray(response)) {
        data = response;
      } else if (response.data && Array.isArray(response.data)) {
        data = response.data;
      } else if (response.status && Array.isArray(response.data)) {
        data = response.data;
      }
      
      console.log('Vendor Types Data (from Vendormaster):', data);
    } catch (err: any) {
      console.error('Failed to fetch vendor types:', err);
    }
  };

  const handleOpenModal = (vendor?: Vendor) => {
    if (vendor) {
      setCurrentVendor(vendor);
      setEditMode(true);
    } else {
      setCurrentVendor({
        vendorName: '',
        gstNo: '',
        contactPerson: '',
        mobileNo: '',
        email: '',
        identityProof: '',
        address: '',
        status: true,
      });
      setEditMode(false);
    }
    setShowModal(true);
    setError('');
    setSuccessMessage('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentVendor({
      vendorName: '',
      gstNo: '',
      contactPerson: '',
      mobileNo: '',
      email: '',
      identityProof: '',
      address: '',
      status: true,
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
      const vendorData = {
        vendorName: currentVendor.vendorName,
        gstNo: currentVendor.gstNo,
        contactPerson: currentVendor.contactPerson,
        mobileNo: currentVendor.mobileNo,
        email: currentVendor.email,
        identityProof: currentVendor.identityProof,
        address: currentVendor.address,
        status: currentVendor.status,
      };

      let success = false;
      let message = '';
      if (editMode) {
        const updateData = { ...vendorData, vendorId: currentVendor.vendorId };
        const response = await updateVendor(updateData);
        if (response.status) {
          message = 'Vendor updated successfully!';
          success = true;
        } else {
          setError(response.message || 'Failed to update vendor');
        }
      } else {
        const response = await addVendor(vendorData);
        if (response.status) {
          message = 'Vendor added successfully!';
          success = true;
        } else {
          setError(response.message || 'Failed to add vendor');
        }
      }
      if (success) {
        setSuccessMessage(message);
        setTimeout(async () => {
          setSuccessMessage('');
          handleCloseModal();
          await fetchVendors();
          setRefreshTable(prev => !prev);
        }, 1200);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setCurrentVendor({
        ...currentVendor,
        [name]: checked,
      });
    } else {
      setCurrentVendor({
        ...currentVendor,
        [name]: value,
      });
    }
  };

  return (
    <div className="vendormaster-container" key={refreshTable ? 'refresh1' : 'refresh0'}>
      <div className="vendormaster-header">
        <h1>Vendor Master</h1>
        <button className="btn-add" onClick={() => handleOpenModal()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Vendor
        </button>
      </div>

      {error && !showModal && <div className="error-message">{error}</div>}

      <div className="table-container">
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <table className="vendormaster-table">
            <thead>
              <tr>
                <th>Sr.NO</th>
                <th>Vendor Name</th>
                <th>GST No</th>
                <th>Contact Person</th>
                <th>Mobile No</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center' }}>
                    No vendors found
                  </td>
                </tr>
              ) : (
                vendors.map((vendor, index) => (
                  <tr key={vendor.vendorId}>
                    <td data-label="S.NO">{index + 1}</td>
                    <td data-label="Vendor Name">{vendor.vendorName}</td>
                    <td data-label="GST No">{vendor.gstNo}</td>
                    <td data-label="Contact Person">{vendor.contactPerson}</td>
                    <td data-label="Mobile No">{vendor.mobileNo}</td>
                    <td data-label="Email">{vendor.email}</td>
                    <td data-label="Status">
                      <span className={`status-badge ${vendor.status ? 'active' : 'inactive'}`}>
                        {vendor.status ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td data-label="Actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleOpenModal(vendor)}
                        title="Edit"
                        aria-label="Edit vendor"
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
              <h2>{editMode ? 'Edit Vendor' : 'Add New Vendor'}</h2>
              <button 
                className="btn-close" 
                onClick={handleCloseModal}
                aria-label="Close modal"
              >
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
                  <label htmlFor="vendorName">
                    Vendor Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="vendorName"
                    name="vendorName"
                    value={currentVendor.vendorName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter vendor name"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="gstNo">
                    GST No <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="gstNo"
                    name="gstNo"
                    value={currentVendor.gstNo}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter GST number"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contactPerson">
                    Contact Person <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    value={currentVendor.contactPerson}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter contact person"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="mobileNo">
                    Mobile No <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    id="mobileNo"
                    name="mobileNo"
                    value={currentVendor.mobileNo}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter mobile number"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={currentVendor.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="identityProof">
                  Identity Proof <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="identityProof"
                  name="identityProof"
                  value={currentVendor.identityProof}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter identity proof"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">
                  Address <span className="required">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={currentVendor.address}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter address"
                  rows={3}
                />
              </div>

              <div className="form-group-checkbox">
                <input
                  type="checkbox"
                  id="status"
                  name="status"
                  checked={currentVendor.status}
                  onChange={handleInputChange}
                />
                <label htmlFor="status">Active Status</label>
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

export default Vendormaster;