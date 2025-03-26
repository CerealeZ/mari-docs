import { Breadcrumb, For } from "@chakra-ui/react";
import { Fragment } from "react";

interface Props {
  path: string[];
  onClick: (path: string) => void;
}

export const Categories = (props: Props) => {
  return (
    <>
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link
              as={"button"}
              cursor={"pointer"}
              onClick={() => props.onClick("/")}
            >
              Home
            </Breadcrumb.Link>
          </Breadcrumb.Item>

          <For each={props.path}>
            {(path, key) => {
              return (
                <Fragment key={key}>
                  <Breadcrumb.Separator />
                  <Breadcrumb.Item
                    as={"button"}
                    cursor={"pointer"}
                    // Haz join de los paths por cada nivel
                    onClick={() =>
                      props.onClick(
                        "/" + props.path.slice(0, key + 1).join("/")
                      )
                    }
                  >
                    <Breadcrumb.Link>{path}</Breadcrumb.Link>
                  </Breadcrumb.Item>
                </Fragment>
              );
            }}
          </For>
        </Breadcrumb.List>
      </Breadcrumb.Root>
    </>
  );
};
