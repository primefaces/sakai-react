'use client';
import React from 'react';

export default function SubTitle({title, titleSize, mobileTitleSize}: {title: string, titleSize: string, mobileTitleSize: string}) {
  return (
    <h3 className={`text-${mobileTitleSize} sm:text-${titleSize} font-bold`}>{title}</h3>
  );
};
