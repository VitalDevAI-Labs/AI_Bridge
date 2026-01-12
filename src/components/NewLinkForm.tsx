import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { MultiSelect, type Option } from '@/components/ui/multiselect';
import { CategorySelect, type CategoryOption } from '@/components/ui/category-select';
import { TagsSelect, type TagOption } from '@/components/ui/tags-select';
import { useCreateLlmLink, useLlmLinks } from '@/hooks/useLlmLinks';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { LlmLinkInsert } from '@/hooks/useLlmLinks';
import modelsData from '@/data/models.json';

interface NewLinkFormProps {
  onClose: () => void;
}

export function NewLinkForm({ onClose }: NewLinkFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: existingLinks } = useLlmLinks();
  const createLlmLink = useCreateLlmLink();
  const [formData, setFormData] = useState<LlmLinkInsert>({
    name: '',
    category: [],
    description: '',
    isPopular: false,
    model: '',
    tags: [],
    url: ''
  });
  const [selectedModels, setSelectedModels] = useState<Option[]>([]);
  const [selectedAreaTags, setSelectedAreaTags] = useState<string[]>([]);
  const [selectedAreaCategories, setSelectedAreaCategories] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to create a link',
      });
      return;
    }
    
    try {
      // Include the current user's ID when creating the link
      const linkData = {
        ...formData,
        user_id: user.id
      };
      
      await createLlmLink.mutateAsync(linkData);
      toast({
        title: 'Success',
        description: 'Link created successfully',
      });
      onClose();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create link',
      });
    }
  };

  // Extract unique categories and tags from existing data
  const availableOptions = useMemo(() => {
    return {
      models: modelsData.map(model => ({ label: model, value: model })),
    };
  }, []);
  
  
  
  const handleModelsChange = (selected: Option[]) => {
    setSelectedModels(selected);
    // For models, we'll take the first selected model since it's typically single-select
    setFormData(prev => ({
      ...prev,
      model: selected.length > 0 ? selected[0].value : ''
    }));
  };
  
  const handleAreaTagsChange = (selected: string[]) => {
    setSelectedAreaTags(selected);
    setFormData(prev => ({
      ...prev,
      tags: selected
    }));
  };

  const handleTagCreate = (newTag: string) => {
    // Optionally, you can add the new tag to your database or cache here
    console.log('New tag created:', newTag);
  };

  const handleAreaCategoriesChange = (selected: string[]) => {
    setSelectedAreaCategories(selected);
    setFormData(prev => ({
      ...prev,
      category: selected
    }));
  };

  const handleCategoryCreate = (newCategory: string) => {
    // Optionally, you can add the new category to your database or cache here
    console.log('New category created:', newCategory);
  };

  return (
    <div className="w-full">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold leading-none tracking-tight">Add New Link</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="space-y-1 sm:space-y-2">
            <label className="text-sm font-medium">URL <span className="text-red-500">*</span></label>
            <Input
              required
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              placeholder="Enter URL"
              className="w-full"
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <label className="text-sm font-medium">Name <span className="text-red-500">*</span></label>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter name"
              className="w-full"
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <label className="text-sm font-medium">Model <span className="text-red-500">*</span></label>
            <MultiSelect
              options={availableOptions.models}
              value={selectedModels}
              onChange={handleModelsChange}
              placeholder="Select a model"
              hasSelectAll={false}
              disableSearch={false}
              className="w-full"
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter description"
              className="w-full"
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <label className="text-sm font-medium">Categories</label>
            <CategorySelect
              value={selectedAreaCategories}
              onChange={handleAreaCategoriesChange}
              onCreateOption={handleCategoryCreate}
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <TagsSelect
              value={selectedAreaTags}
              onChange={handleAreaTagsChange}
              onCreateOption={handleTagCreate}
            />
          </div>

          <div className="flex items-center space-x-2 py-2">
            <Checkbox
              id="isPopular"
              checked={formData.isPopular}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, isPopular: checked as boolean }))
              }
            />
            <label htmlFor="isPopular" className="text-sm font-medium">
              Popular Link
            </label>
          </div>

        <Button type="submit" className="w-full mt-4">
          Submit
        </Button>
      </form>
    </div>
  );
}
