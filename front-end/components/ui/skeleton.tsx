import { cn } from "@/lib/utils";

function Skeleton({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Skeleton };
