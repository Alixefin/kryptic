"use client";

import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Folder, X, Save, Check, Ban, Upload } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";

export default function AdminCategoriesPage() {
    const categories = useQuery(api.categories.listAll);
    const createCategory = useMutation(api.categories.create);
    const updateCategory = useMutation(api.categories.update);
    const deleteCategory = useMutation(api.categories.remove);
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);

    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<Id<"categories"> | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        active: true,
    });

    const resetForm = () => {
        setFormData({ name: "", slug: "", description: "", active: true });
        setImageFile(null);
        setImagePreview("");
        setEditingId(null);
        setError("");
        setIsModalOpen(false);
    };

    const handleEdit = (category: any) => {
        setFormData({
            name: category.name,
            slug: category.slug,
            description: category.description || "",
            active: category.active,
        });
        setImagePreview(category.imageUrl || "");
        setEditingId(category._id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: Id<"categories">) => {
        if (!confirm("Are you sure? This will not delete products in this category along with it.")) return;
        try {
            await deleteCategory({ id });
        } catch (err) {
            alert("Failed to delete category");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            let imageStorageId = undefined;
            if (imageFile) {
                const uploadUrl = await generateUploadUrl();
                const result = await fetch(uploadUrl, {
                    method: "POST",
                    headers: { "Content-Type": imageFile.type },
                    body: imageFile,
                });
                const { storageId } = await result.json();
                imageStorageId = storageId;
            }

            if (editingId) {
                await updateCategory({
                    id: editingId,
                    name: formData.name,
                    slug: formData.slug,
                    description: formData.description || undefined,
                    imageStorageId,
                    active: formData.active,
                });
            } else {
                await createCategory({
                    name: formData.name,
                    slug: formData.slug,
                    description: formData.description || undefined,
                    imageStorageId,
                    active: formData.active,
                });
            }
            resetForm();
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Auto-generate slug from name
    const handleNameChange = (val: string) => {
        setFormData((prev) => ({
            ...prev,
            name: val,
            slug: !editingId ? val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : prev.slug,
        }));
    };

    const filteredCategories = (categories || []).filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (categories === undefined) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Categories</h1>
                    <p className="text-slate-400 mt-1">
                        Manage product categories ({(categories || []).length} total)
                    </p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Category
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
            </div>

            {/* Table */}
            <div className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-700">
                            <th className="text-left p-4 text-sm font-medium text-slate-400">Name</th>
                            <th className="text-left p-4 text-sm font-medium text-slate-400">Slug</th>
                            <th className="text-left p-4 text-sm font-medium text-slate-400">Description</th>
                            <th className="text-left p-4 text-sm font-medium text-slate-400">Status</th>
                            <th className="text-right p-4 text-sm font-medium text-slate-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCategories.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-400">No categories found</td>
                            </tr>
                        ) : filteredCategories.map((cat) => (
                            <tr key={cat._id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-slate-700 overflow-hidden flex-shrink-0">
                                            {cat.imageUrl ? (
                                                <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <Folder className="w-5 h-5 text-slate-500 m-auto mt-2.5" />
                                            )}
                                        </div>
                                        <span className="font-medium text-white">{cat.name}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-slate-400">{cat.slug}</td>
                                <td className="p-4 text-slate-400 truncate max-w-xs">{cat.description || "-"}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs border ${cat.active ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-slate-700 text-slate-400 border-slate-600"
                                        }`}>
                                        {cat.active ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleEdit(cat)}
                                            className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat._id)}
                                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-slate-400 hover:text-red-400"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {
                isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg shadow-2xl">
                            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white">
                                    {editingId ? "Edit Category" : "Add Category"}
                                </h2>
                                <button onClick={resetForm} className="text-slate-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                {error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-slate-300">Category Image</label>
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-20 h-20 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center overflow-hidden">
                                            {imagePreview ? (
                                                <>
                                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => { setImageFile(null); setImagePreview(""); }}
                                                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="w-6 h-6 text-white" />
                                                    </button>
                                                </>
                                            ) : (
                                                <Upload className="w-8 h-8 text-slate-500" />
                                            )}
                                        </div>
                                        <label className="btn-secondary cursor-pointer">
                                            Upload Image
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setImageFile(file);
                                                        setImagePreview(URL.createObjectURL(file));
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-slate-300">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => handleNameChange(e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-emerald-500 outline-none"
                                        placeholder="e.g. T-Shirts"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-slate-300">Slug</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-emerald-500 outline-none font-mono text-sm"
                                        placeholder="e.g. t-shirts"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-slate-300">Description</label>
                                    <textarea
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-emerald-500 outline-none resize-none"
                                        placeholder="Optional description..."
                                    />
                                </div>

                                <div className="flex items-center gap-3">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.active}
                                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                            className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900"
                                        />
                                        <span className="text-white">Active</span>
                                    </label>
                                    <p className="text-xs text-slate-500">
                                        Inactive categories are hidden from the store.
                                    </p>
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {isSubmitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                        {editingId ? "Save Changes" : "Create Category"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
