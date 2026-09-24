import type { AnchorHTMLAttributes, ReactNode } from "react";

export interface TabProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  active?: boolean;
}