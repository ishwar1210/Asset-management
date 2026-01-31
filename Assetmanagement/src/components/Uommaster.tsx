

import { useState, useEffect } from 'react';
import './Uommaster.css';
import { getUomList, addUom, updateUom } from '../api/endpoint';

interface Uom {
  unitId?: number;
  unitName: string;
}

function Uommaster() {
  const [uoms, setUoms] = useState<Uom[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUom, setCurrentUom] = useState<Uom>({
    unitName: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchUoms();
  }, []);

  const fetchUoms = async () => {
    setLoading(true);
    try {
      const response = await getUomList();
      console.log('UOM API Response:', response);
      
      // Handle different response structures
      let data = [];
      if (Array.isArray(response)) {
        data = response;
      } else if (response.data && Array.isArray(response.data)) {
        data = response.data;
      } else if (response.status && Array.isArray(response.data)) {
        data = response.data;
      }
      
      console.log('UOMs Data:', data);
      setUoms(data);
    } catch (err: any) {
      console.error('UOM API Error:', err);
      setError(err.message || 'Failed to fetch UOMs');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (uom?: Uom) => {
    if (uom) {
      setCurrentUom(uom);
      setEditMode(true);
    } else {
      setCurrentUom({ unitName: '' });
      setEditMode(false);
    }
    setShowModal(true);
    setError('');
    setSuccessMessage('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentUom({ unitName: '' });
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
      const uomData = {
        unitName: currentUom.unitName,
      };

      if (editMode) {
        const updateData = { ...uomData, unitId: currentUom.unitId };
        const response = await updateUom(updateData);
        if (response.status) {
          setSuccessMessage('UOM updated successfully!');
          await fetchUoms();
        } else {
          setError(response.message || 'Failed to update UOM');
        }
      } else {
        const response = await addUom(uomData);
        if (response.status) {
          setSuccessMessage('UOM added successfully!');
          await fetchUoms();
        } else {
          setError(response.message || 'Failed to add UOM');
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentUom({
      ...currentUom,
      [name]: value,
    });
  };

  return (
    <div className="uommaster-container">
      <div className="uommaster-header">
        <h1>UOM Master</h1>
        <button className="btn-add" onClick={() => handleOpenModal()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add UOM
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-container">
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <table className="uommaster-table">
            <thead>
              <tr>
                <th>Sr.NO</th>
                <th>UOM Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {uoms.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center' }}>
                    No UOMs found
                  </td>
                </tr>
              ) : (
                uoms.map((uom, index) => (
                  <tr key={uom.unitId}>
                    <td data-label="S.NO">{index + 1}</td>
                    <td data-label="UOM Type">{uom.unitName}</td>
                    <td data-label="Actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleOpenModal(uom)}
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
              <h2>{editMode ? 'Edit UOM' : 'Add New UOM'}</h2>
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
                <label htmlFor="unitName">
                  UOM Type <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="unitName"
                  name="unitName"
                  value={currentUom.unitName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter UOM type (e.g., Kilogram, Meter, Liter)"
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

export default Uommaster