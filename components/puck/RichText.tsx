"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { MediaPickerModal } from "../admin/MediaPickerModal";

interface RichTextProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
}

export const RichText = ({ value, onChange, label }: RichTextProps) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
    const [targetImage, setTargetImage] = useState<HTMLImageElement | null>(null);

    const sanitizeHtml = useMemo(() => {
        const stripDangerous = (html: string) => {
            if (!html) return "";
            let out = html;
            out = out.replace(/<script[\s\S]*?<\/script>/gi, "");
            out = out.replace(/<style[\s\S]*?<\/style>/gi, "");
            out = out.replace(/\son\w+="[^"]*"/gi, "");
            out = out.replace(/\son\w+='[^']*'/gi, "");
            out = out.replace(/\{\s*"@type"\s*:\s*"Question"[\s\S]*?\}\s*\}?/gi, "");
            out = out.replace(/\{\s*"@context"[\s\S]*?\}\s*/gi, "");
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

    // Handle clicks inside the editor to detect image selection for replacement
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === "IMG") {
                setTargetImage(target as HTMLImageElement);
                setIsMediaPickerOpen(true);
            }
        };

        const currentEditor = editorRef.current;
        if (currentEditor) {
            currentEditor.addEventListener("click", handleClick);
        }

        return () => {
            if (currentEditor) {
                currentEditor.removeEventListener("click", handleClick);
            }
        };
    }, []);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(sanitizeHtml(editorRef.current.innerHTML));
        }
    };

    const execCommand = (command: string, value: string = "") => {
        document.execCommand(command, false, value);
        handleInput();
    };

    const setBlock = (tag: "p" | "h2" | "h3" | "h4") => execCommand("formatBlock", tag);
    const setLink = () => {
        const url = prompt("Enter link URL:");
        if (url) execCommand("createLink", url);
    };

    const insertImage = () => {
        setTargetImage(null);
        setIsMediaPickerOpen(true);
    };

    const handleMediaSelect = (urls: string[]) => {
        if (urls.length > 0) {
            const url = urls[0];
            if (targetImage) {
                // Replacing existing image
                targetImage.src = url;
                targetImage.alt = "Article image";
                handleInput();
            } else {
                // Inserting new image
                const imgHtml = `<img src="${url}" alt="Article image" />`;
                execCommand("insertHTML", imgHtml);
            }
        }
        setIsMediaPickerOpen(false);
        setTargetImage(null);
    };

    const insertFAQ = () => {
        const faqHtml = `<details><summary>What is your frequently asked question?</summary><div><p>Type the detailed answer to the question right here.</p></div></details><p><br></p>`;
        execCommand("insertHTML", faqHtml);
    };

    return (
        <div className="space-y-2">
            {label && <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">{label}</label>}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-nb-green/20 focus-within:border-nb-green transition-all">
                <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-100 bg-slate-50">
                    <button type="button" onClick={() => execCommand("bold")} className="p-1.5 hover:bg-white rounded-md text-slate-600 font-bold w-8 h-8 flex items-center justify-center">B</button>
                    <button type="button" onClick={() => execCommand("italic")} className="p-1.5 hover:bg-white rounded-md text-slate-600 italic w-8 h-8 flex items-center justify-center">I</button>
                    <button type="button" onClick={() => execCommand("insertUnorderedList")} className="p-1.5 hover:bg-white rounded-md text-slate-600 w-8 h-8 flex items-center justify-center text-lg">•</button>
                    <button type="button" onClick={() => execCommand("insertOrderedList")} className="p-1.5 hover:bg-white rounded-md text-slate-600 w-8 h-8 flex items-center justify-center text-sm font-bold">1.</button>
                    <button type="button" onClick={setLink} className="p-1.5 hover:bg-white rounded-md text-slate-600 w-8 h-8 flex items-center justify-center">🔗</button>
                    
                    <div className="w-px h-4 bg-slate-200 mx-1" />
                    
                    <button type="button" onClick={() => setBlock("h2")} className="p-1.5 hover:bg-white rounded-md text-slate-600 font-bold text-[10px] w-8 h-8 flex items-center justify-center">H2</button>
                    <button type="button" onClick={() => setBlock("h3")} className="p-1.5 hover:bg-white rounded-md text-slate-600 font-bold text-[10px] w-8 h-8 flex items-center justify-center">H3</button>
                    <button type="button" onClick={() => execCommand("formatBlock", "blockquote")} className="p-1.5 hover:bg-white rounded-md text-slate-600 w-8 h-8 flex items-center justify-center">❝</button>
                    
                    <div className="w-px h-4 bg-slate-200 mx-1" />

                    <button type="button" onClick={insertImage} className="p-1.5 hover:bg-white rounded-md text-slate-600 text-xs font-bold px-2 flex items-center border border-slate-200 bg-white shadow-sm ml-1" title="Insert Image Library">
                        🖼️ Add Image
                    </button>
                    <button type="button" onClick={insertFAQ} className="p-1.5 hover:bg-white rounded-md text-slate-600 text-xs font-bold px-2 flex items-center border border-slate-200 bg-white shadow-sm ml-1" title="Insert FAQ Accordion">
                        ❓ Add FAQ
                    </button>
                </div>
                <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleInput}
                    onPaste={() => setTimeout(handleInput, 0)}
                    className="p-4 min-h-[400px] outline-none max-w-none text-slate-700 font-medium whitespace-pre-wrap prose prose-sm sm:prose-base"
                />
            </div>

            <MediaPickerModal 
                isOpen={isMediaPickerOpen}
                onClose={() => {
                    setIsMediaPickerOpen(false);
                    setTargetImage(null);
                }}
                onSelect={handleMediaSelect}
                selectedIds={[]}
            />
        </div>
    );
};
