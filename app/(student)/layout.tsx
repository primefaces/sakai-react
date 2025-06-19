import Layout from "../../layout/layout";

export default function LayoutStudent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
      <div>
          {/* <BaseLayout>{children}</BaseLayout> */}
          <Layout>{children}</Layout>;
      </div>
  );
}