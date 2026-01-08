import { toast } from 'react-toastify';

export const copyToClipboard = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        toast.success(text, { theme: "dark", autoClose: 3000 });
        console.log('Text copied to clipboard:', text);
    } catch (err) {
        toast.error('Failed to copy text to clipboard.');
        console.error('Failed to copy text to clipboard:', err);
    }
};

export const hashToken = async (token: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(token);

    const hashBuffer = await crypto.subtle.digest('SHA-256', data); // Hash the token

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

    return hashHex;
};

export const verifyToken = async (inputToken: any, storedHash: any) => {
    const hashedToken = await hashToken(inputToken);

    return hashedToken === storedHash;
};

export const base64Encode = (token: any) => {
    return btoa(token); // Encode string to Base64
};

export const base64Decode = (encodedToken: any) => {
    return atob(encodedToken); // Decode Base64 back to string
};

export const formatNumberWithComma = (value: string | number): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) {
    return '0.00';
  }
  
  return numValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export const getEnv = (key: string, defaultValue: string = ""): string => {
  return (import.meta as any).env?.[key] || defaultValue;
};
