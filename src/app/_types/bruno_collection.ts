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
