# LLM Chat Links

A modern, full-featured web application for managing and discovering AI model links and resources. Built with React, TypeScript, and Supabase with dual viewing modes and comprehensive data management capabilities.

## ✨ Features

### 🎯 Core Functionality
- 🔐 **Username-Based Authentication** - Secure sign-up/sign-in with username and password
- 👤 **Personal Data Management** - Each user has their own private collection of links
- 🔍 **Advanced Search & Filtering** - Search across name, model, description, and tags with real-time results
- 🏷️ **Category-based Organization** - Dynamic category filtering and organization
- ⭐ **Popular Links Highlighting** - Mark and filter popular AI resources
- 📊 **Dual View Modes** - Switch between card view and table view for different use cases
- ➕ **CRUD Operations** - Create, read, update, and delete links with full data management

### 🎨 User Experience
- 🔐 **Secure Authentication Flow** - Beautiful username-based login/signup forms with modern design
- 👤 **User Profile Management** - Customizable usernames, avatar display, and account management
- 🌓 **Dark/Light Theme Support** - System-aware theme switching with manual toggle
- ✨ **Modern, Responsive UI** - Built with shadcn/ui and Tailwind CSS
- 📱 **Mobile-First Design** - Fully responsive across all device sizes
- 🔄 **Real-time Updates** - Live data synchronization with Supabase
- 🎭 **Glass Morphism Effects** - Premium visual effects and animations
- 🚀 **Toast Notifications** - User-friendly feedback for all operations

### 📋 Table View Features
- 🔧 **Inline Editing** - Edit all fields directly in the table
- 🔄 **Column Sorting** - Click headers to sort by any field
- 🎯 **Multi-column Filtering** - Filter by name, model, and other fields
- 📋 **Bulk Operations** - Copy URLs, delete rows, and batch actions
- 📊 **Data Validation** - Real-time validation and error handling

### 🎴 Card View Features
- 🎨 **Visual Link Cards** - Beautiful card-based display with badges
- 🏷️ **Tag System** - Visual tag representation with color coding
- 🔗 **Quick Actions** - One-click access to external links
- 📱 **Grid Layout** - Responsive grid that adapts to screen size

### 🎯 My Prompts Features
- 📝 **Personal Prompt Library** - Store and organize your AI prompts
- 🔍 **Smart Search** - Find prompts by title, description, or tags with debounced search
- 🏷️ **Category Organization** - Filter prompts by category (Enhancer, Formatter, Study Expert, etc.)
- 📋 **One-Click Copy** - Copy prompt text to clipboard instantly with toast feedback
- ✏️ **Full CRUD** - Create, read, update, and delete prompts with validation
- 🔒 **Private & Secure** - Your prompts are private and isolated via RLS
- 🏷️ **Flexible Tagging** - Add custom tags for better organization
- 🎨 **Beautiful UI** - Follows Vital Theme design system with glass morphism cards

## 🛠 Tech Stack

- **Frontend Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **Database**: Supabase (PostgreSQL)
- **Table Management**: TanStack Table
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Theme**: next-themes
- **Form Handling**: React Hook Form + Zod validation

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Supabase account** and project

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [your-repo-url]
   cd llm-chat-links
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env.local` file in the project root:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Authentication Setup:**
   - In your Supabase dashboard, go to Authentication > Providers
   - Enable Email authentication (should be enabled by default)
   - The system uses username-based authentication with email as backend identifier

5. **Database Setup:**
   For new installations, run the complete setup SQL in your Supabase SQL Editor:
   ```sql
   -- Create the main table with user authentication support
   CREATE TABLE llm_links (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
     name TEXT NOT NULL,
     description TEXT,
     url TEXT NOT NULL,
     model TEXT,
     category TEXT[],
     "isPopular" BOOLEAN NOT NULL DEFAULT false,
     tags TEXT[],
     user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid()
   );

   -- Create profiles table for username-based authentication
   CREATE TABLE public.profiles (
     id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
     username TEXT UNIQUE NOT NULL,
     updated_at TIMESTAMPTZ DEFAULT NOW(),
     avatar_url TEXT,
     CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 20)
   );

   -- Enable Row Level Security
   ALTER TABLE llm_links ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

   -- Create security policies for llm_links
   CREATE POLICY "Users can view own llm_links" ON llm_links
       FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert own llm_links" ON llm_links
       FOR INSERT WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update own llm_links" ON llm_links
       FOR UPDATE USING (auth.uid() = user_id);

   CREATE POLICY "Users can delete own llm_links" ON llm_links
       FOR DELETE USING (auth.uid() = user_id);

   -- Create security policies for profiles
   CREATE POLICY "Anyone can view profiles" ON public.profiles
     FOR SELECT USING (true);

   CREATE POLICY "Users can insert their own profile" ON public.profiles
     FOR INSERT WITH CHECK (auth.uid() = id);

   CREATE POLICY "Users can update their own profile" ON public.profiles
     FOR UPDATE USING (auth.uid() = id);

   -- Create RPC function for username-based authentication
   CREATE OR REPLACE FUNCTION public.get_email_by_username(p_username TEXT)
   RETURNS TEXT
   LANGUAGE plpgsql
   SECURITY DEFINER
   SET search_path = public
   AS $$
   DECLARE
     v_email TEXT;
   BEGIN
     SELECT u.email INTO v_email
     FROM auth.users u
     JOIN public.profiles p ON p.id = u.id
     WHERE p.username = p_username;
     RETURN v_email;
   END;
   $$;

   -- Create trigger for automatic profile creation
   CREATE OR REPLACE FUNCTION public.handle_new_user()
   RETURNS TRIGGER AS $$
   DECLARE
     username_value TEXT;
     counter INTEGER := 0;
   BEGIN
     username_value := COALESCE(
       new.raw_user_meta_data->>'username',
       split_part(new.email, '@', 1)
     );
     
     WHILE EXISTS(SELECT 1 FROM public.profiles WHERE username = username_value) LOOP
       counter := counter + 1;
       username_value := COALESCE(
         new.raw_user_meta_data->>'username',
         split_part(new.email, '@', 1)
       ) || counter::text;
     END LOOP;
     
     INSERT INTO public.profiles (id, username, updated_at)
     VALUES (new.id, username_value, NOW());
     
     RETURN new;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

   -- Create indexes for better performance
   CREATE INDEX idx_llm_links_user_id ON llm_links(user_id);
   CREATE INDEX idx_profiles_username ON public.profiles(username);

   -- Grant permissions
   GRANT ALL ON public.profiles TO authenticated;
   GRANT SELECT ON public.profiles TO anon;
   GRANT EXECUTE ON FUNCTION public.get_email_by_username(TEXT) TO authenticated;
   ```

   **For existing installations:** If you already have data, use the migration file:
   ```bash
   # Run the SQL commands in database-migration.sql
   # This will safely add authentication without losing existing data
   ```

   **For Prompt Bank Feature:** Run the prompts table setup:
   ```bash
   # Run the SQL commands in database-prompts-setup.sql
   # This will create the prompts table with RLS policies
   ```

6. **Start Development Server:**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
llm-chat-links/
├── src/
│   ├── components/          # React components
│   │   ├── auth/           # Username-based authentication components
│   │   │   ├── AuthPage.tsx    # Main authentication page with tabs
│   │   │   ├── SignInForm.tsx  # Username + password sign-in form
│   │   │   └── SignUpForm.tsx  # Email + username + password sign-up form
│   │   ├── ui/             # shadcn/ui component library
│   │   │   ├── button.tsx  # Button variants (default, hero, premium)
│   │   │   ├── card.tsx    # Card variants (default, glass, premium)
│   │   │   ├── input.tsx   # Form input components
│   │   │   ├── table.tsx   # Table primitive components
│   │   │   ├── toast.tsx   # Toast notification system
│   │   │   └── ...         # Other UI primitives
│   │   ├── LlmLinkCard.tsx # Link display card component
│   │   ├── NewLinkForm.tsx # Form for adding new links
│   │   ├── ThemeToggle.tsx # Dark/light theme switcher
│   │   └── UserProfile.tsx # User profile dropdown with username editing
│   ├── config/             # Configuration and constants
│   │   ├── constants.ts    # App-wide constants
│   │   ├── types.ts        # Type definitions and configs
│   │   └── urls.ts         # URL configurations
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx # Username-based authentication context and provider
│   ├── hooks/              # Custom React hooks
│   │   ├── useLlmLinks.ts  # Main data fetching and CRUD hooks
│   │   ├── useProfile.ts   # User profile management hook
│   │   ├── use-toast.ts    # Toast notification hook
│   │   └── use-mobile.tsx  # Mobile detection hook
│   ├── lib/                # Utilities and configurations
│   │   ├── supabase.ts     # Supabase client configuration
│   │   └── utils.ts        # Utility functions
│   ├── pages/              # Page components
│   │   ├── LlmLinksPage.tsx      # Main card view page
│   │   ├── LlmLinksTablePage.tsx # Table view page
│   │   └── NotFound.tsx          # 404 error page
│   ├── types/              # TypeScript type definitions
│   │   └── supabase.ts     # Supabase database types
│   └── App.tsx             # Main app component with routing
├── public/                 # Static assets
├── components.json         # shadcn/ui configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── vite.config.ts         # Vite build configuration
└── package.json           # Dependencies and scripts
```

## 🎯 Usage

### Navigation
- **Card View**: `/` - Visual card-based interface for browsing LLM links
- **Table View**: `/table` - Spreadsheet-like interface for data management
- **My Prompts**: `/prompts` - Personal prompt library with search and copy

### Card View Operations
- **Search**: Use the search bar to find links by name, model, description, or tags
- **Filter**: Click category buttons to filter by specific categories
- **Add New**: Click the "New link" button to add a new resource
- **View Link**: Click "Visit" to open the external link

### Table View Operations
- **Inline Edit**: Click any cell to edit the value directly
- **Sort**: Click column headers to sort data
- **Filter**: Use the filter inputs above the table
- **Delete**: Use the delete button in the actions column
- **Copy URL**: Quick copy button for sharing links

### My Prompts Operations
- **Create**: Click "New Prompt" or the floating action button
- **Search**: Use the search bar to find prompts (debounced 300ms)
- **Filter**: Click category pills to filter by category
- **Copy**: Click the copy icon on any card to copy prompt text
- **View Details**: Click any card to see full prompt with actions
- **Edit**: Open details and click Edit button
- **Delete**: Open details and click Delete button (with confirmation)

## 🔧 Database Schema

The application uses two main tables with user-based data segregation:

### Main Data Table (`llm_links`)
| Column      | Type          | Description                    |
|-------------|---------------|--------------------------------|
| id          | UUID          | Primary key (auto-generated)  |
| created_at  | TIMESTAMPTZ   | Creation timestamp             |
| name        | TEXT          | Display name of the resource   |
| description | TEXT          | Detailed description           |
| url         | TEXT          | External link URL              |
| model       | TEXT          | AI model name/version          |
| category    | TEXT[]        | Array of category tags         |
| isPopular   | BOOLEAN       | Popular resource flag          |
| tags        | TEXT[]        | Array of searchable tags       |
| user_id     | UUID          | Foreign key to auth.users      |

### User Profiles Table (`profiles`)
| Column      | Type          | Description                    |
|-------------|---------------|--------------------------------|
| id          | UUID          | Primary key, references auth.users(id) |
| username    | TEXT          | Unique username (3-20 chars)  |
| updated_at  | TIMESTAMPTZ   | Profile last updated timestamp |
| avatar_url  | TEXT          | Optional avatar image URL      |

### Prompt Library Table (`prompts`)
| Column        | Type          | Description                     |
|---------------|---------------|---------------------------------|
| id            | UUID          | Primary key (auto-generated)   |
| user_id       | UUID          | Foreign key to auth.users      |
| title         | TEXT          | Prompt title (1-100 chars)     |
| category      | TEXT          | Category name                   |
| description   | TEXT          | Optional description (≤500)     |
| prompt_text   | TEXT          | Actual prompt content (≥10)     |
| tags          | TEXT[]        | Array of tags                   |
| created_at    | TIMESTAMPTZ   | Creation timestamp              |
| updated_at    | TIMESTAMPTZ   | Last update timestamp           |
| search_fts    | TSVECTOR      | Full-text search index          |

### Security Features
- **Row Level Security (RLS)**: Automatically filters data by authenticated user
- **Username-Based Authentication**: Users sign in with username, email resolved server-side
- **Profile Integration**: Automatic profile creation via database triggers
- **Data Isolation**: Each user can only access their own links and profile
- **Secure RPC Functions**: Server-side username-to-email resolution

## 🎨 UI Components & Design System

### Component Library
Built on **shadcn/ui** with custom extensions:

- **Buttons**: Multiple variants (default, outline, ghost, hero, premium)
- **Cards**: Glass morphism effects and premium styling
- **Forms**: Integrated validation with React Hook Form
- **Tables**: Full-featured data tables with sorting and filtering
- **Toasts**: Non-intrusive notification system
- **Theme**: Automatic dark/light mode with system detection

### Design Principles
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Performance**: Optimized with React Query caching and lazy loading
- **Responsiveness**: Mobile-first approach with Tailwind breakpoints
- **Consistency**: Unified design language across all components

## 🔄 State Management

### Data Layer
- **TanStack Query**: Server state management with caching
- **Supabase Client**: Real-time database operations
- **React State**: Local UI state management

### CRUD Operations
- **Create**: Add new links via form with validation
- **Read**: Fetch and cache data with automatic refetching
- **Update**: Inline editing with optimistic updates
- **Delete**: Soft delete with confirmation prompts

## 🚀 Performance Features

- **Code Splitting**: Route-based code splitting with React Router
- **Caching**: Intelligent caching with TanStack Query
- **Optimistic Updates**: Immediate UI updates before server confirmation
- **Lazy Loading**: Components loaded on demand
- **Bundle Optimization**: Vite-powered build optimization

## 🛣 Roadmap

### Completed Features ✅
- ✅ Supabase integration and migration from Notion
- ✅ Dual view modes (card and table)
- ✅ Full CRUD operations
- ✅ Advanced search and filtering
- ✅ Responsive design and theme support
- ✅ Inline table editing
- ✅ Toast notification system
- ✅ Username-based authentication system
- ✅ User profiles with customizable usernames and avatars
- ✅ Row Level Security (RLS) for complete data isolation
- ✅ Modern authentication UI with clean, minimal design
- ✅ Automatic profile creation and management
- ✅ Secure server-side username resolution

### Upcoming Features 🚧
- 🔌 Supabase integration for Prompt Bank (Phase 2 - database ready)
- ⭐ Favorite links and bookmarking
- 🔗 Link sharing and collaboration
- 📊 Usage analytics and insights
- 🏷️ Advanced tagging system
- 📱 Progressive Web App (PWA) support
- 🔍 Full-text search with Supabase (prompts FTS ready)
- 📈 Link popularity tracking
- 🎯 Personalized recommendations
- 🔄 Real-time collaboration features
- 📧 Email notifications and reminders
- 🤝 Prompt sharing and templates library

## 🤝 Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

### Development Process
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with React best practices
- **Prettier**: Code formatting (integrated with shadcn/ui)
- **Conventional Commits**: Structured commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:
- Check the [Issues](https://github.com/your-repo/issues) page
- Create a new issue with detailed information
- Contact the maintainers

---

Built with ❤️ using modern web technologies for the AI community.