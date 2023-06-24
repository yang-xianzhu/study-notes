// 一个虚拟模块的插件
import { Plugin } from "vite";
// 虚拟模块名称
const virtualTestPlugin = "virtual:test";

const resolvedTestId = "\0" + virtualTestPlugin;

export default function virtualTestPluginFn(): Plugin {
  let config = null;
  return {
    name: "vite-plugin-virtual-test",
    resolveId(id) {
      if (id === virtualTestPlugin) {
        return resolvedTestId;
      }
    },
    load(id) {
      if (id === resolvedTestId) {
        return `export default function fn() { console.log('这是一个虚拟模块') }`;
      }
    },
  };
}
