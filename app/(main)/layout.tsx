
import Layout from "../../layout/layout";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return <Layout>{children}</Layout>;
}
