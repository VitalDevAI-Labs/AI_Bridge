import React, { useMemo } from 'react';
import Select from 'react-select';
import modelsData from '@/data/models.json';

// Type for model option
export type ModelOption = {
  value: string;
  label: string;
};

interface ModelSelectProps {
  value: string;
  onChange: (model: string) => void;
}

export function ModelSelect({
  value,
  onChange
}: ModelSelectProps) {
  // Generate model options from models data
  const modelOptions = useMemo(() => {
    return modelsData.map(model => ({
      value: model,
      label: model
    }));
  }, []);

  // Handle model selection change
  const handleChange = (selectedOption: ModelOption | null) => {
    onChange(selectedOption ? selectedOption.value : '');
  };

  // Custom theme to match project's color scheme
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: 'hsl(var(--background))',
      borderColor: state.isFocused
        ? 'hsl(var(--primary))'
        : 'hsl(var(--input))',
      boxShadow: state.isFocused
        ? `0 0 0 1px hsl(var(--primary))`
        : 'none',
      '&:hover': {
        borderColor: 'hsl(var(--primary))'
      }
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: 'hsl(var(--background))',
      border: '1px solid hsl(var(--border))',
      boxShadow: '0 4px 6px -1px hsla(var(--foreground) / 0.1)'
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? 'hsl(var(--primary))'
        : state.isFocused
          ? 'hsl(var(--accent))'
          : 'transparent',
      color: state.isSelected
        ? 'hsl(var(--primary-foreground))'
        : 'hsl(var(--foreground))',
      '&:hover': {
        backgroundColor: 'hsl(var(--accent))'
      }
    })
  };

  return (
    <Select
      name="model"
      options={modelOptions}
      value={modelOptions.find(option => option.value === value) || null}
      onChange={handleChange}
      styles={customStyles}
      className="react-select-container"
      classNamePrefix="react-select"
      placeholder="Select a model"
      noOptionsMessage={() => "No models found"}
    />
  );
}