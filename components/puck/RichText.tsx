"use client";

import React, { useEffect, useMemo, useRef } from "react";

interface RichTextProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
}

export const RichText = ({ value, onChange, label }: RichTextProps) => {
    const editorRef = useRef<HTMLDivElement>(null);

    const sanitizeHtml = useMemo(() => {
        const stripDangerous = (html: string) => {
            if (!html) return "";

            let out = html;

            // Hard strip script/style
            out = out.replace(/<script[\s\S]*?<\/script>/gi, "");
            out = out.replace(/<style[\s\S]*?<\/style>/gi, "");

            // Remove inline event handlers (onload, onclick, etc)
            out = out.replace(/\son\w+="[^"]*"/gi, "");
            out = out.replace(/\son\w+='[^']*'/gi, "");

            // Remove inline FAQ/schema JSON fragments that sometimes get pasted into the editor
            out = out.replace(/\{\s*"@type"\s*:\s*"Question"[\s\S]*?\}\s*\}?/gi, "");
            out = out.replace(/\{\s*"@context"[\s\S]*?\}\s*/gi, "");

            // Normalize nbsp
            out = out.replace(/&nbsp;/g, " ").replace(/\u00A0/g, " ");

            return out.trim();
        };

        return stripDangerous;
    }, []);

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || "";
        }
    }, [value]);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(sanitizeHtml(editorRef.current.innerHTML));
        }
    };

    const execCommand = (command: string, value: string = "") => {
        document.execCommand(command, false, value);
        handleInput();
    };

    const setBlock = (tag: "p" | "h2" | "h3" | "h4") => {
        execCommand("formatBlock", tag);
    };

    const setLink = () => {
        const url = prompt("Enter link URL:");
        if (!url) return;
        execCommand("createLink", url);
    };

    const removeLink = () => execCommand("unlink");

    const insertHr = () => execCommand("insertHorizontalRule");

    const insertInlineCode = () => execCommand("formatBlock", "pre");

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
                        onClick={() => execCommand("underline")}
                        className="p-1.5 hover:bg-white rounded-md transition-colors text-slate-600 underline w-8 h-8 flex items-center justify-center border border-transparent hover:border-slate-200"
                        title="Underline"
                    >
                        U
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
                        onClick={() => execCommand("insertOrderedList")}
                        className="p-1.5 hover:bg-white rounded-md transition-colors text-slate-600 w-8 h-8 flex items-center justify-center border border-transparent hover:border-slate-200 text-sm font-bold"
                        title="Numbered List"
                    >
                        1.
                    </button>
                    <button
                        type="button"
                        onClick={setLink}
                        className="p-1.5 hover:bg-white rounded-md transition-colors text-slate-600 w-8 h-8 flex items-center justify-center border border-transparent hover:border-slate-200"
                        title="Link"
                    >
                        🔗
                    </button>
                    <button
                        type="button"
                        onClick={removeLink}
                        className="p-1.5 hover:bg-white rounded-md transition-colors text-slate-600 w-8 h-8 flex items-center justify-center border border-transparent hover:border-slate-200"
                        title="Remove Link"
                    >
                        ⛓️
                    </button>
                    <div className="w-px h-4 bg-slate-200 mx-1" />
                    <button
                        type="button"
                        onClick={() => setBlock("h2")}
                        className="p-1.5 hover:bg-white rounded-md transition-colors text-slate-600 font-bold text-[10px] w-8 h-8 flex items-center justify-center border border-transparent hover:border-slate-200"
                        title="Heading (H2)"
                    >
                        H2
                    </button>
                    <button
                        type="button"
                        onClick={() => setBlock("h3")}
                        className="p-1.5 hover:bg-white rounded-md transition-colors text-slate-600 font-bold text-[10px] w-8 h-8 flex items-center justify-center border border-transparent hover:border-slate-200"
                        title="Heading (H3)"
                    >
                        H3
                    </button>
                    <button
                        type="button"
                        onClick={() => setBlock("h4")}
                        className="p-1.5 hover:bg-white rounded-md transition-colors text-slate-600 font-bold text-[10px] w-8 h-8 flex items-center justify-center border border-transparent hover:border-slate-200"
                        title="Heading (H4)"
                    >
                        H4
                    </button>
                    <button
                        type="button"
                        onClick={() => execCommand("formatBlock", "blockquote")}
                        className="p-1.5 hover:bg-white rounded-md transition-colors text-slate-600 w-8 h-8 flex items-center justify-center border border-transparent hover:border-slate-200"
                        title="Quote"
                    >
                        ❝
                    </button>
                    <button
                        type="button"
                        onClick={insertHr}
                        className="p-1.5 hover:bg-white rounded-md transition-colors text-slate-600 w-8 h-8 flex items-center justify-center border border-transparent hover:border-slate-200"
                        title="Divider"
                    >
                        ―
                    </button>
                    <button
                        type="button"
                        onClick={() => execCommand("removeFormat")}
                        className="p-1.5 hover:bg-white rounded-md transition-colors text-slate-600 w-8 h-8 flex items-center justify-center border border-transparent hover:border-slate-200"
                        title="Clear formatting"
                    >
                        Tx
                    </button>
                </div>
                <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleInput}
                    onPaste={() => {
                        // allow paste, but normalize afterwards
                        setTimeout(handleInput, 0);
                    }}
                    className="p-4 min-h-[260px] outline-none max-w-none text-slate-700 font-medium whitespace-pre-wrap"
                />
            </div>
        </div>
    );
};
