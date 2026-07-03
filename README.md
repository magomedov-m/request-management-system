# Request Management System

Система управления заявками с полным стеком: **FastAPI + SQLAlchemy + SQLite** (backend) и **React + TypeScript + Vite** (frontend).

## Возможности

- ✅ CRUD операции с заявками
- ✅ Пагинация, фильтрация, поиск, сортировка
- ✅ JWT авторизация администратора
- ✅ Управление статусами заявок
- ✅ Бизнес-правила валидации

## Бизнес-правила

- Статус `done` (выполнена) **нельзя** изменить
- Статус `done` **нельзя** удалить заявку
- Статус `done` **нельзя** перевести в другой статус
- Удалять заявки может **только администратор**

## Запуск

### Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

Backend доступен на: http://localhost:8000  
API документация: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend доступен на: http://localhost:5173

## Учётные данные администратора

- **Логин:** `admin`
- **Пароль:** `admin`

## API Endpoints

| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| POST | `/api/auth/login` | Вход администратора | ❌ |
| GET | `/api/requests/` | Список заявок (пагинация, фильтры) | ❌ |
| POST | `/api/requests/` | Создать заявку | ❌ |
| GET | `/api/requests/{id}` | Получить заявку | ❌ |
| PUT | `/api/requests/{id}` | Обновить заявку | ❌ |
| PATCH | `/api/requests/{id}/status` | Изменить статус | ❌ |
| DELETE | `/api/requests/{id}` | Удалить заявку | ✅ |

## Структура заявки

```typescript
interface Request {
  id: number;
  title: string;           // 3-120 символов
  description?: string;    // до 1000 символов
  status: "new" | "in_progress" | "done";
  priority: "low" | "normal" | "high";
  created_at: string;      // ISO 8601
  updated_at: string;      // ISO 8601
}
```

## Параметры запроса списка

- `page` — номер страницы (default: 1)
- `limit` — записей на страницу (default: 10, max: 100)
- `status` — фильтр по статусу
- `priority` — фильтр по приоритету
- `search` — поиск по заголовку и описанию
- `sort_by` — сортировка: `created_at` или `priority`
- `order` — порядок: `asc` или `desc`
