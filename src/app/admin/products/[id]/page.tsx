"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, X, Package, DollarSign, Save, Trash2 } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { formatPrice } from "@/lib/currency";
import { Id } from "@convex/_generated/dataModel";

// const categories = ["shirts", "bottoms", "jackets", "t-shirts", "accessories"];
const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const availableColors = ["Black", "White", "Red", "Blue", "Green", "Navy", "Gray", "Brown", "Beige"];

export default function EditProductPage({ params }: { params: Promise<{ id: Id<"products"> }> }) {
    const router = useRouter();
    const { id: productId } = use(params);

    const product = useQuery(api.products.getById, { id: productId });
    const updateProduct = useMutation(api.products.update);
    const deleteProduct = useMutation(api.products.remove);
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);

    const categoriesQuery = useQuery(api.categories.listAll);
    const categories = categoriesQuery || [];

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [hoverImageFile, setHoverImageFile] = useState<File | null>(null);
    const [hoverImagePreview, setHoverImagePreview] = useState<string>("");

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        originalPrice: "",
        discount: "",
        category: "",
        sizes: [] as string[],
        colors: [] as string[],
        stock: "0",
        featured: false,
        soldOut: false,
    });

    // Pre-fill form when product data loads
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description || "",
                price: product.price.toString(),
                originalPrice: product.originalPrice?.toString() || "",
                discount: product.discount?.toString() || "",
                category: product.category,
                sizes: product.sizes || [],
                colors: product.colors || [],
                stock: product.stock.toString(),
                featured: product.featured,
                soldOut: product.soldOut,
            });
            setImagePreview(product.imageUrl || "");
            setHoverImagePreview(product.hoverImageUrl || "");
        }
    }, [product]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, isHover = false) => {
        const file = e.target.files?.[0];
        if (file) {
            if (isHover) {
                setHoverImageFile(file);
                setHoverImagePreview(URL.createObjectURL(file));
            } else {
                setImageFile(file);
                setImagePreview(URL.createObjectURL(file));
            }
        }
    };

    const handleSizeToggle = (size: string) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size]
        }));
    };

    const handleColorToggle = (color: string) => {
        setFormData(prev => ({
            ...prev,
            colors: prev.colors.includes(color)
                ? prev.colors.filter(c => c !== color)
                : [...prev.colors, color]
        }));
    };

    const uploadFile = async (file: File) => {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file,
        });
        const { storageId } = await result.json();
        return storageId;
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
        setIsDeleting(true);
        try {
            await deleteProduct({ id: productId });
            router.push("/admin/products");
        } catch (err) {
            alert("Failed to delete product");
            setIsDeleting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            let imageStorageId = undefined;
            let hoverImageStorageId = undefined;

            // Upload main image to Convex storage (only if new file selected)
            if (imageFile) {
                imageStorageId = await uploadFile(imageFile);
            }

            // Upload hover image to Convex storage (only if new file selected)
            if (hoverImageFile) {
                hoverImageStorageId = await uploadFile(hoverImageFile);
            }

            // Update product via Convex mutation
            // Update product via Convex mutation
            const price = parseFloat(formData.price);
            const stock = parseInt(formData.stock);

            if (isNaN(price)) throw new Error("Price must be a valid number");
            if (isNaN(stock)) throw new Error("Stock must be a valid number");

            await updateProduct({
                id: productId,
                name: formData.name,
                description: formData.description || undefined,
                price: price,
                originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
                discount: formData.discount ? parseInt(formData.discount) : undefined,
                category: formData.category,
                imageStorageId: imageStorageId, // Will only be set if new image
                hoverImageStorageId: hoverImageStorageId, // Will only be set if new image
                sizes: formData.sizes.length > 0 ? formData.sizes : undefined,
                colors: formData.colors.length > 0 ? formData.colors : undefined,
                stock: stock,
                featured: formData.featured,
                soldOut: formData.soldOut,
            });

            router.push("/admin/products");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update product");
            setIsSubmitting(false);
        }
    };

    if (product === undefined) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500" />
            </div>
        );
    }

    if (product === null) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-400">Product not found</p>
                <Link href="/admin/products" className="text-emerald-400 hover:text-emerald-300 mt-4 inline-block">
                    Back to products
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products" className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Edit Product</h1>
                        <p className="text-sm text-[var(--text-secondary)]">Update product details</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                    <Trash2 className="w-4 h-4" />
                    Delete Product
                </button>
            </div>

            {error && (
                <div className="bg-[var(--sale-red)]/10 border border-[var(--sale-red)] text-[var(--sale-red)] px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="bg-[var(--bg-secondary)] rounded-lg p-6 space-y-4">
                        <h2 className="font-bold flex items-center gap-2">
                            <Package className="w-5 h-5 text-[var(--accent)]" />
                            Basic Information
                        </h2>

                        <div>
                            <label className="block text-sm font-medium mb-2">Product Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                                placeholder="e.g., Classic Black Hoodie"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Description</label>
                            <textarea
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--accent)] resize-none"
                                placeholder="Describe your product..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Category *</label>
                            <select
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat.slug}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-[var(--bg-secondary)] rounded-lg p-6 space-y-4">
                        <h2 className="font-bold flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-[var(--accent)]" />
                            Pricing
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Price (₦) *</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                                    placeholder="25000"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Original Price (₦)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.originalPrice}
                                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                                    className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                                    placeholder="32000"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Discount (%)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={formData.discount}
                                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                                    className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                                    placeholder="20"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Stock Quantity</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.stock}
                                    onChange={(e) => {
                                        const stockVal = e.target.value;
                                        setFormData({
                                            ...formData,
                                            stock: stockVal,
                                            soldOut: parseInt(stockVal) === 0,
                                        });
                                    }}
                                    className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                                    placeholder="50"
                                />
                                {parseInt(formData.stock) === 0 && (
                                    <p className="text-xs text-[var(--sale-red)] mt-1">
                                        This product will be automatically marked as &quot;Out of Stock&quot;
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Variants */}
                    <div className="bg-[var(--bg-secondary)] rounded-lg p-6 space-y-4">
                        <h2 className="font-bold">Variants</h2>

                        <div>
                            <label className="block text-sm font-medium mb-2">Sizes</label>
                            <div className="flex flex-wrap gap-2">
                                {availableSizes.map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => handleSizeToggle(size)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${formData.sizes.includes(size)
                                            ? "bg-[var(--accent)] border-[var(--accent)] text-white"
                                            : "border-[var(--border-color)] hover:border-[var(--accent)]"
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Colors</label>
                            <div className="flex flex-wrap gap-2">
                                {availableColors.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => handleColorToggle(color)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${formData.colors.includes(color)
                                            ? "bg-[var(--accent)] border-[var(--accent)] text-white"
                                            : "border-[var(--border-color)] hover:border-[var(--accent)]"
                                            }`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Images */}
                    <div className="bg-[var(--bg-secondary)] rounded-lg p-6 space-y-4">
                        <h2 className="font-bold flex items-center gap-2">
                            <Upload className="w-5 h-5 text-[var(--accent)]" />
                            Product Images
                        </h2>

                        {/* Main Image */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Main Image</label>
                            <div className="relative">
                                {imagePreview ? (
                                    <div className="relative aspect-square rounded-lg overflow-hidden">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => { setImageFile(null); setImagePreview(""); }}
                                            className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70"
                                        >
                                            <X className="w-4 h-4 text-white" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-[var(--border-color)] rounded-lg cursor-pointer hover:border-[var(--accent)]">
                                        <Upload className="w-8 h-8 text-[var(--text-secondary)] mb-2" />
                                        <span className="text-sm text-[var(--text-secondary)]">Click to upload</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageChange(e)}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Hover Image */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Hover Image (Optional)</label>
                            <div className="relative">
                                {hoverImagePreview ? (
                                    <div className="relative aspect-square rounded-lg overflow-hidden">
                                        <img src={hoverImagePreview} alt="Hover Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => { setHoverImageFile(null); setHoverImagePreview(""); }}
                                            className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70"
                                        >
                                            <X className="w-4 h-4 text-white" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-[var(--border-color)] rounded-lg cursor-pointer hover:border-[var(--accent)]">
                                        <Upload className="w-8 h-8 text-[var(--text-secondary)] mb-2" />
                                        <span className="text-sm text-[var(--text-secondary)]">Click to upload</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageChange(e, true)}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="bg-[var(--bg-secondary)] rounded-lg p-6 space-y-4">
                        <h2 className="font-bold">Status</h2>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.featured}
                                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                className="w-5 h-5 accent-[var(--accent)]"
                            />
                            <span>Featured Product</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-not-allowed opacity-60">
                            <input
                                type="checkbox"
                                checked={formData.soldOut}
                                disabled
                                className="w-5 h-5 accent-[var(--accent)]"
                            />
                            <span>Out of Stock {formData.soldOut ? "(auto — stock is 0)" : "(set stock to 0 to enable)"}</span>
                        </label>
                    </div>

                    {/* Price Preview */}
                    {formData.price && (
                        <div className="bg-[var(--bg-secondary)] rounded-lg p-6">
                            <h2 className="font-bold mb-3">Price Preview</h2>
                            <p className="text-2xl font-bold">{formatPrice(parseFloat(formData.price) || 0)}</p>
                            {formData.originalPrice && (
                                <p className="text-sm text-[var(--text-secondary)] line-through">
                                    {formatPrice(parseFloat(formData.originalPrice) || 0)}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Update Product
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
