import { useState } from "react";
import { createRequest } from "../api";
import { RequestCreate, RequestPriority } from "../types";

interface RequestFormProps {
  onCreated: () => void;
}

function RequestForm({ onCreated }: RequestFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<RequestPriority>("normal");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const data: RequestCreate = {
      title,
      description: description || undefined,
      priority,
    };
    await createRequest(data);
    setTitle("");
    setDescription("");
    setPriority("normal");
    onCreated();
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginBottom: 24,
        padding: 16,
        border: "1px solid #ccc",
        borderRadius: 8,
      }}
    >
      <h2>Новая заявка</h2>
      <div style={{ marginBottom: 8 }}>
        <input
          type="text"
          placeholder="Заголовок (мин. 3 символа)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
        />
      </div>
      <div style={{ marginBottom: 8 }}>
        <textarea
          placeholder="Описание (до 1000 символов)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
        />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label style={{ marginRight: 8 }}>Приоритет:</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as RequestPriority)}
        >
          <option value="low">Низкий</option>
          <option value="normal">Обычный</option>
          <option value="high">Высокий</option>
        </select>
      </div>
      <button type="submit" style={{ padding: "8px 16px" }}>
        Создать
      </button>
    </form>
  );
}

export default RequestForm;
