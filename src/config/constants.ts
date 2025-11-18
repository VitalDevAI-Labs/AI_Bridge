export const APP_CONFIG = {
  name: 'Vital-Dev LLM Navigator',
  description: 'Access your favorite AI models and platforms.',
  defaultCategory: 'popular'
} as const;

export const CATEGORIES = {
  all: 'all',
  popular: 'popular',
  generalExperts: 'General Experts',
  englishExpert: 'English Expert',
  formatters: 'Formatters'
} as const;

export const FORM_FIELDS = {
  category: {
    name: 'category',
    label: 'Categories',
    placeholder: 'Enter categories (comma-separated)'
  },
  description: {
    name: 'description',
    label: 'Description',
    placeholder: 'Enter description'
  },
  isPopular: {
    name: 'isPopular',
    label: 'Popular Link'
  },
  model: {
    name: 'model',
    label: 'Model',
    placeholder: 'Enter model name'
  },
  tags: {
    name: 'tags',
    label: 'Tags',
    placeholder: 'Enter tags (comma-separated)'
  },
  url: {
    name: 'url',
    label: 'URL',
    placeholder: 'Enter URL'
  }
} as const;
