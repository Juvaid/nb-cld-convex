"use client";

import React, { useEffect, useRef } from "react";

interface RichTextProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
}

export const RichText = ({ value, onChange, label }: RichTextProps) => {
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || "";
        }
    }, [value]);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const execCommand = (command: string, value: string = "") => {
        document.execCommand(command, false, value);
        handleInput();
    };

    return (
        <div className="space-y-2">
            {label && <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">{label}</label>}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-nb-green/20 focus-within:border-nb-green transition-all">
                <div className="flex items-center gap-1 p-2 border-b border-slate-100 bg-slate-50">
                    <button
                        type="button"
                        onClick={() => execCommand("bold")}
                        className="p-1.5 hover:bg-white rounded-md transition-colors text-slate-600 font-bold w-8 h-8 flex items-center justify-center border border-transparent hover:border-slate-200"
                        title="Bold"
                    >
                        B
                    </button>
                    <button
                        type="button"
                        onClick={() => execCommand("italic")}
                        className="p-1.5 hover:bg-white rounded-md transition-colors text-slate-600 italic w-8 h-8 flex items-center justify-center border border-transparent hover:border-slate-200"
                        title="Italic"
                    >
                        I
                    </button>
                    <button
                        type="button"
                        onClick={() => execCommand("insertUnorderedList")}
                        className="p-1.5 hover:bg-white rounded-md transition-colors text-slate-600 w-8 h-8 flex items-center justify-center border border-transparent hover:border-slate-200 text-lg"
                        title="Bullet List"
                    >
                        •
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            const url = prompt("Enter link URL:");
                            if (url) execCommand("createLink", url);
                        }}
                        className="p-1.5 hover:bg-white rounded-md transition-colors text-slate-600 w-8 h-8 flex items-center justify-center border border-transparent hover:border-slate-200"
                        title="Link"
                    >
                        🔗
                    </button>
                    <div className="w-px h-4 bg-slate-200 mx-1" />
                    <button
                        type="button"
                        onClick={() => execCommand("formatBlock", "h2")}
                        className="p-1.5 hover:bg-white rounded-md transition-colors text-slate-600 font-bold text-[10px] w-8 h-8 flex items-center justify-center border border-transparent hover:border-slate-200"
                        title="Heading 1"
                    >
                        H1
                    </button>
                    <button
                        type="button"
                        onClick={() => execCommand("formatBlock", "h3")}
                        className="p-1.5 hover:bg-white rounded-md transition-colors text-slate-600 font-bold text-[10px] w-8 h-8 flex items-center justify-center border border-transparent hover:border-slate-200"
                        title="Heading 2"
                    >
                        H2
                    </button>
                </div>
                <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleInput}
                    className="p-4 min-h-[200px] outline-none prose prose-slate prose-nb max-w-none text-slate-700 font-medium whitespace-pre-wrap"
                />
            </div>
        </div>
    );
};
