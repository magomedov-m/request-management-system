import { useState, useEffect, useCallback } from "react";
import RequestForm from "../components/RequestForm";
import RequestList from "../components/RequestList";
import FilterPanel from "../components/FilterPanel";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import { getRequests } from "../api";
import type { GetRequestsParams, PaginatedResponse } from "../api";
import { RequestPriority } from "../types";

const DEFAULT_PAGE_SIZE = 10;

interface RequestsPageProps {
  onLogout: () => void;
}

function RequestsPage({ onLogout }: RequestsPageProps) {
  const [response, setResponse] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterPriority, setFilterPriority] = useState<string>("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [sortParams, setSortParams] = useState<GetRequestsParams>({
    sort_by: "created_at",
    order: "desc",
  });

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRequests({
        ...sortParams,
        search: debouncedSearch || undefined,
        status: filterStatus || undefined,
        priority: (filterPriority as RequestPriority) || undefined,
        page,
        limit,
      });
      setResponse(data);
    } catch (err: any) {
      console.error("Ошибка загрузки:", err);
      const msg =
        err.response?.data?.detail ||
        err.message ||
        "Ошибка при загрузке данных";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, sortParams, filterStatus, filterPriority, page, limit]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const totalPages = response ? Math.ceil(response.total / limit) : 0;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h1 style={{ margin: 0 }}>Учёт заявок</h1>
        <button
          onClick={onLogout}
          style={{ padding: "8px 16px", cursor: "pointer" }}
        >
          Выйти
        </button>
      </div>
      <RequestForm
        onCreated={() => {
          setPage(1);
          fetchRequests();
        }}
      />
      <SearchBar
        value={search}
        onChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
      />
      <FilterPanel
        filterStatus={filterStatus}
        filterPriority={filterPriority}
        sort_by={sortParams.sort_by}
        order={sortParams.order}
        limit={limit}
        onFilterStatusChange={(value) => {
          setFilterStatus(value);
          setPage(1);
        }}
        onFilterPriorityChange={(value) => {
          setFilterPriority(value);
          setPage(1);
        }}
        onSortByChange={(value) => {
          setSortParams((p) => ({
            ...p,
            sort_by: value as GetRequestsParams["sort_by"],
          }));
          setPage(1);
        }}
        onOrderChange={(value) => {
          setSortParams((p) => ({
            ...p,
            order: value as GetRequestsParams["order"],
          }));
          setPage(1);
        }}
        onLimitChange={(value) => {
          setLimit(value);
          setPage(1);
        }}
      />
      {loading ? (
        <p style={{ textAlign: "center", padding: 24 }}>Загрузка...</p>
      ) : error ? (
        <p style={{ color: "red", textAlign: "center", padding: 24 }}>
          {error}
        </p>
      ) : response ? (
        <>
          {response.items.length === 0 ? (
            <p style={{ textAlign: "center", padding: 24 }}>Заявок нет</p>
          ) : (
            <>
              <RequestList
                requests={response.items}
                onDeleted={fetchRequests}
                onStatusChanged={fetchRequests}
                isAdmin={true}
              />
              <Pagination
                page={page}
                totalPages={totalPages}
                total={response.total}
                onPageChange={setPage}
              />
            </>
          )}
        </>
      ) : null}
    </div>
  );
}

export default RequestsPage;
