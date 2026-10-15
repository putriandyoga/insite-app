type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function normalizeList<T>(response: unknown): T[] {
  if (Array.isArray(response)) {
    return response as T[];
  }

  if (!isRecord(response)) return [];

  // Jika response.data adalah array (contoh: { data: [...] })
  if (Array.isArray(response.data)) {
    return response.data as T[];
  }

  // Jika response.items adalah array (contoh: { items: [...] })
  if (Array.isArray(response.items)) {
    return response.items as T[];
  }

  // Jika struktur Laravel LengthAwarePaginator bersarang: { data: { data: [...] } }
  if (isRecord(response.data)) {
    if (Array.isArray(response.data.data)) {
      return response.data.data as T[];
    }
    if (Array.isArray(response.data.items)) {
      return response.data.items as T[];
    }
  }

  if (Array.isArray(response.records)) {
    return response.records as T[];
  }

  if (Array.isArray(response.results)) {
    return response.results as T[];
  }

  if (isRecord(response.result) || Array.isArray(response.result)) {
    return normalizeList<T>(response.result);
  }

  return [];
}

export function normalizeDetail<T>(response: unknown): T {
  if (!isRecord(response)) return response as T;

  if (
    "data" in response &&
    isRecord(response.data) &&
    "data" in response.data
  ) {
    return response.data.data as T;
  }
  if ("data" in response) return response.data as T;
  if ("result" in response) return response.result as T;

  return response as T;
}
