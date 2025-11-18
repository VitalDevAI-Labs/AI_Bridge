'use client';

import {
  HTMLAttributes,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
  KeyboardEvent,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Plus, Check } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

export type TTag = {
  key: string;
  name: string;
};

type MultipleSelectProps = {
  tags: TTag[];
  customTag?: (item: TTag) => ReactNode | string;
  onChange?: (value: TTag[]) => void;
  onTagCreate?: (newTag: TTag) => void;
  defaultValue?: TTag[];
  label?: string;
  placeholder?: string;
  className?: string;
  allowCreate?: boolean;
  createLabel?: string;
};

export const MultipleSelect = ({
  tags,
  customTag,
  onChange,
  onTagCreate,
  defaultValue,
  label = "Tags",
  placeholder = "Select tags...",
  className,
  allowCreate = true,
  createLabel = "Create new tag",
}: MultipleSelectProps) => {
  const [selected, setSelected] = useState<TTag[]>(defaultValue ?? []);
  const [availableTags, setAvailableTags] = useState<TTag[]>(tags);
  const [isCreating, setIsCreating] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (containerRef?.current) {
      containerRef.current.scrollBy({
        left: containerRef.current?.scrollWidth,
        behavior: 'smooth',
      });
    }
    onValueChange(selected);
  }, [selected]);

  useEffect(() => {
    setAvailableTags(tags);
  }, [tags]);

  useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreating]);

  const onValueChange = (value: TTag[]) => {
    onChange?.(value);
  };

  const onSelect = (item: TTag) => {
    setSelected((prev) => [...prev, item]);
  };

  const onDeselect = (item: TTag) => {
    setSelected((prev) => prev.filter((i) => i !== item));
  };

  const startCreating = () => {
    setIsCreating(true);
    setNewTagName('');
  };

  const cancelCreating = () => {
    setIsCreating(false);
    setNewTagName('');
  };

  const createTag = () => {
    const trimmedName = newTagName.trim();
    if (!trimmedName) return;

    // Check if tag already exists
    const tagExists = availableTags.some(
      tag => tag.name.toLowerCase() === trimmedName.toLowerCase()
    );
    
    if (tagExists) {
      // If tag exists, just select it
      const existingTag = availableTags.find(
        tag => tag.name.toLowerCase() === trimmedName.toLowerCase()
      );
      if (existingTag) {
        onSelect(existingTag);
      }
    } else {
      // Create new tag
      const newTag: TTag = {
        key: trimmedName.toLowerCase().replace(/\s+/g, '-'),
        name: trimmedName
      };
      
      // Add to available tags
      setAvailableTags(prev => [...prev, newTag]);
      
      // Select the new tag
      onSelect(newTag);
      
      // Notify parent component
      onTagCreate?.(newTag);
    }
    
    cancelCreating();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      createTag();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelCreating();
    }
  };

  return (
    <AnimatePresence mode={'popLayout'}>
      <div className={cn('flex w-full flex-col gap-2', className)}>
        <label className="text-sm font-medium">
          {label} <span className="text-red-500">*</span>
        </label>
        
        {/* Selected Tags Display Area */}
        <motion.div
          layout
          ref={containerRef}
          className='selected no-scrollbar flex min-h-12 w-full items-center overflow-x-scroll scroll-smooth rounded-md border border-border bg-background p-2 transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2'
        >
          <motion.div layout className='flex items-center gap-2'>
            {selected?.length === 0 && (
              <span className="text-muted-foreground text-sm">
                {placeholder}
              </span>
            )}
            {selected?.map((item) => (
              <Tag
                name={item?.key}
                key={item?.key}
                className={'bg-secondary text-secondary-foreground border border-border shadow-sm'}
              >
                <div className='flex items-center gap-2'>
                  <motion.span layout className={'text-nowrap text-sm'}>
                    {item?.name}
                  </motion.span>
                  <button 
                    className={'hover:bg-muted rounded-sm p-0.5 transition-colors'} 
                    onClick={() => onDeselect(item)}
                    type="button"
                  >
                    <X size={12} className="text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
              </Tag>
            ))}
          </motion.div>
        </motion.div>
        
        {/* Available Tags Selection Area */}
        {(availableTags?.length > selected?.length || allowCreate) && (
          <motion.div 
            layout
            className='flex w-full flex-wrap gap-2 rounded-md border border-border bg-muted/30 p-3 max-h-40 overflow-y-auto'
          >
            <div className="w-full">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">
                  Available tags (click to add):
                </span>
                {allowCreate && !isCreating && (
                  <button
                    type="button"
                    onClick={startCreating}
                    className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    <Plus size={12} />
                    {createLabel}
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {/* Create New Tag Input */}
                {isCreating && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1 bg-primary/10 border border-primary rounded-md px-2 py-1"
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter tag name..."
                      className="bg-transparent text-sm outline-none placeholder:text-muted-foreground min-w-0 w-24"
                    />
                    <button
                      type="button"
                      onClick={createTag}
                      disabled={!newTagName.trim()}
                      className="p-0.5 hover:bg-primary/20 rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Check size={12} className="text-primary" />
                    </button>
                    <button
                      type="button"
                      onClick={cancelCreating}
                      className="p-0.5 hover:bg-destructive/20 rounded-sm transition-colors"
                    >
                      <X size={12} className="text-muted-foreground hover:text-destructive" />
                    </button>
                  </motion.div>
                )}
                
                {/* Existing Available Tags */}
                {availableTags
                  ?.filter((item) => !selected?.some((i) => i.key === item.key))
                  .map((item) => (
                    <Tag
                      name={item?.key}
                      onClick={() => onSelect(item)}
                      key={item?.key}
                      className="bg-background hover:bg-accent hover:text-accent-foreground border border-border transition-colors"
                    >
                      {customTag ? (
                        customTag(item)
                      ) : (
                        <motion.span layout className={'text-nowrap text-sm'}>
                          {item?.name}
                        </motion.span>
                      )}
                    </Tag>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Helper text */}
        <p className="text-xs text-muted-foreground">
          Selected {selected.length} of {tags.length} tags
        </p>
      </div>
    </AnimatePresence>
  );
};

type TagProps = PropsWithChildren &
  Pick<HTMLAttributes<HTMLDivElement>, 'onClick'> & {
    name?: string;
    className?: string;
  };

export const Tag = ({ children, className, name, onClick }: TagProps) => {
  return (
    <motion.div
      layout
      layoutId={name}
      onClick={onClick}
      className={cn(
        'cursor-pointer rounded-md px-2 py-1 text-sm font-medium transition-all duration-200',
        'hover:scale-105 active:scale-95',
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
};
