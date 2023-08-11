import { API_URLS } from '../constants';
import { EndUse, PaginatedResponse } from '../interfaces';
import { handleApiCall } from '../lib/utils';
import api from './axios';

export const getAllEndUses = async (
  page: number,
  searchQuery: string,
  pageSize = 7
): Promise<PaginatedResponse<EndUse>> => {
  const response = await api.get(API_URLS.EndUse.ALL, {
    params: {
      limit: pageSize,
      page,
      searchTerm: searchQuery,
    },
  });
  return response.data;
};

export const createEndUse = (data: EndUse) => {
  const apiUrl = API_URLS.EndUse.CREATE;

  return handleApiCall(api.post, apiUrl, data);
};
