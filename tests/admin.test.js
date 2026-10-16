import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Vue from "vue";
import App from "../src/App.vue";

let wrapper;
const settle = async () => {
  await Vue.nextTick();
  await new Promise((resolve) => setTimeout(resolve, 0));
  await Vue.nextTick();
};
const button = (text) =>
  wrapper.findAll("button").wrappers.find((item) => item.text() === text);
const makeQuestion = (title) => ({
  title,
  category: "HTML",
  options: ["一", "二", "三", "四"],
  answer: "B",
});

beforeEach(() => {
  localStorage.clear();
  wrapper = mount(App, {
    mocks: {
      $message: { success: vi.fn(), error: vi.fn() },
      $confirm: vi.fn().mockResolvedValue("confirm"),
    },
  });
});
afterEach(() => {
  wrapper.destroy();
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

describe("Quiz 管理后台", () => {
  it("渲染题目表格，查询和重置筛选，切换分页", async () => {
    expect(wrapper.findAll(".el-table__body tbody tr")).toHaveLength(5);
    await wrapper.find("#keyword").setValue("HTML");
    await wrapper.find("form.filters").trigger("submit");
    expect(wrapper.vm.filteredRows).toHaveLength(2);
    expect(wrapper.text()).toContain("HTML 的全称是什么？");
    await button("重置").trigger("click");
    expect(wrapper.vm.filteredRows).toHaveLength(10);
    wrapper
      .findComponent({ name: "ElPagination" })
      .vm.$emit("current-change", 2);
    await settle();
    expect(wrapper.vm.pageRows[0].id).toBe(6);
    expect(wrapper.text()).toContain("HTML 中用于创建超链接的标签是？");
    wrapper.vm.category = "Vue";
    wrapper.vm.search();
    expect(wrapper.vm.page).toBe(1);
    expect(wrapper.vm.filteredRows).toHaveLength(2);
  });

  it("使用实际弹窗表单添加和修改题目，刷新后保留", async () => {
    await button("添加题目").trigger("click");
    await settle();
    await wrapper.find("textarea").setValue("测试新题目");
    const inputs = wrapper.findAll(".option-grid input").wrappers;
    for (let i = 0; i < inputs.length; i++)
      await inputs[i].setValue(["一", "二", "三", "四"][i]);
    await wrapper.findAll('input[type="radio"]').at(1).setChecked();
    await button("保存题目").trigger("click");
    await settle();
    expect(wrapper.vm.questions).toHaveLength(11);
    const row = wrapper.vm.questions.at(-1);
    expect(row).toMatchObject({ title: "测试新题目", answer: "B" });
    wrapper.vm.openEditor(row);
    await settle();
    await wrapper.find("textarea").setValue("修改后的题目");
    await button("保存题目").trigger("click");
    await settle();
    expect(wrapper.vm.questions.at(-1).title).toBe("修改后的题目");
    const reloaded = mount(App);
    expect(reloaded.vm.questions.at(-1).title).toBe("修改后的题目");
    reloaded.destroy();
  });

  it("必填校验阻止空题目，取消编辑不修改原始选项", async () => {
    wrapper.vm.openEditor();
    await settle();
    wrapper.vm.saveRow();
    await settle();
    expect(wrapper.vm.questions).toHaveLength(10);
    expect(wrapper.vm.dialogVisible).toBe(true);
    expect(wrapper.text()).toContain("请填写题目内容");
    wrapper.vm.openEditor(wrapper.vm.questions[0]);
    wrapper.vm.form.options[0] = "未保存的选项";
    wrapper.vm.dialogVisible = false;
    expect(wrapper.vm.questions[0].options[0]).toBe("中国");
  });

  it("用户增改查与重复用户名校验", async () => {
    wrapper.vm.activeTab = "users";
    await settle();
    await button("添加用户").trigger("click");
    await settle();
    Object.assign(wrapper.vm.form, {
      username: "新同学",
      password: "study123",
      date: "2026-10-16",
    });
    await button("保存用户").trigger("click");
    await settle();
    expect(wrapper.vm.users).toHaveLength(7);
    const row = wrapper.vm.users.at(-1);
    wrapper.vm.openEditor(row);
    await settle();
    wrapper.vm.form.username = "改名同学";
    wrapper.vm.saveRow();
    await settle();
    expect(wrapper.vm.users.at(-1).username).toBe("改名同学");
    wrapper.vm.openEditor();
    await settle();
    Object.assign(wrapper.vm.form, {
      username: "demo",
      password: "study123",
      date: "2026-10-16",
    });
    wrapper.vm.saveRow();
    await settle();
    expect(wrapper.vm.users).toHaveLength(7);
    expect(wrapper.text()).toContain("这个用户名已存在");
    wrapper.vm.dialogVisible = false;
    await wrapper.find("#keyword").setValue("改名");
    await wrapper.find("form.filters").trigger("submit");
    expect(wrapper.vm.filteredRows).toHaveLength(1);
  });

  it.each(["questions", "users"])(
    "删除 %s 最后一页数据后返回有效页码，取消删除保留数据",
    async (tab) => {
      wrapper.vm.activeTab = tab;
      await settle();
      const list = wrapper.vm[tab].slice(0, 6);
      wrapper.vm.persist(list);
      wrapper.vm.page = 2;
      await wrapper.vm.removeRow(list[5]);
      expect(wrapper.vm[tab]).toHaveLength(5);
      expect(wrapper.vm.page).toBe(1);
      expect(
        JSON.parse(localStorage.getItem(`quiz-${tab}-v1`)),
      ).toHaveLength(5);
      wrapper.vm.$confirm.mockRejectedValueOnce("cancel");
      await wrapper.vm.removeRow(list[0]);
      expect(wrapper.vm[tab]).toHaveLength(5);
    },
  );

  it("本地存储失败时不显示保存成功，也不丢掉正在编辑的内容", async () => {
    wrapper.vm.openEditor();
    await settle();
    Object.assign(wrapper.vm.form, makeQuestion("存储失败测试"));
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    wrapper.vm.saveRow();
    await settle();
    expect(wrapper.vm.questions).toHaveLength(10);
    expect(wrapper.vm.dialogVisible).toBe(true);
    expect(wrapper.vm.$message.error).toHaveBeenCalled();
    expect(wrapper.vm.$message.success).not.toHaveBeenCalled();
  });
});
