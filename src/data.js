export const letters = ["A", "B", "C", "D"];

export const seedUsers = [
  { id: 1, username: "Demo", password: "demo2026", date: "2026-10-10" },
  { id: 2, username: "林同学", password: "quiz1010", date: "2026-10-10" },
  { id: 3, username: "陈小满", password: "study123", date: "2026-10-11" },
  { id: 4, username: "许晨", password: "web2026", date: "2026-10-12" },
  { id: 5, username: "周可", password: "quiz1024", date: "2026-10-13" },
  { id: 6, username: "小何", password: "hello123", date: "2026-10-15" },
];

export const seedQuestions = [
  {
    id: 1,
    title: "世界上国土面积最大的国家是？",
    category: "常识",
    options: ["中国", "俄罗斯", "加拿大", "美国"],
    answer: "B",
  },
  {
    id: 2,
    title: "法国的首都是哪里？",
    category: "常识",
    options: ["伦敦", "柏林", "巴黎", "马德里"],
    answer: "C",
  },
  {
    id: 3,
    title: "HTML 的全称是什么？",
    category: "HTML",
    options: ["超文本标记语言", "高级文本语言", "超链接语言", "主页工具语言"],
    answer: "A",
  },
  {
    id: 4,
    title: "在 JavaScript 中，哪个关键字用于声明常量？",
    category: "JavaScript",
    options: ["var", "let", "const", "static"],
    answer: "C",
  },
  {
    id: 5,
    title: "CSS 的主要作用是什么？",
    category: "CSS",
    options: ["处理数据逻辑", "描述网页样式", "连接数据库", "编写后端接口"],
    answer: "B",
  },
  {
    id: 6,
    title: "HTML 中用于创建超链接的标签是？",
    category: "HTML",
    options: ["<p>", "<img>", "<div>", "<a>"],
    answer: "D",
  },
  {
    id: 7,
    title: "设置文字颜色应该使用哪个 CSS 属性？",
    category: "CSS",
    options: ["color", "font-size", "background", "border"],
    answer: "A",
  },
  {
    id: 8,
    title: "JavaScript 数组中，哪个方法可以在末尾添加元素？",
    category: "JavaScript",
    options: ["pop()", "shift()", "push()", "slice()"],
    answer: "C",
  },
  {
    id: 9,
    title: "Vue 中实现表单双向绑定的指令是？",
    category: "Vue",
    options: ["v-if", "v-model", "v-for", "v-show"],
    answer: "B",
  },
  {
    id: 10,
    title: "Element UI 中用于展示表格的组件是？",
    category: "Vue",
    options: ["el-form", "el-input", "el-menu", "el-table"],
    answer: "D",
  },
];

export function loadList(key, fallback) {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (Array.isArray(saved)) return saved;
  } catch {
    /* 没有可用的本地记录时使用初始数据。 */
  }
  return JSON.parse(JSON.stringify(fallback));
}

export function today() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
