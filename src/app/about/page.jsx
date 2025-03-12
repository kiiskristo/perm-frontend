export default function About() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">About</h1>
      <div className="prose lg:prose-xl">
        <p>
          This is a Next.js application built with Tailwind CSS and deployed to GitHub Pages
          using GitHub Actions.
        </p>
        <p>
          The application demonstrates how to build a modern web application with:
        </p>
        <ul>
          <li>Next.js for the React framework</li>
          <li>Tailwind CSS for styling</li>
          <li>GitHub Actions for CI/CD</li>
          <li>GitHub Pages for hosting</li>
        </ul>
      </div>
    </div>
  );
} 