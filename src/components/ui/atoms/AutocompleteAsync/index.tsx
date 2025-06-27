import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";

export interface Option {
  id: string;
  label: string;
}

interface AutocompleteAsyncProps<T extends Option = Option> {
  options: T[];
  label: string;
  value: T | undefined;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  loading?: boolean;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  getOptionLabel?: (option: T) => string;
  isOptionEqualToValue?: (option: T, value: T) => boolean;
  noOptionsText?: string;
  loadingText?: string;
}

const AutocompleteAsync = <T extends Option>({
  options,
  label,
  value,
  onChange,
  onSearch,
  loading = false,
  error = false,
  helperText,
  required = false,
  disabled = false,
  placeholder = "",
  getOptionLabel = (option) => option.label,
  isOptionEqualToValue = (option, value) => option.id === value.id,
  noOptionsText = "Không có tùy chọn",
  loadingText = "Đang tải...",
}: AutocompleteAsyncProps<T>) => {
  const [inputValue, setInputValue] = useState("");
  const [debouncedInputValue, setDebouncedInputValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInputValue(inputValue);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [inputValue]);

  useEffect(() => {
    if (debouncedInputValue.length > 0) {
      onSearch(debouncedInputValue);
    }
  }, [debouncedInputValue, onSearch]);

  return (
    <Autocomplete
      options={options}
      value={value}
      onChange={(_, newValue) => onChange(newValue?.id as string)}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      getOptionLabel={(option) => {
        // Xử lý trường hợp option là null hoặc undefined
        if (!option) return "";
        return getOptionLabel(option);
      }}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          {getOptionLabel(option)}
        </li>
      )}
      isOptionEqualToValue={isOptionEqualToValue}
      loading={loading}
      disabled={disabled}
      noOptionsText={noOptionsText}
      loadingText={loadingText}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          required={required}
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
};

export default AutocompleteAsync;
