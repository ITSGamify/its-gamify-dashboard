import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";

export interface Option {
  id: string;
  label: string;
}

interface AutocompleteAsyncMultiProps<T extends Option = Option> {
  options: T[];
  label: string;
  selectedIds: string[];
  onChange: (ids: string[]) => void; // Đổi lại thành onChange với array ids
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

const AutocompleteAsyncMulti = <T extends Option>({
  options,
  label,
  selectedIds,
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
}: AutocompleteAsyncMultiProps<T>) => {
  const [inputValue, setInputValue] = useState("");

  // Tạo value từ selectedIds và options
  const selectedOptions = options.filter((option) =>
    selectedIds.includes(option.id)
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue.length > 0) {
        onSearch(inputValue);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [inputValue, onSearch]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (_: any, newInputValue: string) => {
    setInputValue(newInputValue);
    if (!newInputValue) {
      onSearch("");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (_: any, newValue: T[]) => {
    const newIds = newValue.map((option) => option.id);
    onChange(newIds);
  };

  return (
    <Autocomplete
      multiple
      options={options}
      value={selectedOptions}
      onChange={handleChange}
      onInputChange={handleInputChange}
      getOptionLabel={(option) => {
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
      clearOnBlur
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
          inputProps={{
            ...params.inputProps,
            autoComplete: "off",
          }}
        />
      )}
    />
  );
};

export default AutocompleteAsyncMulti;
