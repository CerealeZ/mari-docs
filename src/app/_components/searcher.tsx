import { parseBruno } from "@/app/_components/start";
import {
  Popover,
  InputGroup,
  Input,
  List,
  Text,
  Portal,
  For,
  Grid,
  GridItem,
  Tag,
  EmptyState,
  VStack,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useOnClickOutside } from "usehooks-ts";

export const Searcher = ({
  requests,
  onClick,
}: {
  requests: ReturnType<typeof parseBruno>["requests"];
  onClick: (path: string, id: string) => void;
}) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const popoverRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  // @ts-expect-error Well, I need to watch two elements at the same time, so I need to use an array and this is the only library that supports it
  useOnClickOutside([popoverRef, inputRef], () => {
    setOpen(false);
  });

  const filteredRequests = requests
    .filter((request) => {
      return (
        request.value.name.toLowerCase().includes(search.toLowerCase()) ||
        request.value.request.url.toLowerCase().includes(search.toLowerCase())
      );
    })
    .slice(0, 5);

  return (
    <Popover.Root
      autoFocus={false}
      open={open}
      onEscapeKeyDown={() => {
        setOpen(false);
      }}
    >
      <Popover.Anchor>
        <InputGroup
          ref={inputRef}
          _icon={{ color: "colorPalette.fg" }}
          startElement={<FaSearch />}
        >
          <Input
            variant={"flushed"}
            onChange={(e) => {
              setOpen(true);
              setSearch(e.target.value);
            }}
            onFocus={() => {
              setOpen(true);
            }}
            onClick={() => {
              setOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Tab") {
                setOpen(false);
              }
            }}
            placeholder="get user..."
          />
        </InputGroup>
      </Popover.Anchor>
      <Portal>
        <Popover.Positioner maxW={"400px"} w={"full"}>
          <Popover.Content
            maxW={"400px"}
            w={"full"}
            colorPalette={"purple"}
            ref={popoverRef}
          >
            <Popover.Arrow />
            <Popover.Body>
              <List.Root gap={2}>
                <For
                  each={filteredRequests}
                  fallback={
                    <EmptyState.Root>
                      <EmptyState.Content>
                        <EmptyState.Indicator>
                          <FaSearch />
                        </EmptyState.Indicator>
                        <VStack textAlign="center">
                          <EmptyState.Title>No results</EmptyState.Title>
                          <EmptyState.Description>
                            We could nott find any results for &quot;{search}
                            &quot;
                          </EmptyState.Description>
                        </VStack>
                      </EmptyState.Content>
                    </EmptyState.Root>
                  }
                >
                  {({ value, path }, index) => {
                    return (
                      <List.Item
                        cursor={"pointer"}
                        _marker={{ content: "''" }}
                        _hover={{
                          backgroundColor: "{colors.purple.50}",
                        }}
                        rounded={"sm"}
                        p={2}
                        key={index}
                        onClick={() => {
                          onClick(
                            path,
                            value.request.url + value.request.method
                          );

                          setOpen(false);
                        }}
                      >
                        <Grid
                          gridTemplateColumns={"auto minmax(0, 1fr)"}
                          alignItems={"center"}
                          gap={4}
                        >
                          <GridItem>
                            <Tag.Root>
                              <Tag.Label>{value.request.method}</Tag.Label>
                            </Tag.Root>
                          </GridItem>
                          <GridItem>
                            <Text color={"colorPalette.fg"} fontWeight={"bold"}>
                              {value.name}
                            </Text>
                            <Text fontSize={"sm"} color={"fg.muted"} truncate>
                              {value.request.url}
                            </Text>
                          </GridItem>
                        </Grid>
                      </List.Item>
                    );
                  }}
                </For>
              </List.Root>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};
