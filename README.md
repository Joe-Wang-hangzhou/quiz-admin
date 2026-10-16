# Quiz 题库管理

Web 开发技术 10 月 16 日课堂作业。使用 Vue 2 和 Element UI，实现 Quiz 游戏的题目与用户管理。

[在线访问](https://quiz-admin-course-2026.vercel.app/) · [GitHub 源码](.)

## 功能

- 题目：按内容、分类查询，添加、编辑、删除，分页显示。
- 编辑题目时可填写四个选项，并选择一个正确答案。
- 用户：按用户名查询，添加、编辑、删除，检查重名与必填项。
- 删除前确认，数据通过 localStorage 保留，刷新后可以继续使用。
- 窄屏下导航移至顶部，表格可以横向滚动。

初始题库前五道题沿用我之前的 Quiz Game 作业，后五道题补充 HTML、CSS、JavaScript 和 Vue 的基础知识。顶部链接可打开之前的答题页面；两个网站独立运行，后台修改不会同步到旧前台。

用户和密码均为演示数据。本项目没有服务端、登录鉴权和真实账号系统，请勿填写真实密码。不同浏览器之间不共享本地数据。

## 运行

需要 Node.js 20.19+ 或 22.12+。

```sh
npm ci
npm run dev
```

```sh
npm test
npm run test:production
npm run build
npm run preview
```

编译结果位于 `dist/`。Vercel 使用 Vite 预设，构建命令为 `npm run build`，输出目录为 `dist`。

## 文件

- `src/App.vue`：导航、查询、表格、分页和编辑弹窗。
- `src/data.js`：初始数据、本地记录读取和日期格式。
- `src/style.css`：页面布局、组件配色和移动端样式。
- `tests/admin.test.js`：表单、查询、分页和持久化功能测试。

参考 [10.16web](https://github.com/juaner-xc/10.16web) 的作业功能范围，重新编写页面和逻辑，调整布局、题库与配色。
