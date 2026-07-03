import { RequestPriority } from "../types";

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

interface FilterPanelProps {
  filterStatus: string;
  filterPriority: string;
  sort_by?: string;
  order?: string;
  limit: number;
  onFilterStatusChange: (value: string) => void;
  onFilterPriorityChange: (value: string) => void;
  onSortByChange: (value: string) => void;
  onOrderChange: (value: string) => void;
  onLimitChange: (value: number) => void;
}

function FilterPanel({
  filterStatus,
  filterPriority,
  sort_by,
  order,
  limit,
  onFilterStatusChange,
  onFilterPriorityChange,
  onSortByChange,
  onOrderChange,
  onLimitChange,
}: FilterPanelProps) {
  return (
    <div
      style={{ marginBottom: 16, display: "flex", gap: 12, flexWrap: "wrap" }}
    >
      <label>
        Статус:{" "}
        <select
          value={filterStatus}
          onChange={(e) => onFilterStatusChange(e.target.value)}
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
          onChange={(e) => onFilterPriorityChange(e.target.value)}
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
          value={sort_by}
          onChange={(e) => onSortByChange(e.target.value)}
        >
          <option value="created_at">Дате создания</option>
          <option value="priority">Приоритету</option>
        </select>
      </label>
      <label>
        Порядок:{" "}
        <select value={order} onChange={(e) => onOrderChange(e.target.value)}>
          <option value="desc">По убыванию</option>
          <option value="asc">По возрастанию</option>
        </select>
      </label>
      <label>
        Показывать по:{" "}
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </label>
    </div>
  );
}

export default FilterPanel;
