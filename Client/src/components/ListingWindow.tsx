import type { GetListingDto } from "@/views/ShoppingTab.tsx";
import { Window } from "@/components/Window.tsx";
import type {ListingDto} from "../../Api.ts";

interface ListingWindowProps {
  listing: GetListingDto;
  onClose: () => void;
  onBuy?: (listingId: number) => void;
  onEdit?: (listing: GetListingDto | ListingDto) => void;
  isOwner: boolean;
}

export function ListingWindow({ listing, onClose, onBuy, onEdit, isOwner }: ListingWindowProps) {
  const item: any = listing;
  const id = item.listingId ?? item.ListingId;
  const title = item.listingName ?? item.ListingName ?? "Untitled Item";
  const rawPrice = item.price ?? item.Price;
  const price = rawPrice != null ? Number(rawPrice).toFixed(2) : "0.00";
  const owner = item.ownerName ?? item.OwnerName ?? "Unknown";
  const img = item.imageUrl ?? item.ImageUrl;
  const category = item.categoryName ?? item.CategoryName;
  const description =
    item.listingDescription ?? item.ListingDescription ?? "No classified data provided.";

  return (
    <div className="y2k-modal-backdrop" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <Window title={`Item Data — #${id}`} onClose={onClose}>
          <div className="text-center" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            {/* Listing Image */}
            <div className="product-thumb product-thumb-placeholder" style={{ width: "120px", height: "120px" }}>
              {img ? (
                <img
                  src={img}
                  alt={title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                "📦"
              )}
            </div>

            {/* Title & Tags */}
            <h2 style={{ margin: "4px 0 0 0" }}>{title}</h2>

            <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
              {category && <span className="y2k-badge">{category}</span>}
              <span className="badge-role badge-admin">${price}</span>
              <span className="badge-role badge-user">@{owner}</span>
            </div>

            {/* Description */}
            <p className="card-subtitle" style={{ textAlign: "left", width: "100%", marginTop: "6px" }}>
              {description}
            </p>

            {/* Buttons */}
            <div style={{ width: "100%", display: "flex", gap: "10px", marginTop: "10px" }}>
              <button
                type="button"
                className="y2k-btn y2k-btn-secondary"
                style={{ flex: 1 }}
                onClick={onClose}
              >
                Close
              </button>
              {!isOwner && (
              <button
                type="button"
                className="y2k-btn"
                style={{ flex: 2 }}
                onClick={() => {
                  if (onBuy) onBuy(id);
                  else alert(`Purchasing listing #${id}!`);
                }}
              >
                Buy Now (${price})
              </button> )}
              {isOwner && (
                  <button
                      type="button"
                      className="y2k-btn"
                      style={{ flex: 2 }}
                      onClick={() => {
                        if (onEdit) onEdit(listing);
                        else alert(`Purchasing listing #${id}!`);
                      }}
                  >
                    Update Listing
                  </button> )}
            </div>
          </div>
        </Window>
      </div>
    </div>
  );
}