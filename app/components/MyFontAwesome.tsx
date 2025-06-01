"use client"; // обязательно в app/ структуре

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { ComponentProps } from "react";

interface IconProps extends ComponentProps<typeof FontAwesomeIcon> {
  icon: IconProp;
  className?: string;
  size?: "xs" | "lg" | "sm" | "1x" | "2x" | "3x" | "4x" | "5x" | "6x" | "7x" | "8x" | "9x" | "10x";
}

export default function MyFontAwesome({ icon, className, size, ...props }:IconProps ) {
  return (
    <FontAwesomeIcon icon={icon} className={className} size={size} {...props} />
  );
}