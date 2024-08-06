## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

# Create a .env.local file in the root directory and add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL = [Your own created Supabase URL created using your account]
NEXT_PUBLIC_SUPABASE_KEY = [Supabase key for your created account]
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Post Image Generator

## Overview

The **Post Image Generator** allows users to create and customize images based on input. Users can add a title, content, and an optional image to generate a customized image that is then uploaded to Supabase. The generated image can be viewed and shared using its public URL.

## How It Works

1. **User Input**: Users enter a title, content, and optionally upload an image file via a form.
2. **Image Generation**: Upon form submission, a custom image is generated using the `canvas` library. The title and content are drawn onto the image, and the user-uploaded image (optional) is added.
3. **Uploading**: The generated image is uploaded to Supabase Storage.
4. **Public URL**: The public URL for the uploaded image is retrieved from Supabase and sent to the user along with the image.

## Key Features

- **Customizable Images**: Users can create images with custom text and optional image uploads.
- **Image Storage**: Images are stored securely using Supabase Storage.
- **Public URL**: Users receive a public URL to view and share the generated image.

## File Structure

- **`/app`**: Contains the main pages of the application.
  - `page.js`: The main form page for generating images.
  - `/api`: Contains API routes for server-side logic and image generation.

- **`/utils`**: Contains utility files such as the Supabase client configuration.
## API Endpoints

- **`POST /api/generate-image`**: Handles image generation and uploads the generated image to Supabase and sends the public URL of the same image to frontend.
