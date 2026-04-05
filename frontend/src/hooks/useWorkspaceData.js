import { useEffect, useState } from "react";
import { dashboardApi, recordsApi } from "../services/api";

function useWorkspaceData({ role, includeRecords = false, recordParams = { limit: 8 } }) {
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [categories, setCategories] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadWorkspace() {
      setLoading(true);

      try {
        const [summaryData, trendsData, categoryData] = await Promise.all([
          dashboardApi.getSummary(),
          dashboardApi.getTrends(),
          dashboardApi.getCategoryBreakdown(),
        ]);

        if (!active) return;

        setSummary(summaryData);
        setTrends(trendsData);
        setCategories(categoryData);

        if (includeRecords && ["analyst", "admin"].includes(role)) {
          const recordsResponse = await recordsApi.getRecords(recordParams);
          if (!active) return;
          setRecords(recordsResponse.data);
        } else {
          setRecords([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadWorkspace();

    return () => {
      active = false;
    };
  }, [includeRecords, role, JSON.stringify(recordParams)]);

  return {
    summary,
    trends,
    categories,
    records,
    loading,
  };
}

export default useWorkspaceData;
