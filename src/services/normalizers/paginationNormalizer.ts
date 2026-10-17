import type { ApiMeta, PaginationLinks } from "@/services/types/api";
import type { PaginationResult } from "@/services/types/common";
import { normalizeList } from "./responseNormalizer";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readNumber(
  source: UnknownRecord,
  keys: string[],
  fallback: number,
): number {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (
      typeof value === "string" &&
      value.trim() !== "" &&
      Number.isFinite(Number(value))
    ) {
      return Number(value);
    }
  }
  return fallback;
}

function readOptionalNumber(
  source: UnknownRecord,
  key: string,
): number | undefined {
  const value = source[key];
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (
    typeof value === "string" &&
    value.trim() !== "" &&
    Number.isFinite(Number(value))
  ) {
    return Number(value);
  }
  return undefined;
}

// function findPaginationMeta(response: unknown): UnknownRecord {
//   if (!isRecord(response)) return {};

//   const rootData = isRecord(response.data) ? response.data : response;

//   if (isRecord(rootData.pagination)) return rootData.pagination;
//   if (isRecord(rootData.meta) && !("current_page" in rootData)) {
//     if (
//       "current_page" in (rootData.meta as UnknownRecord) ||
//       "last_page" in (rootData.meta as UnknownRecord)
//     ) {
//       return rootData.meta as UnknownRecord;
//     }
//   }

//   const paginationKeys = [
//     "current_page",
//     "currentPage",
//     "last_page",
//     "lastPage",
//     "per_page",
//     "perPage",
//     "total",
//   ];
//   if (paginationKeys.some((key) => key in rootData)) {
//     return rootData;
//   }

//   return {};
// }

function findPaginationMeta(response: unknown): UnknownRecord {
  if (!isRecord(response)) return {};

  const rootData = isRecord(response.data) ? response.data : response;

  // Cek jika pagination berada di dalam response.data.meta (struktur API patient-verification)
  if (isRecord(rootData.meta) && "current_page" in rootData.meta) {
    return rootData.meta as UnknownRecord;
  }

  if (isRecord(rootData.pagination)) return rootData.pagination;
  if (isRecord(rootData.meta) && !("current_page" in rootData)) {
    if (
      "current_page" in (rootData.meta as UnknownRecord) ||
      "last_page" in (rootData.meta as UnknownRecord)
    ) {
      return rootData.meta as UnknownRecord;
    }
  }

  const paginationKeys = [
    "current_page",
    "currentPage",
    "last_page",
    "lastPage",
    "per_page",
    "perPage",
    "total",
  ];
  if (paginationKeys.some((key) => key in rootData)) {
    return rootData;
  }

  return {};
}

function readLinks(response: unknown): PaginationLinks | undefined {
  if (!isRecord(response)) return undefined;
  const rootData = isRecord(response.data) ? response.data : response;
  const candidate = isRecord(rootData.links) ? rootData.links : undefined;

  if (!candidate) return undefined;

  const readLink = (key: string): string | null => {
    const value = candidate[key];
    return typeof value === "string" ? value : null;
  };

  return {
    first: readLink("first"),
    last: readLink("last"),
    prev: readLink("prev"),
    next: readLink("next"),
  };
}

// function readApiMeta(response: unknown): ApiMeta | undefined {
//   if (!isRecord(response) || !isRecord(response.meta)) return undefined;

//   const meta = response.meta;

//   if (!("code" in meta || "status" in meta || "message" in meta)) {
//     return undefined;
//   }

//   return {
//     code: typeof meta.code === "number" ? meta.code : undefined,
//     status: typeof meta.status === "string" ? meta.status : undefined,
//     message: typeof meta.message === "string" ? meta.message : undefined,
//     request_id:
//       typeof meta.request_id === "string" ? meta.request_id : undefined,
//     error: meta.error,
//   };
// }
function readApiMeta(response: unknown): ApiMeta | undefined {
  if (!isRecord(response)) return undefined;

  // Root meta berisi status code, message, dll (misal: { meta: { code: 200, message: "..." } })
  const meta = isRecord(response.meta) ? response.meta : undefined;

  if (!meta || !("code" in meta || "status" in meta || "message" in meta)) {
    return undefined;
  }

  return {
    code: typeof meta.code === "number" ? meta.code : undefined,
    status: typeof meta.status === "string" ? meta.status : undefined,
    message: typeof meta.message === "string" ? meta.message : undefined,
    request_id:
      typeof meta.request_id === "string" ? meta.request_id : undefined,
    error: meta.error,
  };
}

export function normalizePagination<T>(
  response: unknown,
  requestedPage = 1,
  requestedPerPage = 10,
): PaginationResult<T> {
  const pagination = findPaginationMeta(response);
  const items = normalizeList<T>(response);

  const currentPage = readNumber(
    pagination,
    ["current_page", "currentPage", "page"],
    requestedPage,
  );
  const perPage = readNumber(
    pagination,
    ["per_page", "perPage", "page_size", "pageSize"],
    requestedPerPage,
  );
  const total = readNumber(
    pagination,
    ["total", "total_count", "totalCount"],
    items.length,
  );
  const lastPage = readNumber(
    pagination,
    ["last_page", "lastPage", "total_pages", "totalPages"],
    Math.max(1, Math.ceil(total / Math.max(perPage, 1))),
  );

  const from = readOptionalNumber(pagination, "from");
  const to = readOptionalNumber(pagination, "to");

  return {
    items,
    total,
    currentPage,
    perPage,
    lastPage,
    ...(from !== undefined ? { from } : {}),
    ...(to !== undefined ? { to } : {}),
    ...(readLinks(response) ? { links: readLinks(response) } : {}),
    ...(readApiMeta(response) ? { meta: readApiMeta(response) } : {}),
  };
}
