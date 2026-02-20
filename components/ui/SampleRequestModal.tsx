"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/Button";

interface SampleRequestModalProps {
    productId: string;
    productName: string;
    onClose: () => void;
}

export const SampleRequestModal = ({ productId, productName, onClose }: SampleRequestModalProps) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [company, setCompany] = useState("");
    const [volume, setVolume] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const submit = useMutation(api.inquiries.submit);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await submit({
                name,
                email,
                message: `Sample Request (50g) for ${productName}`,
                productId,
                productName,
                companyType: company,
                annualVolume: volume,
            });
            setIsSuccess(true);
        } catch (err) {
            console.error(err);
            alert("Failed to submit request. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-[32px] p-10 max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-nb-green/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">✅</div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Request Received!</h3>
                    <p className="text-slate-500 mb-8">Our procurement specialist will contact you to verify your business details and ship the 50g sample.</p>
                    <Button onClick={onClose} className="w-full bg-nb-green hover:bg-nb-green/90 text-white rounded-xl">Close</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden max-w-2xl w-full flex flex-col md:flex-row">
                <div className="md:w-1/3 bg-slate-900 p-10 text-white flex flex-col justify-between">
                    <div>
                        <span className="text-nb-green font-bold text-xs uppercase tracking-widest">B2B Sample</span>
                        <h3 className="text-xl font-bold mt-2">Request 50g Sample</h3>
                        <p className="text-slate-400 text-sm mt-4">Order a testing sample of <strong>{productName}</strong> for lab analysis before placing your bulk order.</p>
                    </div>
                    <div className="text-xs text-slate-500 italic mt-8">Note: Samples are available exclusively for registered business entities.</div>
                </div>

                <div className="md:w-2/3 p-10">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block text-xs font-bold text-slate-400 uppercase mb-1">Name</label>
                                <input id="name" required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-nb-green/20 outline-none" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-xs font-bold text-slate-400 uppercase mb-1">Business Email</label>
                                <input id="email" required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-nb-green/20 outline-none" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="company" className="block text-xs font-bold text-slate-400 uppercase mb-1">Company / Brand Name</label>
                            <input id="company" required value={company} onChange={e => setCompany(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-nb-green/20 outline-none" />
                        </div>
                        <div>
                            <label htmlFor="volume" className="block text-xs font-bold text-slate-400 uppercase mb-1">Estimated Annual Volume (kg/Units)</label>
                            <input id="volume" value={volume} placeholder="e.g. 500kg" onChange={e => setVolume(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-nb-green/20 outline-none" />
                        </div>

                        <div className="pt-4 flex gap-4">
                            <Button type="button" variant="ghost" onClick={onClose} className="flex-1 rounded-xl">Cancel</Button>
                            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-nb-green hover:bg-nb-green/90 text-white rounded-xl">
                                {isSubmitting ? "Submitting..." : "Send Request"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
