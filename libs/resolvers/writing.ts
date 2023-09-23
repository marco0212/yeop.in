import fs from "fs/promises";
import path from "path";
import { Writing } from "../type";
import matter from "gray-matter";
import { isNotEmpty } from "../shared-util";

class WritingResolver {
  private writingPath = "./writings";

  public async writings() {
    const writings = await fs.readdir(this.writingPath);
    const writingsWithMetadata = await Promise.all(
      writings
        .filter(
          (file) =>
            path.extname(file) === ".md" || path.extname(file) === ".mdx"
        )
        .map(async (file) => {
          const filePath = `${this.writingPath}/${file}`;
          const writingContent = await fs.readFile(filePath, "utf8");
          const { data, content } = matter(writingContent);

          return {
            ...data,
            content,
          } as Writing;
        })
    );

    const filtered = writingsWithMetadata
      .filter(isNotEmpty)
      .sort(
        (prev, next) =>
          new Date(next.createdAt).getTime() -
          new Date(prev.createdAt).getTime()
      );

    return filtered;
  }

  public async writing(slug: string) {
    const writings = await this.writings();
    return writings.find((writing) => writing.slug === slug);
  }
}

export const writingResolver = new WritingResolver();
