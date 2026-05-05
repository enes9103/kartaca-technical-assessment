import { AppHeader } from "@/components/layout/app-header";

export default function UsersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppHeader />
      {children}
    </>
  );
}
