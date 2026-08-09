import React from 'react';
import * as Icons from 'lucide-react';

export default function IconRenderer({ name, className = 'w-5 h-5' }) {
  if (!name) return <Icons.Code className={className} />;
  
  const IconComponent = Icons[name] || Icons.Code;
  return <IconComponent className={className} />;
}
