import { FileText, Package, Wrench, MessageSquare, Paintbrush, Download, Image } from 'lucide-react';
import Link from 'next/link';

const cards = [
    { icon: FileText, label: 'Content Blocks', desc: 'Manage page sections and text', href: '/admin/content', color: 'from-blue-500 to-blue-600' },
    { icon: Package, label: 'Products', desc: 'Manage product catalog', href: '/admin/products', color: 'from-green-500 to-emerald-600' },
    { icon: Wrench, label: 'Services', desc: 'Edit service offerings', href: '/admin/services', color: 'from-purple-500 to-purple-600' },
    { icon: Image, label: 'Media Library', desc: 'Upload & manage files', href: '/admin/media', color: 'from-cyan-500 to-cyan-600' },
    { icon: MessageSquare, label: 'Inquiries', desc: 'View contact submissions', href: '/admin/inquiries', color: 'from-orange-500 to-orange-600' },
    { icon: Paintbrush, label: 'Theme Editor', desc: 'Shopify-style layer editing', href: '/admin/settings', color: 'from-rose-500 to-rose-600' },
    { icon: Download, label: 'Export', desc: 'Export theme & content', href: '/admin/export', color: 'from-teal-500 to-teal-600' },
];

export default function AdminDashboard() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 text-sm mt-1">Welcome to the Nature&apos;s Boon CMS. Manage your website content from here.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {cards.map((card) => (
                    <Link
                        key={card.href}
                        href={card.href}
                        className="group bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                            <card.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-bold text-gray-900">{card.label}</h3>
                        <p className="text-gray-500 text-sm mt-1">{card.desc}</p>
                    </Link>
                ))}
            </div>

            {/* Quick info */}
            <div className="mt-8 bg-gradient-to-r from-primary-dark to-primary rounded-2xl p-8 text-white">
                <h2 className="text-xl font-bold mb-2">🚀 Platform Overview</h2>
                <p className="text-white/70 text-sm mb-4">
                    This CMS is built for scalability. All content is stored in Supabase and can be exported as JSON for platform migration.
                </p>
                <div className="flex gap-6 text-sm">
                    <div>
                        <div className="text-2xl font-bold text-accent">Next.js 15</div>
                        <div className="text-white/50">Framework</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-accent">Supabase</div>
                        <div className="text-white/50">Backend</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-accent">Portable</div>
                        <div className="text-white/50">Hosting</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
