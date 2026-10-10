// src/apps/patient-verification/types/userTypes.ts

export interface PatientUserItem {
  id: string | number;
  username: string;
  email: string;
  role: string;
  departemen_id: number | string;
}

export interface LoginResponseData {
  token: string;
  token_type: string;
  user: PatientUserItem;
}

export const defaultPatientUser: PatientUserItem = {
  id: "",
  username: "",
  email: "",
  role: "",
  departemen_id: "",
};

export const validatePatientUser = (payload: PatientUserItem): string[] => {
  const errors: string[] = [];

  if (!payload.username || payload.username.trim() === "") {
    errors.push("Username wajib diisi.");
  }

  if (!payload.role || payload.role.trim() === "") {
    errors.push("Role wajib diisi.");
  }

  return errors;
};
