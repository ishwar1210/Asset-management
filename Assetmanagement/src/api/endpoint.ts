// Get Distributed Assets By Area
export const getDistributedAssetsByArea = async (areaId: number) => {
  try {
    const response = await axiosInstance.post('/AssetReconciliation/GetDistributedAssetsByArea', { areaId });
    return response.data;
  } catch (error) {
    throw error;
  }
};
import axiosInstance from './axiosInstance';

// Login API
export const loginUser = async (userName: string, password: string) => {
  try {
    const response = await axiosInstance.post('/Login/Login', {
      userName,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Role APIs
export const getRoleList = async () => {
  try {
    const response = await axiosInstance.get('/Role/RoleList');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addRole = async (roleData: any) => {
  try {
    const response = await axiosInstance.post('/Role/AddRole', roleData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateRole = async (roleData: any) => {
  try {
    const response = await axiosInstance.post('/Role/UpdateRole', roleData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
// User APIs
export const getUserList = async () => {
  try {
    const response = await axiosInstance.get('/User/UserList');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/User/UserById/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addUser = async (userData: any) => {
  try {
    const response = await axiosInstance.post('/User/AddUser', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (userData: any) => {
  try {
    const response = await axiosInstance.post('/User/UpdateUser', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Category APIs
export const getCategoryList = async () => {
  try {
    const response = await axiosInstance.get('/Category/CategoryList');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCategoryById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/Category/GetCategoryById/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addCategory = async (categoryData: any) => {
  try {
    const response = await axiosInstance.post('/Category/AddCategory', categoryData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCategory = async (categoryData: any) => {
  try {
    const response = await axiosInstance.post('/Category/UpdateCategory', categoryData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Area APIs
export const getAreaTypeList = async () => {
  try {
    const response = await axiosInstance.get('/Area/AreaTypeList');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAreaTypeById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/Area/GetAreaTypeById/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addAreaType = async (areaData: any) => {
  try {
    const response = await axiosInstance.post('/Area/AddAreaType', areaData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAreaType = async (areaData: any) => {
  try {
    const response = await axiosInstance.post('/Area/UpdateAreaType', areaData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// AssetType APIs
export const getAssetTypeList = async () => {
  try {
    const response = await axiosInstance.get('/AssetType/AssetTypeList');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAssetTypeById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/AssetType/GetAssetTypeById/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addAssetType = async (assetTypeData: any) => {
  try {
    const response = await axiosInstance.post('/AssetType/AddAssetType', assetTypeData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAssetType = async (assetTypeData: any) => {
  try {
    const response = await axiosInstance.post('/AssetType/UpdateAssetType', assetTypeData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Vendor APIs
export const getVendorList = async () => {
  try {
    const response = await axiosInstance.get('/Vendor/VendorList');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getVendorById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/Vendor/GetVendorById/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addVendor = async (vendorData: any) => {
  try {
    const response = await axiosInstance.post('/Vendor/AddVendor', vendorData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateVendor = async (vendorData: any) => {
  try {
    const response = await axiosInstance.post('/Vendor/UpdateVendor', vendorData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// VendorType APIs
export const getVendorTypeList = async () => {
  try {
    const response = await axiosInstance.get('/Vendor/VendorTypeList');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getVendorTypeById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/Vendor/GetVendorTypeById/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addVendorType = async (vendorTypeData: any) => {
  try {
    const response = await axiosInstance.post('/Vendor/AddVendorType', vendorTypeData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateVendorType = async (vendorTypeData: any) => {
  try {
    const response = await axiosInstance.post('/Vendor/UpdateVendorType', vendorTypeData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// UOM (Unit of Measure) APIs
export const getUomList = async () => {
  try {
    const response = await axiosInstance.get('/UnitOfMeasure/UnitList');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUomById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/UnitOfMeasure/GetUnitById/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addUom = async (uomData: any) => {
  try {
    const response = await axiosInstance.post('/UnitOfMeasure/AddUnit', uomData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUom = async (uomData: any) => {
  try {
    const response = await axiosInstance.post('/UnitOfMeasure/UpdateUnit', uomData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Asset APIs
export const getAssetList = async () => {
  try {
    const response = await axiosInstance.get('/Asset/AssetList');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Reconciliation APIs
export const getReconciliationList = async () => {
  try {
    const response = await axiosInstance.get('/AssetReconciliation/GetReconciliationList');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAssetById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/Asset/GetAssetById/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addAsset = async (assetData: any) => {
  try {
    const response = await axiosInstance.post('/Asset/AddAsset', assetData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAsset = async (assetData: any) => {
  try {
    const response = await axiosInstance.post('/Asset/UpdateAsset', assetData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// GRN APIs
export const getGRNList = async () => {
  try {
    const response = await axiosInstance.get('/GRN/GRNList');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getGRNById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/GRN/GetGRNById/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addGRN = async (grnData: any) => {
  try {
    const response = await axiosInstance.post('/GRN/AddGRN', grnData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateGRN = async (grnData: any) => {
  try {
    const response = await axiosInstance.post('/GRN/UpdateGRN', grnData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// RFID Binding APIs
export const bindRFID = async (bindingData: any) => {
  try {
    const response = await axiosInstance.post('/RFIDBinding/BindRFID', bindingData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAssetTaggingList = async () => {
  try {
    const response = await axiosInstance.get('/RFIDBinding/AssetTaggingList');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadAssetExcel = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post('/RFIDBinding/UploadAssetExcel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addAssetAllocation = async (allocationData: any) => {
  try {
    const response = await axiosInstance.post('/AssetAllocation/AddAssetAllocation', allocationData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAssetAllocationList = async () => {
  try {
    const response = await axiosInstance.get('/AssetAllocation/AssetAllocationList');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAssetDistributionList = async () => {
  try {
    const response = await axiosInstance.get('/AssetDistribution/List');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add other API endpoints here as needed
