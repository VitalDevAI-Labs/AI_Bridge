import React, { useMemo } from 'react';
import Select, { MultiValue } from 'react-select';
import { useLlmLinks } from '@/hooks/useLlmLinks';

// Predefined tags
const DEFAULT_TAGS = [
  'SvelteKit', 'Remix', 'Vue.js', 'React',
  'Angular', 'Node.js', 'Python', 'AI',
  'ML', 'API', 'Database'
];

// Type for tag option
export type TagOption = {
  value: string;
  label: string;
};

interface TagsSelectProps {
  value: string[];
  onChange: (tags: string[]) => void;
  onCreateOption?: (tag: string) => void;
}

export function TagsSelect({
  value,
  onChange,
  onCreateOption
}: TagsSelectProps) {
  const { data: existingLinks } = useLlmLinks();

  // Generate unique tags from existing links and defaults
  const tagOptions = useMemo(() => {
    const tagSet = new Set<string>([...DEFAULT_TAGS]);

    // Extract tags from existing links
    existingLinks?.forEach(link => {
      if (Array.isArray(link.tags)) {
        link.tags.forEach(tag => {
          if (tag && typeof tag === 'string') {
            tagSet.add(tag);
          }
        });
      }
    });

    // Convert to options
    return Array.from(tagSet)
      .sort()
      .map(tag => ({ value: tag, label: tag }));
  }, [existingLinks]);

  // Handle tag selection change
  const handleChange = (newValue: MultiValue<TagOption>) => {
    onChange(newValue?.map(option => option.value) || []);
  };

  // Handle creating a new tag
  const handleCreateOption = (inputValue: string) => {
    const newTag = { value: inputValue, label: inputValue };

    // Optionally call onCreateOption callback
    onCreateOption?.(inputValue);

    // Add to options and select
    const updatedOptions = [...tagOptions, newTag];
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
    <Select
      isMulti
      name="tags"
      options={tagOptions}
      styles={customStyles}
      className="react-select-container"
      classNamePrefix="react-select"
      value={value.map(tag => ({ value: tag, label: tag }))}
      onChange={handleChange}
      placeholder="Select tags..."
      noOptionsMessage={() => "No tags found"}
      createOptionPosition="first"
      allowCreateWhileLoading={false}
      formatCreateLabel={(inputValue) => `Create tag: "${inputValue}"`}
      onCreateOption={handleCreateOption}
    />
  );
}