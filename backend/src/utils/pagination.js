export const getPaginationParams = (req, defaultLimit = 10) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || defaultLimit));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const buildPaginatedResponse = (items, totalItems, page, limit) => {
  const totalPages = Math.ceil(totalItems / limit) || 1;

  return {
    items,
    pagination: {
      totalItems,
      totalPages,
      currentPage: page,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};
