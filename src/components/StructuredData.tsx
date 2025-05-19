import { NextSeo } from 'next-seo';

interface StructuredDataProps {
  path: string;
  title: string;
  description: string;
  dateModified?: string;
}

export default function StructuredData({ path, title, description, dateModified = new Date().toISOString() }: StructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description,
    url: `https://permupdate.com${path}`,
    dateModified: dateModified,
    publisher: {
      '@type': 'Organization',
      name: 'PERM Analytics',
      url: 'https://permupdate.com',
    },
  };

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        additionalMetaTags={[
          {
            name: 'dateModified',
            content: dateModified,
          },
        ]}
        additionalLinkTags={[
          {
            rel: 'canonical',
            href: `https://permupdate.com${path}`,
          },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
} 