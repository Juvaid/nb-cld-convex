import { MessageSquare, Clock, Mail, Phone } from 'lucide-react';

// Sample inquiries — in production, these would come from Supabase
const sampleInquiries = [
    { id: '1', name: 'Rahul Sharma', email: 'rahul@company.com', phone: '+91-9876543210', message: 'Interested in private label hair care products. Need 500 units.', createdAt: '2026-02-13' },
    { id: '2', name: 'Priya Mehta', email: 'priya@beauty.in', phone: '+91-8765432109', message: 'Looking for OEM face wash with custom formulation. Please share pricing.', createdAt: '2026-02-12' },
    { id: '3', name: 'Amit Verma', email: 'amit@exports.com', phone: '+91-7654321098', message: 'Need bulk pricing for beard oil and hair wax for export market.', createdAt: '2026-02-10' },
];

export default function InquiriesPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
                <p className="text-gray-500 text-sm mt-1">View contact form submissions from potential clients.</p>
            </div>

            <div className="space-y-4">
                {sampleInquiries.map((inquiry) => (
                    <div key={inquiry.id} className="bg-white rounded-2xl border border-gray-100 p-6">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                                    {inquiry.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{inquiry.name}</h3>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {inquiry.email}</span>
                                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {inquiry.phone}</span>
                                    </div>
                                </div>
                            </div>
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                                <Clock className="w-3 h-3" /> {inquiry.createdAt}
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-xl">
                            <MessageSquare className="w-4 h-4 text-primary inline mr-1" />
                            {inquiry.message}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800">
                💡 Connect your Supabase credentials in <code className="bg-yellow-100 px-1 rounded">.env.local</code> to see live inquiries from the contact form.
            </div>
        </div>
    );
}
