import { useState, useEffect, useCallback } from "react";
import RequestForm from "../components/RequestForm";
import RequestList from "../components/RequestList";
import { getRequests } from "../api";
import type { GetRequestsParams, PaginatedResponse } from "../api";
import { RequestPriority } from "../types";

const DEFAULT_PAGE_SIZE = 10;

const statusLabels: Record<string, string> = {
  new: "Новая",
  in_progress: "В работе",
  done: "Выполнена",
};

const priorityLabels: Record<RequestPriority, string> = {
  low: "Низкий",
  normal: "Обычный",
  high: "Высокий",
};

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
      <input
        type="text"
        placeholder="Поиск по заголовку или описанию..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        style={{
          width: "100%",
          padding: 8,
          marginBottom: 16,
          boxSizing: "border-box",
        }}
      />
      <div
        style={{ marginBottom: 16, display: "flex", gap: 12, flexWrap: "wrap" }}
      >
        <label>
          Статус:{" "}
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Все</option>
            {Object.entries(statusLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Приоритет:{" "}
          <select
            value={filterPriority}
            onChange={(e) => {
              setFilterPriority(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Все</option>
            {Object.entries(priorityLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Сортировать по:{" "}
          <select
            value={sortParams.sort_by}
            onChange={(e) => {
              setSortParams((p) => ({
                ...p,
                sort_by: e.target.value as GetRequestsParams["sort_by"],
              }));
              setPage(1);
            }}
          >
            <option value="created_at">Дате создания</option>
            <option value="priority">Приоритету</option>
          </select>
        </label>
        <label>
          Порядок:{" "}
          <select
            value={sortParams.order}
            onChange={(e) => {
              setSortParams((p) => ({
                ...p,
                order: e.target.value as GetRequestsParams["order"],
              }));
              setPage(1);
            }}
          >
            <option value="desc">По убыванию</option>
            <option value="asc">По возрастанию</option>
          </select>
        </label>
        <label>
          Показывать по:{" "}
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </label>
      </div>
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
              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  justifyContent: "center",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Назад
                </button>
                <span>
                  Стр. {page} из {totalPages} (всего: {response.total})
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || totalPages === 0}
                >
                  Вперёд
                </button>
              </div>
            </>
          )}
        </>
      ) : null}
    </div>
  );
}

export default RequestsPage;
