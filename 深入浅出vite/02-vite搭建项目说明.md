### Vite 开发和生产环境的处理

在 vite 搭建的项目的根目录中有一个`index.html`文件，这个文件就是 Vite 默认作为入口文件。也就是说，当我们本地开启一个服务时，Vite 的 DevServer 会自动返回这个 HTML 文件的内容。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/src/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

我们可以看到这个`body`标签中除了 id 为 root 的根节点之外，还包含了一个声明了`type="module"`的`script`标签:

由于现代浏览器原生支持了 ES 模块规范，因此原生的 ES 模块也可以直接放到浏览器中执行，只需要 script 标签中声明了`type="module"`即可。比如上面的 script 标签就声明了 type="module"，同时 src 指向了`/src/main.tsx`文件，如果本地服务器是 3000 端口，此时相当于请求了`http://localhost:3000/src/main.tsx`这个资源，Vite 的 Dev Server 此时会接受到这个请求，然后读取对应的文件内容，进行一定的中间处理，最后将处理的结果返回给浏览器。

```tsx
import App from "./App.tsx";
import "./index.css";
```

在 Vite 项目中，一个`import 预计即代表一个HTTP请求`。正如上述的代码，分别代表两个不同的请求，Vite Dev Server 会读取本地文件，返回浏览器可以解析的代码。当浏览器解析到新的 import 语句，又会发送新的请求，直至所有资源都加载完成。

Vite 所倡导的`No-bundle`理念的真正含义：利用浏览器原生 ES 模块的支持，实现开发阶段的 Dev Server，进行模块的按需加载，而不是先整体打包再进行加载。相比 webpack 这种必须打包再加载的传统构建模式，Vite 在开发阶段省略了繁琐并且耗时的打包过程，这也是它为什么快的一个重要原因。

### Vite 中 CSS 工程化方案

1. 样式方案的意义

- 开发体验欠佳。比如原生 css 不支持选择器的嵌套：

- 样式污染问题。如果出现同样的类名，很容易造成不同的样式互相覆盖或污染。

- 浏览器兼容问题。为了兼容浏览器，我们需要对一些属性(如：transition)加上不同的浏览器前缀，比如`-webkit-`、`-moz-`、`-ms-`、`-o-`，意味着开发者要针对同一个央视属性写很多的冗余代码。

- 打包后的代码体积问题。如果不用任何的 CSS 工程话方案，所有的 css 代码都将打包到产物中，即使有部分样式并没有在代码中使用，导致产物体积过大。

针对如上 CSS 的痛点，社区中诞生了不少解决方案，常见的有 5 类：

1. `CSS预处理器` : 主流的包括`sass/scss`、`less`等。这些方案各自定义了一套语法，让 css 也能使用嵌套规则，甚至能像编程语言一样定义变量、写条件判断和循环语句，大大增强了样式语言的灵活性，解决了原生 css 的开发体验问题。

2. `css module` : 能将 css 类名处理成 hash 值，这样就可以避免同名的情况下样式污染的问题。

3. `PostCSS` : css 后处理，用来解析和处理 CSS 代码，可以实现的功能非常丰富，比如将`px`转换为`rem`，根据目标浏览器情况自动加上类似于`-moz-`、`-o-`属性前缀等。

4. `CSS in JS` : 主流的包括`emtion`和`styled-components`等，顾名思义，这类方案可以实现直接在 JS 中写样式代码，基本包括了`CSS 预处理`和`CSS Module`的各项优点，非常灵活，解决了开发体验的全局样式污染的问题。

5. `CSS原子化框架` : 如`tailwindcss`和`unocss`等，通过类名来指定样式，大大简化了样式写法，提高了样式开发的效率，主要解决了原生 CSS 开发体验的问题。

### Vite 中的静态资源处理

1. 特殊资源后缀
   Vite 中引入静态资源时，也支持在路径最后加上一些特殊的 query 后缀，包括：

   - `?url`: 表示获取资源的路径，这在只想获取文件路径而不是内容的场景将会很有用。

   - `?raw`: 表示获取资源的字符串内容，如果你只想拿到资源的原始内容，可以使用这个后缀。

   - `?inline`: 表示资源强制内联，而不是打包成单独的文件。

2. 单文件 or 内联

在 Vite 中，所有的静态资源都有两种构建方式，一种是打包成一个单文件，另一种是通过`base64`编码的格式内嵌到代码中。

这两种方案我们应该如何去选择？

对于比较小的资源，适合内联到代码中，一方面对`代码体积`的影响很小，另一方面可以减少不必要的网络请求，`优化网络性能`。而对于比较大的资源，就推荐单独打包成一个文件，而不是内联了，否则可能上 MB 的 base64 字符串内嵌到代码中，导致代码体积瞬间庞大，页面加载性能直线下降。

Vite 中内置的优化方案如下：

- 如果静态资源体积 >= 4KB，则提取成单独的文件

- 如果静态资源体积 <= 4KB，则作为 base64 格式的字符串内联

这个临界值我们也可以通过配置项来配置，`build.assetsInlineLimit`自行配置。配置代码如下:

```ts
// vite.config.ts
{
  build: {
    // 调制临界值为 8 KB
    assetsInlineLimit: 8 * 1024;
  }
}
```

> svg 格式的文件不受这个临时值的影响，始终会打包成单独的文件，因为它和普通格式的图片不一样，需要动态设置一些属性

3. 图片压缩

图片资源的体积往往是项目产物体积的大头，如果能尽可能精简图片的体积，那么对项目整体打包产物体积的优化将会是非常明显的。在 JavaScript 领域有一非常知名的图片压缩库`imagemin`，作为底层的压缩工具，前端的项目中经常基于它来进行图片压缩，比如 Webpack 中大名鼎鼎的`image-webpack-loader`。vite 社区当中也有相应的 plugin---`vite-plugin-imagemin`。

- 安装

```shell
pnpm add -D vite-plugin-imagemin
```

- 配置

```ts
// vite.config.ts
import viteImagemin from "vite-plugin-imagemin";

{
  plugins: [
    // 忽略前面的插件
    viteImagemin({
      // 无损压缩配置，无损压缩下图片质量不会变差
      optipng: {
        optimizationLevel: 7,
      },
      // 有损压缩配置，有损压缩下图片质量可能会变差
      pngquant: {
        quality: [0.8, 0.9],
      },
      // svg 优化
      svgo: {
        plugins: [
          {
            name: "removeViewBox",
          },
          {
            name: "removeEmptyAttrs",
            active: false,
          },
        ],
      },
    }),
  ];
}
```

4. 雪碧图优化

在实际的项目中我们经常会用到各种各样的 svg 图标，虽然 svg 文件一般体积不大，但 Vite 中对于 svg 文件会始终打包成单文件，大量的图标引入之后会导致网络请求的增加，大量的 HTTP 请求会导致网络解析耗时变长，页面加载性能直接受到影响。

> HTTP2 的`多路复用设计`可以解决大量 HTTP 的请求导致的网络加载性能问题，因此雪碧图技术在 HTTP2 并没有明显的优化效果，这个技术更适合在传统的 HTTP1.1 场景下使用(比如本地开发)

```tsx
// 每引入svg文件都会网络请求一次
import Logo1 from "@assets/icons/logo-1.svg";
import Logo2 from "@assets/icons/logo-2.svg";
import Logo3 from "@assets/icons/logo-3.svg";
import Logo4 from "@assets/icons/logo-4.svg";
import Logo5 from "@assets/icons/logo-5.svg";
```

Vite 中提供了 `import.meta.glob` 的语法糖来解决这种批量导入的问题，如上述的 import 语句可以写成下面这样:

```tsx
const icons = import.meta.glob("../../assets/icons/logo-*.svg");
```

因为每引入一个 svg 文件都会网络请求一次，当文件很多时，这是一个比较浪费网络资源的任务，所以我们可以使用合并图标的方案，也叫`雪碧图`。我们可以通过`vite-plugin-svg-icons`来实现这个方案。

- 安装插件

```shell
pnpm add -D vite-plugin-svg-icons
```

- 配置

```ts
// vite.config.ts
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

{
  plugins: [
    // 省略其它插件
    createSvgIconsPlugin({
      iconDirs: [path.join(__dirname, "src/assets/icons")],
    }),
  ];
}
```
