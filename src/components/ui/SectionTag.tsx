interface SectionTagProps {
  label: string;
  className?: string;
}

export function SectionTag({ label, className = '' }: SectionTagProps) {
  return (
    <div className={className}>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pb-2">
        {label}
      </h2>
      <div className="w-12 h-1 bg-[#008751] rounded-sm" />
    </div>
  );
}
