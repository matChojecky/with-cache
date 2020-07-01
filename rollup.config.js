import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import {terser} from "rollup-plugin-terser";
import tsc from 'typescript';

export default {
 input: 'src/index.ts', // our source file
 output: [
  {
   file: pkg.main,
   format: 'cjs'
  },
  {
   file: pkg.module,
   format: 'es' // the preferred format
  },
  {
   file: pkg.browser,
   format: 'iife',
   name: 'WithCacheCombiner' // the global which can be used in a browser
  }
 ],
 external: [
  ...Object.keys(pkg.dependencies || {})
 ],
 plugins: [
  typescript({
    tsconfig: "tsconfig.json",
    typescript: tsc,
    clean: true
  }),
  terser({
    output: {
      comments: false
    }
  }) // minifies generated bundles
 ]
};