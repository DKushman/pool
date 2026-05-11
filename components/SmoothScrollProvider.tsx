"use client";

type SmoothScrollProviderProps = {
  children: React.ReactNode;
};

/** Pass-through wrapper; native document scrolling only (Lenis disabled). */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  return <>{children}</>;
}
