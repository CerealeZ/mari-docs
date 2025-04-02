import { Field } from "@/components/ui/field";
import {
  Center,
  Heading,
  FileUpload,
  Box,
  Text,
  Show,
  Alert,
  Stack,
  Button,
  VStack,
  Link as ChakraLink,
  Input,
  Group,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

import { useRef, useState } from "react";

export const Start = ({
  onLoad,
}: {
  onLoad: (collection: ReturnType<typeof parseBruno>) => void;
}) => {
  const [error, setError] = useState<null | Error>(null);
  const url = useRef<string>("");

  const [loading, setLoading] = useState(false);

  const fetchExample = async () => {
    try {
      const response = await fetch("/bruno-example.json");
      const brunocollection = (await response.json()) as BrunoCollection;
      onLoad(parseBruno(brunocollection));
    } catch (error) {
      setError(error as Error);
    }
  };

  return (
    <Center h={"dvh"} px={"2"}>
      <Stack maxW={"65ch"} w={"full"}>
        <Heading textStyle={"6xl"}>Mari Docs</Heading>
        <Text>Watch your Bruno collection in a nice way</Text>
        <ChakraLink fontWeight={"bold"} asChild alignSelf={"start"}>
          <Link href={"/about"}>What is this?</Link>
        </ChakraLink>

        <Box minH={"20"}>
          <Show when={error}>
            {() => {
              return (
                <Alert.Root status="error">
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Title>Oops</Alert.Title>
                    <Alert.Description>
                      Your collection might be invalid
                    </Alert.Description>
                  </Alert.Content>
                </Alert.Root>
              );
            }}
          </Show>
        </Box>

        <FileUpload.Root
          alignItems="stretch"
          maxFiles={10}
          accept={["application/json"]}
          onFileAccept={async ({ files }) => {
            try {
              const file = files.at(-1);
              if (!file) throw new Error("No file selected");
              const json = await file.text();
              const brunocollection = JSON.parse(json) as BrunoCollection;
              onLoad(parseBruno(brunocollection));
            } catch (error) {
              console.log(error);

              setError(
                new Error("Error loading the bruno collection", {
                  cause: error,
                })
              );
            }
          }}
        >
          <FileUpload.HiddenInput />
          <FileUpload.Dropzone>
            <FileUpload.DropzoneContent>
              <Image src="/bruno-logo.png" alt="" width={"70"} height={"70"} />
              <Box>Drop your collection here!</Box>
              <Box color="fg.muted">Only JSON files are supported</Box>
            </FileUpload.DropzoneContent>
          </FileUpload.Dropzone>
        </FileUpload.Root>

        <Group
          attached
          w="full"
          alignItems={"end"}
          position={"relative"}
          as="form"
          onSubmit={async (e) => {
            try {
              setLoading(true);
              e.preventDefault();
              const response = await fetch(url.current);
              const brunocollection =
                (await response.json()) as BrunoCollection;
              onLoad(parseBruno(brunocollection));
            } catch (error) {
              setError(error as Error);
            } finally {
              setLoading(false);
            }
          }}
        >
          <Field label={"Collection URL"} zIndex="2">
            <Input
              type="text"
              rounded={"none"}
              onChange={(e) => {
                url.current = e.target.value;
              }}
              disabled={loading}
            />
          </Field>
          <Button
            bg="bg.subtle"
            variant="outline"
            loading={loading}
            type="submit"
          >
            Submit
          </Button>
        </Group>

        <VStack>
          <Text>Not a Bruno enjoyer yet?</Text>
          <Button onClick={fetchExample}>Use the JSON Placeholder</Button>
        </VStack>
      </Stack>
    </Center>
  );
};

export interface BrunoRequest {
  type: "http";
  name: string;
  /** The request sequence. This is to sort the requests in the bruno interface */
  seq: number;
  request: {
    /** The Request String, like /my-endpoint/:id */
    url: string;
    /** The HTTP Method */
    method: string;
    /** The Request Headers */
    headers: Header[];
    /** The Request Params. There are 2 types: Query Params and Path Params */
    params: Param[];
    /** The Request Body */
    body: JSONRequestBody | NotBody;
    /** The javascript code to execute before a request and after a response  */
    script: Script;
    /** Pass and make stuff with the request and response https://docs.usebruno.com/testing/script/vars */
    vars: Vars;
    /** Soft tests. */
    assertions: Assertion[];
    /** Javascript code to execute advance tests */
    tests: string;
    /** The documentation of the request. This is Markdown */
    docs: string;
    /** The Authentication Method */
    auth: NotAuth | BearerAuth;
  };
}

interface BrunoFolder {
  type: "folder";
  name: string;
  root?: BrunoRoot;
  items?: (BrunoFolder | BrunoRequest)[];
}

interface Param {
  type: "query" | "path";
  name: string;
  value: string;
  enabled: boolean;
}

interface Header {
  name: string;
  value: string;
  enabled: boolean;
}

interface Body {
  formUrlEncoded: unknown[];
  multipartForm: unknown[];
  file: unknown[];
}

interface JSONRequestBody extends Body {
  mode: "json";
  json: string;
}

interface NotBody extends Body {
  mode: "none";
}

/** This is string code of a JS Script */
type Script = Partial<Record<"res" | "req", string>>;

type Vars = Partial<Record<"req" | "res", Var[]>>;
type Var = {
  name: string;
  value: string;
  enabled: boolean;
  local: boolean;
};

/** An Assertion is a Bruno test of how a response should be */
type Assertion = {
  name: string;
  /** The asssertion. This use expressions like gt value, eq value */
  value: string;
  enabled: boolean;
  uid: string;
};

type NotAuth = {
  mode: "none";
};

type BearerAuth = {
  mode: "bearer";
  bearer: {
    token: string;
  };
};

// const isBrunoRequest = (item: object): item is BrunoRequest => {
//   return "type" in item && item.type === "http";
// };

// const isBrunoFolder = (item: object): item is BrunoFolder => {
//   return "type" in item && item.type === "folder";
// };

export type BrunoCollection = {
  name: string;
  version: string;
  environments: Environment[];
  items: (BrunoFolder | BrunoRequest)[];
  brunoConfig: unknown;
  root?: BrunoRoot;
  activeEnvironmentUid?: string;
};

export type Environment = {
  name: string;
  variables: {
    name: string;
    value: string;
    enabled: boolean;
    secret: boolean;
    type: string;
  }[];
};

type BrunoRoot = {
  docs?: string;
  meta?: Partial<Record<"name", string>>;
};

export const parseBruno = (collection: BrunoCollection) => {
  const root = {
    name: collection.name,
    version: collection.version,
    root: collection.root,
    environments: collection.environments,
  };

  const requests: { path: string; value: BrunoRequest }[] = [];
  const folders: { path: string; value: Omit<BrunoFolder, "items"> }[] = [];

  const navigateFolders = (folder: BrunoFolder, root = "/") => {
    const { items, ...rest } = folder;
    folders.push({
      path: root,
      value: rest,
    });

    const childrenPath =
      root === "/" ? root + folder.name : root + "/" + folder.name;

    if (!items) return;

    items.forEach((item) => {
      switch (item.type) {
        case "http":
          requests.push({ path: childrenPath, value: item });
          break;
        case "folder":
          navigateFolders(item, childrenPath);
          break;
      }
    });
  };

  collection.items.forEach((item) => {
    switch (item.type) {
      case "http":
        requests.push({ path: "/", value: item });
        break;
      case "folder":
        navigateFolders(item);
        break;
    }
  });

  return {
    root,
    requests,
    folders,
  };
};
