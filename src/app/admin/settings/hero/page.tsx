"use client";

import { useState } from "react";
import Link from "next/link";
import { Upload, X, Save, ArrowLeft, Trash2, MoveUp, MoveDown, Plus } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";

export default function HeroSettingsPage() {
    const slides = useQuery(api.hero.listAll);
    const createSlide = useMutation(api.hero.create);
    const updateSlide = useMutation(api.hero.update);
    const removeSlide = useMutation(api.hero.remove);

    const generateUploadUrl = useMutation(api.files.generateUploadUrl);

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        ctaText: "SHOP NOW",
        ctaLink: "/collections",
        active: true,
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState("");

    const resetForm = () => {
        setFormData({
            title: "",
            subtitle: "",
            ctaText: "SHOP NOW",
            ctaLink: "/collections",
            active: true,
        });
        setImageFile(null);
        setImagePreview("");
        setIsEditing(false);
        setEditingId(null);
    };

    const handleEdit = (slide: any) => {
        setFormData({
            title: slide.title,
            subtitle: slide.subtitle,
            ctaText: slide.ctaText,
            ctaLink: slide.ctaLink,
            active: slide.active,
        });
        setImagePreview(slide.imageUrl || "");
        setEditingId(slide._id);
        setIsEditing(true);
    };

    const handleDelete = async (id: Id<"heroSlides">) => {
        if (!confirm("Are you sure you want to delete this slide?")) return;
        await removeSlide({ id });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let imageStorageId: Id<"_storage"> | undefined;

            // Upload image if new file selected
            if (imageFile) {
                const postUrl = await generateUploadUrl();
                const result = await fetch(postUrl, {
                    method: "POST",
                    headers: { "Content-Type": imageFile.type },
                    body: imageFile,
                });
                const { storageId } = await result.json();
                imageStorageId = storageId;
            }

            if (editingId) {
                // Update existing
                await updateSlide({
                    id: editingId as Id<"heroSlides">,
                    ...formData,
                    imageStorageId: imageStorageId, // Only update if new image uploaded
                });
            } else {
                // Create new
                if (!imageStorageId && !imageFile) {
                    alert("Please upload an image for the new slide");
                    setIsLoading(false);
                    return;
                }

                if (imageStorageId) {
                    await createSlide({
                        ...formData,
                        imageStorageId: imageStorageId!,
                    });
                }
            }

            resetForm();
        } catch (error) {
            console.error("Failed to save slide:", error);
            alert("Failed to save slide");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/settings" className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Hero Slider</h1>
                    <p className="text-slate-400 mt-1">Manage homepage carousel slides</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Panel */}
                <div className="lg:col-span-1">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sticky top-24">
                        <h2 className="text-lg font-bold text-white mb-6">
                            {isEditing ? "Edit Slide" : "Add New Slide"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Image</label>
                                <div className="relative">
                                    {imagePreview ? (
                                        <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-700">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => { setImageFile(null); setImagePreview(""); }}
                                                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70 text-white"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:border-emerald-500 hover:bg-slate-800/50 transition-colors">
                                            <Upload className="w-8 h-8 text-slate-500 mb-2" />
                                            <span className="text-sm text-slate-500">Click to upload</span>
                                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                        </label>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                                    placeholder="e.g. SUMMER COLLECTION"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Subtitle</label>
                                <input
                                    type="text"
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                                    placeholder="e.g. Elevate your style"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Button Text</label>
                                    <input
                                        type="text"
                                        value={formData.ctaText}
                                        onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Button Link</label>
                                    <input
                                        type="text"
                                        value={formData.ctaLink}
                                        onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                                        required
                                    />
                                </div>
                            </div>

                            <label className="flex items-center gap-3 cursor-pointer py-2">
                                <input
                                    type="checkbox"
                                    checked={formData.active}
                                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                    className="w-5 h-5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-800"
                                />
                                <span className="text-slate-300">Active</span>
                            </label>

                            <div className="flex gap-3 pt-4">
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="flex-1 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 font-medium"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-400 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            {isEditing ? "Update Slide" : "Save Slide"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* List Panel */}
                <div className="lg:col-span-2 space-y-4">
                    {slides === undefined ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500 mx-auto" />
                        </div>
                    ) : slides.length === 0 ? (
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-12 text-center">
                            <p className="text-slate-400 mb-4">No slides created yet.</p>
                            <p className="text-sm text-slate-500">Add your first slide using the form.</p>
                        </div>
                    ) : (
                        slides.map((slide) => (
                            <div
                                key={slide._id}
                                className={`bg-slate-900 border ${slide.active ? 'border-slate-800' : 'border-red-900/30 bg-red-900/5'} rounded-xl p-4 flex gap-4 items-center group`}
                            >
                                <div className="relative w-32 aspect-video bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                                    {slide.imageUrl ? (
                                        <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-600">No Image</div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-white truncate">{slide.title}</h3>
                                        {!slide.active && (
                                            <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-400 border border-red-500/30">Inactive</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-400 truncate">{slide.subtitle}</p>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                        <span>Link: {slide.ctaLink}</span>
                                        <span>Order: {slide.order}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(slide)}
                                        className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                                        title="Edit"
                                    >
                                        <EditIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(slide._id)}
                                        className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function EditIcon({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
    )
}
