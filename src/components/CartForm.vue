<template>
  <div>
    <!-- 當購物車沒有內容時，顯示這段 -->
    <div
      class="no-carts my-lg-8 py-lg-8"
      v-if="carts.total === 0"
    >
      <h2 class="text-center mb-5">購物車沒有商品哦!</h2>
      <div class="text-center">
        <router-link
          class="btn btn-outline-secondary rounded-0 order-2 px-3 px-md-5 mx-3"
          to="/"
        >回首頁</router-link>
        <router-link
          class="btn btn-outline-dark rounded-0 order-1 px-3 px-md-5 mx-3"
          to="/product"
        >去購物</router-link>
      </div>
    </div>

    <div v-else>
      <h2 class="text-center mb-3">租車明細</h2>
      <table class="table">
        <thead>
          <th width="20"></th>
          <th>品名</th>
          <th class="d-md-table-cell d-none"></th>
          <th
            class="d-md-table-cell d-none text-right"
            width="100"
          >單價</th>
          <th
            class="text-right"
            width="60"
          >天數</th>
          <th
            class="text-right"
            width="100"
          >總計</th>
        </thead>
        <tbody>
          <tr
            v-for="item in carts.carts"
            :key="item.id"
          >
            <td class="align-middle">
              <button
                type="button"
                class="btn btn-outline-danger border-0"
                @click="deleteCart(item.id)"
              >
                <i class="far fa-trash-alt"></i>
              </button>
            </td>
            <td>
              <router-link :to="`/product/${item.product_id}`">
                <img
                  class="img-fluid"
                  width="56"
                  :src="item.product.imageUrl"
                  alt
                />
              </router-link>
            </td>
            <td class="d-md-table-cell d-none align-middle">
              <div class="text-secondary mb-0 ml-3">
                {{item.product.title}}
                <p
                  class="text-success m-0"
                  v-if="item.final_total !== item.total"
                >已套用優惠券</p>
              </div>
            </td>
            <td class="d-none d-md-table-cell text-right align-middle">
              <span v-if="item.final_total === item.total">{{item.product.price|currency}}</span>
              <del
                v-else
                class="text-secondary"
              >{{item.product.price|currency}}</del>
            </td>
            <td class="text-right align-middle">{{item.qty}}</td>
            <td class="text-right align-middle">
              <span v-if="item.final_total === item.total">{{item.total|currency}}</span>
              <span
                v-else
                class="text-success"
              >{{item.final_total|currency}}</span>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td class="d-md-table-cell d-none"></td>
            <td class="d-md-table-cell d-none"></td>
            <td
              colspan="3"
              class="text-right text-success"
              v-if="carts.total !== carts.final_total"
            >折扣價</td>
            <td
              colspan="3"
              class="text-right"
              v-else
            >總計</td>

            <td
              class="text-right text-success"
              v-if="carts.total !== carts.final_total"
            >{{ carts.final_total | currency}}</td>
            <td
              class="text-right"
              v-else
            >{{ carts.total | currency }}</td>
          </tr>
        </tfoot>
      </table>

      <hr />

      <div class="text-center">
        <div class="input-group border-bottom pb-3">
          <div class="input-group-prepend">
            <div class="input-group-text bg-white border-0">
              <i class="fal fa-stars"></i>
            </div>
          </div>
          <input
            type="text"
            class="form-control border-0"
            placeholder="輸入優惠碼"
            v-model="couponCode"
          />
          <div class="input-group-append">
            <button
              class="btn btn-outline-secondary rounded-0 px-4"
              @click="useCoupon"
            >套用</button>
          </div>
        </div>
        <div class="text-right">
          <router-link
            class="btn btn-outline-secondary rounded-0 px-4 my-5 mx-3"
            to="/product"
          >繼續租車</router-link>
          <router-link
            class="btn btn-dark rounded-0 px-5 my-5"
            to="/cart/checkout"
          >結帳去</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      couponCode: '',
    };
  },
  methods: {
    useCoupon() {
      const vm = this;
      const apiUrl = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/coupon`;
      const couponCode = {
        code: vm.couponCode,
      };

      vm.$store.dispatch('updateLoading', true);
      axios.post(apiUrl, { data: couponCode }).then((response) => {
        // 呼叫成功或失敗的 alert
        if (response.data.success) {
          vm.$swal.fire({
            position: 'top-end',
            icon: 'success',
            title: '成功套用優惠券囉 :)',
            showConfirmButton: false,
            timer: 3500,
            allowOutsideClick: false,
          });
        } else {
          vm.$swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: '抱歉，優惠券錯誤或已過期 :(',
            showConfirmButton: true,
            allowOutsideClick: false,
          });
        }
        vm.$store.dispatch('getCarts');
        vm.$store.dispatch('updateLoading', false);
      });
    },

    deleteCart(id) {
      const apiUrl = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart/${id}`;
      axios.delete(apiUrl).then(() => {
        this.$store.dispatch('getCarts');
      });
    },
  },
  computed: {
    carts() {
      return this.$store.state.carts;
    },
  },
  created() {
    this.$store.dispatch('getCarts');
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/customMixins.scss";
.no-carts {
  height: 100%;
  @include BS-xl {
    height: 45vh;
  }
}
</style>
