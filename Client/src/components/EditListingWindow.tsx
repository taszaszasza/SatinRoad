import { useEffect, useState } from "react";
import { Window } from "@/components/Window.tsx";
import { Api, type ListingDto } from "../../Api.ts";
import type { GetListingDto } from "@/views/ShoppingTab.tsx";

const MyApi = new Api();

export interface CategoryDto {
  categoryId?: number;
  categoryName?: string;
}

interface EditListingWindowProps {
  listing?: GetListingDto | ListingDto | null;
  ownerId?: number;
  categories?: { id: number; name: string }[];
  onClose: () => void;
  onSuccess: () => void;
}

export function EditListingWindow({
                                    listing,
                                    ownerId,
                                    categories: passedCategories = [],
                                    onClose,
                                    onSuccess,
                                  }: EditListingWindowProps) {
  const isEditing = Boolean(listing);

  const [listingName, setListingName] = useState(listing?.listingName ?? "");
  const [listingDescription, setListingDescription] = useState(listing?.listingDescription ?? "");
  const [price, setPrice] = useState(listing?.price != null ? String(listing.price) : "");
  const [imageUrl, setImageUrl] = useState(listing?.imageUrl ?? "");

  const [availableCategories, setAvailableCategories] = useState<{ id: number; name: string }[]>(
      passedCategories
  );
  const [categoryId, setCategoryId] = useState<number>(
      listing?.categoryId ?? passedCategories[0]?.id ?? 1
  );
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCategoriesLoading(true);

    MyApi.getCategories.categoryGetCategories()
        .then((res: any) => {
          const rawList = res.data ?? [];
          const formatted = rawList.map((cat: any) => ({
            id: cat.categoryId ?? cat.CategoryId,
            name: cat.categoryName ?? cat.CategoryName ?? "Unnamed",
          }));

          setAvailableCategories(formatted);

          // If creating new item and no category selected yet, default to first available
          if (!listing && formatted.length > 0) {
            setCategoryId(formatted[0].id);
          }
        })
        .catch((err: any) => {
          console.error("Failed to load category roster:", err);
        })
        .finally(() => {
          setCategoriesLoading(false);
        });
  }, [listing]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setError("Please enter a valid price.");
      return;
    }

    if (!listingName.trim()) {
      setError("Item title is required.");
      return;
    }

    setLoading(true);

    const cleanImageUrl = imageUrl.trim() || undefined;
    const cleanDescription = listingDescription.trim() || undefined;

    if (isEditing && listing && listing.listingId != null) {
      MyApi.updateListing.listingUpdateListing({
        id: listing.listingId,
        ListingName: listingName.trim(),
        ListingDescription: cleanDescription,
        Price: parsedPrice,
        ImageUrl: cleanImageUrl,
        CategoryId: Number(categoryId),
      })
          .then(() => {
            setLoading(false);
            onSuccess();
          })
          .catch((err: any) => {
            setLoading(false);
            setError(err?.error?.title || "Failed to update item.");
          });
    } else {
      MyApi.createListing.listingCreateListing({
        ListingName: listingName.trim(),
        ListingDescription: cleanDescription,
        Price: parsedPrice,
        ImageUrl: cleanImageUrl,
        CategoryId: Number(categoryId),
        OwnerId: ownerId,
      })
          .then(() => {
            setLoading(false);
            onSuccess();
          })
          .catch((err: any) => {
            setLoading(false);
            setError(err?.error?.title || "Failed to create item.");
          });
    }
  }

  return (
      <div className="y2k-modal-backdrop" onClick={onClose}>
        <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: "460px" }}>
          <Window
              title={isEditing ? `Edit Item — #${listing?.listingId}` : "Create New Contraband"}
              onClose={onClose}
          >
            {error && (
                <div className="error-container" style={{ marginBottom: "12px" }}>
                  <span className="badge-status status-banned">{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="y2k-form">
              {/* Title / Name */}
              <div className="form-group">
                <label className="card-subtitle">Item Name</label>
                <input
                    type="text"
                    className="y2k-input"
                    placeholder="e.g., Cyberdeck Mk-IV"
                    value={listingName}
                    onChange={(e) => setListingName(e.target.value)}
                    required
                />
              </div>

              {/* Price */}
              <div className="form-group">
                <label className="card-subtitle">Price ($)</label>
                <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="y2k-input"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
              </div>

              {/* Category Dropdown */}
              <div className="form-group">
                <label className="card-subtitle">Category Sector</label>
                <select
                    className="y2k-input"
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    disabled={categoriesLoading}
                    required
                >
                  {categoriesLoading && <option value="">Loading sector classifications...</option>}
                  {!categoriesLoading && availableCategories.length === 0 && (
                      <option value="">No sectors found</option>
                  )}
                  {availableCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                  ))}
                </select>
              </div>

              {/* Image URL */}
              <div className="form-group">
                <label className="card-subtitle">Image URL</label>
                <input
                    type="url"
                    className="y2k-input"
                    placeholder="https://..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="card-subtitle">Description</label>
                <textarea
                    className="y2k-input"
                    rows={3}
                    placeholder="Classified item specifications..."
                    value={listingDescription}
                    onChange={(e) => setListingDescription(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                <button
                    type="button"
                    className="y2k-btn y2k-btn-secondary"
                    style={{ flex: 1 }}
                    onClick={onClose}
                    disabled={loading}
                >
                  Cancel
                </button>
                <button
                    type="submit"
                    className="y2k-btn"
                    style={{ flex: 2 }}
                    disabled={loading || categoriesLoading}
                >
                  {loading ? "Saving..." : isEditing ? "Save Changes" : "List Item"}
                </button>
              </div>
            </form>
          </Window>
        </div>
      </div>
  );
}