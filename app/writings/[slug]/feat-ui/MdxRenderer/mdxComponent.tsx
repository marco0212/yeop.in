import { Code } from "bright";
import { MDXComponents } from "mdx/types";
import { Body } from "@libs/shared-ui";
import Link from "next/link";
import Image from "next/image";

export const mdxComponents: MDXComponents = {
  a: ({ children, href }) => {
    const isExternal = href?.startsWith("http");

    return (
      <Link
        href={href || ""}
        target={isExternal ? "_blank" : undefined}
        className="font-bold hover:underline"
      >
        {children}
      </Link>
    );
  },

  h2: ({ children }) => {
    return (
      <Body level={3} weight="500" as="h2">
        {children}
      </Body>
    );
  },

  h3: ({ children }) => {
    return (
      <Body level={2} weight="500" as="h3">
        {children}
      </Body>
    );
  },

  p: ({ children }) => {
    return (
      <Body level={1} as="p">
        {children}
      </Body>
    );
  },

  pre: ({ children, ...props }) => {
    return (
      <Code {...props} theme="material-default" className="text-sm">
        {children}
      </Code>
    );
  },

  blockquote: ({ children }) => {
    return <div className="border-l-4 pl-5 py-2">{children}</div>;
  },
};
