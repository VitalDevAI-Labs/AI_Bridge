// src/components/prompt/NewPromptForm.tsx

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CategorySelect } from '@/components/prompt/category-select';
import { TagsSelect } from '@/components/prompt/tags-select';
import { useCreatePrompt, useUpdatePrompt, usePromptCategories, usePromptTags } from '@/hooks/usePrompts';
import { useToast } from '@/hooks/use-toast';
import type { Prompt, PromptInsert } from '@/config/types';

interface NewPromptFormProps {
  prompt?: Prompt; // For edit mode
  onClose: () => void;
  onSuccess?: () => void;
}

export function NewPromptForm({ prompt, onClose, onSuccess }: NewPromptFormProps) {
  const { toast } = useToast();
  const createPrompt = useCreatePrompt();
  const updatePrompt = useUpdatePrompt();
  const { categories } = usePromptCategories();
  const { tags: existingTags } = usePromptTags();

  const isEditMode = !!prompt;

  const [formData, setFormData] = useState<PromptInsert>({
    title: prompt?.title || '',
    category: prompt?.category || [],
    description: prompt?.description || '',
    prompt_text: prompt?.prompt_text || '',
    tags: prompt?.tags || [],
  });

  const [selectedCategory, setSelectedCategory] = useState<string[]>(
    prompt ? prompt.category : []
  );

  const [selectedTags, setSelectedTags] = useState<string[]>(
    prompt ? prompt.tags : []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Title is required',
      });
      return;
    }

    if (!formData.category || formData.category.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'At least one category is required',
      });
      return;
    }

    if (!formData.prompt_text.trim() || formData.prompt_text.trim().length < 10) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Prompt text must be at least 10 characters',
      });
      return;
    }

    try {
      if (isEditMode && prompt) {
        await updatePrompt.mutateAsync({
          id: prompt.id,
          ...formData,
        });
        toast({
          title: 'Success',
          description: 'Prompt updated successfully',
        });
      } else {
        await createPrompt.mutateAsync(formData);
        toast({
          title: 'Success',
          description: 'Prompt created successfully',
        });
      }

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save prompt',
      });
    }
  };

  const handleCategoryChange = (selected: string[]) => {
    setSelectedCategory(selected);
    // Allow multiple category selection
    setFormData(prev => ({
      ...prev,
      category: selected
    }));
  };

  const handleCategoryCreate = (newCategory: string) => {
    console.log('New category created:', newCategory);
  };

  const handleTagsChange = (selected: string[]) => {
    setSelectedTags(selected);
    setFormData(prev => ({
      ...prev,
      tags: selected
    }));
  };

  const handleTagCreate = (newTag: string) => {
    console.log('New tag created:', newTag);
  };

  return (
    <div className="w-full">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold leading-none tracking-tight">
          {isEditMode ? 'Edit Prompt' : 'Add New Prompt'}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div className="space-y-1 sm:space-y-2">
          <label className="text-sm font-medium">
            Title <span className="text-red-500">*</span>
          </label>
          <Input
            required
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter prompt title (e.g., Speech Enhancer)"
            maxLength={100}
            className="w-full"
          />
        </div>

        <div className="space-y-1 sm:space-y-2">
          <label className="text-sm font-medium">Category</label>
          <CategorySelect
            value={selectedCategory}
            onChange={handleCategoryChange}
            onCreateOption={handleCategoryCreate}
          />
        </div>

        <div className="space-y-1 sm:space-y-2">
          <label className="text-sm font-medium">Description</label>
          <Input
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Brief description of what this prompt does"
            maxLength={200}
            className="w-full"
          />
        </div>

        <div className="space-y-1 sm:space-y-2">
          <label className="text-sm font-medium">
            Prompt Text <span className="text-red-500">*</span>
          </label>
          <Textarea
            required
            value={formData.prompt_text}
            onChange={(e) => setFormData(prev => ({ ...prev, prompt_text: e.target.value }))}
            placeholder="Enter the actual prompt content..."
            className="min-h-[150px] sm:min-h-[200px] font-mono text-sm w-full"
          />
          <p className="text-xs text-muted-foreground">
            {formData.prompt_text.length} characters (minimum 10 required)
          </p>
        </div>

        <div className="space-y-1 sm:space-y-2">
          <label className="text-sm font-medium">Tags</label>
          <TagsSelect
            value={selectedTags}
            onChange={handleTagsChange}
            onCreateOption={handleTagCreate}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-4">
          <Button 
            type="submit" 
            className="flex-1 order-2 sm:order-1"
            disabled={createPrompt.isPending || updatePrompt.isPending}
          >
            {createPrompt.isPending || updatePrompt.isPending ? 'Saving...' : (isEditMode ? 'Update' : 'Create')}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="flex-1 order-1 sm:order-2"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}


