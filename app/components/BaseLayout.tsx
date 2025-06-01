"use client";

// import Footer from "./Footer";
// import Header from "./Header";

export default function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="max-w-[1440px] m-auto flex flex-col min-h-screen">
        {/* <Header /> */}
        <main className="flex-1 w-full flex justify-center">
          {children}
        </main>
        {/* <Footer /> */}
      </div>
    </>
  );
}