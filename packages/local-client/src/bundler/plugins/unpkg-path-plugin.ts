import axios from 'axios';
import * as esbuild from 'esbuild-wasm';
import { fileCache } from './fetch-plugin';
import { Cache } from './fetch-plugin';

const unpkgHost = 'https://unpkg.com';

export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      // handle root entry file of 'index/js'
      build.onResolve(
        { filter: /(^index\.js)/ },
        async (args: esbuild.OnResolveArgs) => {
          return { path: 'index.js', namespace: 'a' };
        }
      );

      // handle relative paths in a module
      build.onResolve(
        { filter: /^\.+\// },
        async (args: esbuild.OnResolveArgs) => {
          const cache = (await fileCache.getItem<Cache>(args.path))
            ?.onResolveResult;
          if (cache) {
            return cache;
          }
          const result: esbuild.OnResolveResult = {
            namespace: 'a',
            path: new URL(args.path, `${unpkgHost}${args.resolveDir}/`).href,
          };

          await fileCache.setItem(args.path, { onResolveResult: result });
          return result;
        }
      );

      //handle main file of a module
      build.onResolve(
        { filter: /^[^/]+$/ },
        async (args: esbuild.OnResolveArgs) => {
          const cache = (await fileCache.getItem<Cache>(args.path))
            ?.onResolveResult;
          if (cache) {
            return cache;
          }
          const result: esbuild.OnResolveResult = {
            namespace: 'a',
            path: `${unpkgHost}/${args.path}`,
          };
          await fileCache.setItem(args.path, { onResolveResult: result });
          return result;
        }
      );

      // handle rest of the patterns
      build.onResolve({ filter: /.*/ }, async (args: esbuild.OnResolveArgs) => {
        const cache = (await fileCache.getItem<Cache>(args.path))
          ?.onResolveResult;
        if (cache) {
          return cache;
        }
        const path = await onResolveHelper(args.path);
        const result: esbuild.OnResolveResult = {
          namespace: 'a',
          path,
        };
        await fileCache.setItem(args.path, { onResolveResult: result });
        return result;
      });
    },
  };
};

const onResolveHelper = async (inputPath: string) => {
  try {
    const res = await axios.head(`${unpkgHost}/${inputPath}`);
    return res.request.responseURL;
  } catch (err) {
    let resolvedPath = unpkgHost;
    const split = inputPath.split('/');
    for (var i = 0; i < split.length; i++) {
      const res = await axios.head(`${resolvedPath}/${split[i]}`);
      const responseURL = res.request.responseURL;
      if (i === split.length - 1) {
        resolvedPath = responseURL;
        break;
      }
      resolvedPath = unpkgHost + new URL('./', responseURL).pathname;
      console.log(resolvedPath);
    }

    return resolvedPath;
  }
};
