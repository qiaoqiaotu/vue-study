<template>
  <div>
    <div class="write-btn">
      <el-button @click="submit" type="primary">提交</el-button>
    </div>
    <el-row>
      <el-col :span="12">
        <!-- Markdown编辑器的基本操作 -->
        <textarea
          class="md-editor"
          name=""
          id=""
          cols="30"
          rows="10"
          @input="update"
        ></textarea>
      </el-col>
      <el-col :span="12">
        <div class="markdown-body" v-html="compiledContent"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import marked from 'marked'
export default {
  data() {
    return {
      content: `# hello
      * 吃饭
      * 睡觉
      * 写代码`,
    }
  },
  computed: {
    compiledContent() {
      return marked(this.content, {})
    },
  },
  methods: {
    submit() {},
    update() {},
  },
}
</script>

<style scoped></style>
