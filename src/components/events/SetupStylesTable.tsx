import type { Package } from "@/types";

const SETUP_LABELS: { key: keyof Package; label: string }[] = [
  { key: "size", label: "Hall Size" },
  { key: "theater", label: "Theatre" },
  { key: "class_room_style", label: "Classroom" },
  { key: "u_shape", label: "U-Shape" },
  { key: "round_table", label: "Round Table" },
  { key: "cover", label: "Cover" },
];

export default function SetupStylesTable({ space }: { space: Package }) {
  const rows = SETUP_LABELS.filter(({ key }) => space[key]);
  if (rows.length === 0) return null;

  return (
    <div className="bento-card overflow-hidden">
      <p className="p-5 pb-0 text-xs font-bold tracking-widest uppercase text-bento-ink-soft/70">
        Occupancy &amp; Setup Style
      </p>
      <div className="overflow-x-auto p-5">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {rows.map(({ key, label }) => (
                <th
                  key={key}
                  scope="col"
                  className="whitespace-nowrap border-b border-white/70 px-4 py-3 text-left text-[0.65rem] font-semibold uppercase tracking-widest text-bento-ink-soft/70"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {rows.map(({ key }) => (
                <td key={key} className="whitespace-nowrap px-4 py-4 text-sm font-medium text-bento-ink">
                  {space[key] as string}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
