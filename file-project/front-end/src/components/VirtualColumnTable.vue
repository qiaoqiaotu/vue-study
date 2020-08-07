<!--
 * @Description: Description
 * @Version: 1.0
 * @Autor: WangQiaoLing
 * @Date: 2020-08-05 17:15:42
 * @LastEditors: WangQiaoLing
 * @LastEditTime: 2020-08-07 10:22:16
-->
<template>
  <div ref="VirtualColTable"
       class="virtual-col-table-container"
       @scroll="scrollEvent($event)">

    <div class="virtual-col-table-phantom"
         :style="{width:tableWidth +'px'}">

      <div :style="{left: getLeft}"
           class="virtual-col-table">

        <div class="virtual-col-table-item"
             v-for="(data, colIndex) in visibleData"
             :key="colIndex">
          <div v-for="(item, itemIndex) in data"
               :key="item.id">
            <el-input v-if="item !== 'width' && item !== 'id'"
                      :style="{width: item.width + 'px'}"
                      :value="item.name"
                      @input="handleInput(colIndex,itemIndex,item,$event)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
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
    tableWidth () {
      return this.tableData.length * this.size
    },
    getLeft () {
      return `${this.startOffset}px`
    },
    visibleCount () {
      return Math.ceil(this.screenWidth / this.size)
    },
    visibleData () {
      return this.tableData.slice(this.start, Math.min(this.end, this.tableData.length))
    }
  },
  data () {
    return {
      screenWidth: 800,
      startOffset: 0,
      start: 0, // 开始的索引
      end: 10, // 结束的索引
    }
  },
  mounted () {
    // 初始化
    this.end = this.start + this.visibleCount
  },
  methods: {

    handleInput (colIndex, itemIndex, item, e) {
      this.$emit('handleInput', colIndex, itemIndex, item, e)
    },
    scrollEvent (e) {
      let scrollLeft = this.$refs.VirtualColTable.scrollLeft
      if (scrollLeft <= 0) {
        return
      }
      this.start = Math.floor(scrollLeft / this.size)
      this.end = this.start + this.visibleCount
      this.startOffset = scrollLeft - (scrollLeft % this.size)
    }
  }
}
</script>
<style scoped>
.virtual-col-table-container {
  height: 100%;
  overflow: auto;
  position: relative;
}
.virtual-col-table-phantom {
  height: 500px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
.virtual-col-table {
  /* border: 2px solid black; */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
}
.virtual-col-table-item {
  width: 120px;
  margin: 5px;
  border: 1px solid navajowhite;
}
</style>