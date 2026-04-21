import './globals.css';
import type { Metadata } from 'next';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';

export const metadata: Metadata = {
  title: 'Care Axis | Healthcare Operations Platform',
  description:
    'Care Axis is the parent healthcare platform with specialized software packages for PI, DPC, ortho, pain, and multi-specialty operations.',
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
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
