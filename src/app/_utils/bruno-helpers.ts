import { Environment } from "@/app/_components/start";

export const mapValues = <T extends { path: string }>(collection: T[]) => {
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

export const replaceEnvironmentVariables =
  (env: Environment["variables"]) => (str: string) => {
    const values = Object.fromEntries(
      env.map(({ name, value }) => [name, value])
    );

    // Reemplazamos usando una expresión regular
    return str.replace(/{{(.*?)}}/g, (_, key) =>
      key.trim() in values ? values[key.trim()] : `{{${key.trim()}}}`
    );
  };
