import type { Tag } from "@/types/health";

const tagColors: Record<Tag["type"], string> = {
  condition: "bg-health-alert/10 text-health-alert",
  medication: "bg-primary/10 text-primary",
  doctor: "bg-secondary/10 text-secondary",
  measurement: "bg-accent/10 text-accent-foreground",
  symptom_category: "bg-health-watch/10 text-health-watch",
  custom: "bg-muted text-muted-foreground",
};

interface TagBadgeProps {
  tag: Tag;
}

export default function TagBadge({ tag }: TagBadgeProps) {
  return (
    <span className={`inline-flex text-[9px] font-semibold px-2 py-0.5 rounded-full ${tagColors[tag.type]}`}>
      {tag.label}
    </span>
  );
}

export function TagList({ tags }: { tags: Tag[] }) {
  if (tags.length === 0) return null;
  return (
    <div className="flex gap-1 flex-wrap">
      {tags.map((tag) => (
        <TagBadge key={tag.id} tag={tag} />
      ))}
    </div>
  );
}
