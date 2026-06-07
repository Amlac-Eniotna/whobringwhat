import { cn } from "@/lib/utils";

interface CharCounterProps {
  value: string;
  max: number;
  className?: string;
}

export function CharCounter({ value, max, className }: CharCounterProps) {
  const count = value.length;
  const isOver = count > max;

  return (
    <span
      aria-live="polite"
      className={cn(
        "mt-0.5 block w-full text-right text-xs tabular-nums",
        isOver ? "text-destructive" : "text-muted-foreground",
        className,
      )}
    >
      {count}/{max}
    </span>
  );
}
