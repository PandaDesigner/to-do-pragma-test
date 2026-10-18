export const PAGE_SIZE = 20;

export function pageCount(total: number, size: number): number {
  if (size <= 0) {
    return total > 0 ? total : 1;
  }
  if (total <= 0) {
    return 1;
  }
  return Math.ceil(total / size);
}
