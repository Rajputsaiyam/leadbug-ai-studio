interface PaginationProps {
  total: number;
  page: number;
  perPage: number;
  onChange: (page: number) => void;
}

const PaginationBar = ({ total, page, perPage, onChange }: PaginationProps) => {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  const pages = [];
  for (let i = 1; i <= Math.min(totalPages, 5); i++) pages.push(i);

  return (
    <div className="flex items-center justify-between mt-4 text-sm">
      <div className="flex items-center gap-1">
        <button onClick={() => onChange(1)} disabled={page === 1} className="px-2 py-1 text-muted-foreground hover:text-foreground disabled:opacity-40">«</button>
        <button onClick={() => onChange(page - 1)} disabled={page === 1} className="px-2 py-1 text-muted-foreground hover:text-foreground disabled:opacity-40">‹ Previous</button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-8 h-8 rounded-full text-xs font-medium ${
              p === page ? "bg-crm-blue text-primary-foreground" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {p}
          </button>
        ))}
        {totalPages > 5 && <span className="px-1 text-muted-foreground">…</span>}
        <button onClick={() => onChange(page + 1)} disabled={page === totalPages} className="px-2 py-1 text-muted-foreground hover:text-foreground disabled:opacity-40">Next ›</button>
        <button onClick={() => onChange(totalPages)} disabled={page === totalPages} className="px-2 py-1 text-muted-foreground hover:text-foreground disabled:opacity-40">»</button>
      </div>
      <span className="text-muted-foreground text-xs">Showing {start} to {end} of {total}</span>
    </div>
  );
};

export default PaginationBar;
