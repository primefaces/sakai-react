'use client'
import { useEffect } from "react";
import Layout from "../layout/layout";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  useEffect(() => {
    import('primereact/resources/primereact.min.css', {
      assert: { type: 'css' }
    });
  }, []);
  return <Layout>{children}</Layout>;
}
