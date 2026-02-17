import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata = {
    title: "Admin — Nature's Boon CMS",
};

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <AdminSidebar />
            <div className="lg:ml-64">
                <div className="p-6 lg:p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
