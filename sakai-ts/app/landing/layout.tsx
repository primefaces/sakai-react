"use client";
import AppConfig from "@/layout/AppConfig";
import React from "react";

interface NotFoundProps {
  children: React.ReactNode;
}

export default function NotFound({ children }: NotFoundProps) {
  return (
    <html lang="en">
      <head>
        <link
          id="theme-css"
          href={`/themes/lara-light-indigo/theme.css`}
          rel="stylesheet"
        ></link>
      </head>
      <body>
        <React.Fragment>
          {children}
          <AppConfig simple />
        </React.Fragment>
      </body>
    </html>
  );
}
