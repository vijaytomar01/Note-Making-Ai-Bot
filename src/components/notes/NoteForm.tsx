'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMongoAuth } from '@/hooks/useMongoAuth';
import { useMongoNoteStore } from '@/store/mongoNoteStore';
import { RichTextEditor } from './RichTextEditor';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Alert } from '@/components/ui/Alert';
import { X, Save } from 'lucide-react';

const noteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().min(1, 'Content is required'),
  category_id: z.string().optional(),
  is_favorite: z.boolean().default(false),
});

type NoteFormData = z.infer<typeof noteSchema>;

interface NoteFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: Partial<NoteFormData>;
  isEditing?: boolean;
  noteId?: string;
}

export function NoteForm({
  onClose,
  onSuccess,
  initialData,
  isEditing = false,
  noteId,
}: NoteFormProps) {
  const [content, setContent] = useState(initialData?.content || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user, token } = useMongoAuth();
  const { createNote, updateNote, categories, fetchCategories } = useMongoNoteStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      category_id: initialData?.category_id || '',
      is_favorite: initialData?.is_favorite || false,
    },
  });

  useEffect(() => {
    if (token) {
      fetchCategories(token);
    }
  }, [token, fetchCategories]);

  useEffect(() => {
    setValue('content', content);
  }, [content, setValue]);

  const onSubmit = async (data: NoteFormData) => {
    if (!token) return;

    try {
      setIsLoading(true);
      setError(null);

      const noteData = {
        ...data,
        user_id: user?.id || '',
        category_id: data.category_id || null,
      };

      if (isEditing && noteId) {
        await updateNote(token, noteId, noteData);
      } else {
        await createNote(token, noteData);
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {isEditing ? 'Edit Note' : 'Create New Note'}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter note title"
                {...register('title')}
                error={errors.title?.message}
              />
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category_id">Category (Optional)</Label>
              <select
                id="category_id"
                {...register('category_id')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">No category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Content */}
            <div>
              <Label>Content</Label>
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Start writing your note..."
                className="mt-2"
              />
              {errors.content && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.content.message}
                </p>
              )}
            </div>

            {/* Favorite */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_favorite"
                {...register('is_favorite')}
                className="rounded border-input"
              />
              <Label htmlFor="is_favorite">Mark as favorite</Label>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading
                  ? isEditing
                    ? 'Updating...'
                    : 'Creating...'
                  : isEditing
                  ? 'Update Note'
                  : 'Create Note'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
