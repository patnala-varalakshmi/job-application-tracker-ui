export const sortList = (data, sortBy, sortOrder) => {
  return [...data].sort((a, b) => {
    if (sortBy === 'createdAt') {
      return sortOrder === 'asc'
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    }
    const aVal = a[sortBy]?.toLowerCase() || '';
    const bVal = b[sortBy]?.toLowerCase() || '';
    return sortOrder === 'asc'
      ? aVal.localeCompare(bVal)
      : bVal.localeCompare(aVal);
  });
};
