'use client';

import { useState } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { defaultServices } from '@/lib/theme';

export default function ServicesManager() {
    const [services, setServices] = useState(
        defaultServices.map((s, i) => ({ ...s, id: String(i + 1) }))
    );
    const [editing, setEditing] = useState(null);

    const handleSave = (service) => {
        setServices(services.map(s => s.id === service.id ? service : s));
        setEditing(null);
        alert('Service saved! (Connect Supabase to persist)');
    };

    const handleAdd = () => {
        const newService = { id: Date.now().toString(), title: 'New Service', description: '', icon: 'Palette', slug: 'new-service' };
        setServices([...services, newService]);
        setEditing(newService.id);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Services</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your service offerings.</p>
                </div>
                <button onClick={handleAdd} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-medium text-sm hover:bg-primary-dark transition-colors">
                    <Plus className="w-4 h-4" /> Add Service
                </button>
            </div>

            <div className="space-y-3">
                {services.map((service) => (
                    <div key={service.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                        {editing === service.id ? (
                            <div className="p-5 bg-gray-50 space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                                        <input value={service.title} onChange={e => setServices(services.map(s => s.id === service.id ? { ...s, title: e.target.value } : s))} className="w-full px-3 py-2 border rounded-lg text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Slug</label>
                                        <input value={service.slug} onChange={e => setServices(services.map(s => s.id === service.id ? { ...s, slug: e.target.value } : s))} className="w-full px-3 py-2 border rounded-lg text-sm" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                                    <textarea rows={3} value={service.description} onChange={e => setServices(services.map(s => s.id === service.id ? { ...s, description: e.target.value } : s))} className="w-full px-3 py-2 border rounded-lg text-sm resize-none" />
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleSave(service)} className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">
                                        <Save className="w-4 h-4" /> Save
                                    </button>
                                    <button onClick={() => setEditing(null)} className="px-4 py-2 border rounded-lg text-sm text-gray-600">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-5 flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-900">{service.title}</h3>
                                    <p className="text-gray-500 text-sm mt-1 line-clamp-1">{service.description}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setEditing(service.id)} className="px-3 py-1.5 text-sm font-medium text-primary border border-primary/20 rounded-lg hover:bg-primary/5">Edit</button>
                                    <button onClick={() => setServices(services.filter(s => s.id !== service.id))} className="p-1.5 text-red-400 hover:text-red-600 rounded-lg">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
