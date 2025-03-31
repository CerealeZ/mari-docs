"use client";

import {
  Box,
  Button,
  EmptyState,
  For,
  Group,
  IconButton,
  Menu,
  Portal,
  Show,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Grid, GridItem, Heading, Span } from "@chakra-ui/react";
import { Prose } from "@/components/ui/prose";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { List } from "@chakra-ui/react";
import { useMemo, useRef, useState } from "react";
import {
  BrunoRequest,
  Environment,
  parseBruno,
  Start,
} from "@/app/_components/start";
import { Categories as Breadcrumbs } from "@/app/_components/categories";
import { FaAngleLeft, FaFolder } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { Searcher } from "@/app/_components/searcher";
import {
  mapValues,
  replaceEnvironmentVariables,
} from "@/app/_utils/bruno-helpers";
import { Categories } from "@/app/_components/content";

export default function Home() {
  const [bruno, setBruno] = useState<ReturnType<typeof parseBruno> | null>(
    null
  );
  if (!bruno) return <Start onLoad={setBruno} />;
  return <BrunApp bruno={bruno} />;
}

const BrunApp = ({ bruno }: { bruno: ReturnType<typeof parseBruno> }) => {
  const { requests, root } = bruno;
  const accordionRef = useRef<{
    setValue: (value: string[], id: string) => void;
  }>(null);
  const [enviromentSelected, setEnviromentSelected] = useState<string>("");
  const [categoryPath, setCategoryPath] = useState("/");
  const { categoryData, splitedPath, categoryFolders, selectedFolder } =
    useBrunoInfo({
      brunoCollection: bruno,
      categoryPath,
      enviromentSelected,
    });

  return (
    <Grid
      gridTemplateColumns={"1rem 1fr 1fr minmax(auto, 57rem) 1fr 1fr 1rem;"}
      minH={"dvh"}
      gridTemplateRows={"auto 1fr"}
    >
      <Grid
        bgColor="colorPalette.fg"
        gridTemplateColumns={"subgrid"}
        gridColumn={"1 / -1"}
      >
        <Box gridColumn={"3 / 6"}>
          <Heading textStyle={"5xl"} color={"colorPalette.contrast"}>
            Mari Docs
          </Heading>
        </Box>
      </Grid>

      <Grid gridTemplateColumns={"subgrid"} gridColumn={"1 / -1"}>
        <Box gridColumn={"3 / 6"}>
          <Grid gridTemplateColumns={"minmax(auto, 20rem) 1fr"} height={"full"}>
            <GridItem borderRight={"1px solid {colors.gray.100}"} p={2}>
              <Box borderBottom={"1px solid {colors.gray.100}"} mb={2}>
                <Group minHeight={"10"}>
                  {categoryPath === "/" ? (
                    <Heading textStyle={"xl"}>{root.name}</Heading>
                  ) : (
                    <>
                      <IconButton
                        variant={"ghost"}
                        onClick={() => {
                          const newPath = categoryPath.split("/");
                          newPath.pop();
                          const path = newPath.join("/") || "/";
                          setCategoryPath(path);
                        }}
                      >
                        <FaAngleLeft />
                      </IconButton>
                      <Heading textStyle={"xl"}>
                        {selectedFolder?.value.name}
                      </Heading>
                    </>
                  )}
                </Group>
                <Searcher
                  requests={requests}
                  onClick={(path, id) => {
                    setCategoryPath(path);
                    accordionRef.current?.setValue([id], id);
                  }}
                />
              </Box>

              <Show
                when={categoryFolders.length > 0}
                fallback={
                  <EmptyState.Root>
                    <EmptyState.Content>
                      <EmptyState.Indicator>
                        <FaFolder />
                      </EmptyState.Indicator>
                      <VStack textAlign="center">
                        <EmptyState.Title>No folders</EmptyState.Title>
                        <EmptyState.Description>
                          There are no folders in this category
                        </EmptyState.Description>
                      </VStack>
                    </EmptyState.Content>
                  </EmptyState.Root>
                }
              >
                <List.Root>
                  <For each={categoryFolders}>
                    {({ value }, index) => {
                      const newPath =
                        categoryPath === "/"
                          ? "/" + value.name
                          : categoryPath + "/" + value.name;

                      return (
                        <List.Item
                          cursor={"pointer"}
                          _marker={{ content: "''" }}
                          key={index}
                        >
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
                    }}
                  </For>
                </List.Root>
              </Show>
            </GridItem>

            <GridItem p={2} position={"relative"}>
              <Breadcrumbs
                path={splitedPath.filter(Boolean)}
                onClick={(path) => {
                  setCategoryPath(path);
                }}
              />
              <Box position={"absolute"} top={2} right={2}>
                <Show when={root.environments.length > 0}>
                  <EnviromentMenu
                    enviroments={root.environments}
                    enviromentSelected={enviromentSelected}
                    onChange={setEnviromentSelected}
                  />
                </Show>
              </Box>
              {categoryPath === "/" ? (
                <CategoryHeader name={root.name} docs={root.root?.docs} />
              ) : (
                <CategoryHeader
                  name={selectedFolder?.value.name}
                  docs={selectedFolder?.value.root?.docs}
                />
              )}
              <Categories ref={accordionRef} data={categoryData} />
            </GridItem>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

const CategoryHeader = ({ name, docs }: { name?: string; docs?: string }) => {
  return (
    <Box>
      <Heading textStyle={"4xl"}>{name}</Heading>
      <Show when={docs}>
        {(docs) => {
          return (
            <Prose>
              <Markdown remarkPlugins={[remarkGfm]}>{docs}</Markdown>
            </Prose>
          );
        }}
      </Show>
    </Box>
  );
};

const EnviromentMenu = ({
  enviroments,
  enviromentSelected,
  onChange,
}: {
  enviroments: ReturnType<typeof parseBruno>["root"]["environments"];
  enviromentSelected: string;
  onChange: (enviroment: string) => void;
}) => {
  return (
    <Group>
      <Text textStyle="sm">
        Enviroment selected:{" "}
        <Span fontWeight={"bold"}>{enviromentSelected || "none"}</Span>
      </Text>
      <Menu.Root>
        <Menu.Trigger asChild>
          <Button size="sm" variant={"subtle"}>
            <FaGear /> Enviroment
          </Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content minW="10rem">
              <Menu.RadioItemGroup
                value={enviromentSelected}
                onValueChange={({ value }) => {
                  onChange(value);
                }}
              >
                <Menu.RadioItem value={""}>
                  No enviroment <Menu.ItemIndicator />
                </Menu.RadioItem>

                {enviroments.map((enviroment) => (
                  <Menu.RadioItem key={enviroment.name} value={enviroment.name}>
                    {enviroment.name}
                    <Menu.ItemIndicator />
                  </Menu.RadioItem>
                ))}
              </Menu.RadioItemGroup>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </Group>
  );
};

const useBrunoInfo = ({
  brunoCollection,
  categoryPath,
  enviromentSelected,
}: {
  brunoCollection: ReturnType<typeof parseBruno>;
  categoryPath: string;
  enviromentSelected: string;
}) => {
  const data = useMemo(() => {
    const { folders, requests, root } = brunoCollection;
    const splitedPath = categoryPath.split("/");
    const mappedRequests = mapValues(requests);
    const mappedFolders = mapValues(folders);
    const categoryFolders = mappedFolders.get(categoryPath) ?? [];
    const prevPath =
      splitedPath.slice(0, splitedPath.length - 1).join("/") || "/";
    const selectedFolder = folders.find((folder) => folder.path === prevPath);
    const enviroments = (
      root.environments.find(
        (enviroment) => enviroment.name === enviromentSelected
      )?.variables ?? []
    ).filter((enviroment) => enviroment.enabled && enviroment.secret === false);

    const makePretty = parseValues(enviroments);

    const categoryData =
      mappedRequests
        .get(categoryPath)
        ?.map(({ value: request }) => makePretty(request)) ?? [];

    return {
      mappedFolders,
      mappedRequests,
      selectedFolder,
      enviroments,
      categoryData,
      categoryFolders,
      splitedPath,
    };
  }, [brunoCollection, categoryPath, enviromentSelected]);

  return data;
};

function parseValues(enviroments: Environment["variables"]) {
  const parseEnviroment = replaceEnvironmentVariables(enviroments);

  return (value: BrunoRequest) => {
    const { request, name } = value;

    const body =
      request.body.mode === "json"
        ? {
            type: "json",
            content: JSON.stringify(JSON.parse(request.body.json), null, 2),
          }
        : undefined;

    const queries = request.params.filter(({ type }) => type === "query");

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
  };
}
