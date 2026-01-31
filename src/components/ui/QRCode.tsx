'use client';

import { QRCodeSVG } from 'qrcode.react';

interface QRCodeProps {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
  className?: string;
}

export function QRCode({
  value,
  size = 200,
  level = 'M',
  includeMargin = true,
  className = '',
}: QRCodeProps) {
  return (
    <div className={`flex items-center justify-center p-4 bg-white rounded-xl ${className}`}>
      <QRCodeSVG
        value={value}
        size={size}
        level={level}
        includeMargin={includeMargin}
        className="w-full h-full"
      />
    </div>
  );
}
