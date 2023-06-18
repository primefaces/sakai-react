'use client'
import AppConfig from "@/layout/AppConfig";
import React from "react";


interface NotFoundProps {
    children: React.ReactNode;
}

export default function NotFound({ children }: NotFoundProps) {

    
    return (
        <React.Fragment>

            {children}
            <AppConfig simple />
        </React.Fragment>
    );
}