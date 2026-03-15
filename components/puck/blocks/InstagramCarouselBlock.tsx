import { Section } from "../../ui/Section";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Heart, MessageCircle, ExternalLink, Play, Image as ImageIcon, Volume2, VolumeX } from "lucide-react";
import styles from "./InstagramCarouselBlock.module.css";

export interface InstagramPost {
    id: string;
    imageUrl: string;
    thumbnailUrl?: string;
    caption: string;
    likes: number;
    comments: number;
    link: string;
    mediaType: 'image' | 'video';
    clickAction?: 'redirect' | 'play';
}

export interface InstagramCarouselBlockProps {
    title?: string;
    subtitle?: string;
    headingAlignment?: "left" | "center";
    posts?: InstagramPost[];
    backgroundColor?: "white" | "slate-50" | "nb-green-light" | "transparent";
    spacing?: "none" | "sm" | "md" | "lg" | "xl";
    showHandles?: boolean;
    aspectRatio?: "square" | "video" | "reel";
    autoplayMode?: "sequential" | "all" | "none";
    autoplayDelay?: number;
    autoScroll?: boolean;
    autoScrollInterval?: number;
    id?: string;
    dataBlock?: string;
    "data-block"?: string;
}

export function InstagramCarouselBlock({
    title = "Follow Us on Instagram",
    subtitle = "Join our community and stay updated with our latest products, manufacturing processes, and behind-the-scenes.",
    headingAlignment = "center",
    posts = [],
    backgroundColor = "slate-50",
    spacing = "lg",
    showHandles = true,
    aspectRatio = "square",
    autoplayMode = "sequential",
    autoplayDelay = 3000,
    autoScroll = true,
    autoScrollInterval = 4000,
    id,
    dataBlock,
    "data-block": dataBlockKebab,
    ...pProps
}: InstagramCarouselBlockProps) {
    const finalDataBlock = dataBlock || dataBlockKebab;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const [itemsPerRow, setItemsPerRow] = useState(5); // Default SSR state

    // Fallback posts if empty
    const displayPosts: InstagramPost[] = posts.length > 0 ? posts : [
        {
            id: '1',
            imageUrl: 'https://images.unsplash.com/photo-1615397323226-538fb23ee7ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            thumbnailUrl: '',
            caption: 'Our new state-of-the-art mixing facility is finally operational! 🏗️🧪 #Manufacturing #NatureBoon #Skincare',
            likes: 342,
            comments: 18,
            link: 'https://www.instagram.com/naturesboon.cosmeticsmfg',
            mediaType: 'image',
            clickAction: 'redirect'
        },
        {
            id: '2',
            imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            thumbnailUrl: '',
            caption: 'Quality control is our top priority. Every batch undergoes rigorous testing. 🔬✅ #QualityAssurance #B2B',
            likes: 512,
            comments: 42,
            link: 'https://www.instagram.com/naturesboon.cosmeticsmfg',
            mediaType: 'image',
            clickAction: 'redirect'
        },
        {
            id: '3',
            imageUrl: 'https://images.unsplash.com/photo-1571781564282-359f130b42fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            thumbnailUrl: '',
            caption: 'Behind the scenes: Packaging our new premium essential oils line. 🌿📦 #PackagingDesign #PrivateLabel',
            likes: 890,
            comments: 55,
            link: 'https://www.instagram.com/naturesboon.cosmeticsmfg',
            mediaType: 'video',
            clickAction: 'play'
        },
        {
            id: '4',
            imageUrl: 'https://images.unsplash.com/photo-1556228720-192b152d1976?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            thumbnailUrl: '',
            caption: 'Sourcing the finest raw ingredients directly from sustainable farms. 🌱🌍 #Sustainability #Ingredients',
            likes: 420,
            comments: 21,
            link: 'https://www.instagram.com/naturesboon.cosmeticsmfg',
            mediaType: 'image',
            clickAction: 'redirect'
        }
    ];

    const maxIndex = Math.max(0, displayPosts.length - 1);

    const nextSlide = useCallback(() => {
        setCurrentIndex((current) => (current >= maxIndex ? 0 : current + 1));
    }, [maxIndex]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((current) => (current <= 0 ? maxIndex : current - 1));
    }, [maxIndex]);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0]?.clientX || null);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0]?.clientX || null);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            nextSlide();
        } else if (isRightSwipe) {
            prevSlide();
        }

        setTouchStart(null);
        setTouchEnd(null);
    };

    const toggleMute = () => {
        setIsMuted(prev => !prev);
    };

    // Auto-scroll logic (Carousel sliding)
    useEffect(() => {
        // Disable carousel auto-scroll if it's in sequential video mode (video timer handles it)
        // OR if all items are already visible
        if (!autoScroll || isHovered || displayPosts.length <= itemsPerRow || autoplayMode === 'sequential') return;

        const timer = setInterval(() => {
            nextSlide();
        }, autoScrollInterval);

        return () => clearInterval(timer);
    }, [autoScroll, autoScrollInterval, isHovered, nextSlide, displayPosts.length, autoplayMode, itemsPerRow]);

    // Sequential Autoplay logic
    useEffect(() => {
        if (autoplayMode !== 'sequential' || isHovered || displayPosts.length === 0) {
            return;
        }

        const videoPostsIndices = displayPosts
            .map((post, index) => (isPostVideo(post) ? index : -1))
            .filter((index) => index !== -1);

        if (videoPostsIndices.length === 0) return;

        const timer = setInterval(() => {
            setActiveVideoIndex((current) => {
                const currentPos = current !== null ? videoPostsIndices.indexOf(current) : -1;
                const nextPos = (currentPos + 1) % videoPostsIndices.length;
                const nextVideoIndex = videoPostsIndices[nextPos];

                // Only scroll carousel if not all posts fit in one view
                if (displayPosts.length > itemsPerRow) {
                    // Only move index if the next video is beyond the current visible range
                    // Or if we are looping back to the start
                    if (nextVideoIndex === 0 || nextVideoIndex >= currentIndex + itemsPerRow || nextVideoIndex < currentIndex) {
                        setCurrentIndex(nextVideoIndex);
                    }
                }

                return nextVideoIndex;
            });
        }, autoplayDelay);

        return () => clearInterval(timer);
    }, [autoplayMode, displayPosts, autoplayDelay, isHovered, currentIndex, itemsPerRow]);

    const handlePostClick = (e: React.MouseEvent, post: InstagramPost, index: number) => {
        if (post.clickAction === 'play') {
            e.preventDefault();
            const newIndex = activeVideoIndex === index ? null : index;
            setActiveVideoIndex(newIndex);

            // If user explicitly clicks to play, we can unmute
            if (newIndex !== null) setIsMuted(false);

            // Only scroll if necessary (e.g. video is partially out of view)
            if (displayPosts.length > itemsPerRow && (index < currentIndex || index >= currentIndex + itemsPerRow)) {
                setCurrentIndex(index);
            }
        }
    };

    // Background color mapping
    const bgColors = {
        "white": "bg-white",
        "slate-50": "bg-slate-50",
        "nb-green-light": "bg-[#e8f5ec]",
        "transparent": "bg-transparent"
    };

    // Use effect to handle window resize and hydration safely
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setItemsPerRow(5);
            else if (window.innerWidth >= 640) setItemsPerRow(2.5);
            else setItemsPerRow(1.25);
        };

        // Initial setup
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Helper to check if a post is a video
    const isPostVideo = (post: InstagramPost) => {
        if (!post.imageUrl) return false;
        if (post.mediaType === 'video') return true;
        if (post.mediaType === 'image') return false;

        return post.imageUrl.match(/\.(mp4|webm|ogg)$/i) ||
            post.imageUrl.includes('/video/') ||
            post.imageUrl.includes('convex.cloud') ||
            post.imageUrl.includes('convex.dev');
    };

    return (
        <Section id={id} dataBlock={finalDataBlock} className={`${bgColors[backgroundColor]} overflow-hidden`}>
            <div className={`py-8 md:py-12 ${spacing === 'none' ? 'py-0' : spacing === 'sm' ? 'py-4' : spacing === 'md' ? 'py-8' : spacing === 'lg' ? 'py-12' : 'py-16'}`}>
                <div className={`mb-8 md:mb-10 ${headingAlignment === "center" ? "text-center mx-auto max-w-2xl" : "max-w-xl"}`}>
                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-pink-50 text-pink-600 text-[10px] font-bold uppercase tracking-wider mb-3 ${headingAlignment === "center" ? "mx-auto" : ""}`}>
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                        Social Feed
                    </div>
                    {title?.trim() && (
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight mb-3">
                            {title}
                        </h2>
                    )}
                    {subtitle?.trim() && (
                        <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed opacity-80">
                            {subtitle}
                        </p>
                    )}
                </div>

                <div
                    className="relative group/carousel"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Carousel Navigation (Desktop) */}
                    {displayPosts.length > itemsPerRow && (
                        <>
                            <button
                                onClick={prevSlide}
                                className={`hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-8 z-10 w-12 h-12 rounded-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 items-center justify-center text-slate-700 hover:text-[#16a34a] hover:scale-110 hover:shadow-xl transition-all ${isHovered ? 'opacity-100' : 'opacity-0'} disabled:opacity-0`}
                                disabled={currentIndex === 0}
                                title="Previous slide"
                                aria-label="Previous slide"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className={`hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-8 z-10 w-12 h-12 rounded-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 items-center justify-center text-slate-700 hover:text-[#16a34a] hover:scale-110 hover:shadow-xl transition-all ${isHovered ? 'opacity-100' : 'opacity-0'} disabled:opacity-0`}
                                disabled={currentIndex >= displayPosts.length - itemsPerRow}
                                title="Next slide"
                                aria-label="Next slide"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    {/* Posts Carousel */}
                    <div className="overflow-hidden pb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
                        <div
                            className={`${styles.carouselContainer} gap-3 sm:gap-4 lg:gap-6`}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            style={{
                                "--current-index": currentIndex,
                            } as React.CSSProperties}
                        >
                            {displayPosts.map((post, i) => {
                                const isVideo = isPostVideo(post);
                                const isPlaying = isVideo && (
                                    autoplayMode === 'all' ||
                                    (autoplayMode === 'sequential' && activeVideoIndex === i) ||
                                    (activeVideoIndex === i)
                                );

                                const ratioClasses = {
                                    square: "aspect-square",
                                    video: "aspect-[4/5]",
                                    reel: "aspect-[9/16]"
                                };

                                return (
                                    <div
                                        key={`${post.id}-${i}`}
                                        className={`w-[80vw] sm:w-[calc(40%-12px)] lg:w-[calc(20%-19.2px)] shrink-0 flex flex-col group`}
                                    >
                                        <a
                                            href={post.link || "https://www.instagram.com/naturesboon.cosmeticsmfg"}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => handlePostClick(e, post, i)}
                                            className={`block relative ${ratioClasses[aspectRatio]} rounded-[18px] overflow-hidden bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-900/5 hover:shadow-premium transition-all duration-500`}
                                        >
                                            {isVideo ? (
                                                <>
                                                    {isPlaying ? (
                                                        <div className="relative w-full h-full">
                                                            <video
                                                                src={post.imageUrl}
                                                                className="w-full h-full object-cover"
                                                                muted={isMuted}
                                                                loop
                                                                autoPlay
                                                                playsInline
                                                            />
                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    toggleMute();
                                                                }}
                                                                className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-black/40 transition-all z-20"
                                                                title={isMuted ? "Unmute" : "Mute"}
                                                            >
                                                                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="relative w-full h-full">
                                                            <Image
                                                                src={post.thumbnailUrl || post.imageUrl}
                                                                alt={post.caption ? `${post.caption.substring(0, 100)} - Nature's Boon Manufacturing` : "Nature's Boon Cosmetics Manufacturing Process"}
                                                                fill
                                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                                sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 20vw"
                                                            />
                                                            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                                                                    <Play className="w-6 h-6 fill-white" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (post.imageUrl && post.imageUrl.trim() !== "") ? (
                                                <Image
                                                    src={post.imageUrl}
                                                    alt={post.caption ? `${post.caption.substring(0, 100)} - Nature's Boon` : "Nature's Boon Personal Care Product"}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 20vw"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                                                    <ImageIcon className="text-slate-200" size={32} />
                                                </div>
                                            )}

                                            {/* Overlay Hover State - only for non-video items or when not active */}
                                            {!isVideo && (
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                                                    <div className="flex items-center gap-1.5 text-white font-bold text-base">
                                                        <Heart className="w-5 h-5 fill-white" />
                                                        <span>{post.likes}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-white font-bold text-base">
                                                        <MessageCircle className="w-5 h-5 fill-white" />
                                                        <span>{post.comments}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </a>

                                        {/* Caption Area */}
                                        <div className="mt-4 px-1">
                                            <a
                                                href={post.link || "https://www.instagram.com/naturesboon.cosmeticsmfg"}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block hover:opacity-80 transition-opacity"
                                            >
                                                <p className="text-slate-600 text-[13px] leading-snug line-clamp-2 mb-3 italic">
                                                    {post.caption}
                                                </p>
                                            </a>
                                            {showHandles && (
                                                <a href={post.link || "https://www.instagram.com/naturesboon.cosmeticsmfg"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.05em] text-nb-green hover:opacity-80 transition-all group/link">
                                                    VIEW ON INSTAGRAM
                                                    <ExternalLink className="w-3 h-3 transition-transform group-hover/link:translate-x-0.5" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mobile Scroll Indicator (Dots) */}
                    {displayPosts.length > 1 && (
                        <div className="flex md:hidden justify-center gap-2 mt-2">
                            {Array.from({ length: displayPosts.length }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentIndex(i)}
                                    className={`h-2 rounded-full transition-all ${i === currentIndex ? 'w-6 bg-[#16a34a]' : 'w-2 bg-slate-300'}`}
                                    aria-label={`Go to slide ${i + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Section>
    );
}

// Puck Block Config Export
import { ImagePicker } from "@/components/ImagePicker";

export const InstagramCarouselBlockConfig = {
    fields: {
        title: { type: "text" },
        subtitle: { type: "textarea" },
        headingAlignment: {
            type: "radio",
            options: [{ label: "Center", value: "center" }, { label: "Left", value: "left" }]
        },
        backgroundColor: {
            type: "select",
            options: [
                { label: "White", value: "white" },
                { label: "Slate 50 (Light Gray)", value: "slate-50" },
                { label: "Nature Soft Green", value: "nb-green-light" },
                { label: "Transparent", value: "transparent" },
            ]
        },
        aspectRatio: {
            type: "select",
            label: "Display Aspect Ratio",
            options: [
                { label: "Square (1:1)", value: "square" },
                { label: "Portrait (4:5)", value: "video" },
                { label: "Reel (9:16)", value: "reel" }
            ]
        },
        spacing: {
            type: "select",
            options: [
                { label: "None", value: "none" },
                { label: "Small", value: "sm" },
                { label: "Medium", value: "md" },
                { label: "Large", value: "lg" },
                { label: "Extra Large", value: "xl" },
            ]
        },
        autoplayMode: {
            type: "radio",
            label: "Video Autoplay Mode",
            options: [
                { label: "One by One", value: "sequential" },
                { label: "All Active", value: "all" },
                { label: "Manual Only", value: "none" }
            ]
        },
        autoplayDelay: { type: "number", label: "Delay between videos (ms)" },
        autoScroll: { type: "radio", label: "Auto Scroll Carousel", options: [{ label: "Yes", value: true }, { label: "No", value: false }] },
        autoScrollInterval: { type: "number", label: "Auto Scroll Speed (ms)" },
        showHandles: { type: "radio", label: "Show View Link", options: [{ label: "Yes", value: true }, { label: "No", value: false }] },
        posts: {
            type: "array",
            getItemSummary: (post: any) => post.caption?.substring(0, 30) + '...' || "Instagram Post",
            arrayFields: {
                imageUrl: {
                    type: "custom",
                    label: "Media Content (Image or Video)",
                    render: ({ value, onChange }: any) => (
                        <ImagePicker value={value} onChange={onChange} />
                    )
                },
                thumbnailUrl: {
                    type: "custom",
                    label: "Fallback Thumbnail (Optional)",
                    render: ({ value, onChange }: any) => (
                        <ImagePicker value={value} onChange={onChange} />
                    )
                },
                clickAction: {
                    type: "radio",
                    label: "On Click Behavior",
                    options: [
                        { label: "Redirect to Link", value: "redirect" },
                        { label: "Play on Site", value: "play" }
                    ]
                },
                caption: { type: "textarea", label: "Caption / Description" },
                likes: { type: "number", label: "Mock Likes Count" },
                comments: { type: "number", label: "Mock Comments Count" },
                link: { type: "text", label: "Post URL" },
                mediaType: {
                    type: "radio",
                    label: "Media Icon Overlay",
                    options: [
                        { label: "Image/Carousel", value: "image" },
                        { label: "Reel/Video", value: "video" }
                    ]
                }
            }
        }
    },
    defaultProps: {
        title: "Follow Us on Instagram",
        subtitle: "Join our community and stay updated with our latest products, manufacturing processes, and behind-the-scenes.",
        headingAlignment: "center",
        backgroundColor: "slate-50",
        spacing: "lg",
        aspectRatio: "square",
        autoplayMode: "sequential",
        autoplayDelay: 3000,
        autoScroll: true,
        autoScrollInterval: 4000,
        showHandles: true,
        posts: []
    },
    render: (props: any) => {
        return <InstagramCarouselBlock {...props} />;
    }
} as any;
