import axios, { AxiosRequestConfig, Method } from 'axios';

interface ApiCallParams {
    url: string;
    method?: Method;
    data?: any;
    params?: Record<string, any>;
    headers?: Record<string, string>;
    withCredentials?: boolean;
}

export async function handleApiCall<T = any>({
    url,
    method = 'GET',
    data,
    params,
    headers,
    withCredentials = false,
}: ApiCallParams): Promise<T> {
    const config: AxiosRequestConfig = {
        url,
        method,
        data,
        params,
        headers,
        withCredentials,
        baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', // Add your backend URL
    };

    console.log('Making API call with config:', config);

    try {
        const response = await axios(config);
        console.log('API response:', response.data);
        return response.data as T;
    } catch (error: any) {
        console.error('API call failed:', error);
        console.error('Error response:', error.response?.data);
        throw error.response?.data || error.message || 'API call failed';
    }
}