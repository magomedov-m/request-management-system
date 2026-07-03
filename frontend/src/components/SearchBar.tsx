interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      type="text"
      placeholder="Поиск по заголовку или описанию..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        padding: 8,
        marginBottom: 16,
        boxSizing: "border-box",
      }}
    />
  );
}

export default SearchBar;
