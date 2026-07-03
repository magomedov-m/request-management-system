interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

function Pagination({ page, totalPages, total, onPageChange }: PaginationProps) {
  return (
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
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        Назад
      </button>
      <span>
        Стр. {page} из {totalPages} (всего: {total})
      </span>
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages || totalPages === 0}
      >
        Вперёд
      </button>
    </div>
  );
}

export default Pagination;
