<template>
  <div>
    <div class="div" v-if="!issearch">
      <img src="@/images/u124.png" class="img" />
      <div>
        <!-- <el-input placeholder="请输入内容" class="input" v-model="searchKeyword"></el-input> -->
        <el-autocomplete
          class="inline-input autocomplete"
          v-model="searchKeyword"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          @select="handleSelect"
          @input="getSearchrank"
          @keyup.enter.native="search"
        >
          <!-- <i class="el-icon-edit el-input__icon"
    slot="suffix"><el-button type="primary" icon="el-icon-search">搜索</el-button>
          </i>-->
          <label
            v-for="(item,index) in categories"
            :key="index"
            class="el-input__icon"
            slot="suffix"
          >[{{item}}]</label>
          <template slot-scope="{ item }">
            <el-row>
              <el-col :span="22">
                <div>{{ item.value=item.name }}</div>
              </el-col>
              <el-col style="text-align:right" :span="2">
                <div>{{item.quality}}</div>
              </el-col>
            </el-row>
          </template>
        </el-autocomplete>

        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <img src="@/images/u160.png" class="u160_img" />
      </div>
    </div>
    <div v-if="issearch">
      <div class="searchDiv">
        <!-- <el-input placeholder="请输入内容" class="input"></el-input> -->
        <el-autocomplete
          class="inline-input autocomplete"
          v-model="searchKeyword"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          @select="handleSelect"
          @input="getSearchrank"
          @keyup.enter.native="search"
        >
          <label
            v-for="(item,index) in categories"
            :key="index"
            class="el-input__icon"
            slot="suffix"
          >[{{item}}]</label>
          <template slot-scope="{ item }">
            <el-row>
              <el-col :span="22">
                <div>{{ item.name }}</div>
              </el-col>
              <el-col style="text-align:right" :span="2">
                <div>{{item.quality}}</div>
              </el-col>
            </el-row>
          </template>
        </el-autocomplete>
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <img src="@/images/u160.png" class="u160_img" />
      </div>
      <el-row>
        <el-col :span="18">
          <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane
              :label="`型号(${modellist.num})`"
              :disabled="modellist.num===0"
              class="tab-pane-content"
              name="model"
            >
              <model  :searchkey="searchKeyword" :modellist="modellist.data"></model>
            </el-tab-pane>
            <el-tab-pane
              :label="`产品(${productlist.num})`"
              :disabled="productlist.num===0"
              class="tab-pane-content"
              name="product"
            >
              <product :searchkey="searchKeyword" :productlist="productlist.data"></product>
            </el-tab-pane>
            <el-tab-pane
              :label="`质量问题(${qualityproblemlist.num})`"
              :disabled="qualityproblemlist.num===0"
              class="tab-pane-content"
              name="qualityproblem"
            >
              <quality-problem :searchkey="searchKeyword" :qualityproblemlist="qualityproblemlist.data"></quality-problem>
            </el-tab-pane>
            <el-tab-pane
              :label="`其他(${otherlist.num})`"
              :disabled="otherlist.num===0"
              class="tab-pane-content"
              name="other"
            >
              <other :searchkey="searchKeyword" :otherlist="otherlist.data"></other>
            </el-tab-pane>
          </el-tabs>
        </el-col>

        <el-col :span="5" class="marginTab">
          <div class="grid-content bg-purple-light">
            <el-tabs type="border-card" class="tab_card">
              <el-tab-pane label="关联文本" class="tab-pane-content">
                <div>
                  <ul>
                    <li v-for="item in relatedtext" :key="item.fileid">
                      <a href="#" @click.stop.prevent="showPreview(item.fileid)">{{item.filetittle}}</a>
                    </li>
                  </ul>
                </div>
                <div class="pagination_d page">
                  <!-- 分页区域 -->
                  <el-pagination
                    layout="prev, pager, next"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :total="total"
                    :page-size="queryInfo.pagesize"
                  ></el-pagination>
                </div>
              </el-tab-pane>

              <el-tab-pane label="关联关系" v-if="false">
                <div class="searchDiv">
                  <img src="@/images/u787.png" class="u787_img" />
                </div>
                <el-table :data="resultlist" stripe>
                  <el-table-column label="关系类型" prop="username"></el-table-column>
                  <el-table-column label="关系名称" prop="level"></el-table-column>
                  <el-table-column label="操作" width="180px"></el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="关联标准" class="tab-pane-content">
                <ul>
                  <li v-for="(item,i) in modellist.relatedstandard" :key="item.fileid">
                    {{i+1}}
                    <a
                      href="#"
                      @click.stop.prevent="showPreview(item.fileid)"
                    >{{item.filetittle}}</a>
                  </li>
                </ul>
                <div class="pagination_d page">
                  <!-- 分页区域 -->
                 <el-pagination
                    layout="prev, pager, next"
                    :current-page="1"
                    :total="0"
                    :page-size="10"
                  ></el-pagination>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import Model from '@/components/search/Model'
import Product from '@/components/search/Product'
import QualityProblem from '@/components/search/QualityProblem'
import Other from '@/components/search/Other'

export default {
  components: {
    Model,
    Product,
    QualityProblem,
    Other
  },
  data() {
    return {
      keyword:'',
      searchKeyword: '',
      keywords: [],
      issearch: false,
      activeName: 'model',
      isModel: true,
      isProduct: false,
      isQualityproblem: false,
      isOther: false,
      categories: [],
      relatedtext: [],
      modellist: [],
      productlist: [],
      qualityproblemlist: [],
      otherlist: [],
      // 获取列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      resultlist: [],
      total: 0
    }
  },
  methods: {
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getReport()
    },
    showModel(e) {
      e.currentTarget.value === 'model' ? (this.isModel = true) : (this.isModel = false)
      e.currentTarget.value === 'product' ? (this.isProduct = true) : (this.isProduct = false)

      e.currentTarget.value === 'qualit' ? (this.isQualityproblem = true) : (this.isQualityproblem = false)

      e.currentTarget.value === 'other' ? (this.isOther = true) : (this.isOther = false)
    },
    async getKeywords() {
      const data = await this.$ajax.get('http://192.168.43.228:8081/api/rank/')

      if (data.status !== 200) {
        return this.$message.error('获取关键字检索列表失败！')
      }
      this.keywords = data.data
    },
    querySearch(queryString, cb) {
      var keywords = this.keywords
      var results = queryString ? keywords.filter(this.createFilter(queryString)) : keywords
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return keyword => {
        return keyword.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    async getSearchrank() {
      const data = await this.$ajax.get(`http://192.168.43.228:8081/api/searchclf/${this.searchKeyword}`)
      if (data.status !== 200) {
        clearSearch()
        return this.$message.error('获取检索分类失败！')
      }
      this.categories = data.data
      this.categories.forEach((item, index) => {
        if (item === 'chanpin') {
          // 'status'为属性名，'非活动'为修改后的内容
          this.categories[index] = '产品'
        } else if (item === 'xinghao') {
          this.categories[index] = '型号'
        }
      })
      console.log(this.categories)
    },
    async getSearch() {
      const data = await this.$ajax.get(`http://192.168.43.228:8081/api/search/${this.searchKeyword}`)
      if (data.status !== 200) {
        return this.$message.error('获取检索结果失败！')
      }
      if (data.data) {
        data.data.forEach(item => {
          if (item.name && item.name.indexOf('型号') != -1) {
            this.modellist = item
            console.log(this.modellist)
          } else if (item.name && item.name.indexOf('产品') != -1) {
            this.productlist = item
            console.log(this.productlist)
          } else if (item.name && item.name.indexOf('质量问题') != -1) {
            this.qualityproblemlist = item

            console.log(this.qualityproblemlist)
          } else if (item.name && item.name.indexOf('others') != -1) {
            this.otherlist = item

            console.log(this.otherlist)
          } else if (item.relatedtext) {
            this.relatedtext = item.relatedtext
          }
        })
        if (this.modellist.num > 0) {
          this.activeName = 'model'
        } else if (this.productlist.num > 0) {
          this.activeName = 'product'
        } else if (this.qualityproblemlist.num > 0) {
          this.activeName = 'qualityproble'
        } else if (this.otherlist.num > 0) {
          this.otherlist = 'other'
        }
      }
    },

    clearSearch() {
      this.otherlist = []
      this.modellist = []
      this.relatedtext = []
      this.qualityproblemlist = []
      this.productlist = []
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    test() {
      return [
        { name: '三全鲜食（北新泾店）', quality: 1000 },
        { name: 'Hot honey 首尔炸鸡（仙霞路）', quality: 100 },
        { name: '新旺角茶餐厅', quality: 10 }
      ]
    },
    handleSelect(item) {
      console.log(item)
    },
    search() {
      if (this.searchKeyword.length === 0) {
        return this.$message.error('请输入检索关内容！')
      }
      this.issearch = true
      this.getSearch()
    },

    showPreview(id) {
      this.$router.push({ path: 'preview', query: { flag: 0, id: id } })
      // this.$router.push({name: 'preview', params: {id: id}})
      // this.$router.replace({name:'preview', params: {}}, () => { this.warning('test!') }, () => { this.warning('test!') })
      // let routeData = this.$router.resolve({ path: '/preview', query: { id: 1 } })
      // window.open('preview', '_blank')
    }
  },
  mounted() {
    this.keywords = this.getKeywords()
    //this.keywords = this.test()
  },
  computed: {}
}
</script>

<style lang="less" scoped>
@import '@/assets/css/search.less';
.img {
  width: 454px;
  height: 277px;
  margin-bottom: 20px;
}
.autocomplete {
  width: 640px;
}
.u160_img {
  margin-left: 20px;
}
.col_h {
  height: 30px;
}

.marginTab {
  margin-left: 15px;
  // margin-top: 10px;
}
.u787_img {
  width: 279px;
  height: 244px;
}
.input {
  width: 640px;
}
.u160_img {
  margin-left: 20px;
}
.tab_card {
  height: 640px;
}

ul,
li {
  padding: 0;
  margin: 0;
  list-style: none;
  color: #718aa9;
  border: 1px;
  border-style: solid;
  border-color: #b4d4ff;
  background-color: #e6f0fe;
  height: 30px;
  margin-bottom: 10px;
  line-height: 30px;
}
ul > li > a {
  text-decoration: none;
  font-size: 14px;
  width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: inline-block;
  padding-left: 10px;
}
.tab-pane-conten {
  position: absolute !important;
  bottom: 100px !important;
}
.page {
  bottom: 50px;
  right: 15px;
  position: absolute;
}
</style>

<style lang="less">
@title_bgc: #e6f0fe;
@border_c: #b1d2ff;
.el-tabs--border-card > .el-tabs__header {
  background-color: #ffffff !important;
}
.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
  background-color: #e6f0fe !important;
}
.el-tabs--border-card {
  border: 2px solid @border_c !important;
}
.el-tabs--border-card > .el-tabs__header {
  border-bottom: 2px solid @border_c !important;
}
</style>
