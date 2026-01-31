

import { useState, useEffect } from 'react';
import './GRN.css';
import { 
  getGRNList, 
  addGRN, 
  updateGRN, 
  getVendorList, 
  getUserList, 
  getAssetList, 
  getCategoryList, 
  getUomList 
} from '../api/endpoint';

interface LineItem {
  lineItemId?: number;
  assetId: number;
  assetName?: string;
  categoryId: number;
  category?: string;
  quantity: number;
  unitOfMeasure: string;
  unitName?: string;
  price: number;
  rfidTrackable: boolean;
  remarks: string;
}

interface GRN {
  grnId?: number;
  vendorId: number;
  vendorName?: string;
  grnNumber: string;
  invoiceNumber: string;
  invoiceDate: string;
  recievedBy: number;
  receivedByName?: string;
  poNumber: string;
  poDate: string;
  lineItems: LineItem[];
}

interface Vendor {
  vendorId: number;
  vendorName: string;
}

interface User {
  userId: number;
  userName: string;
}

interface Asset {
  assetId: number;
  assetName: string;
}

interface Category {
  categoryId: number;
  categoryName: string;
}

interface UnitOfMeasure {
  unitId: number;
  unitName: string;
}

function GRN() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [grns, setGrns] = useState<GRN[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<UnitOfMeasure[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [currentGRN, setCurrentGRN] = useState<GRN>({
    vendorId: 0,
    grnNumber: '',
    invoiceNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    recievedBy: 0,
    poNumber: '',
    poDate: new Date().toISOString().split('T')[0],
    lineItems: [
      {
        assetId: 0,
        categoryId: 0,
        quantity: 0,
        unitOfMeasure: '',
        price: 0,
        rfidTrackable: false,
        remarks: '',
      },
    ],
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchGRNs();
    fetchVendors();
    fetchUsers();
    fetchAssets();
    fetchCategories();
    fetchUnits();
  }, []);

  const fetchGRNs = async () => {
    setLoading(true);
    try {
      const response = await getGRNList();
      console.log('GRN API Response:', response);

      let data = [];
      if (Array.isArray(response)) {
        data = response;
      } else if (response.data && Array.isArray(response.data)) {
        data = response.data;
      } else if (response.status && Array.isArray(response.data)) {
        data = response.data;
      }

      console.log('GRN Data:', data);
      setGrns(data);
    } catch (err: any) {
      console.error('GRN API Error:', err);
      setError(err.message || 'Failed to fetch GRNs');
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async () => {
    try {
      const response = await getVendorList();
      let data = [];
      if (Array.isArray(response)) {
        data = response;
      } else if (response.data && Array.isArray(response.data)) {
        data = response.data;
      } else if (response.status && Array.isArray(response.data)) {
        data = response.data;
      }
      setVendors(data);
    } catch (err: any) {
      console.error('Failed to fetch vendors:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getUserList();
      let data = [];
      if (Array.isArray(response)) {
        data = response;
      } else if (response.data && Array.isArray(response.data)) {
        data = response.data;
      } else if (response.status && Array.isArray(response.data)) {
        data = response.data;
      }
      setUsers(data);
    } catch (err: any) {
      console.error('Failed to fetch users:', err);
    }
  };

  const fetchAssets = async () => {
    try {
      const response = await getAssetList();
      let data = [];
      if (Array.isArray(response)) {
        data = response;
      } else if (response.data && Array.isArray(response.data)) {
        data = response.data;
      } else if (response.status && Array.isArray(response.data)) {
        data = response.data;
      }
      setAssets(data);
    } catch (err: any) {
      console.error('Failed to fetch assets:', err);
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

  const fetchUnits = async () => {
    try {
      const response = await getUomList();
      let data = [];
      if (Array.isArray(response)) {
        data = response;
      } else if (response.data && Array.isArray(response.data)) {
        data = response.data;
      } else if (response.status && Array.isArray(response.data)) {
        data = response.data;
      }
      setUnits(data);
    } catch (err: any) {
      console.error('Failed to fetch units:', err);
    }
  };

  const getVendorName = (vendorId: number) => {
    const vendor = vendors.find((v) => v.vendorId === vendorId);
    return vendor ? vendor.vendorName : 'N/A';
  };

  const getUserName = (userId: number) => {
    const user = users.find((u) => u.userId === userId);
    return user ? user.userName : 'N/A';
  };

  const handleOpenModal = (grn?: GRN, isViewMode: boolean = false) => {
    if (grn) {
      setCurrentGRN(grn);
      setEditMode(!isViewMode);
      setViewMode(isViewMode);
    } else {
      setCurrentGRN({
        vendorId: 0,
        grnNumber: '',
        invoiceNumber: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        recievedBy: 0,
        poNumber: '',
        poDate: new Date().toISOString().split('T')[0],
        lineItems: [
          {
            assetId: 0,
            categoryId: 0,
            quantity: 0,
            unitOfMeasure: '',
            price: 0,
            rfidTrackable: false,
            remarks: '',
          },
        ],
      });
      setEditMode(false);
      setViewMode(false);
    }
    setShowModal(true);
    setError('');
    setSuccessMessage('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentGRN({
      vendorId: 0,
      grnNumber: '',
      invoiceNumber: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      recievedBy: 0,
      poNumber: '',
      poDate: new Date().toISOString().split('T')[0],
      lineItems: [
        {
          assetId: 0,
          categoryId: 0,
          quantity: 0,
          unitOfMeasure: '',
          price: 0,
          rfidTrackable: false,
          remarks: '',
        },
      ],
    });
    setEditMode(false);
    setViewMode(false);
    setError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const grnData = {
        vendorId: currentGRN.vendorId,
        grnNumber: currentGRN.grnNumber,
        invoiceNumber: currentGRN.invoiceNumber,
        invoiceDate: currentGRN.invoiceDate,
        recievedBy: currentGRN.recievedBy,
        poNumber: currentGRN.poNumber,
        poDate: currentGRN.poDate,
        lineItems: currentGRN.lineItems,
      };

      let success = false;
      let message = '';
      if (editMode) {
        const updateData = { ...grnData, grnId: currentGRN.grnId };
        const response = await updateGRN(updateData);
        if (response.status) {
          message = 'GRN updated successfully!';
          success = true;
        } else {
          setError(response.message || 'Failed to update GRN');
        }
      } else {
        const response = await addGRN(grnData);
        if (response.status) {
          message = 'GRN added successfully!';
          success = true;
        } else {
          setError(response.message || 'Failed to add GRN');
        }
      }
      if (success) {
        await fetchGRNs();
        setSuccessMessage(message);
        setTimeout(() => {
          setSuccessMessage('');
          handleCloseModal();
          setRefreshKey(prev => prev + 1);
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

    if (name === 'vendorId' || name === 'recievedBy') {
      setCurrentGRN({
        ...currentGRN,
        [name]: Number(value),
      });
    } else {
      setCurrentGRN({
        ...currentGRN,
        [name]: value,
      });
    }
  };

  const handleLineItemChange = (
    index: number,
    field: keyof LineItem,
    value: string | number | boolean
  ) => {
    const updatedLineItems = [...currentGRN.lineItems];
    
    if (field === 'assetId' || field === 'categoryId' || field === 'quantity') {
      updatedLineItems[index][field] = Number(value);
    } else if (field === 'price') {
      updatedLineItems[index][field] = parseFloat(value as string) || 0;
    } else if (field === 'rfidTrackable') {
      updatedLineItems[index][field] = value as boolean;
    } else if (field === 'remarks' || field === 'unitOfMeasure') {
      updatedLineItems[index][field] = value as string;
    }

    setCurrentGRN({
      ...currentGRN,
      lineItems: updatedLineItems,
    });
  };

  const addLineItem = () => {
    setCurrentGRN({
      ...currentGRN,
      lineItems: [
        ...currentGRN.lineItems,
        {
          assetId: 0,
          categoryId: 0,
          quantity: 0,
          unitOfMeasure: '',
          price: 0,
          rfidTrackable: false,
          remarks: '',
        },
      ],
    });
  };

  const removeLineItem = (index: number) => {
    if (currentGRN.lineItems.length > 1) {
      const updatedLineItems = currentGRN.lineItems.filter((_, i) => i !== index);
      setCurrentGRN({
        ...currentGRN,
        lineItems: updatedLineItems,
      });
    }
  };

  const calculateTotal = () => {
    return currentGRN.lineItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
  };

  return (
    <div className="grn-container" key={refreshKey}>
      <div className="grn-header">
        <h1>Good Receipt Note (GRN)</h1>
        <button className="btn-add" onClick={() => handleOpenModal()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add GRN
        </button>
      </div>

      {error && !showModal && <div className="error-message">{error}</div>}

      <div className="table-container">
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <table className="grn-table">
            <thead>
              <tr>
                <th>Sr.NO</th>
                <th>GRN Number</th>
                <th>Invoice Number</th>
                <th>Invoice Date</th>
                <th>Vendor</th>
                <th>Received By</th>
                <th>Items</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {grns.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center' }}>
                    No GRNs found
                  </td>
                </tr>
              ) : (
                grns.map((grn, index) => (
                  <tr 
                    key={grn.grnId} 
                    onClick={() => handleOpenModal(grn, true)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td data-label="S.NO">{index + 1}</td>
                    <td data-label="GRN Number">{grn.grnNumber}</td>
                    <td data-label="Invoice Number">{grn.invoiceNumber}</td>
                    <td data-label="Invoice Date">
                      {new Date(grn.invoiceDate).toLocaleDateString()}
                    </td>
                    <td data-label="Vendor">
                      {grn.vendorName || getVendorName(grn.vendorId)}
                    </td>
                    <td data-label="Received By">
                      {typeof grn.recievedBy === 'string' 
                        ? grn.recievedBy 
                        : grn.receivedByName || getUserName(grn.recievedBy)}
                    </td>
                    <td data-label="Items">{grn.lineItems?.length || 0} items</td>
                    <td data-label="Actions">
                      <button
                        className="btn-edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal(grn, false);
                        }}
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
          <div className="modal-content grn-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{viewMode ? 'View GRN' : editMode ? 'Edit GRN' : 'Add New GRN'}</h2>
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
              <div className="grn-header-section">
                <h3>GRN Details</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="grnNumber">
                      GRN Number <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="grnNumber"
                      name="grnNumber"
                      value={currentGRN.grnNumber}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter GRN number"
                      disabled={viewMode}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="invoiceNumber">
                      Invoice Number <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="invoiceNumber"
                      name="invoiceNumber"
                      value={currentGRN.invoiceNumber}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter invoice number"
                      disabled={viewMode}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="invoiceDate">
                      Invoice Date <span className="required">*</span>
                    </label>
                    {viewMode ? (
                      <input
                        type="text"
                        value={new Date(currentGRN.invoiceDate).toLocaleDateString()}
                        disabled
                        className="form-control"
                      />
                    ) : (
                      <input
                        type="date"
                        id="invoiceDate"
                        name="invoiceDate"
                        value={currentGRN.invoiceDate}
                        onChange={handleInputChange}
                        required
                      />
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="vendorId">
                      Vendor <span className="required">*</span>
                    </label>
                    {viewMode ? (
                      <input
                        type="text"
                        value={currentGRN.vendorName || getVendorName(currentGRN.vendorId)}
                        disabled
                        className="form-control"
                      />
                    ) : (
                      <select
                        id="vendorId"
                        name="vendorId"
                        value={currentGRN.vendorId}
                        onChange={handleInputChange}
                        required
                      >
                        <option value={0}>Select Vendor</option>
                        {vendors.map((vendor) => (
                          <option key={vendor.vendorId} value={vendor.vendorId}>
                            {vendor.vendorName}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="poNumber">
                      PO Number <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="poNumber"
                      name="poNumber"
                      value={currentGRN.poNumber}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter PO number"
                      disabled={viewMode}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="poDate">
                      PO Date <span className="required">*</span>
                    </label>
                    {viewMode ? (
                      <input
                        type="text"
                        value={new Date(currentGRN.poDate).toLocaleDateString()}
                        disabled
                        className="form-control"
                      />
                    ) : (
                      <input
                        type="date"
                        id="poDate"
                        name="poDate"
                        value={currentGRN.poDate}
                        onChange={handleInputChange}
                        required
                      />
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="recievedBy">
                      Received By <span className="required">*</span>
                    </label>
                    {viewMode ? (
                      <input
                        type="text"
                        value={
                          typeof currentGRN.recievedBy === 'string'
                            ? currentGRN.recievedBy
                            : currentGRN.receivedByName || getUserName(currentGRN.recievedBy)
                        }
                        disabled
                        className="form-control"
                      />
                    ) : (
                      <select
                        id="recievedBy"
                        name="recievedBy"
                        value={currentGRN.recievedBy}
                        onChange={handleInputChange}
                        required
                      >
                        <option value={0}>Select User</option>
                        {users.map((user) => (
                          <option key={user.userId} value={user.userId}>
                            {user.userName}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>

              <div className="line-items-section">
                <div className="line-items-header">
                  <h3>Line Items</h3>
                  {!viewMode && (
                    <button
                      type="button"
                      className="btn-add-item"
                      onClick={addLineItem}
                    >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add Item
                  </button>
                  )}
                </div>

                <div className="line-items-table-container">
                  <table className="line-items-table">
                    <thead>
                      <tr>
                        <th>Asset</th>
                        <th>Category</th>
                        <th>Qty</th>
                        <th>UOM</th>
                        <th>Price</th>
                        <th>Subtotal</th>
                        <th>RFID Trackable</th>
                        <th>Remarks</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentGRN.lineItems.map((item, index) => (
                        <tr key={index}>
                          <td>
                            {viewMode ? (
                              <input
                                type="text"
                                value={item.assetName || 'N/A'}
                                disabled
                                className="table-input"
                              />
                            ) : (
                              <select
                                value={item.assetId}
                                onChange={(e) =>
                                  handleLineItemChange(index, 'assetId', e.target.value)
                                }
                                required
                                className="table-select"
                              >
                                <option value={0}>Select Asset</option>
                                {assets.map((asset) => (
                                  <option key={asset.assetId} value={asset.assetId}>
                                    {asset.assetName}
                                  </option>
                                ))}
                              </select>
                            )}
                          </td>
                          <td>
                            {viewMode ? (
                              <input
                                type="text"
                                value={item.category || 'N/A'}
                                disabled
                                className="table-input"
                              />
                            ) : (
                              <select
                                value={item.categoryId}
                                onChange={(e) =>
                                  handleLineItemChange(index, 'categoryId', e.target.value)
                                }
                                required
                                className="table-select"
                              >
                                <option value={0}>Select Category</option>
                                {categories.map((category) => (
                                  <option key={category.categoryId} value={category.categoryId}>
                                    {category.categoryName}
                                  </option>
                                ))}
                              </select>
                            )}
                          </td>
                          <td>
                            <input
                              type="number"
                              min="0"
                              value={item.quantity}
                              onChange={(e) =>
                                handleLineItemChange(index, 'quantity', e.target.value)
                              }
                              required
                              className="table-input qty-input"
                              disabled={viewMode}
                            />
                          </td>
                          <td>
                            {viewMode ? (
                              <input
                                type="text"
                                value={item.unitOfMeasure || item.unitName || 'N/A'}
                                disabled
                                className="table-input"
                              />
                            ) : (
                              <select
                                value={item.unitOfMeasure}
                                onChange={(e) =>
                                  handleLineItemChange(index, 'unitOfMeasure', e.target.value)
                                }
                                required
                                className="table-select"
                              >
                                <option value="">Select Unit</option>
                                {units.map((unit) => (
                                  <option key={unit.unitId} value={unit.unitName}>
                                    {unit.unitName}
                                  </option>
                                ))}
                              </select>
                            )}
                          </td>
                          <td>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.price}
                              onChange={(e) =>
                                handleLineItemChange(index, 'price', e.target.value)
                              }
                              required
                              className="table-input price-input"
                              disabled={viewMode}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={`₹${(item.quantity * item.price).toFixed(2)}`}
                              disabled
                              className="table-input subtotal-input"
                            />
                          </td>
                          <td>
                            <label className="checkbox-wrapper">
                              <input
                                type="checkbox"
                                checked={item.rfidTrackable}
                                onChange={(e) =>
                                  handleLineItemChange(index, 'rfidTrackable', e.target.checked)
                                }
                                disabled={viewMode}
                              />
                              <span>{item.rfidTrackable ? 'Yes' : 'No'}</span>
                            </label>
                          </td>
                          <td>
                            <input
                              type="text"
                              value={item.remarks}
                              onChange={(e) =>
                                handleLineItemChange(index, 'remarks', e.target.value)
                              }
                              placeholder="Remarks"
                              className="table-input remarks-input"
                              disabled={viewMode}
                            />
                          </td>
                          <td>
                            {!viewMode && currentGRN.lineItems.length > 1 && (
                              <button
                                type="button"
                                className="btn-remove"
                                onClick={() => removeLineItem(index)}
                                title="Remove Item"
                              >
                                Remove
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="total-section">
                  <h3>Total Amount: ₹{calculateTotal().toFixed(2)}</h3>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCloseModal}
                  disabled={loading}
                >
                  {viewMode ? 'Close' : 'Cancel'}
                </button>
                {!viewMode && (
                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? 'Saving...' : editMode ? 'Update' : 'Add'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GRN;