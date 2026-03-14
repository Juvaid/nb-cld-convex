'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import Link from 'next/link';
import React from 'react';

interface BlogPostClientProps {
  slug: string;
  initialBlog: any;
  initialSettings?: any;
}

export default function BlogPostClient({
  slug,
  initialBlog,
  initialSettings,
}: BlogPostClientProps) {
  const blog = useQuery(api.blogs.getBlogBySlug, { slug });

  if (blog === undefined && initialBlog === undefined) {
    return <PageSkeleton />;
  }

  const displayBlog = blog === undefined ? initialBlog : blog;

  if (!displayBlog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
        <h1 className="text-4xl font-black text-slate-900 mb-4 text-center">
          Story Not Found
        </h1>
        <p className="text-slate-500 font-medium mb-8 text-center max-w-md">
          The requested blog post doesn't exist or has been moved.
        </p>
        <Link
          href="/blogs"
          className="flex items-center gap-2 bg-nb-green text-slate-900 px-8 py-3 rounded-2xl font-black shadow-lg shadow-nb-green/20 hover:scale-[1.05] transition-all"
        >
          <ArrowLeft size={20} />
          Back to Blogs
        </Link>
      </div>
    );
  }

  let markdownContent = displayBlog.content || '';
  // Check if it's legacy Puck JSON and extract text if possible
  if (markdownContent.startsWith('{') && markdownContent.includes('"content"')) {
    try {
      const parsedData = JSON.parse(markdownContent);
      markdownContent =
        parsedData.content
          ?.map((block: any) => block.props?.text || '')
          .join('\n\n') || '';
    } catch (e) {
      console.error('Failed to parse legacy JSON blog content', e);
    }
  }

  return (
    <div className="bg-white min-h-screen font-outfit">
      <SiteHeader initialSettings={initialSettings} />
      <article>
        <header className="relative w-full pt-32 pb-20 overflow-hidden bg-slate-900 border-b-[16px] border-nb-green">
          {/* Background Image / Pattern */}
          {displayBlog.coverImage ? (
            <>
              <div className="absolute inset-0 z-0">
                <img
                  src={displayBlog.coverImage}
                  alt={displayBlog.title}
                  className="w-full h-full object-cover opacity-20 blur-xl scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40" />
              </div>
            </>
          ) : (
            <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
          )}

          <div className="container mx-auto px-4 sm:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 text-nb-green/80 font-black uppercase tracking-widest text-[10px] hover:text-nb-green transition-colors mb-8 group bg-nb-green/10 px-4 py-2 rounded-full border border-nb-green/20"
              >
                <ArrowLeft
                  size={14}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                Back to Editorial
              </Link>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight mb-6">
                {displayBlog.title}
              </h1>

              {displayBlog.excerpt && (
                <p className="text-xl md:text-2xl text-slate-300 font-medium leading-relaxed max-w-3xl mx-auto mb-10">
                  {displayBlog.excerpt}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center gap-6 mt-12 pt-12 border-t border-slate-700/50">
                {displayBlog.author && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-nb-green flex items-center justify-center text-slate-900 font-black shadow-lg">
                      {displayBlog.author.charAt(0)}
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] font-black uppercase tracking-widest text-nb-green/80 leading-none mb-1">
                        Written By
                      </div>
                      <div className="text-sm font-bold text-white">
                        {displayBlog.author}
                      </div>
                    </div>
                  </div>
                )}

                {displayBlog.author && (
                  <div className="hidden sm:block w-px h-8 bg-slate-700" />
                )}

                {(displayBlog.publishedAt || displayBlog._creationTime) && (
                  <div className="text-left">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">
                      Published On
                    </div>
                    <div className="text-sm font-bold text-white">
                      {new Date(
                        displayBlog.publishedAt || displayBlog._creationTime
                      ).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Cover Image Feature (Overlapping Header) */}
        {displayBlog.coverImage && (
          <div className="max-w-5xl mx-auto px-4 sm:px-8 -mt-16 relative z-20 mb-8 sm:mb-16">
            <img
              src={displayBlog.coverImage}
              alt={displayBlog.title}
              className="w-full aspect-video object-cover rounded-3xl shadow-2xl border-4 border-white"
            />
          </div>
        )}

        {/* Reading Column */}
        <div className="max-w-[800px] mx-auto px-4 sm:px-8 py-12 md:py-20 prose prose-lg prose-slate prose-headings:font-black prose-p:font-medium prose-p:leading-[1.8] prose-a:text-nb-green hover:prose-a:text-nb-green-deep">
          <ReactMarkdown>{markdownContent}</ReactMarkdown>
        </div>
      </article>

      {/* CTA Footer */}
      <div className="max-w-[800px] mx-auto px-4 sm:px-8 pb-32">
        <div className="bg-slate-900 rounded-[40px] p-8 md:p-12 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white mb-4">
              Interested in these insights?
            </h2>
            <p className="text-slate-400 font-medium mb-8 max-w-lg mx-auto">
              Connect with our expert team for detailed technical discussions
              and customized formulation support.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-nb-green text-slate-900 px-10 py-4 rounded-2xl font-black shadow-xl shadow-nb-green/20 hover:scale-[1.05] transition-all"
            >
              Discuss Your Project
              <ArrowRight size={18} />
            </Link>
          </div>
          {/* Abstract background decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-nb-green/10 rounded-full blur-[100px] -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-nb-green-deep/10 rounded-full blur-[100px] -ml-32 -mb-32" />
        </div>
      </div>
      <SiteFooter initialSettings={initialSettings} />
    </div>
  );
}
