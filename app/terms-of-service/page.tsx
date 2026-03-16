import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Terms of Service",
    description: "Terms of Service and conditions for using Nature's Boon, your premium manufacturing partner.",
};

export default function TermsOfServicePage() {
    return (
        <div className="bg-white py-16 sm:py-24">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-nb-green">
                <h1 className="text-4xl font-extrabold tracking-tight text-nb-gray-900 sm:text-5xl mb-8">
                    Terms of Service
                </h1>

                <p className="text-lg text-gray-500 mb-8">
                    Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
                    <p className="text-gray-600 mb-4">
                        These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Nature's Boon ("we," "us" or "our"), concerning your access to and use of our website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Intellectual Property Rights</h2>
                    <p className="text-gray-600 mb-4">
                        Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Representations</h2>
                    <p className="text-gray-600 mb-4">
                        By using the Site, you represent and warrant that:
                    </p>
                    <ul className="list-disc pl-5 text-gray-600 mb-4 space-y-2">
                        <li>All registration information you submit will be true, accurate, current, and complete.</li>
                        <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                        <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
                        <li>You will not access the Site through automated or non-human means, whether through a bot, script or otherwise.</li>
                        <li>You will not use the Site for any illegal or unauthorized purpose.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Products and Services</h2>
                    <p className="text-gray-600 mb-4">
                        All products and services listed on the site are subject to availability. We reserve the right to discontinue any products at any time for any reason. Prices for all products are subject to change.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Modifications and Interruptions</h2>
                    <p className="text-gray-600 mb-4">
                        We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Site.
                    </p>
                </section>
            </div>
        </div>
    );
}
