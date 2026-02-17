import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export interface CallToActionProps {
    heading?: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
}

export default function CallToAction({
    heading = "Need a Custom Formulation?",
    description = "Our in-house R&D team can develop unique formulations tailored to your brand's requirements.",
    buttonText = "Request Custom Formula",
    buttonLink = "/contact"
}: CallToActionProps) {
    return (
        <section className="py-20 bg-gradient-to-br from-[#16a34a] to-[#15803d]">
            <div className="max-w-3xl mx-auto text-center px-4">
                <h2 className="text-3xl font-bold text-white mb-4">{heading}</h2>
                <p className="text-white/70 mb-8 max-w-2xl mx-auto">
                    {description}
                </p>
                <Link
                    href={buttonLink}
                    className="inline-flex items-center gap-2 px-10 py-4 text-base font-semibold text-[#15803d] bg-gradient-to-r from-[#2bee6c] to-green-300 rounded-full hover:shadow-2xl hover:shadow-[#2bee6c]/30 transition-all hover:-translate-y-1"
                >
                    {buttonText}
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        </section>
    );
}
