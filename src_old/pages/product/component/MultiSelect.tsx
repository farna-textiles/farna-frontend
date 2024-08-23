import { useState } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { MultiSelectProps } from '../../../interfaces';

const MultiSelect = <T extends string>({
  options,
  title,
  trigger,
  newOptions,
}: MultiSelectProps<T>) => {
  const [selectedOptions, setSelectedOptions] = useState<T[]>([]);

  const handleSelectChange = (event: SelectChangeEvent<T[]>) => {
    setSelectedOptions(event.target.value as T[]);
    trigger(event.target.value as T[]);
  };

  const getOptionLabel = (value: T): string => {
    const option = options.find((opt) => opt.value === value);
    if (option) {
      return option.label;
    }
    const newOption = newOptions?.find((opt) => opt.value === value);
    return newOption ? newOption.label : '';
  };

  return (
    <FormControl sx={{ width: '100%' }}>
      <InputLabel
        sx={{ background: 'white', paddingLeft: '5px', paddingRight: '5px' }}
      >
        {title}
      </InputLabel>
      <Select
        required
        multiple
        fullWidth
        value={selectedOptions}
        onChange={handleSelectChange}
        renderValue={(selected) => (
          <div className="space-x-2">
            {(selected as T[]).map((value) => (
              <span
                className="bg-gray-300 rounded-full px-4 py-2 cursor-pointer transition-all duration-150 hover:bg-gray-400"
                key={value}
              >
                {getOptionLabel(value)}
              </span>
            ))}
          </div>
        )}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
        {newOptions?.map((option) => {
          return (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default MultiSelect;
