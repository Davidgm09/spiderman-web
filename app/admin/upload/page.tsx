'use client'

import { useState } from 'react'
import { ImageUpload } from '@/components/ui/image-upload'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function UploadPage() {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])

  const handleUpload = (url: string) => {
    setUploadedUrls(prev => [...prev, url])
    console.log('Image uploaded:', url)
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Upload Images to Supabase Storage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ImageUpload 
            onUpload={handleUpload}
            folder="characters"
          />

          {uploadedUrls.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Uploaded Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {uploadedUrls.map((url, index) => (
                  <div key={index} className="space-y-2">
                    <img 
                      src={url} 
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded border"
                    />
                    <div className="text-xs text-gray-500 break-all">
                      {url}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}