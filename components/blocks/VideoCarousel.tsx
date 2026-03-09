'use client';

import { useState } from 'react';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface VideoItem {
    url: string;
    title?: string;
    description?: string;
    thumbnail?: string;
}

export interface VideoCarouselProps {
    badgeText?: string;
    title?: string;
    videos?: VideoItem[];
}

export default function VideoCarousel({
    badgeText = "Video Showcase",
    title = "Our Manufacturing Excellence",
    videos = [
        { url: "https://www.youtube.com/watch?v=f9v71N1CmqE", title: "State of the art facility", description: "Take a virtual tour of our high-hygiene manufacturing plant." },
        { url: "https://www.youtube.com/watch?v=rXy8N9Tf1T8", title: "Quality Assurance", description: "See how we maintain the highest standards for every product." },
    ]
}: VideoCarouselProps) {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    // Filter out invalid items
    const safeVideos = (videos || []).filter((v): v is VideoItem => !!v && typeof v === 'object' && !!v.url);

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setIsPlaying(false);
        setCurrent((prev) => (prev + newDirection + safeVideos.length) % safeVideos.length);
    };

    if (safeVideos.length === 0) return null;

    const currentVideo = safeVideos[current] || safeVideos[0];
    if (!currentVideo) return null;

    const getEmbedUrl = (url: string) => {
        if (url.includes('youtube.com/watch?v=')) {
            return `https://www.youtube.com/embed/${url.split('v=')[1].split('&')[0]}?autoplay=1`;
        }
        if (url.includes('youtu.be/')) {
            return `https://www.youtube.com/embed/${url.split('youtu.be/')[1]}?autoplay=1`;
        }
        return url;
    };

    const getThumbnail = (video: VideoItem) => {
        if (video.thumbnail) return video.thumbnail;
        // Auto-generate YouTube thumbnail
        if (video.url.includes('youtube.com/watch?v=')) {
            const id = video.url.split('v=')[1]?.split('&')[0];
            return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
        }
        if (video.url.includes('youtu.be/')) {
            const id = video.url.split('youtu.be/')[1];
            return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
        }
        return '';
    };

    return (
        <section className="py-12 sm:py-20 bg-slate-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-8 sm:mb-16">
                    <span className="inline-block text-nb-green font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs mb-3 sm:mb-4">
                        {badgeText}
                    </span>
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                        {title}
                    </h2>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    {/* Video Player */}
                    <div className="aspect-video bg-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl relative border-4 sm:border-[6px] border-white">
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            <motion.div
                                key={`${current}-${isPlaying}`}
                                custom={direction}
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.03 }}
                                transition={{ duration: 0.35, ease: "easeInOut" }}
                                className="absolute inset-0"
                            >
                                {isPlaying ? (
                                    <iframe
                                        src={getEmbedUrl(currentVideo.url)}
                                        className="w-full h-full"
                                        title={currentVideo.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : (
                                    <div
                                        className="absolute inset-0 cursor-pointer group"
                                        onClick={() => setIsPlaying(true)}
                                    >
                                        {/* Thumbnail */}
                                        {getThumbnail(currentVideo) ? (
                                            <img
                                                src={getThumbnail(currentVideo)}
                                                alt={currentVideo.title || 'Video thumbnail'}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />
                                        )}

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

                                        {/* Play Button */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                                <Play className="w-6 h-6 sm:w-8 sm:h-8 text-slate-900 ml-1" fill="currentColor" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Info Bar — stacked on mobile, side-by-side on desktop */}
                    <div className="mt-4 sm:mt-6 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-slate-100">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    {/* Dot indicators */}
                                    {safeVideos.length > 1 && (
                                        <div className="flex gap-1.5">
                                            {safeVideos.map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => {
                                                        setDirection(i > current ? 1 : -1);
                                                        setCurrent(i);
                                                        setIsPlaying(false);
                                                    }}
                                                    title={`Video ${i + 1}`}
                                                    aria-label={`Go to video ${i + 1}`}
                                                    className={`h-2 rounded-full transition-all duration-300 ${current === i ? 'w-6 bg-nb-green' : 'w-2 bg-slate-200 hover:bg-slate-300'}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                        {current + 1}/{safeVideos.length}
                                    </span>
                                </div>
                                <h3 className="text-base sm:text-xl font-bold text-slate-900 truncate">
                                    {currentVideo.title}
                                </h3>
                                {currentVideo.description && (
                                    <p className="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-2">
                                        {currentVideo.description}
                                    </p>
                                )}
                            </div>

                            {/* Controls */}
                            {safeVideos.length > 1 && (
                                <div className="flex gap-2 self-end sm:self-center">
                                    <button
                                        onClick={() => paginate(-1)}
                                        title="Previous video"
                                        aria-label="Previous video"
                                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-nb-green hover:border-nb-green/20 hover:shadow-md transition-all active:scale-95"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    <button
                                        onClick={() => paginate(1)}
                                        title="Next video"
                                        aria-label="Next video"
                                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-nb-green hover:border-nb-green/20 hover:shadow-md transition-all active:scale-95"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-nb-green/5 blur-[120px] rounded-full z-0 pointer-events-none" />
        </section>
    );
}
