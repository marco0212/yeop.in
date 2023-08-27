import { FC } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import "./styles/github-markdown.css";

type MarkdownRendererProps = {
  source: string;
};

export const MarkdownRenderer: FC<MarkdownRendererProps> = ({ source }) => (
  <ReactMarkdown className="markdown-body" remarkPlugins={[remarkGfm]}>
    {source}
  </ReactMarkdown>
);
