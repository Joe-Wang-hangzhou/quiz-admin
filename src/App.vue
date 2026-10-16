<template>
  <div class="app-shell">
    <aside class="sidebar">
      <a class="brand" href="#" @click.prevent="activeTab = 'questions'"
        ><span class="brand-mark">Q<span></span></span
        ><span>Quiz <small>题库管理</small></span></a
      >
      <div class="nav-caption">工作台</div>
      <nav aria-label="后台导航">
        <button
          :class="{ selected: activeTab === 'questions' }"
          @click="activeTab = 'questions'"
        >
          <i class="el-icon-reading"></i>题目管理<span>{{
            questions.length
          }}</span>
        </button>
        <button
          :class="{ selected: activeTab === 'users' }"
          @click="activeTab = 'users'"
        >
          <i class="el-icon-user"></i>用户管理<span>{{ users.length }}</span>
        </button>
      </nav>
      <div class="sidebar-bottom">
        <span class="avatar">Q</span>
        <div>课程作业<small>Web 开发技术</small></div>
      </div>
    </aside>

    <div class="workspace">
      <header class="topbar">
        <span
          >Quiz 管理后台 <i class="el-icon-arrow-right"></i>
          {{ isQuestion ? "题目管理" : "用户管理" }}</span
        ><a
          href="https://web-week02-quiz-game.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          >打开答题前台 <i class="el-icon-top-right"></i
        ></a>
      </header>
      <main>
        <div class="page-heading">
          <div>
            <h1>{{ isQuestion ? "题目管理" : "用户管理" }}</h1>
            <p>
              {{
                isQuestion
                  ? "整理题目、调整选项，为下一次答题做好准备。"
                  : "查看参与答题的用户，维护用户名和账号信息。"
              }}
            </p>
          </div>
          <span class="course-label">10 / 16 课堂练习</span>
        </div>
        <div class="summary">
          <span
            ><i :class="isQuestion ? 'el-icon-notebook-2' : 'el-icon-user'"></i
            >{{ isQuestion ? "题库题目" : "用户总数"
            }}<strong>{{ rows.length }}</strong
            >{{ isQuestion ? "道" : "位" }}</span
          ><span v-if="isQuestion" class="summary-note"
            >单选题 <b>·</b> 每题 4 个选项</span
          ><span v-else class="summary-note"
            >本地演示账号，请勿填写真实密码</span
          >
        </div>

        <section
          class="data-panel"
          :aria-label="isQuestion ? '题目列表' : '用户列表'"
        >
          <div class="panel-title">
            <h2>{{ isQuestion ? "题目列表" : "用户列表" }}</h2>
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="openEditor()"
              >{{ isQuestion ? "添加题目" : "添加用户" }}</el-button
            >
          </div>
          <form class="filters" @submit.prevent="search">
            <label for="keyword">{{ isQuestion ? "题目内容" : "用户名" }}</label
            ><el-input
              id="keyword"
              v-model="keyword"
              :placeholder="isQuestion ? '输入题目关键词' : '输入用户名'"
              clearable
              prefix-icon="el-icon-search"
              @clear="search"
            /><template v-if="isQuestion"
              ><label for="category">分类</label
              ><el-select
                id="category"
                v-model="category"
                placeholder="全部分类"
                ><el-option label="全部分类" value="" /><el-option
                  v-for="item in categories"
                  :key="item"
                  :label="item"
                  :value="item" /></el-select></template
            ><el-button type="primary" plain native-type="submit"
              >查询</el-button
            ><el-button @click="resetSearch">重置</el-button>
          </form>

          <el-table
            v-if="isQuestion"
            :key="'questions'"
            :data="pageRows"
            empty-text="没有找到题目，试试其他关键词或添加一道题。"
            :row-key="'id'"
          >
            <el-table-column prop="id" label="编号" width="76"
              ><template slot-scope="scope"
                ><span class="row-number">{{
                  String(scope.row.id).padStart(2, "0")
                }}</span></template
              ></el-table-column
            >
            <el-table-column prop="title" label="题目内容" min-width="280" />
            <el-table-column prop="category" label="分类" width="115"
              ><template slot-scope="scope"
                ><el-tag size="small" effect="plain" type="info">{{
                  scope.row.category
                }}</el-tag></template
              ></el-table-column
            >
            <el-table-column prop="answer" label="正确答案" width="100"
              ><template slot-scope="scope"
                ><span class="answer-label">{{
                  scope.row.answer
                }}</span></template
              ></el-table-column
            >
            <el-table-column label="操作" width="144"
              ><template slot-scope="scope"
                ><el-button type="text" @click="openEditor(scope.row)"
                  >编辑</el-button
                ><el-button
                  class="delete-button"
                  type="text"
                  @click="removeRow(scope.row)"
                  >删除</el-button
                ></template
              ></el-table-column
            >
          </el-table>
          <el-table
            v-else
            :key="'users'"
            :data="pageRows"
            empty-text="没有找到用户，试试其他用户名。"
            :row-key="'id'"
          >
            <el-table-column prop="id" label="编号" width="76" />
            <el-table-column prop="username" label="用户名" min-width="160"
              ><template slot-scope="scope"
                ><span class="user-name"
                  ><span class="mini-avatar">{{
                    scope.row.username.slice(0, 1)
                  }}</span
                  >{{ scope.row.username }}</span
                ></template
              ></el-table-column
            >
            <el-table-column prop="password" label="演示密码" min-width="150"
              ><template slot-scope="scope"
                ><span class="password">••••••••</span></template
              ></el-table-column
            >
            <el-table-column prop="date" label="加入日期" min-width="145" />
            <el-table-column label="操作" width="144"
              ><template slot-scope="scope"
                ><el-button type="text" @click="openEditor(scope.row)"
                  >编辑</el-button
                ><el-button
                  class="delete-button"
                  type="text"
                  @click="removeRow(scope.row)"
                  >删除</el-button
                ></template
              ></el-table-column
            >
          </el-table>
          <div class="pagination">
            <span
              >共 {{ filteredRows.length }}
              {{ isQuestion ? "道题目" : "位用户" }}</span
            ><el-pagination
              background
              layout="prev, pager, next"
              :page-size="pageSize"
              :current-page="page"
              :total="filteredRows.length"
              @current-change="page = $event"
            />
          </div>
        </section>
        <footer class="page-footer">
          <span>Vue + Element UI 课堂练习</span
          ><span>数据仅保存在当前浏览器</span>
        </footer>
      </main>
    </div>

    <el-dialog
      :title="`${editingId === null ? '添加' : '编辑'}${isQuestion ? '题目' : '用户'}`"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="600px"
      @closed="clearValidation"
    >
      <el-form
        v-if="isQuestion && dialogVisible"
        ref="questionForm"
        :model="form"
        :rules="questionRules"
        label-position="top"
        @submit.native.prevent="saveRow"
      >
        <el-form-item label="题目内容" prop="title"
          ><el-input
            v-model.trim="form.title"
            type="textarea"
            :rows="2"
            maxlength="200"
            show-word-limit
            placeholder="请输入完整的题目"
        /></el-form-item>
        <el-form-item label="分类" prop="category"
          ><el-select v-model="form.category"
            ><el-option
              v-for="item in categories"
              :key="item"
              :label="item"
              :value="item" /></el-select
        ></el-form-item>
        <div class="option-grid">
          <el-form-item
            v-for="(letter, index) in letters"
            :key="letter"
            :label="`选项 ${letter}`"
            :prop="`options.${index}`"
            :rules="[
              {
                required: true,
                whitespace: true,
                message: `请填写选项 ${letter}`,
                trigger: 'blur',
              },
            ]"
            ><el-input
              v-model.trim="form.options[index]"
              :placeholder="`选项 ${letter} 的内容`"
              maxlength="200"
          /></el-form-item>
        </div>
        <el-form-item label="正确答案" prop="answer"
          ><el-radio-group v-model="form.answer"
            ><el-radio
              v-for="letter in letters"
              :key="letter"
              :label="letter"
              border
              >{{ letter }}</el-radio
            ></el-radio-group
          ></el-form-item
        >
      </el-form>
      <el-form
        v-else-if="dialogVisible"
        ref="userForm"
        :model="form"
        :rules="userRules"
        label-position="top"
        @submit.native.prevent="saveRow"
      >
        <el-form-item label="用户名" prop="username"
          ><el-input
            v-model.trim="form.username"
            maxlength="20"
            placeholder="请输入用户名"
        /></el-form-item>
        <el-form-item label="演示密码" prop="password"
          ><el-input
            v-model="form.password"
            type="password"
            show-password
            maxlength="32"
            placeholder="6 至 32 位，仅用于课程演示"
        /></el-form-item>
        <el-form-item label="加入日期" prop="date"
          ><el-date-picker
            v-model="form.date"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
        /></el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button
        ><el-button type="primary" @click="saveRow"
          >保存{{ isQuestion ? "题目" : "用户" }}</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { letters, seedQuestions, seedUsers, loadList, today } from "./data";

const required = (message) => [
  { required: true, whitespace: true, message, trigger: "blur" },
];
const storageKeys = {
  questions: "quiz-questions-v1",
  users: "quiz-users-v1",
};

export default {
  name: "App",
  data() {
    return {
      activeTab: "questions",
      letters,
      categories: ["常识", "HTML", "CSS", "JavaScript", "Vue"],
      questions: loadList(storageKeys.questions, seedQuestions),
      users: loadList(storageKeys.users, seedUsers),
      keyword: "",
      appliedKeyword: "",
      category: "",
      appliedCategory: "",
      page: 1,
      pageSize: 5,
      dialogVisible: false,
      editingId: null,
      form: {},
      questionRules: {
        title: required("请填写题目内容"),
        category: required("请选择分类"),
        answer: required("请选择正确答案"),
      },
      userRules: {
        username: [
          ...required("请填写用户名"),
          {
            validator: (rule, value, callback) => {
              const exists = this.users.some(
                (user) =>
                  user.id !== this.editingId &&
                  user.username.toLowerCase() === value.toLowerCase(),
              );
              callback(
                exists ? new Error("这个用户名已存在，请换一个") : undefined,
              );
            },
            trigger: "blur",
          },
        ],
        password: [
          ...required("请填写演示密码"),
          {
            min: 6,
            max: 32,
            message: "密码长度为 6 至 32 位",
            trigger: "blur",
          },
        ],
        date: required("请选择加入日期"),
      },
    };
  },
  computed: {
    isQuestion() {
      return this.activeTab === "questions";
    },
    rows() {
      return this[this.activeTab];
    },
    filteredRows() {
      const field = this.isQuestion ? "title" : "username";
      return this.rows.filter(
        (row) =>
          row[field]
            .toLowerCase()
            .includes(this.appliedKeyword.toLowerCase()) &&
          (!this.isQuestion ||
            !this.appliedCategory ||
            row.category === this.appliedCategory),
      );
    },
    pageRows() {
      return this.filteredRows.slice(
        (this.page - 1) * this.pageSize,
        this.page * this.pageSize,
      );
    },
  },
  watch: {
    activeTab() {
      this.dialogVisible = false;
      this.resetSearch();
    },
  },
  methods: {
    search() {
      this.appliedKeyword = this.keyword.trim();
      this.appliedCategory = this.category;
      this.page = 1;
    },
    resetSearch() {
      this.keyword = "";
      this.appliedKeyword = "";
      this.category = "";
      this.appliedCategory = "";
      this.page = 1;
    },
    openEditor(row) {
      this.editingId = row ? row.id : null;
      this.form = row
        ? JSON.parse(JSON.stringify(row))
        : this.isQuestion
          ? {
              title: "",
              category: "HTML",
              options: ["", "", "", ""],
              answer: "",
            }
          : { username: "", password: "", date: today() };
      this.dialogVisible = true;
      this.$nextTick(this.clearValidation);
    },
    clearValidation() {
      const ref = this.$refs[this.isQuestion ? "questionForm" : "userForm"];
      if (ref) ref.clearValidate();
    },
    saveRow() {
      this.$refs[this.isQuestion ? "questionForm" : "userForm"].validate(
        (valid) => {
          if (!valid) return;
          const editing = this.editingId !== null;
          const list = JSON.parse(JSON.stringify(this.rows));
          const row = JSON.parse(JSON.stringify(this.form));
          row.id = editing
            ? this.editingId
            : Math.max(0, ...list.map((item) => item.id)) + 1;
          if (editing)
            list.splice(
              list.findIndex((item) => item.id === row.id),
              1,
              row,
            );
          else list.push(row);
          if (!this.persist(list)) return;
          this.dialogVisible = false;
          this.$message.success(editing ? "修改已保存" : "添加成功");
        },
      );
    },
    async removeRow(row) {
      try {
        await this.$confirm(
          `确定删除“${this.isQuestion ? row.title : row.username}”吗？`,
          "删除确认",
          {
            confirmButtonText: "删除",
            cancelButtonText: "取消",
            type: "warning",
          },
        );
      } catch {
        return;
      }
      if (this.persist(this.rows.filter((item) => item.id !== row.id)))
        this.$message.success("已删除");
    },
    persist(list) {
      try {
        localStorage.setItem(storageKeys[this.activeTab], JSON.stringify(list));
      } catch {
        this.$message.error("未能保存，请检查浏览器是否允许使用本地存储");
        return false;
      }
      this[this.activeTab] = list;
      this.page = Math.min(
        this.page,
        Math.max(1, Math.ceil(this.filteredRows.length / this.pageSize)),
      );
      return true;
    },
  },
};
</script>
