"use server";

import { Prose } from "@/components/ui/prose";
import { Center, Link as ChakraLink, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import fs from "node:fs";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default async function About() {
  const note = fs.readFileSync("src/app/about/my-note.md", "utf-8");

  return (
    <Center height={"dvh"}>
      <Stack>
        <ChakraLink href="/" fontWeight={"bold"} asChild alignSelf={"start"}>
          <Link href={"/"}>Back to home</Link>
        </ChakraLink>
        <Prose>
          <Markdown remarkPlugins={[remarkGfm]}>{note}</Markdown>
        </Prose>

        <Text textStyle={"sm"} color="colorPalette.fg" fontWeight={"bold"}>
          The sun shined brighter when she was here
        </Text>
        <audio controls>
          <source src="/remember.mp3" type="audio/ogg" />
          Your browser does not support the audio element.
        </audio>
      </Stack>
    </Center>
  );
}
