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
    productName,
    ...pProps
}: ContactSectionProps & Record<string, any>) {

    const id = (pProps as any).id;
    const dataBlock = (pProps as any)["data-block"];

    return (
        <section id={id} data-block={dataBlock} className="py-12 bg-transparent">
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
                <div className="grid lg:grid-cols-5 gap-12">
                    {/* Contact info */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">{heading}</h2>

                        {(infoItems || []).map((item) => {
                            const IconComponent = iconMap[item.icon] || Mail;

                            // Determine link properties based on icon type
                            let href = "#";
                            let target = "_self";
                            if (item.icon === 'Mail') href = `mailto:${item.value}`;
                            if (item.icon === 'Phone') href = `https://wa.me/${item.value.replace(/[^0-9+]/g, '')}`;
                            if (item.icon === 'MapPin') {
                                href = `https://www.google.com/maps/dir/?api=1&destination=Nature%27s+Boon%2C+Pakhowal+Rd%2C+Thakkarwal%2C+Ludhiana%2C+Punjab+India`;
                                target = "_blank";
                            }

                            return (
                                <a key={item.label} href={href} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined} className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-900/5 shadow-sm hover:border-nb-green/30 hover:shadow-md transition-all group cursor-pointer block">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-nb-green to-nb-green-light flex items-center justify-center shrink-0 shadow-md shadow-nb-green/20 overflow-hidden group-hover:scale-105 transition-transform">
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
                                    <div className="flex-1">
                                        <p className="text-sm text-slate-500 group-hover:text-nb-green transition-colors">{item.label}</p>
                                        <p className="font-semibold text-slate-900 break-words">{item.value}</p>
                                    </div>
                                </a>
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
