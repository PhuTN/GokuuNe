import axios from 'axios';
import config from './config';

const matchApi = axios.create({
  baseURL: `${config.API_URL}/api/matches`,
  timeout: config.TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

// 🟢 Lấy danh sách tất cả trận đấu
export const getAllMatches = async () => {
  const response = await matchApi.get('/');
  return response.data;
};

// 🟢 Tạo mới một trận đấu
export const createMatch = async (matchData) => {
  const response = await matchApi.post('/', matchData);
  return response.data;
};

// 🟢 Lấy chi tiết trận đấu theo ID
export const getMatchById = async (id) => {
  const response = await matchApi.get(`/${id}`);
  return response.data;
};

// 🟢 Xóa một trận đấu theo ID
export const deleteMatch = async (id) => {
  const response = await matchApi.delete(`/${id}`);
  return response.data;
};

export default matchApi;
