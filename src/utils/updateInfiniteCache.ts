export const updateInfiniteCache = (
  olData: any,
  targetId: number | string,
  updateFn: (item: any) => any,
) => {
  if (!olData) return olData;

  return {
    ...olData,
    pages: olData.pages.map((page: any) => ({
      ...page,
      items: page.items.map((item: any) =>
        item.id == targetId ? updateFn(item) : item,
      ),
    })),
  };
};
