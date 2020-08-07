<!--
 * @Description: Description
 * @Version: 1.0
 * @Autor: WangQiaoLing
 * @Date: 2020-08-05 17:05:45
 * @LastEditors: WangQiaoLing
 * @LastEditTime: 2020-08-07 10:12:13
-->
<template>
  <div class="vtable-demo">
    <el-button @click="addCols">添加列</el-button>
    <el-button @click="getAllColsData">获取数据</el-button>
    <div class="table-container">
      <!-- 表格head -->
      <div class="table-head"
           ref="tableHead">
        <div class="table-head-item"
             v-for="row in tableHead"
             :key="row.id"
             :style="{width:row.width+'px',height:row.height+'px',border:'1px solid red'}">{{row.content}}</div>
      </div>
      <!-- 表格body -->
      <div class="table-body"
           ref="tableBody">
        <virtual-column-table :tableData="tableBody"
                              @handleInput="handleInput" />
      </div>
    </div>

  </div>
</template>
<script>
import VirtualColumnTable from '../components/VirtualColumnTable'
export default {
  components: {
    VirtualColumnTable
  },
  data () {
    return {
      tableData: {
        rows: [
          {
            id: 0,
            content: '时间',
            width: 100,
            height: 100,
          },
          {
            id: 1,
            content: '姓名',
            width: 100,
            height: 100,
          },
          {
            id: 2,
            content: '住址',
            width: 100,
            height: 100,
          },
          {
            id: 3,
            content: '时间',
            width: 100,
            height: 100,
          },
          {
            id: 4,
            content: '姓名',
            width: 100,
            height: 100,
          },
          {
            id: 5,
            content: '住址',
            width: 100,
            height: 100,
          },
          {
            id: 6,
            content: '时间',
            width: 100,
            height: 100,
          },
          {
            id: 7,
            content: '姓名',
            width: 100,
            height: 100,
          },
          {
            id: 8,
            content: '住址',
            width: 100,
            height: 100,
          }
        ],
        data: []
      },
    }
  },
  computed: {
    tableHead () {
      return this.tableData.rows
    },
    tableBody () {
      return this.tableData.data
    }
  },
  mounted () {
    this.tableData.data = this.gen_bigdata()
  },
  methods: {
    handleInput (colIndex, itemIndex, item, newValue) {
      this.tableData.data[colIndex][itemIndex].name = newValue
    },
    getAllColsData () {

      this.tableData.data.map(item => {
        item.map(item1 => {
          console.log(item1.name);
        })

      })

    },
    gen_bigdata () {
      let list = []
      for (let i = 0; i < 20; i++) {
        let listItem = []
        for (let j = 0; j < 10; j++) {
          listItem.push({
            id: `${i}-${j}`,
            name: `王小虎${i}-${j}`,
            width: 120
          })
        }
        list.push(listItem)
      }
      return list
    },
    addCols () {
      let addList = []
      for (let j = 0; j < 20; j++) {
        addList.push({
          id: `${Math.random(3) * 100}`,
          name: `${Math.random(3) * 100}王小虎`,
          width: 120
        })
      }
      this.tableData.data.push(addList)
    }
  }
}
</script>
<style scoped>
.vtable-demo {
  width: 90%;
  height: 600px;
  margin: 0 auto;
  margin-top: 20px;
}
.vtable-list {
  width: 80%;
  height: 80%;
  border: 1px solid slateblue;
  overflow: auto;
}
.table-container {
  margin-top: 10px;
}
.table-head {
  float: left;
  width: 150px;
  height: 500px;
  overflow: auto;
  border: 1px solid slateblue;
}
.table-head-item,
.table-body-item {
  margin: 5px;
  text-align: center;
  line-height: 100px;
}
.table-body {
  height: 500px;
  /* border: 1px solid red; */
  overflow: auto;
}
</style>