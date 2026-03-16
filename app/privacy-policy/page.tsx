import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Privacy Policy and data handling practices for Nature's Boon, your premium manufacturing partner.",
};

export default function PrivacyPolicyPage() {
    return (
        <div className="bg-white py-16 sm:py-24">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-nb-green">
                <h1 className="text-4xl font-extrabold tracking-tight text-nb-gray-900 sm:text-5xl mb-8">
                    Privacy Policy
                </h1>

                <p className="text-lg text-gray-500 mb-8">
                    Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                    <p className="text-gray-600 mb-4">
                        Nature's Boon ("we", "our", or "us") respects your privacy and is committed to protecting your personal data.
                        This privacy policy will inform you as to how we look after your personal data when you visit our website
                        (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">2. The Data We Collect About You</h2>
                    <p className="text-gray-600 mb-4">
                        We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                    </p>
                    <ul className="list-disc pl-5 text-gray-600 mb-4 space-y-2">
                        <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier, title, and company name.</li>
                        <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                        <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                        <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Personal Data</h2>
                    <p className="text-gray-600 mb-4">
                        We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                    </p>
                    <ul className="list-disc pl-5 text-gray-600 mb-4 space-y-2">
                        <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                        <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                        <li>Where we need to comply with a legal obligation.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
                    <p className="text-gray-600 mb-4">
                        We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed.
                        In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Contact Us</h2>
                    <p className="text-gray-600 mb-4">
                        If you have any questions about this privacy policy or our privacy practices, please contact us at our physical address or via the contact forms provided on this website.
                    </p>
                </section>
            </div>
        </div>
    );
}
