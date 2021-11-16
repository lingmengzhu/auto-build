<template>
  <div class="layout">
    <div class="header">
      <el-row>
        <el-col>
          <el-select
            v-model="type"
            placeholder="请选择打包类型"
            @change="typeChange"
            class="mr-10"
          >
            <el-option
              v-for="item in typeList"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="branch"
            placeholder="请选择打包分支"
            class="mr-10"
          >
            <el-option
              v-for="item in branchList"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
          <el-button
            :disabled="!branch && running"
            @click="autoBuildReact"
            type="primary"
            >build</el-button
          >
        </el-col>
      </el-row>
    </div>
    <div class="build-info">
      <el-row>
        <el-col :span="8" class="time-line">
          <template v-for="(item, index) in progress">
            <el-row :key="index">
              <el-col :span="12">
                <span class="progress-title" :title="command[index].describe">{{
                  command[index].title
                }}</span>
              </el-col>
              <el-col :span="12">
                <el-progress
                  type="circle"
                  :percentage="item.percentage"
                  :color="item.color"
                  size="mini"
                ></el-progress>
              </el-col>
            </el-row>
          </template>
        </el-col>
        <el-col :span="16" class="build-log">
          <h3>执行日志</h3>
          <vue-editor v-model="content" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { buildVue, buildReact, execCommand } from "../api/index";
let vueBranch = ["dev_7.2.0.0"];
let reactBranch = ["dev_7.2.0.0"];
export default {
  name: "Index",
  data() {
    return {
      running: false,
      type: "react",
      typeList: ["react", "vue"],
      branch: "",
      branchList: reactBranch,
      progress: [
        { percentage: 0, colors: "#f56c6c" },
        { percentage: 0, colors: "#f56c6c" },
        { percentage: 0, colors: "#f56c6c" },
      ],
      command: [
        {
          title: "同步远端更改到本地",
          describe: "git fetch upstream",
        },
        {
          title: "本地代码拉取远端代码",
          describe: "git merge upstream/${branch}",
        },
        {
          title: "打包压缩",
          describe: "npm run build",
        },
      ],
      content: "",
    };
  },
  methods: {
    typeChange(type) {
      this.branch = "";
      switch (type) {
        case "vue":
          this.branchList = vueBranch;
          break;
        default:
          this.branchList = reactBranch;
          break;
      }
    },
    download(data) {
      const url = window.URL.createObjectURL(
        new Blob([data], { type: "application/zip" })
      );
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", "dist.zip");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    autoBuildVue() {
      this.running = true;
      buildVue({ target: this.branch })
        .then((res) => {
          this.download(res.data);
          this.running = false;
        })
        .catch(() => {});
    },
    autoBuildReact() {
      this.running = true;
      buildReact({ target: this.branch })
        .then((res) => {
          this.download(res.data);
          this.running = false;
        })
        .catch(() => {});
    },
    atuoBuild() {
      switch (this.type) {
        case "vue":
          this.autoBuildVue();
          break;
        default:
          this.autoBuildReact();
          break;
      }
    },
    executeCommand(command, env, callBack) {
      execCommand({ command, env }).then((res) => callBack(res));
    },
  },
  mounted() {
    let vm = this;
    if (window.WebSocket) {
      var ws = new WebSocket("ws://192.168.1.149:8009");

      ws.onopen = function () {
        ws.send("conn success");
      };
      ws.onclose = function () {
        console.log("服务器关闭");
      };
      ws.onerror = function () {
        console.log("连接出错");
      };

      ws.onmessage = function (e) {
        console.log("e", e);
        const res = JSON.parse(e.data);
        const { data, step, type } = res;
        console.log("onmessage", res);
        switch (type) {
          case "progress":
            vm.progress.splice(step - 1, 1, data);
            break;
          default:
            vm.content = vm.content + data;
            break;
        }
      };
    }
    this.executeCommand("git branch -r --list", "react", (res) => {
      console.log(res.data);
      const branchStr = res.data
        .replace(/[\r\n]/g, "")
        .trim()
        .replace(/\s+/g, " ");
      const branchArr = branchStr.split(" ");
      reactBranch = branchArr.filter((item) => item.startsWith("upstream"));
      this.typeChange(this.type);
    });
    this.executeCommand("git branch -r --list", "vue", (res) => {
      console.log(res.data);
      const branchStr = res.data
        .replace(/[\r\n]/g, "")
        .trim()
        .replace(/\s+/g, " ");
      const branchArr = branchStr.split(" ");
      vueBranch = branchArr.filter((item) => item.startsWith("upstream"));
      this.typeChange(this.type);
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mr-10 {
  margin-right: 10px;
}
.build-info {
  margin-top: 20px;
}
.progress-title {
  line-height: 130px;
}
</style>
