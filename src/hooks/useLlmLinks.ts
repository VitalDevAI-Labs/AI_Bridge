// src/hooks/useLlmLinks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/types/supabase';

export type LlmLink = Database['public']['Tables']['llm_links']['Row'];
export type LlmLinkInsert = Database['public']['Tables']['llm_links']['Insert'];
export type LlmLinkUpdate = Database['public']['Tables']['llm_links']['Update'];

const fetchLlmLinks = async (): Promise<LlmLink[]> => {
  const { data, error } = await supabase
    .from('llm_links')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching from Supabase:', error);
    throw error;
  }

  return data;
};

const createLlmLink = async (newLink: LlmLinkInsert): Promise<LlmLink> => {
  const { data, error } = await supabase
    .from('llm_links')
    .insert([newLink])
    .select()
    .single();

  if (error) {
    console.error('Error creating link:', error);
    throw error;
  }

  return data;
};

const updateLlmLink = async ({ id, ...updates }: LlmLinkUpdate & { id: string }): Promise<LlmLink> => {
  const { data, error } = await supabase
    .from('llm_links')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating link:', error);
    throw error;
  }

  return data;
};

const deleteLlmLink = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('llm_links')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting link:', error);
    throw error;
  }
};

export const useLlmLinks = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['llmLinks', user?.id],
    queryFn: fetchLlmLinks,
    enabled: !!user, // Only run query when user is authenticated
  });
};

export const useCreateLlmLink = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: createLlmLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['llmLinks', user?.id] });
    },
  });
};

export const useUpdateLlmLink = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: updateLlmLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['llmLinks', user?.id] });
    },
  });
};

export const useDeleteLlmLink = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: deleteLlmLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['llmLinks', user?.id] });
    },
  });
};
