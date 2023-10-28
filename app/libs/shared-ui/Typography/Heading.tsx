import { FC, PropsWithChildren } from "react";

type HeadingProps = {
  level: 1 | 2 | 3;
  weight?: "400" | "500" | "600";
  display?: boolean;
  as?: keyof HTMLElementTagNameMap;
};

export const Heading = ({
  level,
  children,
  weight = "400",
  display,
  as,
}: PropsWithChildren<HeadingProps>) => {
  const textClassName = {
    3: "text-4xl md:text-5xl",
    2: "text-3xl md:text-4xl",
    1: "text-2xl md:text-3xl",
  }[level];

  const weightClassName = {
    "400": "font-normal",
    "500": "font-semibold",
    "600": "font-extrabold",
  }[weight];

  const Component = as || "div";

  return (
    <div
      className={[
        textClassName,
        weightClassName,
        display && "font-display",
      ].join(" ")}
    >
      {children}
    </div>
  );
};
