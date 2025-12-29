import axios from 'axios';

const API_URL = 'https://purple-merit-assessment-mhks.onrender.com/api/users/';
// 1. Get All Users (Admin Only)
const getAllUsers = async (token, page = 1) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  // Page number query param bhej rahe hain
  const response = await axios.get(API_URL + `?pageNumber=${page}`, config);
  return response.data;
};

// 2. Delete User (Admin Only)
const deleteUser = async (userId, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.delete(API_URL + userId, config);
  return response.data;
};

// 3. Update User Status (Activate/Deactivate)
// PDF Req: Activate/Deactivate buttons [cite: 81-82]
const updateUserStatus = async (userId, status, token) => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    // Status update kar rahe hain
    const response = await axios.put(API_URL + userId, { status }, config);
    return response.data;
  };

const userService = {
  getAllUsers,
  deleteUser,
  updateUserStatus
};

export default userService;