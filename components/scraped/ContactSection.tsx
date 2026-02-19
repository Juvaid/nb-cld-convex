'use client';

import { Phone, Mail, MapPin, Clock, LucideIcon } from 'lucide-react';
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import ContactForm from "./ContactForm";

export interface ContactInfoItem {
    label: string;
    value: string;
    icon: string;
}

export interface DepartmentEmail {
    label: string;
    email: string;
}

export interface ContactSectionProps {
    heading?: string;
    infoItems?: ContactInfoItem[];
    departmentEmails?: DepartmentEmail[];
    productId?: string;
    productName?: string;
}

const iconMap: Record<string, LucideIcon> = {
    Phone: Phone,
    Mail: Mail,
    MapPin: MapPin,
    Clock: Clock,
};

export default function ContactSection({
    heading = "Get in Touch",
    infoItems = [],
    departmentEmails = [],
    productId,
    productName
}: ContactSectionProps) {

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
                <div className="grid lg:grid-cols-5 gap-12">
                    {/* Contact info */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">{heading}</h2>

                        {(infoItems || []).map((item) => {
                            const IconComponent = iconMap[item.icon] || Mail;
                            return (
                                <div key={item.label} className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-900/5 shadow-sm">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-nb-green to-nb-green-light flex items-center justify-center shrink-0 shadow-md shadow-nb-green/20 overflow-hidden">
                                        {iconMap[item.icon] ? (
                                            <IconComponent className="w-5 h-5 text-white" />
                                        ) : (
                                            <img
                                                src={item.icon?.startsWith('http') ? item.icon : `/api/storage/${item.icon}`}
                                                className="w-full h-full object-cover"
                                                alt={item.label}
                                            />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">{item.label}</p>
                                        <p className="font-semibold text-slate-900">{item.value}</p>
                                    </div>
                                </div>
                            );
                        })}

                        {departmentEmails.length > 0 && (
                            <div className="mt-8 pt-8 border-t border-slate-100">
                                <h3 className="font-semibold text-slate-900 mb-4">Department Emails</h3>
                                <ul className="space-y-3 text-sm text-slate-500">
                                    {departmentEmails.map((dept, i) => (
                                        <li key={i} className="flex flex-col sm:flex-row sm:items-baseline gap-1">
                                            <span className="font-medium text-slate-900 min-w-[80px]">{dept.label}:</span>
                                            <a href={`mailto:${dept.email}`} className="hover:text-nb-green transition-colors">{dept.email}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Contact form */}
                    <div className="lg:col-span-3">
                        <ContactForm productId={productId} productName={productName} />
                    </div>
                </div>
            </div>
        </section>
    );
}
