import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { MultiSelect, type Option } from '@/components/ui/multiselect';
import { MultipleSelect, type TTag } from '@/components/ui/multiple-select';
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
  const [selectedAreaTags, setSelectedAreaTags] = useState<TTag[]>([]);
  const [selectedAreaCategories, setSelectedAreaCategories] = useState<TTag[]>([]);

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
    if (!existingLinks) return { categories: [], tags: [] };
    
    const categorySet = new Set<string>();
    const tagSet = new Set<string>();
    
    existingLinks.forEach(link => {
      // Handle categories
      if (Array.isArray(link.category)) {
        link.category.forEach(cat => {
          if (cat && typeof cat === 'string') {
            categorySet.add(cat);
          }
        });
      }
      
      // Handle tags
      if (Array.isArray(link.tags)) {
        link.tags.forEach(tag => {
          if (tag && typeof tag === 'string') {
            tagSet.add(tag);
          }
        });
      }
    });
    
    // Add some default categories
    ['General Experts', 'English Expert', 'Formatters', 'Code Assistant', 'Creative Writing', 'Data Analysis'].forEach(cat => categorySet.add(cat));
    
    // Add some default tags
    ['SvelteKit', 'Remix', 'Vue.js', 'React', 'Angular', 'Node.js', 'Python', 'AI', 'ML', 'API', 'Database'].forEach(tag => tagSet.add(tag));
    
    return {
      tags: Array.from(tagSet).sort().map(tag => ({ label: tag, value: tag })),
      models: modelsData.map(model => ({ label: model, value: model })),
      areaTags: Array.from(tagSet).sort().map(tag => ({ key: tag, name: tag })),
      areaCategories: Array.from(categorySet).sort().map(cat => ({ key: cat, name: cat }))
    };
  }, [existingLinks]);
  
  
  
  const handleModelsChange = (selected: Option[]) => {
    setSelectedModels(selected);
    // For models, we'll take the first selected model since it's typically single-select
    setFormData(prev => ({
      ...prev,
      model: selected.length > 0 ? selected[0].value : ''
    }));
  };
  
  const handleAreaTagsChange = (selected: TTag[]) => {
    setSelectedAreaTags(selected);
    setFormData(prev => ({
      ...prev,
      tags: selected.map(tag => tag.name)
    }));
  };

  const handleTagCreate = (newTag: TTag) => {
    // Optionally, you can add the new tag to your database or cache here
    // For now, it's handled locally within the component
    console.log('New tag created:', newTag);
  };

  const handleAreaCategoriesChange = (selected: TTag[]) => {
    setSelectedAreaCategories(selected);
    setFormData(prev => ({
      ...prev,
      category: selected.map(cat => cat.name)
    }));
  };

  const handleCategoryCreate = (newCategory: TTag) => {
    // Optionally, you can add the new category to your database or cache here
    // For now, it's handled locally within the component
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
            <MultipleSelect
              tags={availableOptions.areaCategories}
              onChange={handleAreaCategoriesChange}
              onTagCreate={handleCategoryCreate}
              defaultValue={selectedAreaCategories}
              label="Categories"
              placeholder="No categories selected - choose from available categories below"
              className="w-full"
              allowCreate={true}
              createLabel="Create new category"
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <MultipleSelect
              tags={availableOptions.areaTags}
              onChange={handleAreaTagsChange}
              onTagCreate={handleTagCreate}
              defaultValue={selectedAreaTags}
              label="Tags"
              placeholder="No tags selected - choose from available tags below"
              className="w-full"
              allowCreate={true}
              createLabel="Create new tag"
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
