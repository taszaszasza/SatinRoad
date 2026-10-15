import { useState } from "react";
import { Window } from "@/components/Window.tsx";
import { Api, type ReceiptDto } from "../../Api.ts";
import type { GetListingDto } from "@/views/ShoppingTab.tsx";

const MyApi = new Api();

interface BuyConfirmationWindowProps {
    listing: GetListingDto;
    buyerId?: number;
    onClose: () => void;
    onSuccess: (receipt?: ReceiptDto) => void;
}

export function BuyConfirmationWindow({
                                          listing,
                                          buyerId,
                                          onClose,
                                          onSuccess,
                                      }: BuyConfirmationWindowProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const item: any = listing;
    const listingId = item.listingId ?? item.ListingId;
    const title = item.listingName ?? item.ListingName ?? "Untitled Item";
    const rawPrice = item.price ?? item.Price;
    const price = rawPrice != null ? Number(rawPrice).toFixed(2) : "0.00";
    const owner = item.ownerName ?? item.OwnerName ?? "Unknown";

    function handleConfirm() {
        if (!buyerId) {
            setError("Buyer identity unverified.");
            return;
        }

        setLoading(true);
        setError(null);

        MyApi.sellItem
            .dealSellItem({
                ListingId: listingId,
                BuyerId: buyerId,
            })
            .then((res: any) => {
                setLoading(false);
                const receipt = res.data;
                const finalPrice = receipt?.price ?? receipt?.price ?? 0;
                
                if (finalPrice < price) {
                    alert("🎉 Loyalty Discount Applied!\n\nThis was your 10th purchase with @${owner}.\nYour order was discounted by 20% to $${Number(paidPrice).toFixed(2)}!");
                }
                onSuccess(res.data);
            })
            .catch((err: any) => {
                setLoading(false);
                const message = err?.error?.title || err?.error || "Transaction route failed.";
                
                if (message.includes("police")) {
                    alert(message);
                    onClose();
                    return;
                }
                setError(err);
            });
    }

    return (
        <div className="y2k-modal-backdrop" onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: "420px" }}>
                <Window title="Initiate Transaction" onClose={onClose}>
                    {error && (
                        <div className="error-container" style={{ marginBottom: "12px" }}>
                            <span className="badge-status status-banned">{error}</span>
                        </div>
                    )}

                    <div style={{ display: "flex", flexDirection: "column", gap: "14px", textAlign: "center" }}>
                        <h3 style={{ margin: 0 }}>{title}</h3>

                        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                            <span className="badge-role badge-admin">${price}</span>
                            <span className="badge-role badge-user">Seller: @{owner}</span>
                        </div>

                        <div className="form-group" style={{ textAlign: "left" }}>
                            <label className="card-subtitle">Transfer Instructions</label>
                            <div className="y2k-input" style={{ height: "auto", whiteSpace: "normal", lineHeight: 1.5 }}>
                                Transfer the amount of <strong>${price}</strong> to <strong>@{owner}</strong>.
                                <br /><br />
                                Once the merchant receives the payment, they will ship the order.
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
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
                                type="button"
                                className="y2k-btn"
                                style={{ flex: 2 }}
                                onClick={handleConfirm}
                                disabled={loading}
                            >
                                {loading ? "Locking Deal..." : "Confirm Purchase"}
                            </button>
                        </div>
                    </div>
                </Window>
            </div>
        </div>
    );
}