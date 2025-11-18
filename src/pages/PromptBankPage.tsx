// src/pages/PromptBankPage.tsx

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Plus, RefreshCw, FileText } from 'lucide-react';
import { PromptCard } from '@/components/prompt/PromptCard';
import { PromptSearchBar } from '@/components/prompt/PromptSearchBar';
import { CategoryPills } from '@/components/prompt/CategoryPills';
import { NewPromptForm } from '@/components/prompt/NewPromptForm';
import { PromptDetailsDialog } from '@/components/prompt/PromptDetailsDialog';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserProfile } from '@/components/UserProfile';
import { usePrompts, usePromptCategories, useDeletePrompt } from '@/hooks/usePrompts';
import { useToast } from '@/hooks/use-toast';
import type { Prompt } from '@/config/types';

export default function PromptBankPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showNewPromptForm, setShowNewPromptForm] = useState<boolean>(false);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState<boolean>(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);

  const { categories } = usePromptCategories();
  const deletePrompt = useDeletePrompt();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch prompts with filters
  const { data: prompts, isLoading, error, refetch } = usePrompts({
    query: debouncedSearch,
    category: selectedCategory,
  });

  const handleRefresh = () => {
    refetch();
    toast({
      title: 'Refreshing...',
      description: 'Fetching the latest prompts.',
    });
  };

  const handlePromptClick = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setShowDetailsDialog(true);
  };

  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setShowDetailsDialog(false);
    setShowNewPromptForm(true);
  };

  const handleDelete = async (promptId: string) => {
    try {
      await deletePrompt.mutateAsync(promptId);
      toast({
        title: 'Success',
        description: 'Prompt deleted successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete prompt',
      });
    }
  };

  const handleFormClose = () => {
    setShowNewPromptForm(false);
    setEditingPrompt(null);
  };

  // Calculate statistics
  const stats = useMemo(() => {
    if (!prompts) return { total: 0, categories: 0, filtered: 0 };
    return {
      total: prompts.length,
      categories: categories.length,
      filtered: prompts.length,
    };
  }, [prompts, categories]);

  // Remove loading state - let the page render immediately
  // The data will load in the background and update when ready

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-destructive">Error Loading Prompts</CardTitle>
              <CardDescription>
                Failed to load prompts. Please try refreshing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleRefresh} className="w-full">
                Refresh
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">My Prompts</h2>
            <div className="flex flex-wrap items-center gap-2">
              <Dialog open={showNewPromptForm} onOpenChange={setShowNewPromptForm}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={() => setEditingPrompt(null)} className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    New Prompt
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <NewPromptForm 
                    prompt={editingPrompt || undefined}
                    onClose={handleFormClose}
                  />
                </DialogContent>
              </Dialog>
              <Button size="sm" variant="outline" onClick={() => window.location.href = '/'} className="w-full sm:w-auto">
                <FileText className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">LLM Links</span>
                <span className="sm:hidden">Links</span>
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <Button onClick={handleRefresh} variant="ghost" size="icon" className="h-8 w-8">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <UserProfile />
            </div>
          </div>
        </div>

        {/* Main Title and Subtitle */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-4xl font-bold text-foreground">My Prompts</h1>
          <p className="text-base sm:text-lg text-muted-foreground">Store and access your AI prompts.</p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto px-4 sm:px-0">
          <PromptSearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>

        {/* Category Filter Pills */}
        <CategoryPills
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {/* Debug Status Bar */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {isLoading ? 'Loading prompts...' : `${stats.total} prompts loaded, ${stats.filtered} filtered`}
            {debouncedSearch && ` (searching: "${debouncedSearch}")`}
            {selectedCategory !== 'all' && ` (category: ${selectedCategory})`}
          </p>
        </div>

        {/* Prompts Grid */}
        {!prompts || prompts.length === 0 ? (
          <Card className="max-w-md mx-auto bg-card">
            <CardHeader>
              <CardTitle>No prompts found</CardTitle>
              <CardDescription>
                {searchTerm || selectedCategory !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Create your first prompt to get started!'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {(searchTerm || selectedCategory !== 'all') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="w-full"
                >
                  Clear filters
                </Button>
              )}
              <Button
                onClick={() => setShowNewPromptForm(true)}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Prompt
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4 sm:px-0">
            {prompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onClick={handlePromptClick}
              />
            ))}
          </div>
        )}

        {/* Floating Action Button */}
        <Button
          size="lg"
          onClick={() => {
            setEditingPrompt(null);
            setShowNewPromptForm(true);
          }}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg z-40"
        >
          <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>

        {/* Details Dialog */}
        <PromptDetailsDialog
          prompt={selectedPrompt}
          open={showDetailsDialog}
          onOpenChange={setShowDetailsDialog}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

