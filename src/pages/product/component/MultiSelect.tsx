import React, { useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

// Define the type for the selected options (optional but recommended)
interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  title: string;
  newOptions: Object[];
  trigger: (event:string[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ options, title, trigger, newOptions }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleSelectChange = (event: SelectChangeEvent<string[]>) => {
    setSelectedOptions(event.target.value as string[]);
    trigger(event.target.value as string[])
  };

  return (
    <>
        <FormControl sx={{ width: '100%' }}>
        <InputLabel sx={{ background: 'white', paddingLeft: '5px', paddingRight: '5px' }}>{title}</InputLabel>
        <Select
            required
            multiple
            fullWidth
            value={selectedOptions}
            onChange={handleSelectChange}
            renderValue={(selected) => (
            <div className='space-x-2'>
                {(selected as string[]).map((value) => (
                <span className='bg-gray-300 rounded-full px-4 py-2 cursor-pointer transition-all duration-150 hover:bg-gray-400' key={value}>{value}</span>
                ))}
            </div>
            )}
        >
            {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
                {option.label}
            </MenuItem>
            ))}
            {
              newOptions.map((option) => {
                return <MenuItem key={option.name} value={option.name}>
                  {option.name}
                </MenuItem>
              })
            }
        </Select>
        </FormControl>
    </>
  );
};

export default MultiSelect;
