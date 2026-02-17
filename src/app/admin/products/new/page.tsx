"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, X, Package, DollarSign } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { formatPrice } from "@/lib/currency";

const categories = ["shirts", "bottoms", "jackets", "t-shirts", "accessories"];
const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const availableColors = ["Black", "White", "Red", "Blue", "Green", "Navy", "Gray", "Brown", "Beige"];

export default function AddProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [hoverImageFile, setHoverImageFile] = useState<File | null>(null);
  const [hoverImagePreview, setHoverImagePreview] = useState<string>("");

  const createProduct = useMutation(api.products.create);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      let imageStorageId = undefined;
      let hoverImageStorageId = undefined;

      // Upload main image to Convex storage
      if (imageFile) {
        imageStorageId = await uploadFile(imageFile);
      }

      // Upload hover image to Convex storage
      if (hoverImageFile) {
        hoverImageStorageId = await uploadFile(hoverImageFile);
      }

      // Create product via Convex mutation
      await createProduct({
        name: formData.name,
        description: formData.description || undefined,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        discount: formData.discount ? parseInt(formData.discount) : undefined,
        category: formData.category,
        imageStorageId,
        hoverImageStorageId,
        sizes: formData.sizes.length > 0 ? formData.sizes : undefined,
        colors: formData.colors.length > 0 ? formData.colors : undefined,
        stock: parseInt(formData.stock),
        featured: formData.featured,
        soldOut: formData.soldOut,
      });

      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add product");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Add New Product</h1>
          <p className="text-sm text-[var(--text-secondary)]">Add a new item to your catalog</p>
        </div>
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
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
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
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                  placeholder="50"
                />
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

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.soldOut}
                onChange={(e) => setFormData({ ...formData, soldOut: e.target.checked })}
                className="w-5 h-5 accent-[var(--accent)]"
              />
              <span>Sold Out</span>
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
                <Package className="w-5 h-5" />
                Add Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
