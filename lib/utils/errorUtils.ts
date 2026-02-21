/**
 * Utility to extract a user-friendly error message from an Axios error response.
 * It handles string details, nested field errors, and specific backend response keys.
 */
export const getErrorMessage = (err: any): string => {
    if (!err) return "An unexpected error occurred.";

    const responseData = err.response?.data;

    if (responseData) {
        // 1. Handle string details
        if (typeof responseData.detail === 'string') return responseData.detail;
        if (typeof responseData.error === 'string') return responseData.error;
        if (typeof responseData.message === 'string') return responseData.message;
        if (typeof responseData.status === 'string' && responseData.status === 'error') {
            if (typeof responseData.messsage === 'string') return responseData.messsage; // Note: handle typo in backend if it exists
        }

        // 2. Handle field-specific errors (often an array of strings per field)
        if (typeof responseData === 'object') {
            const firstKey = Object.keys(responseData)[0];
            const errorVal = responseData[firstKey];

            if (Array.isArray(errorVal) && errorVal.length > 0) {
                return `${firstKey}: ${errorVal[0]}`;
            }

            if (typeof errorVal === 'string') {
                return errorVal;
            }
        }
    }

    return err.message || "An unexpected error occurred.";
};
