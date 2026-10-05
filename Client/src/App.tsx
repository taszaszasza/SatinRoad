import { APITester } from "./APITester";
import "./index.css";
import {Api, type ListingDto} from "../Api.ts";
import {useEffect, useState} from "react";

//import logo from "./logo.svg";
//import reactLogo from "./react.svg";

const MyApi = new Api();

export function App() {
    const [listings, setListings] = useState<ListingDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        MyApi.getAllListings.listingGetAllListings()
            .then((res) => {
                setListings(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || 'Underground API Unreachable');
                setLoading(false);
            });
    }, []);

    return (
        <div className="app-container">
            <header className="app-header">
                <h1 className="satin-logo">✧*｡ Satin Road ｡*✧</h1>
                <p className="satin-tagline">
                    🎀 The cutie-patootie illicit underground market • est. 2004 🎀
                </p>
            </header>

            <main>
                <div className="y2k-window y2k-window-modal">
                    <div className="y2k-window-header">
                        <span>📡 System_Status.exe</span>
                        <div className="y2k-window-controls">
                            <span className="y2k-control-dot"></span>
                            <span className="y2k-control-dot close"></span>
                        </div>
                    </div>
                    <div className="y2k-window-body text-center">
                        {loading && (
                            <div className="status-badge status-loading">
                                Connecting to network... ⏳
                            </div>
                        )}
                        {error && (
                            <div className="status-badge status-offline">
                                ⚠️ {error}
                            </div>
                        )}
                        {!loading && !error && (
                            <div className="status-badge status-online">
                                ✧ ONLINE ✧ {listings.length} Listings Active 🎀
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}