# Instagram Video Downloader (Snsta)

A modern, beautiful web application for downloading Instagram content including videos, photos, reels, IGTV, and carousels.

## Features

- 📥 Download Instagram videos, photos, reels, IGTV, and carousel posts
- 🎨 Beautiful, responsive UI with gradient design
- 📋 Copy shortcodes and media URLs to clipboard
- ⚡ Fast performance with Next.js and Turbopack
- 🔒 Secure API endpoints for media fetching
- 🌓 Dark/Light theme support
- 💫 Smooth animations with Framer Motion

## Live Demo

Visit the live application at: [https://snsta.vercel.app/](https://snsta.vercel.app/)

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI + Custom components
- **Forms:** React Hook Form with Zod validation
- **Icons:** Lucide React
- **Notifications:** Sonner
- **Animations:** Framer Motion
- **Package Manager:** Bun

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- Bun (recommended) or npm/yarn/pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Kuldeep23345/insta-things-downloader.git
cd instagram-video-downloader
```

2. Install dependencies:
```bash
# Using Bun (recommended)
bun install

# Or using npm
npm install
```

3. Run the development server:
```bash
# Using Bun (recommended)
bun dev

# Or using npm
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                 # Next.js app router
│   ├── api/             # API routes
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/          # Reusable components
│   ├── header.tsx       # Navigation header
│   ├── cta.tsx          # Call-to-action section
│   └── how-to-download.tsx # Instructions component
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
│   └── utils.ts         # Helper functions
├── graphql/             # GraphQL requests and types
├── public/              # Static assets
├── styles/              # Global styles
└── ...                  # Configuration files
```

## API Routes

- `POST /api/download-proxy` - Proxies media downloads
- `POST /api/instagram/story` - Handles story-related requests
- GraphQL endpoint for fetching Instagram post data

## Key Features Explained

### Content Type Selection
Users can switch between different content types:
- Video: For regular Instagram videos
- Photo: For single images
- Reels: For Instagram Reels
- IGTV: For long-form Instagram videos
- Carousel: For multi-image/video posts
- Viewer: For browsing Instagram content

### Download Process
1. User pastes an Instagram URL
2. Application extracts the shortcode from the URL
3. Fetches post data using internal API/GraphQL
4. Displays preview of the content
5. User can download or copy URLs

### Media Proxy
The `/api/download-proxy` endpoint securely proxies media requests to avoid CORS issues and protect any API keys.

## Environment Variables

Create a `.env.local` file with any required environment variables:

```env
# Example - add any required API keys or configuration here
NEXT_PUBLIC_EXAMPLE_KEY=your_key_here
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components inspired by shadcn/ui
- Icons from [Lucide](https://lucide.dev/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)
- Notifications via [Sonner](https://sonner.emilkowalski.ski/)

---

