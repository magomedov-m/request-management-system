import { deleteRequest, updateStatus } from "../api";
import { RequestOut } from "../types";

interface RequestListProps {
  requests: RequestOut[];
  onDeleted: () => void;
  onStatusChanged: () => void;
  isAdmin: boolean;
}

function RequestList({
  requests,
  onDeleted,
  onStatusChanged,
  isAdmin,
}: RequestListProps) {
  const handleDelete = async (id: number) => {
    if (!window.confirm("Вы уверены, что хотите удалить эту заявку?")) {
      return;
    }
    try {
      await deleteRequest(id);
      onDeleted();
    } catch (err) {
      console.error("Ошибка удаления:", err);
      alert("Не удалось удалить заявку");
    }
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
            <td style={{ padding: 8 }}>
              {req.priority === "low"
                ? "Низкий"
                : req.priority === "normal"
                  ? "Обычный"
                  : "Высокий"}
            </td>
            <td style={{ padding: 8 }}>
              {new Date(req.created_at).toLocaleString("ru-RU")}
            </td>
            <td style={{ padding: 8 }}>
              {isAdmin && (
                <button
                  onClick={() => handleDelete(req.id)}
                  style={{ cursor: "pointer", color: "red" }}
                  disabled={req.status === "done"}
                >
                  Удалить
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default RequestList;
