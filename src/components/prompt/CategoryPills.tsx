// src/components/prompt/CategoryPills.tsx

import { Button } from '@/components/ui/button';

interface CategoryPillsProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export const CategoryPills = ({ categories, selected, onSelect }: CategoryPillsProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <Button
        variant={selected === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onSelect('all')}
        className="rounded-full"
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selected === category ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelect(category)}
          className="rounded-full"
        >
          {category}
        </Button>
      ))}
    </div>
  );
};


