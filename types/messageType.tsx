import { ReactNode } from "react";

export interface MessageType {
    state: boolean;
    value: {
        severity?:string;
        summary?:string;
        detail?:string | ReactNode;
    }
}