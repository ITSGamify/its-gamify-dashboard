import { Option } from "@components/ui/atoms/AutocompleteAsync";
import { DEFAULT_LIMIT_OPTIONS_PARAMS } from "@constants/query";
import { PaginatedResponse, PaginationParams } from "@interfaces/dom/query";
import { UseQueryResult } from "@tanstack/react-query";
import { useState } from "react";

export interface OptionField<T> {
  labelField: keyof T; // used as fallback if customLabel is not provided
  valueField: keyof T;
  customLabel?: (item: T) => string;
  customValue?: (item: T) => string | object;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: Record<string, any>;
  enabled?: boolean;
}

type Params<P> = P extends PaginationParams ? P : PaginationParams;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useGetOptions = <T extends Record<string, any>, P>(
  useGetData: (
    params?: Params<P>
  ) => UseQueryResult<PaginatedResponse<T>, Error>,
  optionField: OptionField<T>
) => {
  const [query, setQuery] = useState("");
  const isEnabled = optionField.enabled ?? true;
  const params = {
    limit: DEFAULT_LIMIT_OPTIONS_PARAMS,
    q: query,
    ...optionField.params,
  } as Params<P>;

  const { data: response, isLoading } = useGetData(
    !isEnabled ? undefined : params
  );

  const options = Array.isArray(response?.data)
    ? response.data.map(
        (item) =>
          ({
            label: optionField.customLabel
              ? optionField.customLabel(item)
              : item[optionField.labelField],
            id: optionField.customValue
              ? optionField.customValue(item)
              : item[optionField.valueField],
          } as Option)
      )
    : [];

  const handleSearchOptions = (value: string) => {
    setQuery(value);
  };

  return {
    options,
    isLoading,
    handleSearchOptions,
    response,
  };
};
