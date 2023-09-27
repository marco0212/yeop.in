import { writingResolver } from "@libs/resolvers";
import { Body, Heading, SkewBlock } from "@libs/shared-ui";
import Link from "next/link";

export default async function Home() {
  const writings = await writingResolver.writings();

  return (
    <div className="flex flex-col gap-10">
      <SkewBlock>
        <div className="flex flex-col gap-4">
          <Heading level={3} weight="600">
            Hello there,
            <br />
            I&apos;m Jeong
          </Heading>

          <Body level={1}>
            I am a software developer with a specialization in front-end. I have
            primarily worked at startups 🚀 Now I&apos;m working as a JavaScript
            developer at D.whale provides the service Clap.
          </Body>
        </div>
      </SkewBlock>
      <div className="flex flex-col gap-20">
        <div className="container flex flex-col gap-8">
          <Heading level={1} weight="600">
            👨‍💻 I&apos;ve worked at
          </Heading>

          <ul>
            <li className="flex border-b border-t py-2 justify-between items-center">
              <Body level={2} weight="600">
                D.whale
              </Body>
              <div className="basis-40">
                <Body level={1}>2022.11 ~ Now</Body>
              </div>
            </li>
            <li className="flex border-b py-2 justify-between items-center">
              <Body level={2} weight="600">
                Freelancer
              </Body>
              <div className="basis-40">
                <Body level={1}>2022.02 ~ 2022.11</Body>
              </div>
            </li>
            <li className="flex border-b py-2 justify-between items-center">
              <Body level={2} weight="600">
                Class101
              </Body>
              <div className="basis-40">
                <Body level={1}>2020.07 ~ 2022.02</Body>
              </div>
            </li>
          </ul>
        </div>

        <div className="container flex flex-col gap-8">
          <Heading level={1} weight="600">
            ✏️ Latest Writings
          </Heading>

          <ul className="flex flex-col gap-8">
            {writings.map((writing) => (
              <li key={writing.slug}>
                <Link
                  href={`writings/${writing.slug}`}
                  className="flex flex-col gap-1"
                >
                  <Body level={2} weight="600">
                    {writing.title}
                  </Body>
                  <Body level={1}>{writing.description}</Body>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
