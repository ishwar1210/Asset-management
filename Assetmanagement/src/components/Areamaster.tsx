

import { useState, useEffect } from 'react';
import { getAreaTypeList, addAreaType, updateAreaType } from '../api/endpoint';
import './Areamaster.css';

interface Area {
  areaTypeId?: number;
  areaTypeName: string;
  areaTypeDescription: string;
  parentId: number;
  parentName?: string;
}

function Areamaster() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentArea, setCurrentArea] = useState<Area>({
    areaTypeName: '',
    areaTypeDescription: '',
    parentId: 0,
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch areas on component mount
  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAreaTypeList();
      setAreas(response.data || response || []);
    } catch (err: any) {
      setError('Failed to fetch areas: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const getParentAreaName = (parentId: number) => {
    if (parentId === 0) return 'Root';
    const parentArea = areas.find(a => a.areaTypeId === parentId);
    return parentArea ? parentArea.areaTypeName : 'N/A';
  };

  const handleOpenModal = (area?: Area) => {
    if (area) {
      setCurrentArea(area);
      setEditMode(true);
    } else {
      setCurrentArea({ areaTypeName: '', areaTypeDescription: '', parentId: 0 });
      setEditMode(false);
    }
    setShowModal(true);
    setError('');
    setSuccessMessage('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentArea({ areaTypeName: '', areaTypeDescription: '', parentId: 0 });
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
        await updateAreaType(currentArea);
        setSuccessMessage('Area updated successfully!');
      } else {
        await addAreaType(currentArea);
        setSuccessMessage('Area added successfully!');
      }
      await fetchAreas();
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'parentId') {
      const parentIdValue = parseInt(value);
      const parentName = parentIdValue === 0 ? 'Root' : areas.find(a => a.areaTypeId === parentIdValue)?.areaTypeName || '';
      
      setCurrentArea({
        ...currentArea,
        parentId: parentIdValue,
        parentName: parentName,
      });
    } else {
      setCurrentArea({
        ...currentArea,
        [name]: value,
      });
    }
  };

  return (
    <div className="areamaster-container">
      <div className="areamaster-header">
        <h1>Area Master</h1>
        <button className="btn-add" onClick={() => handleOpenModal()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Area
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-container">
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <table className="areamaster-table">
            <thead>
              <tr>
                <th>Area ID</th>
                <th>Area Name</th>
                <th>Description</th>
                <th>Parent Area</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {areas.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center' }}>
                    No areas found
                  </td>
                </tr>
              ) : (
                areas.map((area) => (
                  <tr key={area.areaTypeId}>
                    <td>{area.areaTypeId}</td>
                    <td>{area.areaTypeName}</td>
                    <td>{area.areaTypeDescription}</td>
                    <td>{getParentAreaName(area.parentId)}</td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => handleOpenModal(area)}
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
              <h2>{editMode ? 'Edit Area' : 'Add New Area'}</h2>
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
                <label htmlFor="areaTypeName">
                  Area Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="areaTypeName"
                  name="areaTypeName"
                  value={currentArea.areaTypeName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter area name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="areaTypeDescription">
                  Description <span className="required">*</span>
                </label>
                <textarea
                  id="areaTypeDescription"
                  name="areaTypeDescription"
                  value={currentArea.areaTypeDescription}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter description"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label htmlFor="parentId">
                  Parent Area <span className="required">*</span>
                </label>
                <select
                  id="parentId"
                  name="parentId"
                  value={currentArea.parentId}
                  onChange={handleInputChange}
                  required
                >
                  <option value={0}>Root (No Parent)</option>
                  {areas
                    .filter(area => area.areaTypeId !== currentArea.areaTypeId)
                    .map((area) => (
                      <option key={area.areaTypeId} value={area.areaTypeId}>
                        {area.areaTypeName}
                      </option>
                    ))}
                </select>
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

export default Areamaster