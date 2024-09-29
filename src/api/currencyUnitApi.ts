/* eslint-disable @typescript-eslint/no-explicit-any */
import { MutationFunction } from "@tanstack/react-query";
import { API_URLS } from "../constants";
import api from "./axios";
import { CurrencyUnit, PaginatedResponse } from "../interfaces";
import { handleApiCall } from "../lib/utils";

export const getAllCurrencyUnits = async (
  page = -1,
  pageSize?: number,
  searchQuery?: string
): Promise<PaginatedResponse<CurrencyUnit>> => {
  const response = await handleApiCall(api.get, API_URLS.CURRENCY_UNITS.ALL, {
    params: {
      limit: pageSize,
      page: page + 1,
      searchTerm: searchQuery,
    },
  });

  return response;
};

export const createCurrencyUnit = async (currencyUnit: CurrencyUnit) => {
  return handleApiCall(api.post, API_URLS.CURRENCY_UNITS.CREATE, currencyUnit);
};

export const updateCurrencyUnit: MutationFunction<
  any,
  [number, CurrencyUnit]
> = async (params) => {
  const [id, data] = params;
  const apiUrl = API_URLS.CURRENCY_UNITS.UPDATE.replace(":id", String(id));

  return handleApiCall(api.put, apiUrl, data);
};

export const deleteCurrencyUnit = async (id: number, data = {}) => {
  const apiUrl = API_URLS.CURRENCY_UNITS.DELETE.replace(":id", String(id));
  return handleApiCall(api.delete, apiUrl, data);
};
