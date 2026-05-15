interface Props {
  title: string;
  subtitle?: string;
}
export function PageTitle({ title, subtitle }: Props) {
  return (
    <div className="mb-2">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mb-1">{title}</h1>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  );
}
