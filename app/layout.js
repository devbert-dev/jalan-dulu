import './globals.css';

export const metadata = {
  title: 'Jalan Dulu — Find Your Tribe, Join Activities',
  description: 'Discover and host events with smart gender quotas. Zero commission. Built for Indonesian communities.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
