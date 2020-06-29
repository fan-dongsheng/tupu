<template>
  <el-row>
    <el-col :span="4">
      <!--<el-row class="row-sr">-->
        <!--<el-col>详情</el-col>-->
      <!--</el-row>-->
      <el-row class="row-sr">
        <el-col>
          <el-input placeholder="输入关键字搜索" suffix-icon="el-icon-search" v-model="input2"></el-input>
        </el-col>
      </el-row>
      <el-row class="row-sr">
        <el-col>搜索结果</el-col>
      </el-row>
      <el-row
        class="row-sr"
        v-for="item of listData"
        :key="item.id">
        <div @click="nodeSearch(item.name)">
          <el-col :span="6">
            <img src="@/images/u262x.png" class="img_size1"/>
          </el-col>
          <el-col :span="18">
            <div>{{item.name}}</div>
            <div>{{item.mainKey}}</div>
            <div>{{item.detail}}</div>
          </el-col>
        </div>
      </el-row>
      <div class="pagination_d">
        <!-- 分页区域 -->
        <el-pagination
          :current-page="1"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="1"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-col>
    <el-col :span="15">
      <el-row>
        <el-col :span="20">
          <img src="@/images/u1445.png" class="img_size" @click="backShow"/>
          <img src="@/images/u1447.png" class="img_size" @click="forwardShow"/>
          <img src="@/images/u1449.png" class="img_size" @click="showHistoryDialog"/>
          <img src="@/images/u1451.png" class="img_size" @click="showSearchDialog"/>
          <img src="@/images/u1452.png" class="img_size" @click="showThemeDialog"/>
          <img src="@/images/u1453.png" class="img_size" @click="removeGraph"/>
        </el-col>
        <!--<el-col :span="4">-->
          <!--<img src="@/images/u1022.png" class="img_size"/>-->
          <!--<img src="@/images/u1024.png" class="img_size"/>-->
        <!--</el-col>-->
      </el-row>
      <el-row>
        <el-col>
          <div  id="kgpp" ref="tuImage"></div>
          <!--<kg-plot :loadData="this.nodeData" :wide="720"></kg-plot>-->
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="5">
      <el-row class="row-sr">
        <el-tabs type="border-card">
          <el-tab-pane label="实体">
            <el-table :data="this.resNode">
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column label="实体名称" prop="name"></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="关系"></el-tab-pane>
          <el-tab-pane label="事件">
            <el-table :data="resultlist" stripe>
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column label="关系名称" prop="username"></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </el-col>
    <!-- 搜索话框 -->
    <el-dialog title="定位搜索" :visible.sync="searchVisible" width="30%" @close="searchDialogClosed">
      <el-input v-model="searchNode" placeholder="请输入内容" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="doSearchNode"></el-button>
      </el-input>
    </el-dialog>
     <!-- 历史记录 -->
    <el-dialog title="历史记录" :visible.sync="historyVisible" width="30%">
      <el-table :data="historylist" stripe>
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column label="导入时间" prop="datatime"></el-table-column>
              <el-table-column label="导入实体数量" prop="number"></el-table-column>
            </el-table>
    </el-dialog>
    <!-- 保存主题 -->
    <el-dialog title="分享图谱"  :visible.sync="themeVisible" width="750px">
      <Theme v-on:flag="shutDialog" v-bind:haoba="this.$refs.tuImage"></Theme>
    </el-dialog>
  </el-row>
</template>
<script>
import Theme from '../components/Theme.vue'
import {load} from './js/graph.js'
import {update} from "./js/update";
import {getGraphData} from './js/graph.js'
import {gethistCache} from "./js/graph";


export default {
  components:{
    Theme
  },
  data() {
    return {
      tk: "slkdflksadflasdjf",
      resultlist: [{ username: '发射车故障' }, { username: '系统_型号组成关系' }, { username: '产品_型号组成关系' }],
      searchVisible: false,
      historyVisible:false,
      themeVisible:false,
      historylist:[{datatime:'2019-06-28 16:32:50',number:3},{datatime:'2019-06-26 16:32:50',number:1},{datatime:'2019-06-27 16:32:50',number:2}],
      searchForm: {
        search: []
      },
      searchFormRules: {
        search: [{ required: true, message: '请输入查询的内容', trigger: 'blur' }]
      },
      listData:[{id:0,name:"中北大学",mainKey:"问题1",detail:"分系统1"},
                {id:1,name:"北京理工大学",mainKey:"问题2",detail:"分系统2"},
                {id:2,name:"北京航空航天大学",mainKey:"问题3",detail:"分系统3"},
                {id:3,name:"三部",mainKey:"问题4",detail:"分系统4"},
                {id:4,name:"304",mainKey:"问题5",detail:"分系统5"}],
      nodeData: Object,
      searchNode:'',
      backCount: 1,
      bf: false,
      resNode: []
    }
  },
  methods: {
    searchDialogClosed() {
      this.backCount = 1
      this.$refs.addressFormRef.resetFields()
    },
    showSearchDialog() {
      this.backCount = 1
      this.searchVisible = true
    },
    showHistoryDialog() {
      this.historylist = this.doHistory()
      this.backCount = 1
      this.historyVisible = true
    },
    doHistory() {
      this.$ajax.get('http://localhost:8023/getHistoriesByType?type=knowledge')
        .then(res => {
          let tableData = []
          res.data.data.histories.forEach((val, index, arr) => {
            let obj = {}
            // 处理record
            let subject = val.historySubject
            let scope = val.historyScope
            obj.record = subject + "（" + scope + "）"
            // 处理time
            let date = new Date(val.createDate)
            let year = date.getFullYear()
            let month
            if ((date.getMonth() + 1) < 10) {
              month = "0" + (date.getMonth() + 1)
            } else {
              month = date.getMonth() + 1
            }
            let day
            if ((date.getDate() + 1) < 10) {
              day = "0" + date.getDate()
            } else {
              day = date.getDate()
            }
            let hours = date.getHours()
            let minutes
            if ((date.getMinutes() + 1) < 10) {
              minutes = "0" + date.getMinutes()
            } else {
              minutes = date.getMinutes()
            }
            let seconds
            if ((date.getSeconds() + 1) < 10) {
              seconds = "0" + date.getSeconds()
            } else {
              seconds = date.getSeconds()
            }
            obj.time = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds
            // 处理id
            obj.historyId = val.historyId
            tableData.push(obj)
          })
          return tableData
          // this.$Loading.service().close()
          // this.$emit("listenHistories", tableData)
        })
        .catch(error => {
          console.log(error)
          this.$alert('获取历史记录失败！', '错误', {
            confirmButtonText: '确定',
          })
          // this.$Loading.service().close()
        })
    },
    showThemeDialog() {
      this.backCount = 1
      this.themeVisible = true
    },
    nodeSearch(keyword) {
      this.backCount = 1
      this.$ajax.get('http://localhost:8023/MapDisplay/subGraph?nodeName=' + keyword)
        .then(res => {
          this.resNode = res.data.nodes
          update()
          load(res.data,720,false)
        })
        .catch(error => {
          this.$alert('知识检索失败！', '错误', {
            confirmButtonText: '确定',
          })
          console.log(error)
        })
    },
    removeGraph() {
      this.backCount = 0
      d3.select("#svgGraph").select("#svgOne").selectAll("*").remove(); // 清空SVG中的内容
    },
    doSearchNode() {
      this.backCount = 0
      this.searchVisible = false
      let nodesData = getGraphData()
      let newNodes = []
      let findNode = false
      nodesData.nodes.forEach((val)=> {
        if (val.name == this.searchNode) {
          findNode = true
          val['highLight'] = true;
        } else {
          val['highLight'] = false
        }
        newNodes.push(val)
      } )
      if (findNode) {
        update();
        load({nodes: newNodes, links: nodesData.links}, 720, false);
      } else {
        alert("没有找到该实体")
      }
      this.searchNode = ''
    },
    backShow() {
      let histCacheData = gethistCache();
      if (this.backCount < histCacheData.length) {
        this.backCount++;
      } else {
        this.backCount = histCacheData.length
      }
      console.log(histCacheData.length - this.backCount);
      update()
      load(histCacheData[histCacheData.length - this.backCount],720,true)
    },
    forwardShow() {
      let histCacheData = gethistCache();
      if (this.backCount > 0) {
        this.backCount--;
      } else {
        this.backCount = 0
      }
      update()
      load(histCacheData[this.backCount],720,true)
    },
    shutDialog(da) {
      this.themeVisible = da
    }
  }
}

</script>
<style lang="less" scoped>
  .img_size {
    width: 30px;
    height: 30px;
  }
  .img_size1 {
    width: 40px;
    height: 40px;
  }
  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
.row-sr {
  padding-left: 5px;
  padding-top: 10px;
  padding-bottom: 15px;
  border-bottom: 0.5px;
  border-bottom-style: solid;
  border-bottom-color: #797979;
  //height: 50px;
  border-right: 1px;
  border-right-style: solid;

  //   border-style: solid;
  //   border-top: 0.5px;
  //   border-top-style: solid;
  //   border-top-color: #797979;
}
</style>
