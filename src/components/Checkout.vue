<template>
  <div class="row justify-content-center">
    <div class="col-lg-10">
      <h2 class="text-center border-bottom pb-3 m-0">
        <span>填寫資訊</span>
      </h2>
      <button
        class="btn btn-outline-secondary btn-sm text-left rounded-0 mt-3 mb-5"
        @click="showCarts"
      >
        訂單細節
        <i
          class="arrowIcon fal fa-arrow-circle-up ml-1"
          :class="{'arrowRotate': arrowRotate}"
        ></i>
      </button>
      <div class="carts">
        <table class="table">
          <thead>
            <th
              colspan="2"
              width="100"
            >品名</th>
            <th class="text-right">天數</th>
            <th class="text-right">總計</th>
          </thead>
          <tbody>
            <tr
              v-for="item in carts.carts"
              :key="item.id"
            >
              <td>
                <img
                  class="img-fluid"
                  width="56"
                  :src="item.product.imageUrl"
                  alt
                />
              </td>
              <td class="align-middle">
                {{item.product.title}}
                <p
                  class="text-success m-0"
                  v-if="item.final_total !== item.total"
                >已套用優惠券</p>
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
          </tfoot>
        </table>
      </div>
      <form
        class="border-bottom mb-5"
        @submit.prevent="createOrder"
      >
        <div class="form-row">
          <div class="form-group col-md-6">
            <div class="input-group border-bottom">
              <div class="input-group-prepend">
                <div class="input-group-text bg-white border-0">
                  <i class="fal fa-user"></i>
                </div>
              </div>
              <input
                type="text"
                name="name"
                class="form-control border-0"
                placeholder="您的真實姓名"
                v-model="form.user.name"
                v-validate="'required'"
              />
            </div>
           
          </div>
          <div class="form-group col-md-6">
            <div class="input-group border-bottom">
              <div class="input-group-prepend">
                <div class="input-group-text bg-white border-0">
                  <i class="fal fa-mobile-alt"></i>
                </div>
              </div>
              <input
                type="tel"
                name="tel"
                class="form-control border-0"
                placeholder="手機或市話"
                v-model="form.user.tel"
                v-validate="'required'"
              />
            </div>
           
          </div>
        </div>
        <div class="form-group">
          <div class="input-group border-bottom">
            <div class="input-group-prepend">
              <div class="input-group-text bg-white border-0">
                <i class="fal fa-envelope"></i>
              </div>
            </div>
            <input
              type="email"
              name="email"
              class="form-control border-0"
              placeholder="Email"
              v-model="form.user.email"
              v-validate="'required|email'"
            />
          </div>
         
        </div>

        <div class="form-group">
          <div class="input-group border-bottom mb-4">
            <div class="input-group-prepend">
              <div class="input-group-text bg-white border-0">
                <i class="fal fa-home-lg"></i>
              </div>
            </div>
            <input
              type="text"
              name="address"
              class="form-control border-0"
              placeholder="請輸入住址"
              v-model="form.user.address"
              v-validate="'required'"
            />
          </div>
         
        </div>
        <div class="form-group">
          <label>
            <i class="fal fa-house-return"></i>
            <i class="fal fa-shipping-fast p-3"></i>
            <span class="text-secondary">取車方式</span>
          </label>
          <div class="form-row justify-content-center">
            <div class="form-group col-md-5">
              <div class="custom-control custom-radio custom-control-inline ml-5 ml-md-0">

                <!-- 選擇超商取貨，則 convenience 為 true，顯示超商門市位址欄位-->
                <input
                  type="radio"
                  name="delivery"
                  class="custom-control-input"
                  id="convenience-store"
                  @change="convenience = true"
                  required
                />
                <label
                  class="custom-control-label"
                  for="convenience-store"
                >到店取車</label>
              </div>
            </div>
            <div class="form-group col-md-5">
              <div class="custom-control custom-radio custom-control-inline">

                <!-- 選擇宅配，超商門市位址 delivery 為 false，則在下一頁訂單資訊表中不會顯示超商門市地址 -->
                <input
                  type="radio"
                  name="delivery"
                  class="custom-control-input"
                  id="home-delivery"
                  @change="convenience = false;"
                />
                <label
                  class="custom-control-label"
                  for="home-delivery"
                >配車到府</label>
              </div>
            </div>
          </div>
        </div>

        <!-- 如果選擇到店取車，才會顯示分店地址 -->
        <div
          class="form-group delivery"
          v-if="convenience"
        >
          <div class="input-group border-bottom mb-4">
            <div class="input-group-prepend">
              <div class="input-group-text bg-white border-0">
                <i class="fal fa-igloo"></i>
              </div>
            </div>
            <input
              type="text"
              name="convenience"
              class="form-control border-0"
              placeholder="請填入分店名稱或地址"
              v-model="form.user.delivery"
              v-validate="'required'"
            />
          </div>
          
        </div>
        <div class="form-group">
          <label for="orderMessage">
            <i class="fal fa-comment-alt p-3"></i>
            留言 (選填)
          </label>
          <textarea
            class="form-control"
            name="orderMessage"
            id="orderMessage"
            cols="30"
            rows="10"
            placeholder="歡迎留下額外訂單要求或改進建議"
            v-model="form.message"
          ></textarea>
        </div>

        <div class="text-right">
          <button
            type="submit"
            class="btn btn-outline-dark rounded-0 px-5 mb-5"
          >送出訂單</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
          // 超商門市位址
          delivery: '',
        },
        message: '',
      },
      // 是否啟用超商取貨
      convenience: false,
      // 控制訂單細節的箭頭
      arrowRotate: false,
    };
  },
  methods: {
    // 建立訂單
    createOrder() {
      const vm = this;
      const apiUrl = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/order`;

      const order = vm.form;

      vm.$store.dispatch('updateLoading', true);

     
          axios.post(apiUrl, { data: order }).then((response) => {
            if (response.data.success) {
              vm.$router.push(`/cart/checkout/${response.data.orderId}`);
              vm.$store.dispatch('getCarts');
            }
          });
        
    
    },
    // 購物車細節
    showCarts() {
      $('.carts').slideToggle();
      this.arrowRotate = !this.arrowRotate;
    },
  },
  computed: {
    carts() {
      return this.$store.state.carts;
    },
  },
};
</script>

<style lang="scss" scoped>
.carts {
  display: none;
}

.arrowIcon {
  transition: all 0.5s;
}

.arrowRotate {
  transform: rotate(180deg);
  transition: all 0.5s;
}
</style>
