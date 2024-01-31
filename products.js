
let bsProductModal = "";
let bsDelModal = "";

const url = 'https://ec-course-api.hexschool.io/v2';
const apiPath = 'sasimi';

const apiGetProducts = `${url}/api/${apiPath}/admin/products/all`;
const baseUrl = `${url}/api/${apiPath}/admin/product`;

const app = Vue.createApp({
  data() {
    return {
      isLoading: false,
      products: {},
      selectProduct: {
        imagesUrl: []
      }
    }
  },
  methods: {
    // 登入驗證
    getTokenFromCookies() {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)HexSchoolVueToken\s*\=\s*([^;]*).*$)|^.*$/,
        "$1",
      );
      axios.defaults.headers.common['Authorization'] = token;
    },
    check() { // 2. 驗證登入
      axios.post(`${url}/api/user/check`)
        .then(res => {
          //驗證成功
          this.getProducts()
        })
        .catch(err => {
          //驗證失敗
          Swal.fire({
            icon: "error",
            title: `錯誤 ${err.response.status}`,
            text: err.response.data.message,
            confirmButtonText: "Got It!",
          }).then((result) => {
            location.replace('./') //按下 confirm button 後才進行跳轉
          });
        })
    },
    // Modal 控制
    showModal(modal) {
      modal.show()
    },
    hideModal(modal) {
      modal.hide()
    },
    // 產品方法
    getProducts() {
      axios.get(apiGetProducts)
      .then(res => {
        this.isLoading = false
        this.products = res.data.products;
      })
      .catch(err => {
        Swal.fire({
          icon: "error",
          title: `錯誤 ${err.response.status}`,
          text: err.response.data.message,
          confirmButtonText: "OK",
        });
      })
    },
    updateProduct(){
      this.isLoading = true;
      const url = `${baseUrl}/${this.selectProduct.id ? this.selectProduct.id : ''}`;
      const updateData = {
        data: this.selectProduct,
      };
      const reqMethod = this.selectProduct.id ? 'put' : 'post';

      axios[reqMethod](url, updateData)
        .then(res => {
          this.hideModal(bsProductModal);
          this.getProducts();
        })
        .catch(err => {
          this.isLoading = false
          Swal.fire({
            icon: "error",
            title: `錯誤 ${err.response.status}`,
            text: err.response.data.message,
            confirmButtonText: "OK",
          });
        })
    },
    deleteProduct(){
      this.isLoading = true;
      const url = `${baseUrl}/${this.selectProduct.id}`;
      axios.delete(url)
        .then(res => {
          this.hideModal(bsDelModal);
          this.getProducts();
        })
        .catch(err => {
          Swal.fire({
            icon: "error",
            title: `錯誤 ${err.response.status}`,
            text: err.response.data.message,
            confirmButtonText: "OK",
          });
        })
    },
    // 開啟 new model
    openNewModal() {
      this.selectProduct = {}
      this.showModal(bsProductModal)
    },
    // 開啟 edit model
    openEditModal(item) {
      this.selectProduct = { ...item }
      this.showModal(bsProductModal)
    },
    // 開啟 remove model
    openDeleteModal(item){
      this.selectProduct = { ...item }
      this.showModal(bsDelModal)
    },
  },
  mounted() {
    this.isLoading = true
    this.getTokenFromCookies();
    this.check();
    // 初始化綁定 Modal
    bsProductModal = new bootstrap.Modal(this.$refs.productModal);
    bsDelModal = new bootstrap.Modal(this.$refs.delProductModal);
  }
});
app.component('loading', VueLoading.Component);
app.mount('#app');