'use client';

import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { ExternalLink, Database, Key } from 'lucide-react';

export function SetupNotice() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Alert className="mb-6">
        <Database className="h-4 w-4" />
        <div className="ml-2">
          <h3 className="font-semibold">Setup Required</h3>
          <p className="text-sm mt-1">
            To use authentication and notes features, you need to configure Supabase.
          </p>
        </div>
      </Alert>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Complete Your Setup</h2>
        
        <div className="space-y-6">
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="text-lg font-semibold mb-2">Step 1: Create Supabase Project</h3>
            <p className="text-gray-600 mb-3">
              Create a free account and new project at Supabase.
            </p>
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Go to Supabase
            </a>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="text-lg font-semibold mb-2">Step 2: Run Database Schema</h3>
            <p className="text-gray-600 mb-3">
              Copy and run the SQL from <code className="bg-gray-100 px-2 py-1 rounded">supabase-schema.sql</code> in your Supabase SQL editor.
            </p>
            <div className="bg-gray-50 p-3 rounded text-sm font-mono">
              Location: <span className="text-blue-600">ai-notes-app/supabase-schema.sql</span>
            </div>
          </div>

          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="text-lg font-semibold mb-2">Step 3: Update Environment Variables</h3>
            <p className="text-gray-600 mb-3">
              Replace the placeholder values in your <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> file:
            </p>
            <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
              <div>NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here</div>
              <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here</div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Find these values in your Supabase project settings → API
            </p>
          </div>

          <div className="border-l-4 border-orange-500 pl-4">
            <h3 className="text-lg font-semibold mb-2">Step 4: Restart Development Server</h3>
            <p className="text-gray-600 mb-3">
              After updating the environment variables, restart your development server:
            </p>
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
              npm run dev
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">
            <Key className="inline h-4 w-4 mr-1" />
            Optional: OpenAI Integration
          </h4>
          <p className="text-blue-800 text-sm">
            For AI-powered features (search, recommendations), add your OpenAI API key to the environment file.
          </p>
        </div>

        <div className="mt-6 text-center">
          <Button onClick={() => window.location.reload()}>
            Refresh Page After Setup
          </Button>
        </div>
      </div>
    </div>
  );
}
