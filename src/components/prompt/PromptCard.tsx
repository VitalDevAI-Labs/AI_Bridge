// src/components/prompt/PromptCard.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { Prompt } from '@/config/types';

interface PromptCardProps {
  prompt: Prompt;
  onClick?: (prompt: Prompt) => void;
}

export const PromptCard = ({ prompt, onClick }: PromptCardProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleCardClick = () => {
    if (onClick) {
      onClick(prompt);
    }
  };

  return (
    <Card 
      className="bg-card rounded-xl shadow-sm border-border hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-start gap-2">
              <CardTitle className="text-lg font-bold text-foreground line-clamp-2 leading-tight">
                {prompt.title}
              </CardTitle>
            </div>
            
            <div className="flex flex-wrap gap-1.5">
              {(Array.isArray(prompt.category) ? prompt.category : [prompt.category]).map((cat, index) => (
                <Badge 
                  key={index}
                  variant="secondary" 
                  className="text-xs px-2.5 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20"
                >
                  {cat}
                </Badge>
              ))}
            </div>
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="shrink-0 h-9 w-9 p-0"
            title="Copy prompt"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0 pb-4 px-6">
        {prompt.description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {prompt.description}
          </p>
        )}

        {prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {prompt.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs px-2.5 py-0.5 rounded-full bg-muted/50 hover:bg-muted transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};


