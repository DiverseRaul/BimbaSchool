# GradeTrack - School Grade Management Application

A modern web application for managing school grades, calculating GPA, and finding suitable colleges using AI recommendations. Built with Vue.js and Supabase.

## Features

- Grade calculation and GPA tracking
- AI-powered college recommendations based on academic performance
- User profile management
- Secure data storage with Supabase

## Technology Stack

- **Frontend**: Vue.js 3 with Composition API
- **UI Framework**: Tailwind CSS
- **Backend/Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: Pinia
- **Routing**: Vue Router
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/bimba-school.git
cd bimba-school
```

2. Install dependencies
```
npm install
```

3. Set up environment variables
   
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Run the development server
```
npm run dev
```

## Supabase Setup

To use this application, you need to set up the following tables in your Supabase project:

1. **profiles**
   - id (references auth.users.id)
   - first_name
   - last_name
   - avatar_url
   - school
   - graduation_year
   - email_notifications
   - created_at
   - updated_at

2. **courses**
   - id
   - user_id (references auth.users.id)
   - name
   - grade
   - credits
   - created_at

3. **college_searches**
   - id
   - user_id (references auth.users.id)
   - gpa
   - location
   - type
   - major
   - results_count
   - created_at

4. **saved_colleges**
   - id
   - user_id (references auth.users.id)
   - name
   - location
   - type
   - acceptance_rate
   - average_gpa
   - tuition
   - website
   - created_at

## Building for Production

```
npm run build
```

## License

[MIT](LICENSE)
