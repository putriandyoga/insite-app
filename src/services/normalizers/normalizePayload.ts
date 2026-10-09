function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null) return false;

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function appendValue(formData: FormData, key: string, value: unknown): void {
  if (value === null || value === undefined) return;

  if (value instanceof Blob) {
    formData.append(key, value);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      appendValue(formData, `${key}[${index}]`, item);
    });
    return;
  }

  if (isPlainObject(value)) {
    Object.entries(value).forEach(([childKey, childValue]) => {
      appendValue(formData, `${key}[${childKey}]`, childValue);
    });
    return;
  }

  if (value instanceof Date) {
    formData.append(key, value.toISOString());
    return;
  }

  formData.append(key, String(value));
}

export function normalizePayload(payload: unknown): FormData {
  if (payload instanceof FormData) return payload;

  if (!isPlainObject(payload)) {
    throw new TypeError("Payload harus berupa object atau FormData.");
  }

  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    appendValue(formData, key, value);
  });

  return formData;
}
