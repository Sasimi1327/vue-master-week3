import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.8/vue.esm-browser.min.js'

const url = 'https://ec-course-api.hexschool.io/v2';

const app = createApp({
  data() {
    return {
      user: {
        username: "",
        password: ""
      }
    }
  },
  methods: {
    signin() { // 1. 登入
      axios.post(`${url}/admin/signin`, this.user)
        .then(res => {
          const { token, expired } = res.data;
          document.cookie = `HexSchoolVueToken=${token}; expires=${new Date(expired)};`;
          location.replace('./products.html')
        })
        .catch(err => {
          Swal.fire({
            icon: "error",
            title: `錯誤 ${err.response.status}`,
            text: err.response.data.message,
            confirmButtonText: "OK",
          });
        })

    }
  }
})
app.mount('#app')

