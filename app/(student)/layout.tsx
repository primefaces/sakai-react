import StudentLayout from "@/layout/StudentLayout";

export default function LayoutStudent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
      <div>
          {/* <BaseLayout>{children}</BaseLayout> */}
          <StudentLayout>{children}</StudentLayout>
      </div>
  );
}