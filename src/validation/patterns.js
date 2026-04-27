export const emailPattern = /^[\w.!#$%&’*+/=?`{|}~-]+@[\w-]+(?:\.[\w-]+)+$/;
export const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/; // min 8, upper, lower, number
export const codePattern = /^\d{6}$/; // 6‑digit verification code
