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
    withCredentials = true, // Changed default to true for HTTP-only cookies
}: ApiCallParams): Promise<T> {
    const config: AxiosRequestConfig = {
        url,
        method,
        data,
        params,
        headers,
        withCredentials, // This ensures cookies are sent with every request
        baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
        timeout: 30000, // Add timeout for better error handling
    };

    console.log('Making API call with config:', config);

    try {
        const response = await axios(config);
        console.log('API response:', response.data);
        return response.data as T;
    } catch (error: any) {
        console.error('API call failed:', error);
        console.error('Error response:', error.response?.data);
        
        // Better error handling for different scenarios
        if (error.response) {
            // Server responded with error status
            throw error.response.data || error.message || 'API call failed';
        } else if (error.request) {
            // Request was made but no response received
            throw 'No response received from server';
        } else {
            // Something else happened
            throw error.message || 'API call failed';
        }
    }
}
