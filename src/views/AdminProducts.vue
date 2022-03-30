<template>
  <div class="container">
    <Loading :active="isLoading" :z-index="1060"></Loading>
    <div class="text-end mt-4">
      <button class="btn btn-dark" type="button" @click="openModal(true)">建立新產品</button>
    </div>
    <table class="table table-hover mt-4">
      <thead class="table-dark">
        <tr>
          <th width="120">分類</th>
          <th>產品名稱</th>
          <th width="120">原價</th>
          <th width="120">售價</th>
          <th width="120">是否啟用</th>
          <th width="120">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.item" :class="{'text-secondary': !product.is_enabled}">
          <td>{{ product.category }}</td>
          <td>{{ product.title }}</td>
          <td>{{ $filters.currency(product.origin_price) }}</td>
          <td>{{ $filters.currency(product.price) }}</td>
          <td>
            <span v-if="product.is_enabled" class="text-success">啟用</span>
            <span v-else class="text-muted">未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button
                type="button"
                class="btn btn-outline-primary btn-sm"
                @click="openModal(false, product)"
              >
                編輯
              </button>
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click="openDelModal(product)"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 分頁元件 -->
    <PaginationCom
      :pages="pagination"
      @emit-pages="getProducts"
    ></PaginationCom>
    <!-- ProductModal:新增、編輯 -->
    <ProductModal
    :is-new="isNew"
    :product="tempProduct"
    @update-product="updateProduct"
    ref="productModal">
    </ProductModal>
    <!-- DelModal:刪除 -->
    <DelModal
    :item="tempProduct"
    @del-item="delProduct"
    ref="delModal">
    </DelModal>
  </div>
</template>

<script>
// 匯入元件
import PaginationCom from '@/components/PaginationCom'
import ProductModal from '@/components/ProductModal'
import DelModal from '@/components/DelModal'

// 環境變數
const apiUrl = process.env.VUE_APP_API
const apiPath = process.env.VUE_APP_PATH

export default {
  // 元件
  components: {
    PaginationCom,
    ProductModal,
    DelModal
  },
  data () {
    return {
      // 存放產品資訊
      products: [],
      // 存放分頁資訊
      pagination: {},
      tempProduct: {},
      isNew: false,
      isLoading: false,
      currentPage: 1
    }
  },
  inject: ['emitter'],
  methods: {
    getProducts (currentPage = 1) {
      this.currentPage = currentPage
      const url = `${apiUrl}/api/${apiPath}/admin/products?page=${currentPage}`
      this.isLoading = true
      this.$http
        .get(url)
        .then((res) => {
          this.products = res.data.products
          this.pagination = res.data.pagination
          this.isLoading = false
        })
        .catch((err) => {
          this.isLoading = false
          this.$httpMessageState(err.response, '錯誤訊息')
        })
    },
    openModal (isNew, item) {
      if (isNew) {
        this.tempProduct = {
          imagesUrl: []
        }
        this.isNew = true
        this.$refs.productModal.openModal()
      } else {
        // 使用淺拷貝避免外層物件一起更動，以及避免單圖產品無法追加圖片
        this.tempProduct = { imagesUrl: [], ...item }
        this.isNew = false // 編輯模式
        this.$refs.productModal.openModal()
      }
    },
    openDelModal (item) {
      this.tempProduct = { ...item }
      this.$refs.delModal.openModal()
    },
    updateProduct (item) {
      this.tempProduct = item
      this.isLoading = true
      let url = `${apiUrl}/api/${apiPath}/admin/product`
      let httpMethod = 'post'

      if (!this.isNew) {
        url = `${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`
        httpMethod = 'put'
      }
      this.$http[httpMethod](url, { data: this.tempProduct })
        .then((res) => {
          this.isLoading = false
          this.$httpMessageState(res, '產品更新')
          this.$refs.productModal.hideModal()
          this.getProducts()
        })
        .catch((err) => {
          this.isLoading = false
          this.$httpMessageState(err, '產品更新')
        })
    },
    delProduct () {
      const url = `${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`
      this.isLoading = true
      this.$http
        .delete(url)
        .then((res) => {
          this.isLoading = false
          this.$httpMessageState(res, '產品刪除')
          this.$refs.delModal.hideModal()
          this.getProducts()
        })
        .catch((err) => {
          this.isLoading = false
          this.$httpMessageState(err.response, '產品刪除')
        })
    }
  },
  mounted () {
    this.getProducts()
  }
}
</script>
