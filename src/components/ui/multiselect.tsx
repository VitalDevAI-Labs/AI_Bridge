import React from 'react';
// @ts-ignore - react-multi-select-component doesn't have TypeScript definitions
import { MultiSelect as ReactMultiSelect } from 'react-multi-select-component';
import { cn } from '@/lib/utils';

export interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  value: Option[];
  onChange: (value: Option[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  hasSelectAll?: boolean;
  disableSearch?: boolean;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select items...",
  className,
  disabled = false,
  hasSelectAll = true,
  disableSearch = false,
}) => {
  return (
    <div className={cn("multiselect-wrapper", className)}>
      <ReactMultiSelect
        options={options}
        value={value}
        onChange={onChange}
        labelledBy="Select"
        hasSelectAll={hasSelectAll}
        disableSearch={disableSearch}
        overrideStrings={{
          selectSomeItems: placeholder,
          allItemsAreSelected: "All items are selected",
          selectAll: "Select All",
          search: "Search",
          clearSearch: "Clear Search",
        }}
        disabled={disabled}
      />
      <style jsx global>{`
        /* Force theme integration - Override all library styles */
        .multiselect-wrapper * {
          box-sizing: border-box;
        }
        
        /* Main dropdown container */
        .multiselect-wrapper .dropdown-container {
          border: 1px solid hsl(var(--border)) !important;
          border-radius: 0.375rem !important;
          background-color: hsl(var(--background)) !important;
          min-height: 2.5rem !important;
          transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out !important;
          position: relative !important;
        }
        
        .multiselect-wrapper .dropdown-container:focus-within {
          border-color: hsl(var(--ring)) !important;
          box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2) !important;
        }
        
        /* Dropdown heading/trigger area */
        .multiselect-wrapper .dropdown-heading {
          padding: 0.5rem 0.75rem !important;
          color: hsl(var(--foreground)) !important;
          font-size: 0.875rem !important;
          display: flex !important;
          align-items: center !important;
          gap: 0.5rem !important;
          min-height: 2.5rem !important;
          cursor: pointer !important;
          background-color: hsl(var(--background)) !important;
        }
        
        .multiselect-wrapper .dropdown-heading .dropdown-heading-value {
          flex: 1 !important;
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 0.25rem !important;
          align-items: center !important;
        }
        
        /* Selected item tags */
        .multiselect-wrapper .dropdown-heading .dropdown-heading-value .item-renderer {
          background-color: hsl(var(--secondary)) !important;
          color: hsl(var(--secondary-foreground)) !important;
          padding: 0.125rem 0.5rem !important;
          border-radius: 0.25rem !important;
          font-size: 0.75rem !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 0.25rem !important;
          border: 1px solid hsl(var(--border)) !important;
          max-width: 150px !important;
        }
        
        .multiselect-wrapper .dropdown-heading .dropdown-heading-value .item-renderer .item-renderer-text {
          font-weight: 500 !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          color: hsl(var(--secondary-foreground)) !important;
        }
        
        .multiselect-wrapper .dropdown-heading .dropdown-heading-value .item-renderer .item-renderer-remove {
          cursor: pointer !important;
          padding: 0.125rem !important;
          border-radius: 50% !important;
          transition: background-color 0.2s ease-in-out !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 14px !important;
          height: 14px !important;
          font-size: 10px !important;
          line-height: 1 !important;
          color: hsl(var(--secondary-foreground)) !important;
        }
        
        .multiselect-wrapper .dropdown-heading .dropdown-heading-value .item-renderer .item-renderer-remove:hover {
          background-color: hsl(var(--muted)) !important;
        }
        
        /* Dropdown indicator arrow */
        .multiselect-wrapper .dropdown-heading .dropdown-heading-dropdown-indicator {
          margin-left: auto !important;
          color: hsl(var(--muted-foreground)) !important;
          transition: transform 0.2s ease-in-out !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 20px !important;
          height: 20px !important;
        }
        
        .multiselect-wrapper .dropdown-container.dropdown-container--open .dropdown-heading .dropdown-heading-dropdown-indicator {
          transform: rotate(180deg) !important;
        }
        
        /* Dropdown content/options */
        .multiselect-wrapper .dropdown-content {
          position: absolute !important;
          z-index: 50 !important;
          background-color: hsl(var(--popover)) !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: 0.375rem !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
          margin-top: 0.25rem !important;
          max-height: 200px !important;
          overflow-y: auto !important;
          width: 100% !important;
          min-width: 200px !important;
        }
        
        .multiselect-wrapper .dropdown-content .panel-content {
          padding: 0.25rem !important;
          background-color: hsl(var(--popover)) !important;
        }
        
        /* Search input */
        .multiselect-wrapper .dropdown-content .search {
          padding: 0.5rem !important;
          border-bottom: 1px solid hsl(var(--border)) !important;
          background-color: hsl(var(--popover)) !important;
        }
        
        .multiselect-wrapper .dropdown-content .search input {
          width: 100% !important;
          padding: 0.5rem !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: 0.25rem !important;
          background-color: hsl(var(--background)) !important;
          color: hsl(var(--foreground)) !important;
          font-size: 0.875rem !important;
        }
        
        .multiselect-wrapper .dropdown-content .search input:focus {
          outline: none !important;
          border-color: hsl(var(--ring)) !important;
          box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2) !important;
        }
        
        .multiselect-wrapper .dropdown-content .search input::placeholder {
          color: hsl(var(--muted-foreground)) !important;
        }
        
        /* Option items - Force text visibility */
        .multiselect-wrapper .dropdown-content .select-item {
          padding: 0.5rem 0.75rem !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          gap: 0.5rem !important;
          color: hsl(var(--popover-foreground)) !important;
          font-size: 0.875rem !important;
          border-radius: 0.25rem !important;
          margin: 0.125rem !important;
          transition: background-color 0.2s ease-in-out !important;
          background-color: transparent !important;
        }
        
        /* Force all text elements to be visible */
        .multiselect-wrapper .dropdown-content .select-item span,
        .multiselect-wrapper .dropdown-content .select-item label,
        .multiselect-wrapper .dropdown-content .select-item div,
        .multiselect-wrapper .dropdown-content .select-item * {
          color: hsl(var(--popover-foreground)) !important;
        }
        
        .multiselect-wrapper .dropdown-content .select-item:hover {
          background-color: hsl(var(--accent)) !important;
          color: hsl(var(--accent-foreground)) !important;
        }
        
        .multiselect-wrapper .dropdown-content .select-item:hover span,
        .multiselect-wrapper .dropdown-content .select-item:hover label,
        .multiselect-wrapper .dropdown-content .select-item:hover div,
        .multiselect-wrapper .dropdown-content .select-item:hover * {
          color: hsl(var(--accent-foreground)) !important;
        }
        
        .multiselect-wrapper .dropdown-content .select-item input[type="checkbox"] {
          margin: 0 !important;
          width: 1rem !important;
          height: 1rem !important;
          accent-color: hsl(var(--primary)) !important;
        }
        
        .multiselect-wrapper .dropdown-content .select-item.select-item--selected {
          background-color: hsl(var(--accent)) !important;
          color: hsl(var(--accent-foreground)) !important;
        }
        
        .multiselect-wrapper .dropdown-content .select-item.select-item--selected span,
        .multiselect-wrapper .dropdown-content .select-item.select-item--selected label,
        .multiselect-wrapper .dropdown-content .select-item.select-item--selected div,
        .multiselect-wrapper .dropdown-content .select-item.select-item--selected * {
          color: hsl(var(--accent-foreground)) !important;
        }
        
        /* Select all option */
        .multiselect-wrapper .dropdown-content .select-all {
          border-bottom: 1px solid hsl(var(--border)) !important;
          margin-bottom: 0.25rem !important;
          padding-bottom: 0.5rem !important;
          background-color: hsl(var(--popover)) !important;
        }
        
        .multiselect-wrapper .dropdown-content .select-all .select-item {
          font-weight: 600 !important;
          color: hsl(var(--primary)) !important;
        }
        
        .multiselect-wrapper .dropdown-content .select-all .select-item span,
        .multiselect-wrapper .dropdown-content .select-all .select-item * {
          color: hsl(var(--primary)) !important;
        }
        
        /* Placeholder text */
        .multiselect-wrapper .dropdown-heading .dropdown-heading-value .gray {
          color: hsl(var(--muted-foreground)) !important;
          font-style: italic !important;
        }
        
        /* Dark theme specific overrides */
        .dark .multiselect-wrapper .dropdown-content {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2) !important;
        }
        
        /* Responsive adjustments */
        @media (max-width: 640px) {
          .multiselect-wrapper .dropdown-heading .dropdown-heading-value .item-renderer {
            max-width: 120px !important;
            font-size: 0.7rem !important;
          }
          
          .multiselect-wrapper .dropdown-content {
            max-height: 160px !important;
          }
        }
      `}</style>
    </div>
  );
};


