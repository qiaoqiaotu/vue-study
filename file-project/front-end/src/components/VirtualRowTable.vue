<!--
 * @Description: Description
 * @Version: 1.0
 * @Autor: WangQiaoLing
 * @Date: 2020-08-05 17:15:42
 * @LastEditors: WangQiaoLing
 * @LastEditTime: 2020-08-06 10:53:57
-->
<template>
  <div ref="VirtualTable"
       class="virtual-table-container"
       @scroll="scrollEvent($event)">
    <div class="virtual-table-phantom"
         :style="{height: tableHeight+'px'}">
      <div class="virtual-table"
           :style="{top: getTop}">
        <table-rows-item class="virtual-table-item"
                         v-for="data in visibleData"
                         :size="data.width"
                         :data="data"
                         :key="data.id"
                         :style="{height: size+'px'}" />
      </div>
    </div>
  </div>
</template>
<script>
import TableRowsItem from './TableRowsItem'

export default {
  components: {
    TableRowsItem
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    size: {
      type: Number,
      default: 120
    }
  },
  computed: {
    tableHeight () {
      return this.tableData.length * this.size
    },
    getTop () {
      return `${this.startOffset}px`
    },
    visibleCount () {
      console.log(Math.ceil(this.screenHeight / this.size));
      return Math.ceil(this.screenHeight / this.size)
    },
    visibleData () {
      return this.tableData.slice(this.start, Math.min(this.end, this.tableData.length))
    }
  },
  data () {
    return {
      screenHeight: 800,
      startOffset: 0,
      start: 0, // 开始的索引
      end: 4, // 结束的索引
    }
  },
  mounted () {
    // 初始化
    this.end = this.start + this.visibleCount
  },
  methods: {
    scrollEvent (e) {
      let scrollTop = this.$refs.VirtualTable.scrollTop
      this.start = Math.floor(scrollTop / this.size)
      this.end = this.start + this.visibleCount
      this.startOffset = scrollTop - (scrollTop % this.size)
    }
  }
}
</script>
<style scoped>
.virtual-table-container {
  height: 100%;
  overflow: auto;
  position: relative;
}
.virtual-table-phantom {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: -1;
}
.virtual-table {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
.virtual-list-item {
  padding: 10px;
  color: #555;
  border: 1px solid #555;
  /* border */
}
</style>