import { Prose } from "@/components/ui/prose";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRootProvider,
  Badge,
  Box,
  Clipboard,
  Code,
  DataList,
  EmptyState,
  For,
  Heading,
  IconButton,
  Show,
  Span,
  Table,
  useAccordion,
  VStack,
} from "@chakra-ui/react";
import { Ref, useRef, useImperativeHandle, useEffect } from "react";
import { ImInfo } from "react-icons/im";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const Categories = ({
  data,
  ref,
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

  ref?: Ref<{ setValue: (value: string[], id: string) => void }>;
}) => {
  const myRef = useRef<string>(null);

  const accordion = useAccordion({
    collapsible: true,
  });

  useImperativeHandle(
    ref,
    () => ({
      setValue: (value, id) => {
        myRef.current = id;
        accordion.setValue(value);
      },
    }),
    [accordion]
  );

  useEffect(() => {
    if (myRef.current) {
      const myAccordion = document.querySelector(
        `[data-identifier="${myRef.current}"]`
      );

      myAccordion?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      myRef.current = null;
    }
  });

  return (
    <AccordionRootProvider value={accordion}>
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
            <AccordionItem key={id} value={id} data-identifier={id}>
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
    </AccordionRootProvider>
  );
};
