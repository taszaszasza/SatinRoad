import { useEffect, useState } from "react";
import { Api, type ReceiptDto, Role, type UserDto } from "../../Api.ts";
import { EditUserWindow } from "@/components/EditUserWindow.tsx";
import { Window } from "@/components/Window.tsx";

const MyApi = new Api();

interface MyProfileTabProps {
    currentUser: UserDto;
    onProfileUpdated: () => void;
}

export function MyProfileTab({ currentUser, onProfileUpdated }: MyProfileTabProps) {
    const [isEditing, setIsEditing] = useState(false);
    const isAdmin = currentUser.role === Role.Admin;
    const [receipts, setReceipts] = useState<ReceiptDto[]>([]);
    const [loadingReceipts, setLoadingReceipts] = useState(false);
    const [receiptError, setReceiptError] = useState<string | null>(null);

    const userId = currentUser.userId ?? (currentUser as any).UserId;

    useEffect(() => {
        if (!userId) return;
        setLoadingReceipts(true);
        setReceiptError(null);

        MyApi.getReceiptsByUserId
            .dealGetReceiptsByUserId({ id: userId })
            .then((res: any) => {
                setReceipts(res.data ?? []);
            })
            .catch((err: any) => {
                setReceiptError(err?.error?.title || "Failed to load transaction ledger.");
            })
            .finally(() => {
                setLoadingReceipts(false);
            });
    }, [userId]);

    return (
        <div style={{ maxWidth: "760px", margin: "24px auto 0 auto", width: "100%", padding: "0 16px" }}>
            {/* Top Centered ID Card */}
            <div style={{ maxWidth: "480px", margin: "0 auto" }}>
                <Window title="ID Card">
                    <div
                        className="text-center"
                        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}
                    >
                        <div className="user-card-avatar" style={{ width: "80px", height: "80px", fontSize: "2rem" }}>
                            {currentUser.avatarUrl ? (
                                <img
                                    src={currentUser.avatarUrl}
                                    alt={currentUser.userName}
                                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                    }}
                                />
                            ) : (
                                currentUser.userName?.charAt(0).toUpperCase() || "?"
                            )}
                        </div>

                        <h2 style={{ margin: "4px 0 0 0" }}>@{currentUser.userName}</h2>

                        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                            <span className={`badge-role ${isAdmin ? "badge-admin" : "badge-user"}`}>
                                {isAdmin ? "Admin" : "User"}
                            </span>
                            <span className={`badge-status ${currentUser.isBanned ? "status-banned" : "status-active"}`}>
                                {currentUser.isBanned ? "Banned" : "Active"}
                            </span>
                        </div>

                        <button
                            type="button"
                            className="y2k-btn y2k-btn-block"
                            style={{ marginTop: "12px" }}
                            onClick={() => setIsEditing(true)}
                        >
                            Edit Your Profile
                        </button>
                    </div>
                </Window>
            </div>

            {/* Wide Order Ledger Cards */}
            <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
                <span className="card-subtitle">Order Ledger</span>

                {loadingReceipts && (
                    <div className="text-center" style={{ padding: "16px" }}>
                        <span className="card-subtitle">Loading receipts...</span>
                    </div>
                )}

                {receiptError && (
                    <div className="error-container">
                        <span className="badge-status status-banned">{receiptError}</span>
                    </div>
                )}

                {!loadingReceipts && receipts.length === 0 && (
                    <div className="y2k-generic-card" style={{ justifyContent: "center", textAlign: "center" }}>
                        <span className="card-subtitle">No transactions recorded.</span>
                    </div>
                )}

                {receipts.map((rcpt: any, index) => {
                    const receiptId = rcpt.receiptId ?? rcpt.ReceiptId ?? index;
                    const listingName = rcpt.listingName ?? rcpt.ListingName ?? "Classified Item";
                    const price = rcpt.price ?? rcpt.Price ?? 0;
                    const buyerId = rcpt.buyerId ?? rcpt.BuyerId;
                    const img = rcpt.imageUrl ?? rcpt.ImageUrl;
                    const counterparty = (rcpt.sellerName ?? rcpt.SellerName) || (rcpt.buyerName ?? rcpt.BuyerName);
                    const isBuyer = buyerId === userId;

                    return (
                        <div key={receiptId} className="y2k-generic-card" style={{ width: "100%" }}>
                            {/* Media Slot Matching ShoppingTab */}
                            <div className="card-media">
                                {img ? (
                                    <img
                                        src={img}
                                        alt={listingName}
                                        className="user-card-avatar"
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                        }}
                                    />
                                ) : (
                                    <div className="user-card-avatar">📦</div>
                                )}
                            </div>

                            {/* Card Body */}
                            <div className="card-body">
                                <div className="card-header-row">
                                    <div
                                        className="card-title-group"
                                        style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}
                                    >
                                        <span className="card-title">{listingName}</span>

                                        <span className={`badge-status ${isBuyer ? "status-active" : "badge-admin"}`}>
                                            {isBuyer ? "BOUGHT" : "SOLD"}
                                        </span>

                                        <span className="badge-role badge-admin">${Number(price).toFixed(2)}</span>
                                    </div>
                                </div>

                                {counterparty && (
                                    <span className="card-subtitle">
                                        {isBuyer ? `Seller: @${counterparty}` : `Buyer: @${counterparty}`}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {isEditing && (
                <EditUserWindow
                    user={currentUser}
                    canEditRole={false}
                    onClose={() => setIsEditing(false)}
                    onSuccess={() => {
                        setIsEditing(false);
                        onProfileUpdated();
                    }}
                />
            )}
        </div>
    );
}