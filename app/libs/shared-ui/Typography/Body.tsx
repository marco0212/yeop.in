import { isNotEmpty } from "@libs/shared-util";
import { PropsWithChildren } from "react";
import type React from "react";

type BodyProps = {
  level: 1 | 2 | 3;
  weight?: "400" | "500" | "600";
  display?: boolean;
  as?: keyof HTMLElementTagNameMap;
};

export const Body = ({
  level,
  children,
  weight = "400",
  display,
  as,
}: PropsWithChildren<BodyProps>) => {
  const textClassName = {
    1: "text-md",
    2: "text-lg",
    3: "text-xl",
  }[level];

  const weightClassName = {
    "400": "font-normal",
    "500": "font-semibold",
    "600": "font-extrabold",
  }[weight];

  const Component = as || "div";

  return (
    <Component
      className={[textClassName, weightClassName, display && "font-display"]
        .filter(isNotEmpty)
        .join(" ")}
    >
      {children}
    </Component>
  );
};
