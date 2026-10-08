import { useEffect, useState } from "react";
import { Api } from "../../Api.ts";
import { Window } from "@/components/Window.tsx";

const MyApi = new Api();

export interface CategoryDto {
    categoryId?: number;
    categoryName?: string;
}

export function ManageCategoriesTab() {
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // New Category Form State
    const [newCatName, setNewCatName] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    function loadCategories() {
        setLoading(true);
        setError(null);

        MyApi.getCategories.categoryGetCategories()
            .then((res: any) => {
                setLoading(false);
                setCategories(res.data ?? []);
            })
            .catch((err: any) => {
                setLoading(false);
                setError(err?.error?.title || "Failed to decrypt category index.");
            });
    }

    function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        if (!newCatName.trim()) return;

        MyApi.createCategory.categoryCreateCategory({
            CategoryName: newCatName.trim(),
        })
            .then(() => {
                setNewCatName("");
                setIsCreating(false);
                loadCategories();
            })
            .catch((err: any) => {
                setError(err?.error?.title || "Failed to register category.");
            });
    }

    function handleDelete(id?: number) {
        if (!id) return;
        if (!confirm("Terminate this category classification?")) return;

        MyApi.deleteCategory.categoryDeleteCategory({ id })
            .then(() => loadCategories())
            .catch((err: any) => {
                setError(err?.error?.title || "Failed to delete category.");
            });
    }

    useEffect(() => {
        loadCategories();
    }, []);

    return (
        <div>
            {/* Header action */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <span className="card-subtitle"></span>
                <button
                    type="button"
                    className="y2k-btn"
                    onClick={() => setIsCreating(true)}
                >
                    + New Sector
                </button>
            </div>

            {loading && (
                <div className="text-center">
                    <span className="status-badge status-loading">Scanning registry...</span>
                </div>
            )}

            {error && (
                <div className="error-container" style={{ marginBottom: "12px" }}>
                    <span className="badge-status status-banned">{error}</span>
                </div>
            )}

            {/* Category List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {categories.map((cat, index) => {
                    const id = cat.categoryId ?? (cat as any).CategoryId ?? index;
                    const name = cat.categoryName ?? (cat as any).CategoryName ?? "Unnamed";

                    return (
                        <div key={id} className="y2k-generic-card" style={{ alignItems: "center" }}>
                            <div className="card-body">
                                <div className="card-header-row">
                                    <div className="card-title-group">
                                        <span className="card-title">{name}</span>
                                        <span className="y2k-badge">ID #{id}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="card-actions">
                                <button
                                    type="button"
                                    className="y2k-btn-action btn-delete"
                                    onClick={() => handleDelete(id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Create Modal */}
            {isCreating && (
                <div className="y2k-modal-backdrop" onClick={() => setIsCreating(false)}>
                    <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: "400px" }}>
                        <Window title="Register Classification Tag" onClose={() => setIsCreating(false)}>
                            <form onSubmit={handleCreate} className="y2k-form">
                                <div className="form-group">
                                    <label className="card-subtitle">Tag Identifier</label>
                                    <input
                                        type="text"
                                        className="y2k-input"
                                        placeholder="e.g. Weapons"
                                        value={newCatName}
                                        onChange={(e) => setNewCatName(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                                    <button
                                        type="button"
                                        className="y2k-btn y2k-btn-secondary"
                                        style={{ flex: 1 }}
                                        onClick={() => setIsCreating(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="y2k-btn" style={{ flex: 1 }}>
                                        Register
                                    </button>
                                </div>
                            </form>
                        </Window>
                    </div>
                </div>
            )}
        </div>
    );
}