import { API_URLS } from "../constants";
import { handleApiCall } from "../lib/utils";
import api from "./axios";

export const getAllEndUses = async () => {
    const apiUrl = API_URLS.EndUse.ALL_ENDUSES;

    return handleApiCall(api.get, apiUrl, {});
  };