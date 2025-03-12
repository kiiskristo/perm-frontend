# Next.js with Tailwind CSS

This is a Next.js application built with Tailwind CSS and deployed to GitHub Pages using GitHub Actions.

## Features

- Next.js for React framework
- Tailwind CSS for styling
- GitHub Actions for CI/CD
- GitHub Pages for hosting

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

The application is automatically deployed to GitHub Pages when changes are pushed to the main branch.

## Environment Variables

The following environment variables are used in this project:

- `NEXT_PUBLIC_API_URL`: The URL of the API
- `NEXT_PUBLIC_GA_ID`: The Google Analytics ID

These can be set in the GitHub repository secrets for the GitHub Actions workflow. 