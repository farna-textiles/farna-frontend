import { MutationFunction } from "@tanstack/react-query";
import { API_URLS } from "../constants";
import { PaginatedResponse, Product } from "../interfaces";
import { handleApiCall } from "../lib/utils";
import api from "./axios";

export const getAllProducts = async (
    page: number,
    pageSize: number,
    searchQuery: string
  ): Promise<PaginatedResponse<Product>> => {
    const response = await api.get(API_URLS.Products.ALL_PRODUCTS, {
      params: {
        limit: pageSize,
        page: page + 1,
        searchTerm: searchQuery,
      },
    });
    return response.data;
};

export const getAllProductsTemp = async (page: number, pageSize: number, searchQuery: string): Promise<PaginatedResponse<Product>> => {
    return {
        limit:10,
        page:1,
        total:1,
        data: [
            {
                id: "0",
                lotNo: 12,
                danier: "dummy",
                type: "cloth",
                noOfFilaments: 20,
                luster: "ok",
                userId: "id",
            },
            {
                id: "1",
                lotNo: 12,
                danier: "dummy",
                type: "cloth",
                noOfFilaments: 20,
                luster: "ok",
                userId: "id",
            },
            {
                id: "2",
                lotNo: 12,
                danier: "dummy",
                type: "cloth",
                noOfFilaments: 20,
                luster: "ok",
                userId: "id",
            },
            {
                id: "3",
                lotNo: 12,
                danier: "dummy",
                type: "cloth",
                noOfFilaments: 20,
                luster: "ok",
                userId: "id",
            },
        ]
    }
    
    
  };

  export const deleteProduct = async (id: number, data = {}) => {
    const apiUrl = API_URLS.Products.DELETE_PRODUCT.replace(':id', String(id));
    return handleApiCall(api.delete, apiUrl, data);
  };
  
  export const getProduct = async (id: number, data = {}) => {
    const apiUrl = API_URLS.Products.GET_PRODUCT.replace(':id', String(id));
  
    return handleApiCall(api.get, apiUrl, data);
  };
  
  export const createProduct = async (data: object) => {
    return handleApiCall(api.post, API_URLS.Products.CREATE_PRODUCT, data);
  };
  
  export const updateProduct = async (id:string, data:object) => {
    const apiUrl = API_URLS.Products.UPDATE_PRODUCT.replace(':id', String(id));
    return handleApiCall(api.put, apiUrl, data);
  };
  