import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { ComboBoxOption } from '../data/gameData';
import { base64Encode } from './GeneralUtility';

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
  token: string;
  meta?: T;
  types: ComboBoxOption,
  status: string;
  balance: number;
  success: boolean;
  throttle: number;
}

interface Headers {
  [key: string]: string;
}

type OnSuccessCallback<T = any> = (data: ApiResponse<T>) => void;
type OnErrorCallback = (error: AxiosError) => void;

export const apiPost = async <T = any>(
  url: string,
  body: any,
  headers: Headers,
  onSuccess: OnSuccessCallback<T>,
  onError: OnErrorCallback
): Promise<void> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await axios.post(url, body, {
      headers: {
        ...headers,
      },
    });

    console.log('url:', url);
    console.log('response:', response);

    if (response.status === 200 || response.status === 201) {
      if (Number(response.data.code) === 200) {
        onSuccess(response.data);
        if (response.data.token) {
          localStorage.setItem('token', base64Encode(response.data.token));
        }

      } else if (Number(response.data.code) === 1001) {
        toast.error(response.data.message, { theme: 'dark', autoClose: 3000 });
      } else if (Number(response.data.code) === 5000) {
        window.location.href = '/maintenance';
      } else if (Number(response.data.code) === 1002) {
        window.location.href = '/invalid-platform';
      } else if (Number(response.data.code) === 1003) {
        window.location.href = '/forbidden';
      } else {
        toast.error(response.data.message, { theme: 'dark', autoClose: 3000 });
      }
    } else if (Number(response.status) === 401) {
      window.location.href = '/unauthorized';
    } else if (Number(response.data.code) === 1003) {
      window.location.href = '/forbidden';
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (Number(error.response.status) === 401) {
          window.location.href = '/unauthorized';
        } else if (Number(error.response.status) === 429) {
          console.log('Error:', error.response.data.message)
        } else {
          toast.error(error.response.data.message, { theme: 'dark', autoClose: 3000 });
        }
      } else {
        toast.error('An unexpected error occurred', { theme: 'dark', autoClose: 3000 });
      }
      onError(error);
    } else {
      toast.error('An unexpected error occurred', { theme: 'dark', autoClose: 3000 });
    }
  }
};

export const apiGet = async <T = any>(
  url: string,
  headers: Headers,
  onSuccess: OnSuccessCallback<T>,
  onError: OnErrorCallback
): Promise<T | null> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await axios.get(url, {
      headers: {
        ...headers,
      },
    });

    console.log('url:', url);
    console.log('response:', response);

    if (Number(response.data.code) === 1003) {
      window.location.href = '/forbidden';
    } else if (Number(response.data.code) === 5000) {
      window.location.href = '/maintenance'
    } else if (Number(response.data.code) === 1002) {
      window.location.href = '/invalid-platform';
    } else if (Number(response.status) === 200 || Number(response.status) === 201) {
      onSuccess(response.data);
      return response.data.data ?? null;
    }
    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (Number(error.response.status) === 401) {
          window.location.href = '/unauthorized';
        } else {
          toast.error(error.response.data.message, { theme: 'dark', autoClose: 3000 });
        }
      } else {
        toast.error('An unexpected error occurred', { theme: 'dark', autoClose: 3000 });
      }
      onError(error);
    } else {
      toast.error('An unexpected error occurred', { theme: 'dark', autoClose: 3000 });
    }
    return null;
  }
};
