export interface BindingInfo {
  bed_id: string;
  bed_label: string;
  room_label: string;
  ward_name: string;
}

export interface StbItem {
  id: string;
  serial: string;
  serial_source: string;
  status: string;
  note: string;
  online: boolean;
  last_seen_at: string;
  app_version: string;
  os_version: string;
  last_ip: string;
  created_at: string;
  ttl_hours: number;
  bed_id: string;
  binding?: BindingInfo | null;
  revoked_at: string;
  retired_at: string;
}

export const defaultStb: StbItem = {
  id: "",
  serial: "",
  serial_source: "",
  status: "",
  note: "",
  online: false,
  last_seen_at: "",
  app_version: "",
  os_version: "",
  last_ip: "",
  created_at: "",
  revoked_at: "",
  retired_at: "",
  ttl_hours: 24,
  bed_id: "",
  binding: null,
};

export const validateStb = (payload: StbItem): string[] => {
  const errors: string[] = [];

  if (!payload.serial) {
    errors.push("Serial is required.");
  }
  if (!payload.note) {
    errors.push("Note is required.");
  }

  return errors;
};
export interface EnrollmentCodeResponse {
  id: string;
  code: string;
  expires_at: string;
  replaces_active_code: boolean;
}
