import SearchInput from "@/components/forms/SearchInput";

export default function Filters({ onSearch }: any) {
  const handleChange = (val: string) => {
    onSearch(val);
  };

  return (
    <div className="mb-4">
      <SearchInput onChange={handleChange} />
    </div>
  );
}