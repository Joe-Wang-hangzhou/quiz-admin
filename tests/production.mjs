import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";

const origin = process.env.PRODUCTION_URL;
const readAsset = async (path) => {
  if (!origin) return readFileSync(new URL(`../dist${path}`, import.meta.url), "utf8");
  const response = await fetch(new URL(path, origin));
  assert.equal(response.status, 200, path);
  return response.text();
};
const html = await readAsset("/index.html");
const asset = html.match(/src="(\/assets\/[^\"]+\.js)"/)[1];
const dom = new JSDOM(html, {
  url: "https://quiz-admin-course-2026.vercel.app",
  runScripts: "outside-only",
  pretendToBeVisual: true,
});
const { window } = dom;
const { document } = window;
const settle = () => new Promise((resolve) => setTimeout(resolve, 50));
const rows = () => [...document.querySelectorAll(".el-table__body tbody tr")];
const click = async (selector, text) => {
  const target = [...document.querySelectorAll(selector)].find(
    (element) => element.textContent.trim() === text,
  );
  assert.ok(target, `找不到 ${text}`);
  target.click();
  await settle();
};
const query = async (keyword) => {
  const input = document.querySelector("#keyword");
  input.value = keyword;
  input.dispatchEvent(new window.Event("input", { bubbles: true }));
  await click("button", "查询");
};

try {
  window.eval(await readAsset(asset));
  await settle();
  assert.equal(rows().length, 5);
  assert.match(rows()[0].textContent, /世界上国土面积最大的国家/);
  await click(".el-pager li", "2");
  assert.match(rows()[0].textContent, /创建超链接/);
  await query("HTML");
  assert.equal(rows().length, 2);
  assert.ok(rows().every((row) => row.textContent.includes("HTML")));
  await click("button", "重置");
  document.querySelector("#category").click();
  await settle();
  await click(".el-select-dropdown__item", "Vue");
  await click("button", "查询");
  assert.equal(rows().length, 2);
  assert.match(rows()[0].textContent, /双向绑定/);
  await query("不存在的题目");
  assert.equal(rows().length, 0);
  assert.match(document.querySelector(".el-table__empty-text").textContent, /没有找到题目/);
  await click("button", "重置");
  assert.equal(rows().length, 5);
  document.querySelectorAll("nav button")[1].click();
  await settle();
  await click(".el-pager li", "2");
  await query("林");
  assert.equal(rows().length, 1);
  assert.match(rows()[0].textContent, /林同学/);
  await query("不存在的用户");
  assert.equal(rows().length, 0);
  assert.match(document.querySelector(".el-table__empty-text").textContent, /没有找到用户/);
  await click("button", "重置");
  assert.equal(rows().length, 5);
  console.log("生产构建验证通过：初始表格、分页、关键词、分类、用户查询、空结果和重置。");
} finally {
  window.close();
}
