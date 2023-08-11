# Vue 3 + TypeScript + Vite

vue3-admin-template模板

## 项目创建

pnpm安装指令

```
npm i -g pnpm
```

项目初始化命令:

```
pnpm create vite
```

项目安装依赖：

```
pnpm install
```

项目运行：

```
pnpm run dev
```

## 项目配置

### eslint配置

安装：

```
pnpm i eslint -D
```

生成配置文件：.eslint.cjs

```
npx eslint --init
```

**.eslint.cjs配置文件**

```
module.exports = {
   //运行环境
    "env": {
        "browser": true,//浏览器端
        "es2021": true,//es2021
    },
    //规则继承
    "extends": [
       //全部规则默认是关闭的,这个配置项开启推荐规则,推荐规则参照文档
       //比如:函数不能重名、对象不能出现重复key
        "eslint:recommended",
        //vue3语法规则
        "plugin:vue/vue3-essential",
        //ts语法规则
        "plugin:@typescript-eslint/recommended"
    ],
    //要为特定类型的文件指定处理器
    "overrides": [
    ],
    //指定解析器:解析器
    //Esprima 默认解析器
    //Babel-ESLint babel解析器
    //@typescript-eslint/parser ts解析器
    "parser": "@typescript-eslint/parser",
    //指定解析器选项
    "parserOptions": {
        "ecmaVersion": "latest",//校验ECMA最新版本
        "sourceType": "module"//设置为"script"（默认），或者"module"代码在ECMAScript模块中
    },
    //ESLint支持使用第三方插件。在使用插件之前，您必须使用npm安装它
    //该eslint-plugin-前缀可以从插件名称被省略
    "plugins": [
        "vue",
        "@typescript-eslint"
    ],
    //eslint规则
    "rules": {
    }
}
```

##### 1.1vue3环境代码校验插件

```
# 让所有与prettier规则存在冲突的Eslint rules失效，并使用prettier进行代码检查
"eslint-config-prettier": "^8.6.0",
"eslint-plugin-import": "^2.27.5",
"eslint-plugin-node": "^11.1.0",
# 运行更漂亮的Eslint，使prettier规则优先级更高，Eslint优先级低
"eslint-plugin-prettier": "^4.2.1",
# vue.js的Eslint插件（查找vue语法错误，发现错误指令，查找违规风格指南
"eslint-plugin-vue": "^9.9.0",
# 该解析器允许使用Eslint校验所有babel code
"@babel/eslint-parser": "^7.19.1",
```

安装指令

```
pnpm install -D eslint-plugin-import eslint-plugin-vue eslint-plugin-node eslint-plugin-prettier eslint-config-prettier eslint-plugin-node @babel/eslint-parser
```


**当我们运行`pnpm run format`的时候，会把代码直接格式化**

## pinia

store和getters属性名不能重复

## vue3 在js中使用scss变量

在 vite 创建的项目中，如果你想在 js 里引用 scss 文件，需要在后缀前加上 .module

variables.module.scss
```scss
// 左侧菜单宽度
$base-menu-width: 260px;
$base-menu-bgcolor: #0E2026;
$menuText:#bebec0;
$base-menu-active-color: #fff;
// 顶部导航
$base-tabbar-height: 48px;
$base-tabbar-border-color: #E9E9E9;

:export {
  menuBg: $base-menu-bgcolor;
  menuText: $menuText;
  menuActiveText: $base-menu-active-color;
}
```

**重点：需要使用 :export 导出指定变量**

在js中使用:
```vue
<template>
    <div>{{ variables.menuBg }}</div>
</template>
<script setup>
import variables from './styles/variables.module.scss'
console.log(variables, variables.menuBg)
</script>
```

## 如何使用递归组件

```vue
<script lang="ts">
export default {
  name: 'MenuBar'
}
</script>
<script lang="ts" setup>
// 业务逻辑
</script>
```

在组件的 template 中调用自身

```vue
<template>
    <div>
        ...
        <MenuBar />
    </div>
</template>
```