"use client";

import {
  Box,
  Button,
  Clipboard,
  Code,
  DataList,
  EmptyState,
  For,
  IconButton,
  Menu,
  Portal,
  Show,
  Table,
  VStack,
} from "@chakra-ui/react";
import { Badge, Grid, GridItem, Heading, Span, Text } from "@chakra-ui/react";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@/components/ui/accordion";
import { Prose } from "@/components/ui/prose";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { List } from "@chakra-ui/react";
import { useState } from "react";
import { ImInfo } from "react-icons/im";
import { Environment, parseBruno, Start } from "@/app/_components/start";
import { Categories as Breadcrumbs } from "@/app/_components/categories";

export default function Home() {
  const [bruno, setBruno] = useState<ReturnType<typeof parseBruno> | null>(
    null
  );
  const [enviromentSelected, setEnviromentSelected] = useState<string | null>();

  const [categoryPath, setCategoryPath] = useState("/");
  const splitedPath = categoryPath.split("/");

  if (!bruno) return <Start onLoad={setBruno} />;

  const { folders, requests, root } = bruno;

  const mappedRequests = mapValues(requests);
  const mappedFolders = mapValues(folders);
  const path = splitedPath.slice(0, -1).join("/") || "/";
  const selectedFolders = mappedFolders.get(path);
  const selectedFolder = selectedFolders?.find(
    ({ value }) => value.name === splitedPath.at(-1)
  );

  const currentFolders = mappedFolders.get(categoryPath) ?? [];

  const enviroments = (
    root.environments.find(
      (enviroment) => enviroment.name === enviromentSelected
    )?.variables ?? []
  ).filter((enviroment) => enviroment.enabled && enviroment.secret === false);

  const parseEnviroment = replaceEnvironmentVariables(enviroments);

  return (
    <Grid gridTemplateColumns={"24rem 1fr"}>
      <GridItem colSpan={2}>
        <Heading textStyle={"5xl"}>Mari Docs</Heading>
        <Text>Documentación de bruno</Text>
        <Show when={root.environments.length > 0}>
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button variant="outline" size="sm">
                Enviroment
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content minW="10rem">
                  <Menu.RadioItemGroup
                    value={enviromentSelected ?? undefined}
                    onValueChange={({ value }) => {
                      setEnviromentSelected(value);
                    }}
                  >
                    <Menu.RadioItem value={""}>No enviroment</Menu.RadioItem>

                    {root.environments.map((enviroment) => (
                      <Menu.RadioItem
                        key={enviroment.name}
                        value={enviroment.name}
                      >
                        {enviroment.name}
                        <Menu.ItemIndicator />
                      </Menu.RadioItem>
                    ))}
                  </Menu.RadioItemGroup>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Show>
      </GridItem>

      <GridItem>
        {categoryPath === "/" ? (
          <Heading textStyle={"xl"}>{root.name}</Heading>
        ) : (
          <Heading textStyle={"xl"}> {selectedFolder?.value.name}</Heading>
        )}

        <List.Root>
          {currentFolders.map(({ value }, index) => {
            const newPath =
              categoryPath === "/"
                ? "/" + value.name
                : categoryPath + "/" + value.name;

            return (
              <List.Item cursor={"pointer"} key={index}>
                <Button
                  w={"full"}
                  justifyContent={"start"}
                  onClick={() => setCategoryPath(newPath)}
                  variant={"ghost"}
                >
                  {value.name}
                </Button>
              </List.Item>
            );
          })}
        </List.Root>
      </GridItem>
      <GridItem px={4}>
        <Breadcrumbs
          path={splitedPath.filter(Boolean)}
          onClick={(path) => {
            setCategoryPath(path);
          }}
        />
        {categoryPath === "/" ? (
          <>
            <Heading textStyle={"4xl"}>{root.name}</Heading>
            <Prose>
              <Markdown remarkPlugins={[remarkGfm]}>{root.root?.docs}</Markdown>
            </Prose>
          </>
        ) : (
          <>
            <Heading textStyle={"4xl"}> {selectedFolder?.value.name}</Heading>

            <Show when={selectedFolder?.value.root?.docs}>
              {(docs) => {
                return (
                  <Prose>
                    <Markdown remarkPlugins={[remarkGfm]}>{docs}</Markdown>{" "}
                  </Prose>
                );
              }}
            </Show>
          </>
        )}

        <Categories
          data={
            mappedRequests.get(categoryPath)?.map(({ value }) => {
              const { request, name } = value;

              const body =
                request.body.mode === "json"
                  ? {
                      type: "json",
                      content: JSON.stringify(
                        JSON.parse(request.body.json),
                        null,
                        2
                      ),
                    }
                  : undefined;

              const queries = request.params.filter(
                ({ type }) => type === "query"
              );

              const params = request.params.filter(({ type }) => {
                return type === "path";
              });

              return {
                id: request.url + request.method,
                path: parseEnviroment(request.url),
                method: request.method,
                description: name,
                docs: request.docs,
                body: body,
                query:
                  queries.length > 0
                    ? queries.map(({ name, value }) => {
                        return {
                          key: parseEnviroment(name),
                          value: parseEnviroment(value),
                        };
                      })
                    : undefined,

                params:
                  params.length > 0
                    ? params.map(({ name, value }) => {
                        return {
                          key: parseEnviroment(name),
                          value: parseEnviroment(value),
                        };
                      })
                    : undefined,
              };
            }) ?? []
          }
        />
      </GridItem>
    </Grid>
  );
}

const Categories = ({
  data,
}: {
  data: {
    id: string;
    method: string;
    path: string;
    description: string;
    docs: string;
    body?: {
      type: string;
      content: string;
    };
    query?: { key: string; value: string }[];
    params?: { key: string; value: string }[];
  }[];
}) => {
  return (
    <AccordionRoot>
      <For
        each={data}
        fallback={
          <EmptyState.Root>
            <EmptyState.Content>
              <EmptyState.Indicator>
                <ImInfo />
              </EmptyState.Indicator>
              <VStack textAlign="center">
                <EmptyState.Title>No requests</EmptyState.Title>
                <EmptyState.Description>
                  There are no requests in this category
                </EmptyState.Description>
              </VStack>
            </EmptyState.Content>
          </EmptyState.Root>
        }
      >
        {({ description, method, path, docs, body, query, params, id }) => {
          return (
            <AccordionItem key={id} value={id}>
              <AccordionItemTrigger>
                <Badge size={"lg"}>{method}</Badge>
                <Span textStyle={"2xl"}>{description}</Span>
              </AccordionItemTrigger>
              <AccordionItemContent>
                <DataList.Root mb={4}>
                  <DataList.Item>
                    <DataList.ItemLabel>URI</DataList.ItemLabel>
                    <DataList.ItemValue alignItems={"center"} gap={2}>
                      {path}
                      <Clipboard.Root value={path}>
                        <Clipboard.Trigger asChild>
                          <IconButton variant="surface" size="xs">
                            <Clipboard.Indicator />
                          </IconButton>
                        </Clipboard.Trigger>
                      </Clipboard.Root>
                    </DataList.ItemValue>
                  </DataList.Item>
                  <DataList.Item>
                    <DataList.ItemLabel>Method:</DataList.ItemLabel>
                    <DataList.ItemValue>{method}</DataList.ItemValue>
                  </DataList.Item>

                  <Show when={body}>
                    {(body) => {
                      return (
                        <DataList.Item>
                          <DataList.ItemLabel>Body</DataList.ItemLabel>
                          <DataList.ItemValue>
                            <Code whiteSpace={"pre"}>{body.content}</Code>
                          </DataList.ItemValue>
                        </DataList.Item>
                      );
                    }}
                  </Show>

                  <Show when={params}>
                    {(params) => {
                      return (
                        <Box>
                          <Heading>Params</Heading>
                          <Table.Root size="sm" maxW={"60"}>
                            <Table.Header>
                              <Table.Row>
                                <Table.ColumnHeader>Key</Table.ColumnHeader>
                                <Table.ColumnHeader>Value</Table.ColumnHeader>
                              </Table.Row>
                            </Table.Header>
                            <Table.Body>
                              <For each={params}>
                                {({ key, value }, index) => {
                                  return (
                                    <Table.Row key={index}>
                                      <Table.Cell>{key}</Table.Cell>
                                      <Table.Cell>{value}</Table.Cell>
                                    </Table.Row>
                                  );
                                }}
                              </For>
                            </Table.Body>
                          </Table.Root>
                        </Box>
                      );
                    }}
                  </Show>

                  <Show when={query}>
                    {(query) => {
                      return (
                        <Box>
                          <Heading>Queries</Heading>
                          <Table.Root size="sm" maxW={"60"}>
                            <Table.Header>
                              <Table.Row>
                                <Table.ColumnHeader>Key</Table.ColumnHeader>
                                <Table.ColumnHeader>Value</Table.ColumnHeader>
                              </Table.Row>
                            </Table.Header>
                            <Table.Body>
                              <For each={query}>
                                {({ key, value }, index) => {
                                  return (
                                    <Table.Row key={index}>
                                      <Table.Cell>{key}</Table.Cell>
                                      <Table.Cell>{value}</Table.Cell>
                                    </Table.Row>
                                  );
                                }}
                              </For>
                            </Table.Body>
                          </Table.Root>
                        </Box>
                      );
                    }}
                  </Show>
                </DataList.Root>
                <Prose>
                  <Markdown remarkPlugins={[remarkGfm]}>{docs}</Markdown>
                </Prose>
              </AccordionItemContent>
            </AccordionItem>
          );
        }}
      </For>
    </AccordionRoot>
  );
};

interface BrunoRequest {
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
  items: (BrunoFolder | BrunoRequest)[];
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
  environments: unknown[];
  items: (BrunoFolder | BrunoRequest)[];
  brunoConfig: unknown;
  root?: BrunoRoot;
  activeEnvironmentUid?: string;
};

type BrunoRoot = {
  docs?: string;
  meta?: Partial<Record<"name", string>>;
};

const mapValues = <T extends { path: string }>(collection: T[]) => {
  const map = collection.reduce((acc, item) => {
    const { path, ...rest } = item;
    const hasPath = acc.has(path);
    if (hasPath) {
      const requests = acc.get(path);
      requests?.push(rest);
    } else {
      acc.set(path, [rest]);
    }

    return acc;
  }, new Map<string, Omit<T, "path">[]>());
  return map;
};

const replaceEnvironmentVariables =
  (env: Environment["variables"]) => (str: string) => {
    const values = Object.fromEntries(
      env.map(({ name, value }) => [name, value])
    );

    // Reemplazamos usando una expresión regular
    return str.replace(/{{(.*?)}}/g, (_, key) =>
      key.trim() in values ? values[key.trim()] : `{{${key.trim()}}}`
    );
  };
