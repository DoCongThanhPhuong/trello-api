export const pagingSkipValue = (page, size) => {
  if (!page || !size) return 0
  if (page <= 0 || size <= 0) return 0
  return (page - 1) * size
}
