

import { useState, useEffect } from 'react';
import { getUserList, addUser, updateUser, getRoleList } from '../api/endpoint';
import './Usermaster.css';

interface User {
  userId?: number;
  fullName: string;
  userName: string;
  roleId: number;
  mobileNo: string;
  email: string;
  address: string;
  identityProof: string;
  password: string;
}

interface Role {
  roleId: number;
  roleName: string;
}

function Usermaster() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>({
    fullName: '',
    userName: '',
    roleId: 0,
    mobileNo: '',
    email: '',
    address: '',
    identityProof: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch users and roles on component mount
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getUserList();
      setUsers(response.data || response || []);
    } catch (err: any) {
      setError('Failed to fetch users: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await getRoleList();
      setRoles(response.data || response || []);
    } catch (err: any) {
      console.error('Failed to fetch roles:', err);
    }
  };

  const getRoleName = (roleId: number) => {
    const role = roles.find(r => r.roleId === roleId);
    return role ? role.roleName : 'N/A';
  };

  const handleOpenModal = (user?: User) => {
    if (user) {
      setCurrentUser({ ...user, password: '' });
      setEditMode(true);
    } else {
      setCurrentUser({
        fullName: '',
        userName: '',
        roleId: 0,
        mobileNo: '',
        email: '',
        address: '',
        identityProof: '',
        password: '',
      });
      setEditMode(false);
    }
    setShowModal(true);
    setError('');
    setSuccessMessage('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentUser({
      fullName: '',
      userName: '',
      roleId: 0,
      mobileNo: '',
      email: '',
      address: '',
      identityProof: '',
      password: '',
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
      if (editMode) {
        await updateUser(currentUser);
        setSuccessMessage('User updated successfully!');
      } else {
        await addUser(currentUser);
        setSuccessMessage('User added successfully!');
      }
      await fetchUsers();
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentUser({
      ...currentUser,
      [name]: name === 'roleId' ? parseInt(value) : value,
    });
  };

  return (
    <div className="usermaster-container">
      <div className="usermaster-header">
        <h1>User Master</h1>
        <button className="btn-add" onClick={() => handleOpenModal()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add User
        </button>
      </div>

      {error && !showModal && <div className="alert alert-error">{error}</div>}
      {successMessage && !showModal && <div className="alert alert-success">{successMessage}</div>}

      {loading && !showModal ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <div className="table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>Full Name</th>
                <th>Username</th>
                <th>Role</th>
                <th>Mobile No</th>
                <th>Email</th>
                <th>Address</th>
                <th>Identity Proof</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user.userId || index}>
                    <td>{index + 1}</td>
                    <td>{user.fullName}</td>
                    <td>{user.userName?.trim()}</td>
                    <td>{getRoleName(user.roleId)}</td>
                    <td>{user.mobileNo}</td>
                    <td>{user.email}</td>
                    <td>{user.address}</td>
                    <td>{user.identityProof}</td>
                    <td>
                      <button className="btn-edit" onClick={() => handleOpenModal(user)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="no-data">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editMode ? 'Edit User' : 'Add New User'}</h2>
              <button className="btn-close" onClick={handleCloseModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={currentUser.fullName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter full name"
                  />
                </div>

                <div className="form-group">
                  <label>Username *</label>
                  <input
                    type="text"
                    name="userName"
                    value={currentUser.userName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter username"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Role *</label>
                  <select
                    name="roleId"
                    value={currentUser.roleId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="0">Select Role</option>
                    {roles.map(role => (
                      <option key={role.roleId} value={role.roleId}>
                        {role.roleName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Mobile No *</label>
                  <input
                    type="text"
                    name="mobileNo"
                    value={currentUser.mobileNo}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter mobile number"
                    maxLength={10}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={currentUser.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter email"
                  />
                </div>

                <div className="form-group">
                  <label>Identity Proof *</label>
                  <input
                    type="text"
                    name="identityProof"
                    value={currentUser.identityProof}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter identity proof number"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address *</label>
                <textarea
                  name="address"
                  value={currentUser.address}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter address"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Password {editMode ? '(Leave blank to keep current)' : '*'}</label>
                <input
                  type="password"
                  name="password"
                  value={currentUser.password}
                  onChange={handleInputChange}
                  required={!editMode}
                  placeholder="Enter password"
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
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

export default Usermaster;