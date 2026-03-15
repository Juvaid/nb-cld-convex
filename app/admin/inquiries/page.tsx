"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Mail, Search, Loader2, Eye, Trash2, CheckCircle2, MessageSquare, Clock, Copy, Check, Phone, Filter, Calendar, Tag, ChevronDown, Download } from "lucide-react";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function InquiriesAdmin() {
    const { token } = useAuth();
    const inquiries = useQuery(api.inquiries.list);
    const updateStatus = useMutation(api.inquiries.updateStatus);
    const deleteInquiry = useMutation(api.inquiries.deleteInquiry);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedId, setSelectedId] = useState<any>(null);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const [filterCategory, setFilterCategory] = useState("all");
    const [filterProduct, setFilterProduct] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterDateRange, setFilterDateRange] = useState("all"); // all, today, week, month

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filteredInquiries = useMemo(() => {
        if (!inquiries) return [];
        return inquiries.filter(item => {
            // Search filter
            const matchesSearch = searchQuery === "" ||
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.message.toLowerCase().includes(searchQuery.toLowerCase());

            // Status filter
            const matchesStatus = filterStatus === "all" || item.status === filterStatus;

            // Product filter
            const matchesProduct = filterProduct === "all" || item.productName === filterProduct;

            // Category filter
            const matchesCategory = (filterCategory === "all" || item.productCategory === filterCategory) ||
                (filterCategory === "None" && !item.productCategory);

            // Date filter
            let matchesDate = true;
            if (filterDateRange !== "all") {
                const date = new Date(item.submittedAt);
                const now = new Date();
                if (filterDateRange === "today") {
                    matchesDate = date.toDateString() === now.toDateString();
                } else if (filterDateRange === "week") {
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    matchesDate = date >= weekAgo;
                } else if (filterDateRange === "month") {
                    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    matchesDate = date >= monthAgo;
                }
            }

            return matchesSearch && matchesStatus && matchesProduct && matchesCategory && matchesDate;
        });
    }, [inquiries, searchQuery, filterStatus, filterProduct, filterCategory, filterDateRange]);

    const categories = useMemo(() => {
        const cats = new Set(inquiries?.map(i => i.productCategory).filter(Boolean));
        return ["all", ...Array.from(cats)];
    }, [inquiries]);

    const products = useMemo(() => {
        const prods = new Set(inquiries?.map(i => i.productName).filter(Boolean));
        return ["all", ...Array.from(prods)];
    }, [inquiries]);

    const selectedInquiry = inquiries?.find(i => i._id === selectedId);

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const formatFullDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const handleStatusUpdate = async (id: any, status: "new" | "read" | "replied") => {
        try {
            await updateStatus({ id, status, token: token ?? undefined });
            setIsStatusOpen(false); // Close menu after update
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const handleDelete = async (id: any) => {
        if (confirm("Are you sure you want to delete this inquiry?")) {
            try {
                await deleteInquiry({ id, token: token ?? undefined });
                if (selectedId === id) setSelectedId(null);
            } catch (error) {
                console.error("Failed to delete inquiry:", error);
            }
        }
    };

    const exportToCSV = () => {
        if (!filteredInquiries || filteredInquiries.length === 0) {
            alert("No data available to export.");
            return;
        }

        const headers = ["ID", "Name", "Email", "Phone", "Brand", "Request Type", "Quantity", "Timeline", "Formula", "Status", "Product", "Category", "Message", "Submitted At"];
        const rows = filteredInquiries.map(item => [
            `"=""${item._id}"""`,
            `"${item.name.replace(/"/g, '""')}"`,
            `"${item.email.replace(/"/g, '""')}"`,
            `"=""${(item.phone || "").replace(/"/g, '""')}"""`,
            `"${(item.brandName || "").replace(/"/g, '""')}"`,
            `"${(item.requestType || "").replace(/"/g, '""')}"`,
            `"${(item.annualVolume || "").replace(/"/g, '""')}"`,
            `"${(item.timeline || "").replace(/"/g, '""')}"`,
            `"${(item.formulaStatus || "").replace(/"/g, '""')}"`,
            item.status,
            `"${(item.productName || "").replace(/"/g, '""')}"`,
            `"${(item.productCategory || "").replace(/"/g, '""')}"`,
            `"${item.message.replace(/"/g, '""').replace(/\n/g, " ")}"`,
            new Date(item.submittedAt).toISOString()
        ]);

        const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `inquiries_export_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 font-outfit">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Communication Hub</h1>
                    <p className="text-slate-500 font-medium">Manage and respond to customer inquiries from your website.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Leads</span>
                            <span className="text-xl font-black text-slate-900 leading-none">{inquiries?.length || 0}</span>
                        </div>
                        <div className="w-px h-8 bg-slate-100" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">New</span>
                            <span className="text-xl font-black text-nb-green leading-none">{inquiries?.filter(i => i.status === 'new').length || 0}</span>
                        </div>
                    </div>

                    <button
                        onClick={exportToCSV}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2"
                        title="Export current view to Excel/CSV"
                    >
                        <Download size={16} />
                        Export Data
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest mr-2">
                    <Filter size={14} />
                    Filters
                </div>

                {/* status filter */}
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-nb-green/20"
                    title="Filter by Status"
                >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                </select>

                {/* category filter */}
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-nb-green/20"
                    title="Filter by Category"
                >
                    <option value="all">All Categories</option>
                    {categories.filter(c => c !== "all").map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                {/* product filter */}
                <select
                    value={filterProduct}
                    onChange={(e) => setFilterProduct(e.target.value)}
                    className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-nb-green/20 max-w-[200px]"
                    title="Filter by Product"
                >
                    <option value="all">All Products</option>
                    {products.filter(p => p !== "all").map(prod => (
                        <option key={prod} value={prod}>{prod}</option>
                    ))}
                </select>

                {/* date filter */}
                <select
                    value={filterDateRange}
                    onChange={(e) => setFilterDateRange(e.target.value)}
                    className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-nb-green/20"
                    title="Filter by Date Range"
                >
                    <option value="all">Any Time</option>
                    <option value="today">Today</option>
                    <option value="week">Past 7 Days</option>
                    <option value="month">Past 30 Days</option>
                </select>

                <button
                    onClick={() => {
                        setFilterStatus("all");
                        setFilterCategory("all");
                        setFilterProduct("all");
                        setFilterDateRange("all");
                        setSearchQuery("");
                    }}
                    className="ml-auto text-xs font-bold text-slate-400 hover:text-red-500 transition-colors"
                >
                    Reset All
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* List Side */}
                <div className="lg:col-span-5 space-y-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name, email or message..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-nb-green/20 focus:border-nb-green focus:bg-white transition-all font-medium"
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
                        {!inquiries ? (
                            <div className="flex-grow flex flex-col items-center justify-center py-20">
                                <Loader2 className="animate-spin text-nb-green mb-4" size={32} />
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Syncing Inquiries...</p>
                            </div>
                        ) : filteredInquiries.length === 0 ? (
                            <div className="flex-grow flex flex-col items-center justify-center py-20 px-6 text-center">
                                <Mail className="text-slate-100 mb-4" size={60} />
                                <p className="text-slate-500 font-black">
                                    {searchQuery ? `No leads matching "${searchQuery}"` : "Your inbox is empty."}
                                </p>
                                <p className="text-slate-400 text-sm font-medium mt-1">
                                    All customer queries will appear here in real-time.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50 overflow-y-auto max-h-[700px]">
                                {filteredInquiries.map((item) => (
                                    <div
                                        key={item._id}
                                        onClick={() => setSelectedId(item._id)}
                                        className={`p-5 cursor-pointer transition-all hover:bg-slate-50 group relative ${selectedId === item._id ? 'bg-nb-green/5 border-l-4 border-nb-green' : 'border-l-4 border-transparent'}`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-black text-slate-800 text-sm group-hover:text-nb-green transition-colors">{item.name}</h3>
                                                {item.status === 'new' && (
                                                    <div className="w-2 h-2 rounded-full bg-nb-green animate-pulse" />
                                                )}
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                                {formatDate(item.submittedAt)}
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-500 font-medium mb-3 truncate">{item.email}</div>
                                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                            {item.message}
                                        </p>

                                        <div className="mt-4 flex items-center justify-between">
                                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${item.status === 'new' ? 'bg-nb-green/10 text-nb-green' :
                                                item.status === 'replied' ? 'bg-blue-50 text-blue-500' :
                                                    'bg-slate-100 text-slate-400'
                                                }`}>
                                                {item.status}
                                            </span>

                                            {item.productName && (
                                                <span className="text-[10px] font-bold text-nb-green/60 bg-nb-green/5 px-2 py-0.5 rounded italic truncate max-w-[120px]">
                                                    {item.productName}
                                                </span>
                                            )}

                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }}
                                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Delete Lead"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Detail Side */}
                <div className="lg:col-span-7">
                    {selectedInquiry ? (
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden sticky top-6">
                            {/* Card Header */}
                            <div className="p-8 border-b border-slate-50 bg-slate-50/30">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-nb-green font-black text-2xl flex-shrink-0">
                                            {selectedInquiry.name.substring(0, 1).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <h2 className="text-2xl font-black text-slate-900 tracking-tight truncate">{selectedInquiry.name}</h2>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                                                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium group">
                                                    <Mail size={14} className="text-slate-400" />
                                                    <span className="truncate max-w-[150px] sm:max-w-none">{selectedInquiry.email}</span>
                                                    <button
                                                        onClick={() => copyToClipboard(selectedInquiry.email, 'email')}
                                                        className="p-1 hover:bg-slate-100 rounded transition-colors"
                                                        title="Copy Email"
                                                    >
                                                        {copiedId === 'email' ? <Check size={12} className="text-nb-green" /> : <Copy size={12} className="text-slate-400" />}
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                                                    <Phone size={14} className="text-slate-400" />
                                                    <span>{selectedInquiry.phone || "No phone"}</span>
                                                    {selectedInquiry.phone && (
                                                        <button
                                                            onClick={() => copyToClipboard(selectedInquiry.phone!, 'phone')}
                                                            className="p-1 hover:bg-slate-100 rounded transition-colors"
                                                            title="Copy Phone"
                                                        >
                                                            {copiedId === 'phone' ? <Check size={12} className="text-nb-green" /> : <Copy size={12} className="text-slate-400" />}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="dropdown relative h-10">
                                            <button
                                                onClick={() => setIsStatusOpen(!isStatusOpen)}
                                                className={`h-full flex items-center gap-2 px-4 border rounded-xl font-bold text-sm transition-all font-outfit min-w-[120px] justify-center ${selectedInquiry.status === 'new' ? 'bg-nb-green/10 border-nb-green/20 text-nb-green' :
                                                    selectedInquiry.status === 'replied' ? 'bg-blue-50 border-blue-100 text-blue-500' :
                                                        'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                                    }`}
                                                title="Change Status"
                                            >
                                                <span className="capitalize">{selectedInquiry.status}</span>
                                                <Clock size={14} className={selectedInquiry.status === 'new' ? 'text-nb-green' : 'text-slate-400'} />
                                            </button>

                                            {isStatusOpen && (
                                                <>
                                                    <div className="fixed inset-0 z-40" onClick={() => setIsStatusOpen(false)} />
                                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-2xl transition-all z-50 p-2">
                                                        <button
                                                            onClick={() => handleStatusUpdate(selectedInquiry._id, 'new')}
                                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-slate-600 hover:bg-nb-green/5 hover:text-nb-green rounded-xl transition-all"
                                                        >
                                                            <div className="w-2 h-2 rounded-full bg-nb-green" />
                                                            Set as New
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(selectedInquiry._id, 'read')}
                                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                                                        >
                                                            <Eye size={16} />
                                                            Mark as Read
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(selectedInquiry._id, 'replied')}
                                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-500 rounded-xl transition-all"
                                                        >
                                                            <CheckCircle2 size={16} />
                                                            Mark as Replied
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => handleDelete(selectedInquiry._id)}
                                            className="p-2.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            title="Delete Lead"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                                        <div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Inquiry ID</span>
                                            <span className="text-xs font-mono font-bold text-slate-600 truncate block">{selectedInquiry._id}</span>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(selectedInquiry._id, 'id')}
                                            className="text-[10px] font-bold text-nb-green mt-2 flex items-center gap-1 hover:underline self-start"
                                        >
                                            {copiedId === 'id' ? <Check size={10} /> : <Copy size={10} />}
                                            {copiedId === 'id' ? 'ID Copied' : 'Copy ID'}
                                        </button>
                                    </div>
                                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Submitted On</span>
                                        <span className="text-xs font-bold text-slate-600 block">
                                            {formatFullDate(selectedInquiry.submittedAt)}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-medium mt-1 block italic opacity-60">
                                            Automatic timestamp verified
                                        </span>
                                    </div>
                                </div>

                                {/* B2B Details Grid */}
                                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {selectedInquiry.brandName && (
                                        <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Brand</span>
                                            <span className="text-xs font-bold text-slate-700 block truncate">{selectedInquiry.brandName}</span>
                                        </div>
                                    )}
                                    {selectedInquiry.requestType && (
                                        <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Request</span>
                                            <span className="text-xs font-bold text-slate-700 block truncate">{selectedInquiry.requestType}</span>
                                        </div>
                                    )}
                                    {selectedInquiry.annualVolume && (
                                        <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Quantity</span>
                                            <span className="text-xs font-bold text-slate-700 block truncate">{selectedInquiry.annualVolume}</span>
                                        </div>
                                    )}
                                    {selectedInquiry.timeline && (
                                        <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Timeline</span>
                                            <span className="text-xs font-bold text-slate-700 block truncate">{selectedInquiry.timeline}</span>
                                        </div>
                                    )}
                                    {selectedInquiry.formulaStatus && (
                                        <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Formula</span>
                                            <span className="text-xs font-bold text-slate-700 block truncate">{selectedInquiry.formulaStatus}</span>
                                        </div>
                                    )}
                                </div>

                                {selectedInquiry.productName && (
                                    <div className="mt-6 bg-nb-green/5 border border-nb-green/10 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-white border border-nb-green/10 flex items-center justify-center text-nb-green">
                                                <Tag size={20} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-nb-green uppercase tracking-widest leading-none">Product Lead</span>
                                                    {selectedInquiry.productCategory && (
                                                        <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-widest">
                                                            {selectedInquiry.productCategory}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-base font-black text-slate-800 block mt-0.5">{selectedInquiry.productName}</span>
                                            </div>
                                        </div>
                                        <Link
                                            href={`/products/${selectedInquiry.productId}`}
                                            className="px-4 py-2 bg-white border border-nb-green/20 rounded-xl text-xs font-black text-nb-green hover:bg-nb-green hover:text-white transition-all text-center self-start md:self-center"
                                        >
                                            View Product
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Message Panel */}
                            <div className="p-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 rounded-full bg-nb-green/10 flex items-center justify-center text-nb-green">
                                        <MessageSquare size={16} />
                                    </div>
                                    <h3 className="font-black text-slate-900 tracking-tight">Customer Message</h3>
                                </div>

                                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100/50">
                                    <p className="text-slate-700 font-medium leading-[1.8] whitespace-pre-wrap">
                                        {selectedInquiry.message}
                                    </p>
                                </div>

                                <div className="mt-10 flex gap-4">
                                    <a
                                        href={`mailto:${selectedInquiry.email}`}
                                        className="flex-grow bg-slate-900 text-white text-center py-4 rounded-2xl font-black shadow-xl shadow-slate-900/10 hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all text-sm"
                                    >
                                        Direct Response via Email
                                    </a>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[600px] flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-slate-200 p-10 text-center">
                            <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center text-slate-200 mb-6">
                                <Eye size={40} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">Select a Lead to Inspect</h3>
                            <p className="text-slate-400 font-medium max-w-sm">
                                Choose an inquiry from the side list to view full details and manage the communication flow.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
