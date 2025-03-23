import { BrunoCollection } from "@/app/page";

export const data = {
  name: "Mari docs",
  version: "1",
  items: [
    {
      type: "http",
      name: "World",
      seq: 2,
      request: {
        url: "asdsad/:id?asdasdasd=dasdasdasdasdasd{{ROOT}}",
        method: "GET",
        headers: [
          {
            name: "Authorization",
            value: "My value",
            enabled: true,
          },
        ],
        params: [
          {
            name: "asdasdasd",
            value: "dasdasdasdasdasd{{ROOT}}",
            type: "query",
            enabled: true,
          },
          {
            name: "id",
            value: "asdsdddsad",
            type: "path",
            enabled: true,
          },
        ],
        body: {
          mode: "json",
          json: '{\n  "name": "Mari"\n}',
          formUrlEncoded: [],
          multipartForm: [],
          file: [],
        },
        script: {
          req: "const world = 2",
          res: "const pepito = 3",
        },
        vars: {
          req: [
            {
              name: "asd",
              value: "asd",
              enabled: true,
              local: false,
            },
          ],
          res: [
            {
              name: "asdsad",
              value: "asdasdasd",
              enabled: true,
              local: false,
            },
            {
              name: "",
              value: "",
              enabled: true,
              local: false,
            },
          ],
        },
        assertions: [
          {
            name: "body.world",
            value: "gt asdsadsad",
            enabled: true,
            uid: "k5650rd80GYSpklPesmnw",
          },
        ],
        tests: "",
        docs: "",
        auth: {
          mode: "bearer",
          bearer: {
            token: "asdasdasdasdasdsad",
          },
        },
      },
    },
    {
      type: "folder",
      name: "Clientes",
      root: {
        docs: "Hi, esta es la documentación valenciana",
        meta: {
          name: "Clientes",
        },
      },
      items: [
        {
          type: "http",
          name: "Obtener cliente",
          seq: 2,
          request: {
            url: "https://jsonplaceholder.typicode.com/todos/2",
            method: "GET",
            headers: [],
            params: [],
            body: {
              mode: "none",
              formUrlEncoded: [],
              multipartForm: [],
              file: [],
            },
            script: {},
            vars: {},
            assertions: [],
            tests: "",
            docs: "",
            auth: {
              mode: "none",
            },
          },
        },
        {
          type: "http",
          name: "Obtener clientes",
          seq: 1,
          request: {
            url: "https://jsonplaceholder.typicode.com/todos/1",
            method: "GET",
            headers: [],
            params: [],
            body: {
              mode: "none",
              formUrlEncoded: [],
              multipartForm: [],
              file: [],
            },
            script: {},
            vars: {},
            assertions: [],
            tests: "",
            docs: "# Bien, ahora tenemos documentación\n\n|Params|World|\n| --- | --- |\n| SAd | asdasd|",
            auth: {
              mode: "none",
            },
          },
        },
        {
          type: "folder",
          name: "BruhFolder",
          items: [
            {
              type: "folder",
              name: "Hi",
              items: [
                {
                  type: "http",
                  name: "Request2",
                  seq: 1,
                  request: {
                    url: "",
                    method: "GET",
                    headers: [],
                    params: [],
                    body: {
                      mode: "none",
                      formUrlEncoded: [],
                      multipartForm: [],
                      file: [],
                    },
                    script: {},
                    vars: {},
                    assertions: [],
                    tests: "",
                    docs: "",
                    auth: {
                      mode: "none",
                    },
                  },
                },
              ],
            },
            {
              type: "http",
              name: "Bruh request",
              seq: 1,
              request: {
                url: "https:www.google.com.br",
                method: "GET",
                headers: [],
                params: [],
                body: {
                  mode: "none",
                  formUrlEncoded: [],
                  multipartForm: [],
                  file: [],
                },
                script: {},
                vars: {},
                assertions: [],
                tests: "",
                docs: "",
                auth: {
                  mode: "none",
                },
              },
            },
          ],
        },
      ],
    },
  ],
  activeEnvironmentUid: "gI3g1XFRk7HsXfuYWzErY",
  environments: [
    {
      variables: [
        {
          name: "ROOT",
          value: "https://www.google.com.br",
          enabled: true,
          secret: false,
          type: "text",
        },
      ],
      name: "ROOT",
    },
    {
      variables: [
        {
          name: "WORLDCITO",
          value: "",
          enabled: true,
          secret: false,
          type: "text",
        },
      ],
      name: "WORLD",
    },
  ],
  root: {
    docs: "Este es una demostración de cómo la documentación puede ser esencial para la escritura de una buena API.\n\nAquí tenemos la posibilidad de tener una buena estructura. Solamente tienes que utilizar ambas manos para tener en cuenta una buena estructura.\n",
  },
  brunoConfig: {
    version: "1",
    name: "Mari docs",
    type: "collection",
    ignore: ["node_modules", ".git"],
    size: 0.0009632110595703125,
    filesCount: 4,
  },
} satisfies BrunoCollection;
