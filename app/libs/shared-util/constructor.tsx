import { createElement, FunctionComponent } from "react";

type HookType<Props, Result extends {}> = (props: Props) => Result;

export function bind<Props, Result extends {}>(
  useHook: HookType<Props, Result>,
  Component: FunctionComponent<Result>
) {
  return function BoundComponent(props: Props) {
    const result = useHook(props);
    return createElement<Result>(Component, result);
  };
}
