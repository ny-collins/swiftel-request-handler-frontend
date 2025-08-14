import { AxiosError } from 'axios';

interface BackendError {
    message: string;
    errors?: { [key: string]: string[] }; // For Zod validation errors
}

export const getErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
        const backendError = error.response?.data as BackendError;
        if (backendError?.message) {
            return backendError.message;
        }
    }
    if (error instanceof Error) {
        return error.message;
    }
    return 'An unexpected error occurred.';
};