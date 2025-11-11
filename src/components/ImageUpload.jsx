// components/ImageUpload.js
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ImageUpload({ onImageUploaded, currentImage }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || null);
  const [error, setError] = useState(null);

  const uploadImage = async (event) => {
    try {
      setUploading(true);
      setError(null);

      const file = event.target.files[0];

      if (!file) return;

      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setError('Image size must be less than 5MB');
        return;
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      // Set preview
      setPreview(publicUrl);

      // Pass URL back to parent component
      onImageUploaded(publicUrl);

      console.log('Image uploaded successfully:', publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onImageUploaded('');
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium mb-2">
        Featured Image
      </label>

      {/* Image Preview */}
      {preview && (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-gray-300"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition text-sm"
          >
            Remove
          </button>
        </div>
      )}

      {/* Upload Button */}
      {!preview && (
        <div className="flex items-center gap-4">
          <label
            htmlFor="image-upload"
            className={`
              cursor-pointer border border-black text-black px-6 py-3 rounded-lg 
              transition font-medium inline-block
              ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {uploading ? 'Uploading...' : '📷 Upload Image'}
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={uploadImage}
            disabled={uploading}
            className="hidden"
          />
        </div>
      )}

      {/* Upload Instructions */}
      <p className="text-xs text-gray-500">
        Supported formats: JPEG, PNG, GIF, WebP (Max size: 5MB)
      </p>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
