import {useEffect, useMemo, useState} from "react";
import {Api, type ListingDto, Role, type UserDto} from "../../Api.ts";
import {SearchBar} from "@/components/SearchBar.tsx";
import {ListingWindow} from "@/components/ListingWindow.tsx";
import {EditListingWindow} from "@/components/EditListingWindow.tsx";
import {BuyConfirmationWindow} from "@/components/BuyConfirmationWindow.tsx"; // adjust path if needed

const MyApi = new Api();

export interface GetListingDto {
    listingId: number;
    listingName: string;
    listingDescription?: string;
    price: number;
    imageUrl?: string;
    categoryId: number;
    categoryName: string;
    ownerId: number;
    ownerName: string;
    isActive?: boolean;
}

interface ShoppingTabProps {
    currentUser: UserDto;
    isMyShop: boolean;
}

export function ShoppingTab({currentUser, isMyShop}: ShoppingTabProps) {
    const [products, setProducts] = useState<GetListingDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [listing, setListing] = useState<GetListingDto | null>(null);
    const [updateListing, setUpdateListing] = useState<GetListingDto |ListingDto | null>(null);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [buyingListing, setBuyingListing] = useState<GetListingDto | null>(null);


    function loadProducts() {
        setLoading(true);
        setError(null);
        
        if(!isMyShop) {

            MyApi.getAllListings.listingGetAllListings()
                .then((res: any) => {
                    setLoading(false);
                    setProducts(res.data ?? []);
                })
                .catch((err: any) => {
                    setLoading(false);
                    setError(err?.error?.title || "Failed to load catalog items.");
                });
        } else {
            MyApi.getListingByUserId.listingGetListingByUserId({id: currentUser.userId})
                .then((res: any) => {
                    setLoading(false);
                    setProducts(res.data ?? []);
                }).catch((err: any) => {
                    setLoading(false);
                    setError(err?.error?.title || "Failed to load catalog items.");
            })
                
        }
    }
    
    function deleteListing(listingId: number) {
        MyApi.deleteListing.listingDeleteListing({id: listingId})
        .then(() => { loadProducts();})
    }

    useEffect(() => {
        loadProducts();
    }, [isMyShop, currentUser.userId]);
    

    const categories = useMemo(() => {
        const unique = new Set<string>();
        products.forEach((p: any) => {
            const name = p.categoryName ?? p.CategoryName;
            if (name) unique.add(name);
        });
        return ["All", ...Array.from(unique)];
    }, [products]);

    // filters by query and category at the same time
    const filteredProducts = useMemo(() => {
        return products.filter((item: any) => {
            const title = (item.listingName ?? item.ListingName ?? "").toLowerCase();
            const owner = (item.ownerName ?? item.OwnerName ?? "").toLowerCase();
            const category = item.categoryName ?? item.CategoryName ?? "";
            const q = searchQuery.toLowerCase().trim();

            const matchesSearch = !q || title.includes(q) || owner.includes(q);
            const matchesCategory =
                selectedCategory === "All" || category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, selectedCategory]);

    return (
        <div>
            <div className="toolbar-row">
            {/* Existing Search Bar */}
            <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search listings by title or merchant..."
            />

            <button
                type="button"
                className="y2k-btn"
                onClick={() => setIsCreating(true)}
            >
                +
            </button>
                
            </div>

            {/* Category Pills using existing role-toggle styles */}
            {categories.length > 1 && (
                <div className="role-toggle-container">
                    <div className="role-toggle">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                className={selectedCategory === cat ? "active" : ""}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Loading & Error States */}
            {loading && (
                <div className="text-center">
                    <span className="status-badge status-loading">Decrypting market data...</span>
                </div>
            )}

            {error && (
                <div className="error-container">
                    <span className="badge-status status-banned">{error}</span>
                </div>
            )}

            {!loading && !error && filteredProducts.length === 0 && (
                <div className="no-users-label">
                    {products.length === 0
                        ? "No items in the catalog yet."
                        : "No listings match your search or filter."}
                </div>
            )}

            {/* List rendered with existing Generic Card */}
            {filteredProducts.map((item: any, index) => {
                const id = item.listingId ?? item.ListingId ?? index;
                const title = item.listingName ?? item.ListingName ?? "Untitled Item";
                const rawPrice = item.price ?? item.Price;
                const price = rawPrice != null ? Number(rawPrice).toFixed(2) : "0.00";
                const owner = item.ownerName ?? item.OwnerName ?? "Unknown";
                const img = item.imageUrl ?? item.ImageUrl;
                const category = item.categoryName ?? item.CategoryName;

                return (
                    <div key={id} className="y2k-generic-card">
                        {/* Media Slot */}
                        <div className="card-media">
                            {img ? (
                                <img
                                    src={img}
                                    alt={title}
                                    className="user-card-avatar"
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                    }}
                                />
                            ) : (
                                <div className="user-card-avatar">📦</div>
                            )}
                        </div>

                        {/* Content Slot */}
                        <div className="card-body">
                            <div className="card-header-row">
                                <div className="card-title-group">
                                    <span className="card-title">{title}</span>
                                    {category && <span className="y2k-badge">{category}</span>}
                                    <span className="badge-role badge-admin">${price}</span>
                                </div>
                            </div>
                            <span className="card-subtitle">Merchant: @{owner}</span>
                        </div>

                        {/* Actions Slot */}
                        <div className="card-actions">
                            {currentUser.role === Role.Admin &&(
                            <button
                                type="button"
                                className="y2k-btn-action"
                                
                                onClick={() => {
                                    deleteListing(item.listingId)
                                }}
                            >
                                Delete
                            </button> )}
                            <button
                                type="button"
                                className="y2k-btn-action btn-ban"
                                onClick={() => setListing(item)}
                            >
                                Open listing
                            </button>
                        </div>
                    </div>
                   
                );
            })}
            {listing && (
                <ListingWindow
                    listing={listing}
                    onClose={() => setListing(null)}
                    onBuy={() => {
                        setBuyingListing(listing);
                        setListing(null);
                    }} 
                    onEdit={(listingForEdit) =>{
                        setListing(null);
                        setUpdateListing(listingForEdit);
                    }}
                isOwner={isMyShop || (listing.ownerId === currentUser.userId)}/> )}
            {updateListing && (
                <EditListingWindow
                    listing={updateListing}
                    ownerId={currentUser.userId ?? 0}
                    onClose={() => setUpdateListing(null)}
                    onSuccess={() => {
                        setUpdateListing(null);
                        loadProducts(); }} /> ) }
            {isCreating && (
                <EditListingWindow
                    listing={updateListing}
                    ownerId={currentUser.userId ?? 0}
                    onClose={() => setIsCreating(false)}
                    onSuccess={() => {
                        setIsCreating(false);
                        loadProducts(); }} /> ) }
            {buyingListing && (
                <BuyConfirmationWindow
                    listing={buyingListing}
                    buyerId={currentUser.userId}
                    onClose={() => setBuyingListing(null)}
                    onSuccess={() => {
                        setBuyingListing(null);
                        loadProducts(); // refresh catalog
                        alert("Order locked! Deal registered in the transaction ledger.");
                    }}
                />
            )}
            
        </div>
    );
}