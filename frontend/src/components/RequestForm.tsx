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
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  const validate = () => {
    const newErrors: { title?: string; description?: string } = {};
    if (title.length < 3) {
      newErrors.title = "Минимум 3 символа";
    }
    if (title.length > 120) {
      newErrors.title = "Максимум 120 символов";
    }
    if (description.length > 1000) {
      newErrors.description = "Максимум 1000 символов";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const data: RequestCreate = {
        title,
        description: description || undefined,
        priority,
      };
      await createRequest(data);
      setTitle("");
      setDescription("");
      setPriority("normal");
      setErrors({});
      onCreated();
    } catch (err: any) {
      console.error("Ошибка создания:", err);
      const msg = err.response?.data?.detail || "Ошибка при создании заявки";
      alert(msg);
    }
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
          placeholder="Заголовок (3-120 символов)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: 8,
            boxSizing: "border-box",
            borderColor: errors.title ? "red" : undefined,
          }}
        />
        {errors.title && (
          <span style={{ color: "red", fontSize: 12 }}>{errors.title}</span>
        )}
      </div>
      <div style={{ marginBottom: 8 }}>
        <textarea
          placeholder="Описание (до 1000 символов)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{
            width: "100%",
            padding: 8,
            boxSizing: "border-box",
            borderColor: errors.description ? "red" : undefined,
          }}
        />
        {errors.description && (
          <span style={{ color: "red", fontSize: 12 }}>
            {errors.description}
          </span>
        )}
      </div>
      <div style={{ marginBottom: 8 }}>
        <label style={{ marginRight: 8 }}>Приоритет:</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as RequestPriority)}
          style={{ padding: "4px 8px" }}
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
