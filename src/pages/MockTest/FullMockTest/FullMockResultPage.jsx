import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import FullMockTestResult from "./FullMockTestResult";
import DashboardLayout from "../../../components/DashboardLayout/DashboardLayout";

const FullMockResultPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                // Assuming we have an endpoint to get result by ID.
                // If not, we might need to use the generic "get my results" and filter, 
                // BUT it is better to have a direct endpoint.
                // Checking fullMockTestRoutes.js... it only has getUserFullMockTestResults (all).
                // I'll check if there is a getResultById endpoint. 
                // ... There isn't one explicitly for "FullMockTestResult" in the shared code snippet of routes 
                // (only getFullMockTestById which is the TEST definition, not the RESULT).
                // WAIT! I need to create a backend route to get a single result by ID first?
                // The user said "Blank screen", meaning frontend route didn't match anything.
                // But if I add the route, I still need the API.
                // Let's assume for now I added the route to App.jsx.
                // I need to fetch the specific result.

                // Temporary workaround: Fetch all my results and find the one. 
                // Better: Add endpoint GET /api/mocktest/full/result/:id to backend.

                // Let's try to query the existing generic endpoint or just filter on client side for speed.
                const res = await api.get("/mocktest/full/results/my");
                const found = (res.data?.data || []).find(r => r._id === id);

                if (found) {
                    setResult(found);
                } else {
                    setError("Result not found.");
                }
            } catch (err) {
                console.error("Error fetching result:", err);
                setError("Failed to load result.");
            } finally {
                setLoading(false);
            }
        };

        fetchResult();
    }, [id]);

    if (loading) return <div className="p-20 text-center">Loading Result...</div>;
    if (error) return <div className="p-20 text-center text-red-500">{error}</div>;

    return (
        <DashboardLayout>
            <div className="p-6">
                <button
                    onClick={() => navigate("/mock-test?module=Results")}
                    className="mb-4 text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                    &larr; Back to Results
                </button>
                <FullMockTestResult result={result} />
            </div>
        </DashboardLayout>
    );
};

export default FullMockResultPage;
