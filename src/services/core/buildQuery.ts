import type { PaginatedParams } from "@/services/types/common";

type QueryValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | QueryValue[]
  | { [key: string]: QueryValue };

function appendQuery(
  params: URLSearchParams,
  key: string,
  value: QueryValue,
): void {
  if (value === null || value === undefined) return;

  if (Array.isArray(value)) {
    value.forEach((item) => {
      if (item !== null && typeof item === "object" && !Array.isArray(item)) {
        Object.entries(item).forEach(([childKey, childValue]) => {
          appendQuery(params, `${key}[${childKey}]`, childValue);
        });
      } else if (Array.isArray(item)) {
        appendQuery(params, key, item);
      } else if (item !== null && item !== undefined) {
        params.append(`${key}[]`, String(item));
      }
    });

    return;
  }

  if (typeof value === "object") {
    Object.entries(value).forEach(([childKey, childValue]) => {
      appendQuery(params, `${key}[${childKey}]`, childValue);
    });

    return;
  }

  params.append(key, String(value));
}

export function buildQuery(
  input?: PaginatedParams | Record<string, unknown>,
): string {
  if (!input) return "";

  const params = new URLSearchParams();

  Object.entries(input).forEach(([key, value]) => {
    appendQuery(params, key, value as QueryValue);
  });

  return params.toString();
}
