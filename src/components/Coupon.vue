<template>
  <div class="row justify-content-center mt-5">
    <div class="col-md-9">
      <div class="table-responsive">
        <table class="table table-hover">
          <thead class="thead-light">
            <th>截止日期</th>
            <th>優惠券名稱</th>
            <th>折扣碼</th>
            <th class="text-right">折扣數</th>
            <th class="text-right">是否啟用</th>
            <th class="text-center" width="150">編輯</th>
          </thead>
          <tbody>
            <tr v-for="item in coupons" :key="item.id">
              <td>{{ item.dueDate | dateFormate }}</td>
              <td>{{ item.title }}</td>
              <td>{{ item.code }}</td>
              <td class="text-right">{{ item.percent }} %</td>
              <td class="text-right">
                <span v-if="item.is_enabled" class="text-success">啟用</span>
                <span v-else>未啟用</span>
              </td>
              <td class="text-right d-flex justify-content-around">
                <button class="btn btn-outline-primary btn-sm" @click="openModal('edit', item)">
                  編輯
                </button>
                <button class="btn btn-outline-danger btn-sm" @click="openModal('delete', item)">
                  刪除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="col-md-3">
      <div class="card card-shadow">
        <div class="card-body">
          <form @submit.prevent="createNewCoupon">
            <div class="form-group">
              <label for="couponTitle">優惠券名稱</label>
              <input type="text" class="form-control" id="couponTitle" v-model="title" />
            </div>
            <div class="form-group">
              <label for="couponTitle">折扣碼</label>
              <input type="text" class="form-control" id="couponCode" v-model="code" />
            </div>
            <div class="form-group">
              <label for="couponDueDate">截止日期</label>
              <input type="date" class="form-control" id="couponDueDate" v-model="dueDate" />
            </div>
            <div class="form-group">
              <label for="couponPercent">折扣百分比</label>
              <input
                type="number"
                class="form-control"
                id="couponPercent"
                v-model="percent"
                placeholder="折扣數，單位百分比"
              />
            </div>
            <div class="form-group form-check">
              <input
                type="checkbox"
                class="form-check-input"
                id="couponEnabled"
                v-model="is_enabled"
              />
              <label class="form-check-label" for="couponEnabled">是否啟用</label>
            </div>
            <div class="text-right">
              <button type="submit" class="btn btn-warning">新增</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div class="modal fade" id="couponEditModal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="couponEditModalLabel">修改優惠券</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label for="couponEditTitle">優惠券名稱</label>
                <input
                  type="text"
                  class="form-control"
                  id="couponEditTitle"
                  v-model="template.title"
                />
              </div>
              <div class="form-group">
                <label for="couponEditDueDate">截止日期</label>
                <input
                  type="date"
                  class="form-control"
                  id="couponEditDueDate"
                  v-model="template.dueDate"
                />
              </div>
              <div class="form-group">
                <label for="couponEditPercent">折扣百分比</label>
                <input
                  type="number"
                  class="form-control"
                  id="couponEditPercent"
                  v-model="template.percent"
                  placeholder="折扣數，單位百分比"
                />
              </div>
              <div class="form-group form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="couponEditEnabled"
                  v-model="template.is_enabled"
                />
                <label class="form-check-label" for="couponEditEnabled">是否啟用</label>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button type="submit" class="btn btn-success" @click="editCoupon">確認修改</button>
          </div>
        </div>
      </div>
    </div>

    <!--Delete Modal -->
    <div class="modal fade" id="delCouponModal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="delCouponLabel">刪除優惠券</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            確定要刪除
            <span class="text-danger font-weight-bold">{{ template.title }}</span> 優惠券嗎 ?
            (刪除後無法復原)
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="deleteCoupon">刪除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      code: '',
      dueDate: '',
      percent: '',
      is_enabled: true,
      coupons: [],
      template: {},
    };
  },
  methods: {
    // 取得所有優惠券
    getCoupons(page = 1) {
      const vm = this;
      const apiUrl = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupons?page=${page}`;

      vm.$store.dispatch('updateLoading', true);

      axios.get(apiUrl).then((response) => {
        vm.coupons = response.data.coupons;
        vm.$store.dispatch('updateLoading', false);
      });
    },
    // 新增優惠券
    createNewCoupon() {
      const vm = this;
      const apiUrl = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupon`;

      vm.$store.dispatch('updateLoading', true);

      // 修改日期格式
      vm.dueDate = new Date(vm.dueDate).getTime() / 1000;

      const newCoupon = {
        data: {
          title: vm.title,
          code: vm.code,
          dueDate: vm.dueDate,
          percent: vm.percent,
          is_enabled: vm.is_enabled,
        },
      };

      axios.post(apiUrl, newCoupon).then(() => {
        vm.getCoupons();
        vm.$store.dispatch('updateLoading', false);
      });
    },
    openModal(isDoing, item) {
      const vm = this;
      vm.template = Object.assign({}, item);

      /**
       * ! 使用 eslint 時，不能在 case、default 宣告變數，原因是即使在不同 case 或 default 宣告變數，變數都是可見的
       * ! 所以必須加入 {} 來表示不同作用域
       * * 詳 https://cn.eslint.org/docs/rules/no-case-declarations、https://tinyurl.com/v3bnzox
       */
      switch (isDoing) {
        case 'edit': {
          // 修改日期格式
          const originDate = new Date(item.dueDate * 1000);
          const dateFormate = `${originDate.getFullYear()}-${originDate.getMonth()
            + 1}-${originDate.getDate()}`;

          vm.template.dueDate = dateFormate;
          $('#couponEditModal').modal('show');
          break;
        }
        default:
          $('#delCouponModal').modal('show');
          break;
      }
    },
    // 修改優惠券
    editCoupon() {
      const vm = this;
      const apiUrl = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupon/${vm.template.id}`;

      vm.$store.dispatch('updateLoading', true);

      const editedCoupon = {
        title: vm.template.title,
        is_enabled: vm.template.is_enabled,
        percent: vm.template.percent,
        due_date: new Date(vm.template.dueDate).getTime(),
      };

      axios.put(apiUrl, { data: editedCoupon }).then(() => {
        vm.getCoupons();
        $('#couponEditModal').modal('hide');
        vm.$store.dispatch('updateLoading', false);
      });
    },
    // 刪除優惠券
    deleteCoupon() {
      const vm = this;
      const apiUrl = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupon/${vm.template.id}`;
      vm.$store.dispatch('updateLoading', true);

      $('#deleteModal').modal('show');

      axios.delete(apiUrl).then(() => {
        vm.getCoupons();
        $('#delCouponModal').modal('hide');
        vm.$store.dispatch('updateLoading', false);
      });
    },
  },

  created() {
    this.getCoupons();
  },
};
</script>
