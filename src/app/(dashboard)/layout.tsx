import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GN Foundation',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
