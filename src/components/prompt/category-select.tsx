import React, { useMemo } from 'react';
import CreatableSelect from 'react-select/creatable';
import { MultiValue } from 'react-select';
import { usePromptCategories } from '@/hooks/usePrompts';

// Predefined categories
const DEFAULT_CATEGORIES = [
  'Enhancer',
  'Formatter',
  'Study Expert',
  'Code Assistant'
];

// Type for category option
export type CategoryOption = {
  value: string;
  label: string;
};

interface CategorySelectProps {
  value: string[];
  onChange: (categories: string[]) => void;
  onCreateOption?: (category: string) => void;
}

export function CategorySelect({
  value,
  onChange,
  onCreateOption
}: CategorySelectProps) {
  const { categories } = usePromptCategories();

  // Generate unique categories from existing categories and defaults
  const categoryOptions = useMemo(() => {
    const categorySet = new Set<string>([...DEFAULT_CATEGORIES]);

    // Add existing categories
    categories.forEach(cat => {
      if (cat && typeof cat === 'string') {
        categorySet.add(cat);
      }
    });

    // Convert to options
    return Array.from(categorySet)
      .sort()
      .map(cat => ({ value: cat, label: cat }));
  }, [categories]);

  // Handle category selection change
  const handleChange = (newValue: MultiValue<CategoryOption>) => {
    onChange(newValue?.map(option => option.value) || []);
  };

  // Handle creating a new category
  const handleCreateOption = (inputValue: string) => {
    const newCategory = { value: inputValue, label: inputValue };

    // Optionally call onCreateOption callback
    onCreateOption?.(inputValue);

    // Add to options and select
    const updatedOptions = [...categoryOptions, newCategory];
    onChange([...value, inputValue]);
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
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: 'hsl(var(--secondary))',
      color: 'hsl(var(--secondary-foreground))'
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: 'hsl(var(--secondary-foreground))'
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: 'hsl(var(--secondary-foreground))',
      '&:hover': {
        backgroundColor: 'hsl(var(--destructive))',
        color: 'hsl(var(--destructive-foreground))'
      }
    })
  };

  return (
    <CreatableSelect
      isMulti
      name="prompt-categories"
      options={categoryOptions}
      styles={customStyles}
      className="react-select-container"
      classNamePrefix="react-select"
      value={value.map(cat => ({ value: cat, label: cat }))}
      onChange={handleChange}
      placeholder="Select or create categories..."
      noOptionsMessage={() => "No categories found"}
      createOptionPosition="first"
      allowCreateWhileLoading={false}
      formatCreateLabel={(inputValue) => `Create category: "${inputValue}"`}
      onCreateOption={handleCreateOption}
    />
  );
}