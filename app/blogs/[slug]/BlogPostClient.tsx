'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { ArrowLeft, ArrowRight, Calendar, ImageIcon, Tag } from 'lucide-react';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { PuckRenderer } from '@/components/PuckRenderer';
import { blogConfig } from '@/components/puck/blog-config';
import Link from 'next/link';
import React from 'react';

interface BlogPostClientProps {
  slug: string;
  initialBlog: any;
  initialSettings?: any;
}

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mt-12 mb-5 leading-tight tracking-tight">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-10 mb-4 leading-tight tracking-tight border-b border-slate-100 pb-3">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-black text-slate-800 mt-8 mb-3 leading-snug">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-lg font-bold text-slate-800 mt-6 mb-2">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="text-slate-700 text-lg leading-[1.85] mb-5 font-normal">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="my-5 space-y-2 pl-0 list-none">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-5 space-y-2 pl-6 list-decimal">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-slate-700 text-lg leading-relaxed flex gap-3">
      <span className="mt-[11px] w-1.5 h-1.5 rounded-full bg-nb-green flex-shrink-0" />
      <span>{children}</span>
    </li>
  ),
  strong: ({ children }) => <strong className="font-bold text-slate-900">{children}</strong>,
  em: ({ children }) => <em className="italic text-slate-600">{children}</em>,
  a: ({ href, children }) => (
    <a href={href} className="text-nb-green font-semibold underline underline-offset-2 hover:text-nb-green-deep transition-colors"
       rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
       target={href?.startsWith('http') ? '_blank' : undefined}>
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-6 pl-5 border-l-4 border-nb-green bg-nb-green/5 py-4 pr-4 rounded-r-xl">
      <div className="text-slate-700 text-lg italic leading-relaxed">{children}</div>
    </blockquote>
  ),
  code: ({ children, className }) => {
    const isBlock = className?.includes('language-');
    if (isBlock) {
      return (
        <pre className="bg-slate-900 text-slate-100 rounded-2xl p-6 my-6 overflow-x-auto text-sm font-mono">
          <code>{children}</code>
        </pre>
      );
    }
    return <code className="bg-slate-100 text-nb-green-deep px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>;
  },
  hr: () => <hr className="my-10 border-0 border-t border-slate-100" />,
  table: ({ children }) => (
    <div className="overflow-x-auto my-8 rounded-2xl border border-slate-100 shadow-sm">
      <table className="w-full text-left text-slate-700 text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-slate-50 text-slate-900 font-bold text-xs uppercase tracking-widest">{children}</thead>,
  tbody: ({ children }) => <tbody className="divide-y divide-slate-50">{children}</tbody>,
  tr: ({ children }) => <tr className="hover:bg-slate-50/50 transition-colors">{children}</tr>,
  th: ({ children }) => <th className="px-4 py-3 font-bold">{children}</th>,
  td: ({ children }) => <td className="px-4 py-3">{children}</td>,
};

function PlaceholderImageBlock() {
  return (
    <div className="w-full aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl shadow-2xl ring-1 ring-slate-200 flex flex-col items-center justify-center gap-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, #15803d 0, #15803d 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
      <div className="relative z-10 flex flex-col items-center gap-3 text-center px-8">
        <div className="w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center">
          <ImageIcon size={24} className="text-slate-300" />
        </div>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Cover image not set</p>
        <p className="text-slate-400 text-sm max-w-xs">
          Go to <span className="font-bold text-nb-green">/admin/blogs</span> → edit this post → upload a cover image
        </p>
      </div>
    </div>
  );
}

function RelatedCard({ blog }: { blog: any }) {
  return (
    <Link href={`/blogs/${blog.slug}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-nb-green/30 hover:shadow-lg transition-all duration-300">
      <div className="aspect-video bg-slate-100 relative overflow-hidden">
        {blog.coverImage ? (
          <img src={blog.coverImage} alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
            <ImageIcon size={28} className="text-slate-200" />
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h4 className="font-black text-slate-900 leading-tight mb-2 group-hover:text-nb-green transition-colors line-clamp-2 text-base">{blog.title}</h4>
        {blog.excerpt && (
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4">{blog.excerpt}</p>
        )}
        <div className="mt-auto flex items-center gap-1 text-nb-green text-xs font-black uppercase tracking-widest group-hover:gap-3 transition-all">
          Read <ArrowRight size={12} />
        </div>
      </div>
    </Link>
  );
}

export default function BlogPostClient({ slug, initialBlog, initialSettings }: BlogPostClientProps) {
  const blog = useQuery(api.blogs.getBlogBySlug, { slug });
  const allBlogs = useQuery(api.blogs.listBlogs);

  if (blog === undefined && initialBlog === undefined) return <PageSkeleton />;

  const displayBlog = blog === undefined ? initialBlog : blog;

  if (!displayBlog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-6">
          <ImageIcon size={28} className="text-slate-300" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-4 text-center">Article Not Found</h1>
        <p className="text-slate-500 font-medium mb-8 text-center max-w-md">
          This article doesn't exist or may have been moved.
        </p>
        <Link href="/blogs"
          className="flex items-center gap-2 bg-nb-green text-white px-8 py-3 rounded-2xl font-black shadow-lg hover:scale-[1.03] transition-all">
          <ArrowLeft size={18} /> Back to All Articles
        </Link>
      </div>
    );
  }

  const cleanMarkdownContent = (content: string) => {
    if (!content) return "";
    
    let cleaned = content;
    
    // 1. Remove JSON-LD and Schema artifacts (common in scraped WordPress data)
    // Target blocks starting with {"@context" or {"@type"
    cleaned = cleaned.replace(/\{(\s*)"@context":[\s\S]*?\}/g, '');
    cleaned = cleaned.replace(/\{(\s*)"@type":[\s\S]*?\}/g, '');
    
    // Remove hanging JSON fragments often found in poor scrapes
    cleaned = cleaned.replace(/["']@type["']:\s*["'].*?["']/g, '');
    cleaned = cleaned.replace(/["']@context["']:\s*["'].*?["']/g, '');
    
    // 2. Strip HTML tags to ensure clean rendering in standard markdown
    // Many scraped blogs have nested spans and inline styles that break the design system
    cleaned = cleaned.replace(/<[^>]*>?/gm, '');
    
    // 3. Line-by-line normalization
    return cleaned
      .split('\n')
      .map(line => line.trim()) // Crucial: Remove leading spaces that trigger code blocks
      .filter(line => {
        const t = line.trim();
        // Remove lines that are just JSON punctuation leftover after cleaning
        if (t === '}' || t === '},' || t === ']' || t === '],' || t === '{' || t === '[' || t === '}}') return false;
        // Skip obvious JSON property lines if they somehow survived
        if (t.startsWith('"') && t.includes('": "') && (t.endsWith('"') || t.endsWith('",'))) return false;
        return t.length > 0;
      })
      .join('\n')
      .replace(/&nbsp;/g, ' ')
      .replace(/\u00A0/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };

  let markdownContent = displayBlog.content || '';
  let puckData = null;

  if (markdownContent.trim().startsWith('{')) {
    try {
      puckData = JSON.parse(markdownContent);
      // Valid Puck JSON — use PuckRenderer, no need to flatten to markdown
    } catch { /* parse failed */ }
  }

  // Sanitize the content for all renderers to remove scraping artifacts
  markdownContent = cleanMarkdownContent(markdownContent);

  const related = allBlogs?.filter((b: any) => b.slug !== slug).slice(0, 3) || [];
  const publishedDate = displayBlog.publishedAt || displayBlog._creationTime;
  const tags = displayBlog.keywords
    ? displayBlog.keywords.split(',').map((k: string) => k.trim()).filter(Boolean).slice(0, 5)
    : [];

  return (
    <div className="bg-white min-h-screen">
      <SiteHeader initialSettings={initialSettings} />

      <article>
        {/* Hero */}
        <header className="relative w-full pt-28 pb-16 overflow-hidden bg-slate-950">
          {displayBlog.coverImage ? (
            <div className="absolute inset-0 z-0">
              <img src={displayBlog.coverImage} alt="" className="w-full h-full object-cover opacity-15 scale-110 blur-2xl" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
            </div>
          ) : (
            <div className="absolute inset-0 z-0 opacity-[0.06]"
              style={{ backgroundImage: 'repeating-linear-gradient(45deg, #15803d 0, #15803d 1px, transparent 0, transparent 50%)', backgroundSize: '24px 24px' }} />
          )}

          <div className="container mx-auto px-4 sm:px-8 relative z-10">
            <div className="max-w-3xl mx-auto">
              <Link href="/blogs"
                className="inline-flex items-center gap-2 text-nb-green/70 hover:text-nb-green font-bold text-xs uppercase tracking-widest mb-8 transition-colors group">
                <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                All Articles
              </Link>

              {displayBlog.category === 'seo-page' && (
                <div className="mb-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-nb-green/20 border border-nb-green/30 text-nb-green text-[10px] font-black uppercase tracking-widest">
                    Manufacturing Guide
                  </span>
                </div>
              )}

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight mb-5">
                {displayBlog.title}
              </h1>

              {displayBlog.excerpt && (
                <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mb-8">{displayBlog.excerpt}</p>
              )}

              <div className="flex flex-wrap items-center gap-5 pt-6 border-t border-slate-800">
                {displayBlog.author && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-nb-green flex items-center justify-center text-white font-black text-sm shadow">
                      {displayBlog.author.charAt(0)}
                    </div>
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 leading-none">Author</div>
                      <div className="text-sm font-bold text-white">{displayBlog.author}</div>
                    </div>
                  </div>
                )}
                {publishedDate && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar size={13} />
                    <span className="text-sm font-medium">
                      {new Date(publishedDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Cover image OR placeholder */}
        <div className="max-w-4xl mx-auto px-4 sm:px-8 -mt-8 relative z-10 mb-12">
          {displayBlog.coverImage ? (
            <img src={displayBlog.coverImage} alt={displayBlog.title}
              className="w-full aspect-video object-cover rounded-3xl shadow-2xl ring-1 ring-slate-200" />
          ) : (
            <PlaceholderImageBlock />
          )}
        </div>

        {/* Article body */}
        <div className="max-w-[760px] mx-auto px-4 sm:px-8 pb-8">
          {puckData ? (
            <PuckRenderer data={puckData} siteSettings={initialSettings} configOverride={blogConfig} />
          ) : (
            <ReactMarkdown components={markdownComponents}>{markdownContent}</ReactMarkdown>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="max-w-[760px] mx-auto px-4 sm:px-8 pb-12">
            <div className="flex flex-wrap gap-2 pt-8 border-t border-slate-100">
              <Tag size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
              {tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-xs font-bold text-slate-600">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* CTA */}
      <div className="max-w-[760px] mx-auto px-4 sm:px-8 pb-16">
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-nb-green/20 border border-nb-green/30 text-nb-green text-[10px] font-black uppercase tracking-widest mb-5">
              Start Today
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-4 leading-tight">
              Ready to Start Your Private Label Brand?
            </h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto leading-relaxed">
              Discuss your requirements, MOQ, and formulation with our manufacturing team.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/contact"
                className="inline-flex items-center gap-2 bg-nb-green text-white px-8 py-3.5 rounded-2xl font-black shadow-lg hover:bg-nb-green-deep hover:scale-[1.03] transition-all">
                Get a Free Quote <ArrowRight size={16} />
              </Link>
              <Link href="/products"
                className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-white/20 transition-all">
                Browse Products
              </Link>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-nb-green/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-nb-green/5 rounded-full blur-[80px] -ml-32 -mb-32 pointer-events-none" />
        </div>
      </div>

      {/* Related articles */}
      {related.length > 0 && (
        <div className="bg-slate-50 border-t border-slate-100 py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-slate-900">Related Articles</h3>
              <Link href="/blogs" className="text-nb-green font-bold text-sm flex items-center gap-1 hover:gap-3 transition-all">
                All articles <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((b: any) => <RelatedCard key={b._id} blog={b} />)}
            </div>
          </div>
        </div>
      )}

      <SiteFooter initialSettings={initialSettings} />
    </div>
  );
}
