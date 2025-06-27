import { OrderDirection } from "@interfaces/dom/query";
import { TableColumns } from "@interfaces/dom/table";

export const getInitialSorted = (
  searchParams: URLSearchParams,
  defaultColumn: TableColumns
) => {
  const searchParamsKeys = Array.from(searchParams.keys());

  return [...defaultColumn]
    .sort((a, b) => {
      const indexA = searchParamsKeys.indexOf(a.column as string);
      const indexB = searchParamsKeys.indexOf(b.column as string);

      return indexA === -1 ? 1 : indexB === -1 ? -1 : indexA - indexB;
    })
    .map((each) => ({
      ...each,
      direction: (searchParams.get(each.column as string) ||
        each.direction) as OrderDirection,
    }));
};

export const appendFirstSearchParams = (
  column: string,
  direction: string,
  searchParams: URLSearchParams
) => {
  const newSearchParams = new URLSearchParams();
  newSearchParams.set(column, direction);

  if (searchParams.get(column)) {
    searchParams.delete(column);
  }

  searchParams.forEach((value, key) => {
    if (key !== column) {
      newSearchParams.append(key, value);
    }
  });

  return newSearchParams;
};

export const createParamSetter = (params: URLSearchParams) => {
  return (key: string, value: string | null | undefined) => {
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
  };
};
