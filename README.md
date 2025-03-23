# PERM Analytics

PERM Analytics is a modern web application that helps users track and predict PERM (Program Electronic Review Management) labor certification processing times. Built with Next.js and TypeScript, it provides accurate timeline estimates based on historical data and statistical analysis.

## Features

- **Timeline Prediction**: Estimates PERM processing times based on:
  - Employer name initial (80% influence)
  - Submission date (20% influence)
  - Recent processing trends
  - 15% buffer for realistic upper-bound estimates

- **Analytics Dashboard**:
  - Daily volume tracking
  - Weekly averages
  - Monthly trends
  - Backlog monitoring
  - Processing speed analysis

- **Modern Tech Stack**:
  - Next.js 13+ App Router
  - TypeScript
  - Tailwind CSS
  - Dark mode support
  - Responsive design

## Getting Started

### Prerequisites

- Node.js 20.x or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/perm-frontend.git
cd perm-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_GA_ID`: Google Analytics ID (optional)

### Development

Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
# or
yarn build
```

## SEO and Performance

- Server-side rendering
- Static site generation
- Structured data (Schema.org)
- Optimized meta tags
- Sitemap generation
- robots.txt configuration
- PWA support

## Data Sources

Data is sourced from:
- U.S. Department of Labor ([https://www.dol.gov/agencies/eta/foreign-labor/performance](https://www.dol.gov/agencies/eta/foreign-labor/performance))
- Manual updates from publicly accessible sources

## Legal

- [Privacy Policy](/privacy-policy)
- [Terms of Service](/terms-of-service)
- [Disclaimer](/disclaimer)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Contact

For any inquiries:
- General: info@permupdate.com 