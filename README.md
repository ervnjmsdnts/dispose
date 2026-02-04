# Dispose - Phone Recycling App

A mobile-first web application that allows users to dispose or recycle their phones by taking pictures and arranging for pickup or drop-off.

## Tech Stack

- **Package Manager**: pnpm
- **Framework**: NextJS App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Database**: Convex
- **File Storage**: Convex Storage
- **Authentication**: Clerk

## Features

- User authentication with Clerk
- Camera integration for taking phone pictures
- Document multiple phones for recycling
- Choose between pick-up or drop-off options
- Mobile-first responsive design

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Set up Clerk authentication:
   - Create a Clerk application at [clerk.com](https://clerk.com)
   - Add your Clerk keys to `.env.local`:
     ```
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
     CLERK_SECRET_KEY=sk_test_...
     ```

3. Set up Convex:
   - The project is already configured with Convex
   - Run Convex dev server:
     ```bash
     npx convex dev
     ```

4. Run the development server:

   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `app/` - NextJS app router pages
- `convex/` - Convex backend functions and schema
- `components/ui/` - Shadcn UI components
- `lib/` - Utility functions

## Database Schema

- `phones` - Stores phone information with images
- `disposalRequests` - Stores recycling requests
- `_storage` - Convex file storage for images

## Deployment

1. Deploy Convex to production:

   ```bash
   npx convex deploy
   ```

2. Update environment variables in your deployment platform with:
   - `NEXT_PUBLIC_CONVEX_URL`
   - Clerk keys

3. Deploy the NextJS app to Vercel, Netlify, or your preferred platform
