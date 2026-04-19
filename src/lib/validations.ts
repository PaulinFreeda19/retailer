export interface ValidationResult {
  valid: boolean;
  message?: string;
}

/* ------------------ REQUIRED ------------------ */
export const required = (value: string): ValidationResult => {
  if (!value || value.trim() === "") {
    return { valid: false, message: "This field is required" };
  }
  return { valid: true };
};

/* ------------------ NAME ------------------ */
export const validateName = (name: string): ValidationResult => {
  if (!name) {
    return { valid: false, message: "Name is required" };
  }

  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return { valid: false, message: "Name can only contain letters and spaces" };
  }

  return { valid: true };
};
export const validateEmail = (email: string): ValidationResult => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return { valid: false, message: "Email is required" };
  }

  if (!regex.test(email)) {
    return { valid: false, message: "Invalid email format" };
  }

  return { valid: true };
};

/* ------------------ PASSWORD ------------------ */
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { valid: false, message: "Password is required" };
  }

  if (password.length < 6) {
    return { valid: false, message: "Password must be at least 6 characters" };
  }

  return { valid: true };
};

/* ------------------ OTP ------------------ */
export const validateOtp = (otp: string): ValidationResult => {
  if (!otp) {
    return { valid: false, message: "OTP is required" };
  }

  if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
    return { valid: false, message: "OTP must be 6 digits" };
  }

  return { valid: true };
};
export const validateField = (
  value: string,
  rules: ((val: string) => ValidationResult)[]
): ValidationResult => {
  for (let rule of rules) {
    const result = rule(value);
    if (!result.valid) return result;
  }

  return { valid: true };
};