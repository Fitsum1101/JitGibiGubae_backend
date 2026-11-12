import type { Request } from "express";

export type QueryOptions = {
  page?: number;
  limit?: number;
  isActive?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  hasPagination?: boolean; // New field
};

export const parseQuery = (req: Request): QueryOptions => {
  const query = req.query;

  const page = query.page ? parseInt(query.page as string, 10) : 1;
  const limit = query.limit ? parseInt(query.limit as string, 10) : 10;

  return {
    page: page > 0 ? page : 1,
    limit: limit > 0 && limit <= 100 ? limit : 10, // Limit max 100 for safety

    isActive: query.isActive === "true" ? true : query.isActive === "false" ? false : undefined,

    search: query.search ? (query.search as string).trim() : undefined,

    sortBy: query.sortBy ? (query.sortBy as string) : "createdAt",
    sortOrder: (query.sortOrder as "asc" | "desc") || "desc",

    // New: Control pagination
    hasPagination:
      query.hasPagination === "true" || query.hasPagination === undefined ? true : false,
  };
};

/**
 * Build Prisma query options
 */
export const buildPrismaQuery = (options: QueryOptions) => {
  const {
    page = 1,
    limit = 10,
    sortBy,
    sortOrder,
    isActive,
    search,
    hasPagination,
    ...restFilters
  } = options;

  const where: any = { ...restFilters };

  if (isActive !== undefined) {
    where.isActive = isActive;
  }

  if (search) {
    where.OR = [
      { username: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      // Add more fields if needed for other models
    ];
  }

  const queryOptions: any = {
    orderBy: { [sortBy || "createdAt"]: sortOrder },
    where: Object.keys(where).length > 0 ? where : undefined,
  };

  // Apply pagination only if hasPagination is true
  if (hasPagination) {
    queryOptions.skip = (page - 1) * limit;
    queryOptions.take = limit;
  }

  return queryOptions;
};
