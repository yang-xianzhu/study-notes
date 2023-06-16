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

### Vite 中 css 工程话方案

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
