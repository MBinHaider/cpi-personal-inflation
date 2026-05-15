interface Props {
  source: string;
  updatedLabel: string;
}
export function Footer({ source, updatedLabel }: Props) {
  return (
    <div className="mt-6 pt-4 border-t border-gray-200 flex flex-wrap justify-between gap-2 text-[10px] text-gray-500">
      <span>{source}</span>
      <span>{updatedLabel}</span>
    </div>
  );
}
