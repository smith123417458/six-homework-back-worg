<template>
  <div>
    <div v-if="!order.is_paid">
      <h2 class="text-center text-success">您的訂單已建立</h2>
      <p class="text-center text-secondary">待付款成功後，將於 8 小時內取車</p>
    </div>
    <dir v-else>
      <h2 class="text-center text-success">您已成功付款</h2>
      <p class="text-center text-secondary">感謝您的預訂，我們將會盡快準備車輛</p>
    </dir>

    <div class="card p-0 card-shadow mb-5 p-3">
      <div class="card-body p-0">
        <table class="table">
          <tbody>
            <tr>
              <th
                class="border-top-0"
                width="280"
              >
                <i class="fal fa-calendar-alt mr-2"></i>
                <span class="font-weight-bold">訂單日期</span>
              </th>
              <td class="border-top-0">{{ order.create_at | dateFormate }}</td>
            </tr>
            <tr>
              <th>
                <i class="fal fa-music-alt mr-2"></i>
                <span class="font-weight-bold">訂單編號</span>
              </th>
              <td>{{ order.id }}</td>
            </tr>
            <tr>
              <th>
                <i class="fal fa-user mr-2"></i>
                <span class="font-weight-bold">姓名</span>
              </th>
              <td>{{ order.user.name }}</td>
            </tr>
            <tr>
              <th>
                <i class="fal fa-mobile-alt mr-2 ml-1"></i>
                <span class="font-weight-bold">電話</span>
              </th>
              <td>{{ order.user.tel }}</td>
            </tr>
            <tr>
              <th>
                <i class="fal fa-envelope mr-2"></i>
                <span class="font-weight-bold">Email</span>
              </th>
              <td>{{ order.user.email }}</td>
            </tr>
            <tr>
              <th>
                <i class="fal fa-home-lg mr-2"></i>
                <span class="font-weight-bold">配車地址</span>
              </th>
              <td>{{ order.user.address }}</td>
            </tr>
            <tr v-if="order.user.delivery">
              <th>
                <i class="fal fa-igloo mr-2"></i>
                <span class="font-weight-bold">分店地址</span>
              </th>
              <td>{{ order.user.delivery }}</td>
            </tr>
            <tr>
              <th>
                <i class="fal fa-comment-alt mr-2"></i>
                <span class="font-weight-bold">備註</span>
              </th>
              <td>{{ order.message }}</td>
            </tr>
            <tr>
              <th>
                <i class="fal fa-dollar-sign ml-1 mr-2"></i>
                <span class="font-weight-bold">付款金額</span>
              </th>
              <td>{{ order.total | currency }}</td>
            </tr>
            <tr>
              <th>
                <i
                  class="fal fa-check-circle mr-2"
                  v-if="order.is_paid"
                ></i>
                <i
                  class="fal fa-exclamation-circle mr-2"
                  v-else
                ></i>付款狀態
              </th>
              <td>
                <span
                  class="text-success"
                  v-if="order.is_paid"
                >
                  <i class="fal fa-check mr-2"></i>已付款
                </span>
                <span
                  class="text-danger"
                  v-else
                >未付款</span>
              </td>
            </tr>

            <!-- 信用卡輸入 -->
            <tr
              id="payForm"
              v-if="!order.is_paid"
            >
              <th
                colspan="2"
                class="border-top-0 pt-5"
              >
                <div class="row ml-1 mb-3">
                  <i class="fab fa-cc-mastercard mr-2"></i>
                  <i class="fab fa-cc-jcb mr-2"></i>
                  <i class="fab fa-cc-visa mr-2"></i>
                  <span class="font-weight-bold">信用卡輸入</span>
                </div>

                <form @submit.prevent="payOrder">
                  <div class="mb-3">
                    <div class="input-group border-bottom">
                      <div class="input-group-prepend">
                        <div class="input-group-text bg-white border-0"><i class="fal fa-lock-alt"></i></div>
                      </div>
                      <input
                        class="form-control border-0  "
                        type="tel"
                        maxlength="16"
                        placeholder="卡號"
                      />
                    </div>
                  </div>
                  <div class="row mb-5">
                    <div class="col-4 col-lg-2">
                      <div class="input-group border-bottom">
                        <input
                          type="tel"
                          class="form-control border-0"
                          placeholder="安全碼"
                          maxlength="3"
                          required
                        />
                      </div>
                    </div>
                    <div class="col-4 col-lg-2">
                      <div class="input-group border-bottom">
                        <input
                          type="tel"
                          class="form-control border-0"
                          placeholder="月份"
                          maxlength="2"
                          required
                        />
                      </div>
                    </div>
                    <div class="col-4 col-lg-2">
                      <div class="input-group border-bottom">
                        <input
                          type="tel"
                          class="form-control border-0"
                          placeholder="年"
                          maxlength="4"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div class="row justify-content-end">
                    <button
                      class="btn btn-outline-danger rounded-0 mr-3"
                      type="submit"
                    >
                      確認付款
                    </button>
                    <p></p>
                  </div>
                </form>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 付款成功才顯示 -->
    <div
      class="nav-button text-center my-5"
      v-if="order.is_paid"
    >
      <router-link
        class="btn btn-outline-secondary rounded-0 mr-3"
        to="/product"
      >回商品頁</router-link>
      <router-link
        class="btn btn-outline-dark rounded-0 ml-3"
        to="/"
      >回首頁</router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      order: {
        user: {},
      },
    };
  },
  methods: {
    // 得到單筆訂單資訊
    getOrder() {
      const vm = this;
      // 取得當下訂單網址路由
      const { orderId } = vm.$route.params;
      const apiUrl = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/order/${orderId}`;

      vm.$store.dispatch('updateLoading', true);

      axios.get(apiUrl).then((response) => {
        vm.order = response.data.order;
        vm.$store.dispatch('updateLoading', false);
      });
    },
    // 確認付款
    payOrder() {
      const vm = this;
      const apiUrl = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/pay/${vm.order.id}`;
      vm.$store.dispatch('updateLoading', true);

      axios.post(apiUrl).then(() => {
        vm.getOrder();

        // 付款成功後，關閉信用卡輸入欄位
        vm.closeForm();

        vm.$swal.fire({
          position: 'top-end',
          icon: 'success',
          title: '您已完成付款囉!',
          showConfirmButton: false,
          timer: 2000,
          allowOutsideClick: false,
        });

        vm.$store.dispatch('updateLoading', false);
      });
    },
    // 關閉信用卡付款表單
    closeForm() {
      $('#payForm').fadeOut();
    },
  },
  created() {
    this.getOrder();
  },
};
</script>

<style lang="scss">
.nav-button {
  transition: all 3s;
}
</style>
