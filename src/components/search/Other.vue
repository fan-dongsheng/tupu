<template>
  <div>

    <div class="div_border" v-for="item in otherlist.content.datas" :key="item.fileid">
      <div class="marginBootom">{{item.filetittle}}</div>
      <el-row>
        <el-col :span="23">
             <div v-html="item.filecontent"  class="summary"></div>
        </el-col>
      </el-row>
    </div>

    <div class="pagination_d">
      <!-- 分页区域 -->
      <el-pagination
        :current-page="1"
        :page-sizes="[2,5,10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :total="otherlist.content.count"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    searchkey: String ,
    otherlist: Array
  },
  data() {
    return {
      isMponentHide: true,
      isFaultHide: true,
       // 获取列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      total: 0
    }
  },
  created() {
    //  test();
  },
  methods: {
    onMShow: function() {
      this.isMponentHide = false //点击onShow切换为false，显示为展开画面
    },
    onMHide: function() {
      this.isMponentHide = true //点击onHide切换为true，显示为折叠画面
    },
    onFShow: function() {
      this.isFaultHide = false
    },
    onFHide: function() {
      this.isFaultHide = true
    },

    async getSearch() {
      const data = await this.$ajax.get(`http://192.168.43.228:8081/api/searchCategory/others/${this.searchkey}?size=${this.queryInfo.pagesize}&page=${this.queryInfo.pagenum}`)
      if (data.status !== 200) {
        return this.$message.error('获取检索结果失败！')
      }
      this.otherlist=data.data;
      console.log(this.otherlist);
      this.total = this.otherlist.content.count
    },

    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getSearch()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getSearch()
    }
  }
}
</script>
<style lang="less"  scoped>
@import '@/assets/css/search.less';
</style>
