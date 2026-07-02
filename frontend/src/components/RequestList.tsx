import { deleteRequest } from "../api";
import { RequestOut, RequestPriority } from "../types";

interface RequestListProps {
  requests: RequestOut[];
  onDeleted: () => void;
}

const priorityColors: Record<RequestPriority, string> = {
  low: "#4caf50",
  normal: "#2196f3",
  high: "#f44336",
};

const priorityLabels: Record<RequestPriority, string> = {
  low: "Низкий",
  normal: "Обычный",
  high: "Высокий",
};

const statusLabels: Record<string, string> = {
  new: "Новая",
  in_progress: "В работе",
  done: "Выполнена",
};

function RequestList({ requests, onDeleted }: RequestListProps) {
  const handleDelete = async (id: number) => {
    await deleteRequest(id);
    onDeleted();
  };

  return (
    <div>
      {requests.length === 0 && <p>Заявок нет</p>}
      {requests.map((req) => (
        <div
          key={req.id}
          style={{
            padding: 12,
            marginBottom: 8,
            border: "1px solid #ddd",
            borderRadius: 6,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <strong>{req.title}</strong>
            {req.description && (
              <p style={{ margin: "4px 0", color: "#555" }}>
                {req.description}
              </p>
            )}
            <small style={{ color: "#888" }}>
              {statusLabels[req.status] || req.status} ·{" "}
              <span style={{ color: priorityColors[req.priority] }}>
                {priorityLabels[req.priority]}
              </span>{" "}
              · {new Date(req.created_at).toLocaleString("ru-RU")}
            </small>
          </div>
          <button
            onClick={() => handleDelete(req.id)}
            style={{ color: "red", cursor: "pointer" }}
          >
            Удалить
          </button>
        </div>
      ))}
    </div>
  );
}

export default RequestList;
