import { MDXRemote } from "next-mdx-remote/rsc";
import { FC } from "react";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
// @ts-expect-error no types
import remarkA11yEmoji from "@fec/remark-a11y-emoji";
import remarkToc from "remark-toc";
import { mdxComponents } from "./mdxComponent";

type MdxRendererProps = {
  children: string;
};

export const MdxRenderer: FC<MdxRendererProps> = ({ children }) => (
  <div className="[&>*]:my-5">
    <MDXRemote
      source={children}
      options={{
        mdxOptions: {
          remarkPlugins: [
            remarkGfm,
            remarkFrontmatter,
            remarkA11yEmoji,
            [
              remarkToc,
              {
                tight: true,
                maxDepth: 5,
              },
            ],
          ],
          rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
        },
      }}
      components={mdxComponents}
    />
  </div>
);
