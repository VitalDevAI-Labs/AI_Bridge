// src/hooks/usePrompts.ts
// Phase 2: Supabase integration

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { Prompt, PromptInsert, PromptUpdate } from '@/config/types';

// Fetch prompts with optional filters
const fetchPrompts = async (filters: { 
  query?: string; 
  category?: string; 
  tags?: string[] 
}): Promise<Prompt[]> => {
  let query = (supabase as any)
    .from('prompts')
    .select('*')
    .order('updated_at', { ascending: false });

  // Apply search filter
  if (filters.query && filters.query.trim()) {
    const searchTerm = filters.query.trim();
    query = query.or(
      `title.ilike.%${searchTerm}%,` +
      `description.ilike.%${searchTerm}%,` +
      `prompt_text.ilike.%${searchTerm}%`
    );
  }

  // Apply category filter (check if category array includes the filter)
  if (filters.category && filters.category !== 'all') {
    query = query.contains('category', [filters.category]);
  }

  // Apply tag filter
  if (filters.tags && filters.tags.length > 0) {
    query = query.contains('tags', filters.tags);
  }

  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching prompts:', error);
    throw error;
  }

  return data as Prompt[];
};

/**
 * Fetch prompts with optional filters
 */
export const usePrompts = (filters: { query?: string; category?: string; tags?: string[] } = {}) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['prompts', user?.id, filters],
    queryFn: () => fetchPrompts(filters),
    enabled: !!user, // Only fetch when user is authenticated
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
  });
};

/**
 * Get unique categories from all prompts (flattened from arrays)
 */
export const usePromptCategories = () => {
  const { data: prompts, isLoading } = usePrompts();
  
  const categories = prompts 
    ? Array.from(new Set(prompts.flatMap(p => p.category))).sort()
    : [];
    
  return { categories, isLoading };
};

/**
 * Get unique tags from all prompts
 */
export const usePromptTags = () => {
  const { data: prompts, isLoading } = usePrompts();
  
  const tags = prompts 
    ? Array.from(new Set(prompts.flatMap(p => p.tags))).sort()
    : [];
    
  return { tags, isLoading };
};

/**
 * Create a new prompt
 */
export const useCreatePrompt = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (newPrompt: PromptInsert) => {
      if (!user) throw new Error('User must be authenticated');
      
      const { data, error } = await (supabase as any)
        .from('prompts')
        .insert({ 
          ...newPrompt, 
          user_id: user.id 
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating prompt:', error);
        throw error;
      }
      
      return data as Prompt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts', user?.id] });
    },
  });
};

/**
 * Update an existing prompt
 */
export const useUpdatePrompt = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: PromptUpdate) => {
      const { data, error } = await (supabase as any)
        .from('prompts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating prompt:', error);
        throw error;
      }
      
      return data as Prompt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts', user?.id] });
    },
  });
};

/**
 * Delete a prompt
 */
export const useDeletePrompt = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from('prompts')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting prompt:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts', user?.id] });
    },
  });
};


