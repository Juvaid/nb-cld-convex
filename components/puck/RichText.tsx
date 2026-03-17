"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { MediaPickerModal } from "../admin/MediaPickerModal";
import { Code, Eye, AlignLeft, AlignCenter, AlignRight, AlignJustify, Maximize, Smartphone, Monitor } from "lucide-react";

interface RichTextProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
}

export const RichText = ({ value, onChange, label }: RichTextProps) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
    const [targetImage, setTargetImage] = useState<HTMLImageElement | null>(null);
    const [isCodeView, setIsCodeView] = useState(false);
    const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);

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
        if (!isCodeView && editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || "";
        }
    }, [value, isCodeView]);

    // Handle clicks inside the editor to detect image selection for replacement
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === "IMG") {
                setSelectedImage(target as HTMLImageElement);
            } else {
                setSelectedImage(null);
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

    const updateImageStyle = (styles: Partial<CSSStyleDeclaration>) => {
        if (selectedImage) {
            Object.assign(selectedImage.style, styles);
            // Also manage some alignment classes for the renderer
            if (styles.float === 'left') {
                selectedImage.className = 'float-img-left';
            } else if (styles.float === 'right') {
                selectedImage.className = 'float-img-right';
            } else if (styles.display === 'block') {
                selectedImage.className = 'block-img-center';
                selectedImage.style.marginLeft = 'auto';
                selectedImage.style.marginRight = 'auto';
            } else {
                selectedImage.className = '';
            }
            handleInput();
        }
    };

    return (
        <div className="space-y-2">
            {label && <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">{label}</label>}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-nb-green/20 focus-within:border-nb-green transition-all">
                <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-100 bg-slate-50">
                    <button type="button" onClick={() => execCommand("bold")} disabled={isCodeView} title="Bold" className="p-1.5 hover:bg-white disabled:opacity-30 rounded-md text-slate-600 font-bold w-8 h-8 flex items-center justify-center">B</button>
                    <button type="button" onClick={() => execCommand("italic")} disabled={isCodeView} title="Italic" className="p-1.5 hover:bg-white disabled:opacity-30 rounded-md text-slate-600 italic w-8 h-8 flex items-center justify-center">I</button>
                    
                    <div className="w-px h-4 bg-slate-200 mx-1" />

                    <button type="button" onClick={() => execCommand("justifyLeft")} disabled={isCodeView} title="Align Left" className="p-1.5 hover:bg-white disabled:opacity-30 rounded-md text-slate-600 w-8 h-8 flex items-center justify-center"><AlignLeft size={16} /></button>
                    <button type="button" onClick={() => execCommand("justifyCenter")} disabled={isCodeView} title="Align Center" className="p-1.5 hover:bg-white disabled:opacity-30 rounded-md text-slate-600 w-8 h-8 flex items-center justify-center"><AlignCenter size={16} /></button>
                    <button type="button" onClick={() => execCommand("justifyRight")} disabled={isCodeView} title="Align Right" className="p-1.5 hover:bg-white disabled:opacity-30 rounded-md text-slate-600 w-8 h-8 flex items-center justify-center"><AlignRight size={16} /></button>
                    <button type="button" onClick={() => execCommand("justifyFull")} disabled={isCodeView} title="Justify" className="p-1.5 hover:bg-white disabled:opacity-30 rounded-md text-slate-600 w-8 h-8 flex items-center justify-center"><AlignJustify size={16} /></button>

                    <div className="w-px h-4 bg-slate-200 mx-1" />

                    <button type="button" onClick={() => execCommand("insertUnorderedList")} disabled={isCodeView} title="Bullet List" className="p-1.5 hover:bg-white disabled:opacity-30 rounded-md text-slate-600 w-8 h-8 flex items-center justify-center text-lg">•</button>
                    <button type="button" onClick={() => execCommand("insertOrderedList")} disabled={isCodeView} title="Numbered List" className="p-1.5 hover:bg-white disabled:opacity-30 rounded-md text-slate-600 w-8 h-8 flex items-center justify-center text-sm font-bold">1.</button>
                    <button type="button" onClick={setLink} disabled={isCodeView} title="Link" className="p-1.5 hover:bg-white disabled:opacity-30 rounded-md text-slate-600 w-8 h-8 flex items-center justify-center text-lg">🔗</button>

                    <div className="w-px h-4 bg-slate-200 mx-1" />

                    <button type="button" onClick={() => setBlock("h2")} disabled={isCodeView} className="p-1.5 hover:bg-white disabled:opacity-30 rounded-md text-slate-600 font-bold text-[10px] w-8 h-8 flex items-center justify-center">H2</button>
                    <button type="button" onClick={() => setBlock("h3")} disabled={isCodeView} className="p-1.5 hover:bg-white disabled:opacity-30 rounded-md text-slate-600 font-bold text-[10px] w-8 h-8 flex items-center justify-center">H3</button>
                    <button type="button" onClick={() => execCommand("formatBlock", "blockquote")} disabled={isCodeView} className="p-1.5 hover:bg-white disabled:opacity-30 rounded-md text-slate-600 w-8 h-8 flex items-center justify-center">❝</button>

                    <div className="w-px h-4 bg-slate-200 mx-1" />

                    <button type="button" onClick={insertImage} disabled={isCodeView} className="p-1.5 hover:bg-white disabled:opacity-30 rounded-md text-slate-600 text-xs font-bold px-2 flex items-center border border-slate-200 bg-white shadow-sm ml-1" title="Insert Image Library">
                        🖼️ Add Image
                    </button>
                    <button type="button" onClick={insertFAQ} disabled={isCodeView} className="p-1.5 hover:bg-white disabled:opacity-30 rounded-md text-slate-600 text-xs font-bold px-2 flex items-center border border-slate-200 bg-white shadow-sm ml-1" title="Insert FAQ Accordion">
                        ❓ Add FAQ
                    </button>

                    <div className="flex-grow" />

                    <button
                        type="button"
                        onClick={() => setIsCodeView(!isCodeView)}
                        className={`p-1.5 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 px-3 border transition-all ${isCodeView
                                ? 'bg-slate-900 border-slate-950 text-white'
                                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                            }`}
                    >
                        {isCodeView ? <Eye size={12} /> : <Code size={12} />}
                        {isCodeView ? 'Visual' : 'Code'}
                    </button>
                </div>

                {/* Image Toolbar - only shows when an image is selected */}
                {!isCodeView && selectedImage && (
                    <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-slate-100 bg-nb-green/5 animate-in fade-in slide-in-from-top-1 duration-200">
                        <span className="text-[10px] font-black uppercase tracking-widest text-nb-green mr-2">Image Setup:</span>
                        
                        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                            <button type="button" onClick={() => updateImageStyle({ float: 'left', display: 'inline', margin: '0 20px 20px 0' })} className="p-1 hover:bg-slate-100 rounded text-slate-600" title="Float Left"><AlignLeft size={14} /></button>
                            <button type="button" onClick={() => updateImageStyle({ float: 'none', display: 'block', margin: '20px auto' })} className="p-1 hover:bg-slate-100 rounded text-slate-600" title="Center"><AlignCenter size={14} /></button>
                            <button type="button" onClick={() => updateImageStyle({ float: 'right', display: 'inline', margin: '0 0 20px 20px' })} className="p-1 hover:bg-slate-100 rounded text-slate-600" title="Float Right"><AlignRight size={14} /></button>
                        </div>

                        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 ml-2">
                            <button type="button" onClick={() => updateImageStyle({ width: '25%' })} className="px-2 py-0.5 hover:bg-slate-100 rounded text-[10px] font-black text-slate-600">25%</button>
                            <button type="button" onClick={() => updateImageStyle({ width: '50%' })} className="px-2 py-0.5 hover:bg-slate-100 rounded text-[10px] font-black text-slate-600">50%</button>
                            <button type="button" onClick={() => updateImageStyle({ width: '75%' })} className="px-2 py-0.5 hover:bg-slate-100 rounded text-[10px] font-black text-slate-600">75%</button>
                            <button type="button" onClick={() => updateImageStyle({ width: '100%' })} className="px-2 py-0.5 hover:bg-slate-100 rounded text-[10px] font-black text-slate-600">100%</button>
                        </div>

                        <button 
                            type="button" 
                            onClick={() => {
                                setTargetImage(selectedImage);
                                setIsMediaPickerOpen(true);
                            }}
                            className="bg-white px-3 py-1 rounded-lg border border-slate-200 text-[10px] font-black text-nb-green hover:bg-nb-green/5 transition-colors ml-auto flex items-center gap-1.5"
                        >
                            Change Image
                        </button>
                    </div>
                )}
                {isCodeView ? (
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full p-4 min-h-[400px] outline-none bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed resize-y"
                        spellCheck={false}
                        title="HTML Code Editor"
                        placeholder="Paste your raw HTML here..."
                    />
                ) : (
                    <div
                        ref={editorRef}
                        contentEditable
                        onInput={handleInput}
                        onPaste={() => setTimeout(handleInput, 0)}
                        className="p-4 min-h-[400px] outline-none max-w-none text-slate-700 font-medium whitespace-pre-wrap prose prose-sm sm:prose-base focus:bg-slate-50/30 transition-colors"
                    />
                )}
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
