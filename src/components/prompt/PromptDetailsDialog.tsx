// src/components/prompt/PromptDetailsDialog.tsx

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Edit, Trash2, Check } from 'lucide-react';
import { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { Prompt } from '@/config/types';

interface PromptDetailsDialogProps {
  prompt: Prompt | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (prompt: Prompt) => void;
  onDelete?: (promptId: string) => void;
}

export const PromptDetailsDialog = ({
  prompt,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: PromptDetailsDialogProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!prompt) return null;

  const handleCopy = async () => {
    const success = await copyToClipboard(prompt.prompt_text);
    
    if (success) {
      setCopied(true);
      toast({
        title: 'Copied!',
        description: 'Prompt copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed to copy',
        description: 'Could not copy prompt to clipboard',
      });
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(prompt);
      onOpenChange(false);
    }
  };

  const handleDelete = () => {
    if (onDelete && confirm('Are you sure you want to delete this prompt?')) {
      onDelete(prompt.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold pr-8">{prompt.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Category Badges */}
          {(Array.isArray(prompt.category) ? prompt.category : [prompt.category]).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(prompt.category) ? prompt.category : [prompt.category]).map((cat, index) => (
                <Badge 
                  key={index}
                  variant="secondary" 
                  className="text-sm px-3 py-1 rounded-md bg-primary/10 text-primary"
                >
                  {cat}
                </Badge>
              ))}
            </div>
          )}

          {/* Description */}
          {prompt.description && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {prompt.description}
              </p>
            </div>
          )}

          {/* Prompt Text */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Prompt</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopy}
                className="h-8"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 mr-2 text-green-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
                {prompt.prompt_text}
              </pre>
            </div>
          </div>

          {/* Tags */}
          {prompt.tags.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {prompt.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs px-2.5 py-0.5 rounded-full"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
            {onEdit && (
              <Button
                variant="default"
                size="sm"
                onClick={handleEdit}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};


