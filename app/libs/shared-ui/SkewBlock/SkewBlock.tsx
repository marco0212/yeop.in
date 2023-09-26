import { PropsWithChildren } from "react";

export const SkewBlock = ({ children }: PropsWithChildren) => {
  return (
    <div className="bg-primary skew-block">
      <div className="container">{children}</div>
    </div>
  );
};
