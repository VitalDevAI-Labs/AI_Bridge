export const NOTION_URLS = {
  databases: {
    llmLinks: {
      view: 'https://www.notion.so/24e69b261dbf80bb860bf0f425a6abf2?v=24e69b261dbf8074a733000c2cf50e83',
      edit: 'https://www.notion.so/24e69b261dbf80bb860bf0f425a6abf2?v=24e69b261dbf8074a733000c2cf50e83&p=25069b261dbf80548105c27914f23731&pm=s'
    }
  }
} as const;

export const API_URLS = {
  base: 'http://localhost:3001',
  endpoints: {
    fetchAndCache: '/api/fetch-and-cache'
  }
} as const;
