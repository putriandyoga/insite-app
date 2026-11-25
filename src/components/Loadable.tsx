import { Suspense } from "react";
import type { ComponentProps, ComponentType, LazyExoticComponent } from "react";
import { IndicatorLoading } from "@/components/IndicatorLoading";

export function Loadable<T extends ComponentType<any>>(
  Component: LazyExoticComponent<T>,
) {
  return function WrappedLoadable(props: ComponentProps<T>) {
    return (
      <Suspense
        fallback={<IndicatorLoading fullscreen text="Memuat Halaman..." />}
      >
        <Component {...props} />
      </Suspense>
    );
  };
}
