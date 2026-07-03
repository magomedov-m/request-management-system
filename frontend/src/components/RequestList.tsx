import { deleteRequest, updateStatus } from "../api";
import { RequestOut, RequestPriority } from "../types";

interface RequestListProps {
  requests: RequestOut[];
  onDeleted: () => void;
  onStatusChanged: () => void;
}

const priorityLabels: Record<RequestPriority, string> = {
  low: "Низкий",
  normal: "Обычный",
  high: "Высокий",
};

function RequestList({
  requests,
  onDeleted,
  onStatusChanged,
}: RequestListProps) {
  const handleDelete = async (id: number) => {
    await deleteRequest(id);
    onDeleted();
  };

  const handleStatusChange = async (
    id: number,
    status: RequestOut["status"],
  ) => {
    await updateStatus(id, status);
    onStatusChanged();
  };

  if (requests.length === 0) {
    return <p>Заявок нет</p>;
  }

  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
      }}
    >
      <thead>
        <tr style={{ borderBottom: "2px solid #ccc" }}>
          <th style={{ textAlign: "left", padding: 8 }}>Заголовок</th>
          <th style={{ textAlign: "left", padding: 8 }}>Описание</th>
          <th style={{ textAlign: "left", padding: 8 }}>Статус</th>
          <th style={{ textAlign: "left", padding: 8 }}>Приоритет</th>
          <th style={{ textAlign: "left", padding: 8 }}>Создана</th>
          <th style={{ textAlign: "left", padding: 8 }}>Действия</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((req) => (
          <tr key={req.id} style={{ borderBottom: "1px solid #eee" }}>
            <td style={{ padding: 8 }}>{req.title}</td>
            <td style={{ padding: 8 }}>{req.description || "—"}</td>
            <td style={{ padding: 8 }}>
              <select
                value={req.status}
                onChange={(e) =>
                  handleStatusChange(
                    req.id,
                    e.target.value as RequestOut["status"],
                  )
                }
                disabled={req.status === "done"}
              >
                <option value="new">Новая</option>
                <option value="in_progress">В работе</option>
                <option value="done">Выполнена</option>
              </select>
            </td>
            <td style={{ padding: 8 }}>{priorityLabels[req.priority]}</td>
            <td style={{ padding: 8 }}>
              {new Date(req.created_at).toLocaleString("ru-RU")}
            </td>
            <td style={{ padding: 8 }}>
              <button
                onClick={() => handleDelete(req.id)}
                style={{ cursor: "pointer", color: "red" }}
                disabled={req.status === "done"}
              >
                Удалить
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default RequestList;
