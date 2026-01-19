interface SkeletonProps {
  className?: string;
  aspectRatio?: string;
}

export function Skeleton({ className = '', aspectRatio }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-comb-200 rounded-lg ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-[--radius-card] shadow-honey overflow-hidden">
      <Skeleton className="w-full rounded-none" aspectRatio="4/5" />
      <div className="p-6">
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

export function SkeletonImage({ aspectRatio = '4/5' }: { aspectRatio?: string }) {
  return (
    <Skeleton className="w-full rounded-[--radius-card]" aspectRatio={aspectRatio} />
  );
}
