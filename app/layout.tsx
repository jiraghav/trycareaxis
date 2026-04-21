import './globals.css';
import type { Metadata } from 'next';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';

export const metadata: Metadata = {
  metadataBase: new URL('https://trycareaxis.com'),
  title: 'Care Axis | Healthcare Operations Platform',
  description:
    'Care Axis is the parent healthcare platform with specialized software packages for PI, DPC, ortho, pain, and multi-specialty operations.',
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    title: 'Care Axis | Healthcare Operations Platform',
    description:
      'One platform. Specialized packages for every practice model.',
    type: 'website',
    url: '/',
    siteName: 'Care Axis',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Care Axis' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Care Axis | Healthcare Operations Platform',
    description:
      'One platform. Specialized packages for every practice model.',
    images: ['/twitter-image'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Care Axis',
    url: 'https://trycareaxis.com',
    email: 'hello@trycareaxis.com',
    telephone: '+1-800-000-0360',
    description:
      'Care Axis is a healthcare operations platform with specialized packages for PI, DPC, ortho, pain, and multi-specialty practices.',
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Care Axis',
    url: 'https://trycareaxis.com',
  };

  return (
    <html lang="en">
      <body>
        <AnalyticsTracker />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
