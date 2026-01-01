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