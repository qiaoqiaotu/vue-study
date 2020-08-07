<!--
 * @Description: 虚拟列表
 * @Version: 1.0
 * @Autor: WangQiaoLing
 * @Date: 2020-08-05 15:49:20
 * @LastEditors: WangQiaoLing
 * @LastEditTime: 2020-08-06 10:49:24
-->
<template>
  <div ref="VirtualList"
       class="virtual-list-container"
       @scroll="scrollEvent($event)">
    <div class="virtual-list-phantom"
         :style="{height: listHeight+'px'}">

      <div class="virtual-list"
           :style="{top: getTop}">
        <list-item class="virtual-list-item"
                   v-for="data in visibleData"
                   :key="data.id"
                   :data="data.content"
                   :style="{height: size+'px'}" />
      </div>
    </div>
  </div>
</template>
<script>
import ListItem from './ListItem'
export default {
  name: 'VirtualList',
  components: {
    ListItem
  },
  props: {
    listData: {
      type: Array,
      default: () => []
    },
    size: {
      type: Number,
      default: 150
    }
  },
  computed: {
    listHeight () {
      return this.listData.length * this.size
    },
    getTop () {
      return `${this.startOffset}px`
    },
    visibleCount () {
      return Math.ceil(this.screenHeight / this.size)
    },
    visibleData () {
      return this.listData.slice(this.start, Math.min(this.end, this.listData.length))
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
    this.end = this.start + this.visibleCount
  },
  methods: {
    scrollEvent (e) {
      let scrollTop = this.$refs.VirtualList.scrollTop
      this.start = Math.floor(scrollTop / this.size)
      this.end = this.start + this.visibleCount
      this.startOffset = scrollTop - (scrollTop % this.size)
    }
  }
}
</script>
<style scoped>
.virtual-list-container {
  height: 100%;
  overflow: auto;
  position: relative;
}
.virtual-list-phantom {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: -1;
}
.virtual-list {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
.virtual-list-item {
  padding: 10px;
  color: #555;
  border-bottom: 1px solid #555;
}
</style>