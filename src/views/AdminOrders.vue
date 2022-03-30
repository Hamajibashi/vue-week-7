<template>
  <div class="container">
    <Loading :active="isLoading" :z-index="1060"></Loading>
    <table class="table table-hover mt-4">
      <thead class="table-dark">
        <tr>
          <th>購買時間</th>
          <th>Email</th>
          <th>購買款項</th>
          <th>應付金額</th>
          <th>是否付款</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="item in orders" :key="item.id">
        <tr v-if="orders.length" :class="{'text-secondary':!item.is_paid}">
          <td>{{$filters.date(item.create_at)}}</td>
          <td>{{item.user.email}}</td>
          <td>{{item.create_at}}</td>
          <td>{{item.total}}</td>
          <td>
            <span v-if="item.is_paid" class="text-success fw-bold">已付款</span>
            <span v-else class="text-muted">未付款</span>
          </td>
          <td>
            <div class="btn-group">
              <button
                type="button"
                class="btn btn-outline-primary btn-sm"
                @click="openModal(item)"
              >
                檢視
              </button>
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click="openDelOrderModal(item)"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
        </template>
      </tbody>
    </table>
    <OrderModal
    :order="tempOrder"
    ref="orderModal"
    @update-paid="updatePaid"
    ></OrderModal>
    <DelModal
    :item="tempOrder"
    ref="delModal"
    @del-item="delOrder"
    ></DelModal>
    <PaginationCom :pages="pagination"
      @emit-pages="getOrders"></PaginationCom>
  </div>
</template>

<script>
// 匯入元件
import PaginationCom from '@/components/PaginationCom'
import OrderModal from '@/components/OrderModal'
import DelModal from '@/components/DelModal'

// 環境變數
const apiUrl = process.env.VUE_APP_API
const apiPath = process.env.VUE_APP_PATH

export default {
  components: {
    PaginationCom,
    OrderModal,
    DelModal
  },
  data () {
    return {
      orders: {},
      pagination: {},
      tempOrder: {},
      isNew: false,
      isLoading: false,
      currentPage: 1
    }
  },
  inject: ['emitter'],
  methods: {
    getOrders (currentPage = 1) {
      this.currentPage = currentPage
      const url = `${apiUrl}/api/${apiPath}/admin/orders?page=${currentPage}`
      this.isLoading = true
      this.$http.get(url, this.tempProduct)
        .then((res) => {
          this.orders = res.data.orders
          this.pagination = res.data.pagination
          this.isLoading = false
        })
        .catch((err) => {
          this.isLoading = false
          this.$httpMessageState(err.response, '錯誤訊息')
          alert(err.data.message)
        })
    },
    openModal (item) {
      this.tempOrder = { ...item }
      this.isNew = false
      this.$refs.orderModal.openModal()
    },
    openDelOrderModal (item) {
      this.tempOrder = { ...item }
      this.$refs.delModal.openModal()
    },
    updatePaid (item) {
      this.isLoading = true
      const url = `${apiUrl}/api/${apiPath}/admin/order/${this.tempOrder.id}`
      const paid = {
        is_paid: item.is_paid
      }
      this.$http.put(url, { data: paid })
        .then((res) => {
          this.isLoading = false
          this.$refs.orderModal.hideModal()
          this.getOrders(this.currentPage)
          this.$httpMessageState(res, '更新付款狀態')
        })
        .catch((err) => {
          this.isLoading = false
          this.$httpMessageState(err.response, '錯誤訊息')
        })
    },
    delOrder () {
      const url = `${apiUrl}/api/${apiPath}/admin/order/${this.tempOrder.id}`
      this.isLoading = true
      this.$http.delete(url)
        .then((res) => {
          this.isLoading = false
          this.$httpMessageState(res, '刪除訂單')
          this.$refs.delModal.hideModal()
          this.getOrders(this.currentPage)
        })
        .catch((err) => {
          this.isLoading = true
          this.$httpMessageState(err.response, '錯誤訊息')
        })
    }
  },
  mounted () {
    this.getOrders()
  }
}
</script>
