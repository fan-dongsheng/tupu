<template>
  <el-row class="conten_div">
    <el-col :span="5" class="conten_div">
      <div class="conten_div p_div_border">
        <el-row class="title_div row_height">
          <el-col>关联文本列表</el-col>
        </el-row>
        <el-row>
          <el-col>
            <ul class="col-content">
              <li v-for="(item,i) in datalist.id.datas" :key="item.qualityid">
                {{i+1}}
                <a
                  href="#"
                  @click.stop.prevent="getReportByid(2,item.qualityid)"
                >{{item.zhiliangwenti}}</a>
              </li>
            </ul>
          </el-col>
        </el-row>
        <el-row>
          <!-- 分页区域 -->

          <el-pagination
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :total="total"
            :page-size="queryInfo.pagesize"
          ></el-pagination>
          <!-- 分页区域 -->
          <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">-->
        </el-row>
      </div>
    </el-col>

    <el-col :span="14" class="conten_div">
      <div class="conten_div p_div_border content">
        <el-row class="title_div row_height">
          <el-col :span="22">文件名：【{{content.filetittle}}.{{content.filetype}}】</el-col>
          <el-col :span="1">
            <a href="#" @click.stop.prevent="handlePreview">预览</a>
          </el-col>
          <el-col :span="1">
            <a href="#" @click.stop.prevent>下载</a>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <div v-html="content.filecontent" class="col-content"></div>
          </el-col>
        </el-row>
      </div>
    </el-col>

    <el-col :span="5" class="conten_div" v-if="true">
      <div class="conten_div p_div_border">
        <el-row class="title_div row_height">
          <el-col>关联实体</el-col>
        </el-row>
        <el-row>
          <el-col>
            <div>【质量问题】{{content.entity.zhiliangwenti}}</div>
            <div>【型号】{{content.entity.xinhao}}</div>
            <div>【产品】{{content.entity.chanpin}}</div>
            <div>【问题部件】{{content.entity.wentibujian}}</div>
            <div>【异常描述】{{content.entity.yichangmiaoshu}}</div>
            <div>【发生问题时间】{{content.entity.fashengwentishijian}}</div>
          </el-col>
        </el-row>
      </div>
    </el-col>
  </el-row>
</template>
<script>
export default {
  props: {
    id: String
  },

  data() {
    return {
      activeName: '1',
      datalist: [],
      content: {},
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      total: 0,
      modelid: '',
      productid: '',

      flag: 0
    }
  },
  methods: {
    async getReport() {
      // const data = await this.$ajax(
      //   {
      //     method: 'get',
      //     url: `http://192.168.43.228:8081/api/filenum/${modelid}/${productid}?size:${queryInfo.pagesize}`,
      //     headers: {
      //       'Content-type': 'application/x-www-form-urlencoded'
      //     }
      //   },
      //   { page: this.queryInfo.pagenum, size: this.queryInfo.size }
      // )
      const data = await this.$ajax.get(`http://192.168.43.228:8081/api/filenum/${this.modelid}/${this.productid}?size=${this.queryInfo.pagesize}&page=${this.queryInfo.pagenum}`, {
        page: this.queryInfo.pagenum,
        size: this.queryInfo.size
      })
      if (data.status !== 200) {
        return this.$message.error('获取报告失败！')
      }

      this.datalist = data.data
      this.total = this.datalist.id.count

      console.log(this.total)
      this.content = this.datalist.content
    },
    async getReportByid(flag, id) {
      const data = await this.$ajax.get(`http://192.168.43.228:8081/api/fileid/${id}`)
      if (data.status !== 200) {
        return this.$message.error('获取报告失败！')
      }
      if (flag != 2) {
        this.datalist = data.data
      }
      this.content = data.data.content
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getReport()
    },
    handlePreview() {
      var url = 'http://127.0.0.1:8080/file/test.txt' //要预览文件的访问地址
      window.open('http://127.0.0.1:8012/onlinePreview?url=' + encodeURIComponent(url))
    }
  },

  mounted() {
    //this.$route.query.key
  },
  //flag=0就只返回一个报告，
  created() {
    if (this.$route.query.flag === 0) {
      this.flag = this.$route.query.flag
      this.modelid = this.$route.query.id
      this.getReportByid(this.$route.query.flag, this.$route.query.id)
    } else if (this.$route.query.flag === 1) {
      this.flag = this.$route.query.flag
      this.modelid = this.$route.query.modelid
      this.productid = this.$route.query.productid
      this.getReport(this.$route.query.modelid, this.$route.query.productid)
    }
  }
}
</script>
<style lang="less"  scoped>
@import '../assets/css/search.less';
@left: 15px;
.row_height {
  height: 40px;
  line-height: 40px;
  padding-left: @left;
}
.content {
  margin-left: @left;
}
.conten_div {
  height: 99%;
}
.title_div {
  border-bottom: 2px solid @border_c;
}
.p_div_border {
  border: 2px solid @border_c;
}
ul,
li {
  padding: 0;
  margin: 0;
  list-style: none;
}
ul,
li,
a {
  text-decoration: none;
  font-size: 14px;
}
.col-content {
  margin-top: @left;
  margin-left: @left;
}
.collapse-item-header {
  padding-left: @left;
  padding-right: @left;
}
</style>
