'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';
import { Film } from 'lucide-react';

interface OptimizedMediaProps extends Omit<ImageProps, 'src' | 'alt'> {
    src: string;
    alt: string;
    mediaType?: 'image' | 'video'; // Explicit override if known
    autoPlay?: boolean;
    loop?: boolean;
    muted?: boolean;
    controls?: boolean;
    poster?: string;
}

export function OptimizedMedia({
    src,
    alt,
    mediaType,
    autoPlay = false,
    loop = true,
    muted = true,
    controls = false,
    poster,
    className,
    ...imageProps // standard next/image props
}: OptimizedMediaProps) {
    const isVideo = mediaType === 'video' || src.match(/\.(mp4|webm|mov)$/i);

    if (isVideo) {
        return (
            <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
                <video
                    src={src}
                    poster={poster || undefined} // Generate poster? undefined for now
                    autoPlay={autoPlay}
                    loop={loop}
                    muted={muted}
                    controls={controls}
                    playsInline
                    className="w-full h-full object-cover"
                    title={alt}
                />
            </div>
        );
    }

    return (
        <Image
            src={src}
            alt={alt}
            className={className}
            {...imageProps}
        />
    );
}
