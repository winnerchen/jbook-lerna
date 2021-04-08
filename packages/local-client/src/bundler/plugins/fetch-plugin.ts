import * as esbuild from 'esbuild-wasm';
import axios, { AxiosResponse } from 'axios';
import localForage from 'localforage';

export const fileCache = localForage.createInstance({
  name: 'filecache',
});

export interface Cache {
  onLoadResult: esbuild.OnLoadResult;
  onResolveResult: esbuild.OnResolveResult;
}

export const fetchPlugin = (inputCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      // handle index file
      build.onLoad(
        { filter: /(^index\.js)/ },
        async (args: esbuild.OnLoadArgs) => {
          return {
            loader: 'jsx',
            contents: inputCode,
          };
        }
      );

      // search source code in the cache, return directly if it exists
      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        const cache = (await fileCache.getItem<Cache>(args.path))?.onLoadResult;
        if (cache) {
          return cache;
        }
      });

      build.onLoad({ filter: /\.css$/ }, async (args: esbuild.OnLoadArgs) => {
        const response = await axios.get(args.path);
        const result = buildCssOnLoadResult(response);
        await fileCache.setItem(args.path, result);
        return result;
      });

      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        const axiosResponse = await axios.get(args.path);
        const result = buildJsxOnLoadResult(axiosResponse);
        await fileCache.setItem(args.path, { onLoadResult: result });
        return result;
      });
    },
  };
};

const buildJsxOnLoadResult = (response: any): esbuild.OnLoadResult => {
  const {
    data,
    request: { responseURL },
  } = response as AxiosResponse<any>;
  const pathname = new URL('./', responseURL).pathname;
  return {
    loader: 'jsx',
    contents: data,
    resolveDir: pathname,
  };
};

const buildCssOnLoadResult = (response: any): esbuild.OnLoadResult => {
  const {
    data,
    request: { responseURL },
  } = response as AxiosResponse<any>;
  const escaped = data
    .replace(/\n/g, '')
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'");
  const contents = `
    const style = document.createElement('style');
    style.innerText = ${escaped}';
    document.head.appendChild(style);
  `;

  const pathname = new URL('./', responseURL).pathname;

  return {
    loader: 'jsx',
    contents: contents,
    resolveDir: pathname,
  };
};
