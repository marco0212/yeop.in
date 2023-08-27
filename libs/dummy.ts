type Tag = "work" | "book" | "journal" | "dev";

type Writing = {
  id: string;
  title: string;
  summary: string;
  content: string;
  tags: Tag[];
  createdAt: string;
};

const WRITING: Writing = {
  id: "1",
  title: "세이노의 가르침",
  summary:
    "세이노가 말합니다. 엄살 떨지 말고 일이나 쳐 하라고.\n더이상 패배주의에 젖어 한탄하지 말고 일어나서 문제를 해결하라고 이야기합니다.\n너가 뭘 알아.",
  content:
    "# A demo of `react-markdown`\n`react-markdown` is a markdown component for React.\n\n👉 Changes are re-rendered as you type.\n\n👈 Try writing some markdown on the left.\n\n## Overview\n\n* Follows [CommonMark](https://commonmark.org)\n* Optionally follows [GitHub Flavored Markdown](https://github.github.com/gfm/)\n* Renders actual React elements instead of using `dangerouslySetInnerHTML`\n* Lets you define your own components (to render `MyHeading` instead of `h1`)\n* Has a lot of plugins\n\n| Feature    | Support              |\n| ---------: | :------------------- |\n| CommonMark | 100%                 |\n| GFM        | 100% w/ `remark-gfm` |\n\n\n~~strikethrough~~\n\n\n* [ ] task list\n* [x] checked item",
  tags: ["book"],
  createdAt: new Date().toISOString(),
};

export const SINGLE_WRITING = WRITING;
export const LIST_WRITING = [WRITING, WRITING].map((writing, index) => ({
  ...writing,
  id: index.toString(),
}));
