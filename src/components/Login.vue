<template>
  <div class="mt-5">
    <form class="form-signin" @submit.prevent="signin">
      <img class="mb-4" src="/docs/4.2/assets/brand/bootstrap-solid.svg" alt="" width="72" height="72">
      <h1 class="h3 mb-3 font-weight-normal">請登入</h1>
      <label for="inputEmail" class="sr-only">電子郵件</label>
      <input type="email" id="inputEmail" class="form-control" v-model="user.username" placeholder="Email address" required autofocus>
      <label for="inputPassword" class="sr-only">密碼</label>
      <input type="password" id="inputPassword" class="form-control" v-model="user.password" placeholder="Password" required autocomplete>
      <div class="checkbox mb-3">
        <label>
          <input type="checkbox" value="remember-me"> 記得我
        </label>
      </div>
      <button class="btn btn-lg btn-primary btn-block" type="submit">登入</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    signin() {
      const api = `${process.env.VUE_APP_APIPATH}/admin/signin`;
      const vm = this;
      this.$http.post(api, vm.user)
        .then((res) => {
          console.log(res.data);
          if (res.data.success) {
            vm.$router.push('/admin');
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}
.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

</style>
