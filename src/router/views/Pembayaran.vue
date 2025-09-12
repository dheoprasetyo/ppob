<template>
  <layout>
    
    <b-container fluid class="p-4">
      <b-row class="mb-4">
        <b-col cols="6">
          <div class="d-flex align-items-center">
            <b-avatar :src="profile.profile_image" size="60px" class="mr-3"></b-avatar>
            <div>
              <p class="text-muted mb-1">Selamat datang,</p>
              <h4 class="font-weight-bold">{{ profile.first_name }} {{ profile.last_name }}</h4>
            </div>
          </div>
        </b-col>
        
        <b-col cols="6">
          <b-card class="bg-danger text-white balance-card">
            <p class="mb-1 opacity-75">Saldo anda</p>
            <div class="d-flex align-items-center">
              <h3 class="font-weight-bold mr-2">
                {{ showBalance ? formatCurrency(balance) : 'Rp • • • • • • •' }}
              </h3>
              
            </div>
            <small class="opacity-75">Lihat Saldo
                <b-button variant="link" class="text-white p-0" @click="toggleBalance">
                    <i :class="showBalance ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
                </b-button>
            </small>
          </b-card>
        </b-col>
      </b-row>

      <b-row class="mb-4">
        <div>
            <h6>Pembayaran</h6>
            <div class="d-flex align-items-center">
                {{ name }}
            </div>

            <div class="input-container">
                <b-form-input
                    v-model="tagihan"
                    placeholder="masukan nominal Top Up"
                    type="text"
                    class="form-control"
                    readonly
                ></b-form-input>
            </div>

            <button 
                class="topup-btn active"
                :disabled="loading"
                @click="transaction()"
            >
                {{ loading ? 'Loading...' : 'Bayar' }}
            </button>
            <p v-if="message" class="text-success mt-2" style="cursor: pointer;" @click="$router.push('/')">{{ message }}, klik disini untuk kembali ke branda</p>
        </div>
      </b-row>
    </b-container>
  </layout>
</template>

<script>
import axios from 'axios'
import Layout from '../layout/Layout.vue';
export default {
  name: 'Pembayaran',
  props:['id', 'name', 'tagihan'],
  components: {
    Layout,
  },
  data() {
    return {
      baseapi: localStorage.getItem("baseapi"),
      token: localStorage.getItem("token"),
      profile: [],
      balance: 0,
      showBalance: false,
      amounts: [10000, 20000, 50000, 100000, 250000, 500000],
      selectedAmount: null,
      loading: false,
      message: ''
      
    }
  },
  methods: {
    toggleBalance() {
      this.showBalance = !this.showBalance;
    },
    formatCurrency(value) {
      const formatted = new Intl.NumberFormat('id-ID').format(value);
      return `Rp ${formatted}`;
    },
    async transaction() {
        console.log('test')
        this.loading = true
        this.errorMsg = ''
        try {
            const res = await axios.post(this.baseapi+'/transaction', {
                service_code: this.id,
            },
            {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            })
            this.message = res.data.message;
            this.balance = res.data.data.balance
            this.loadDashboardData()
        } catch (err) {
            this.message = err.response?.data?.message || 'Pemabayaran gagal'
        } finally {
            this.loading = false
        }
    },
    async loadDashboardData() {
        try {
            const [profile, balance] = await Promise.all([
                axios.get(this.baseapi + '/profile', {
                headers: { Authorization: `Bearer ${this.token}` }
                }),
                axios.get(this.baseapi + '/balance', {
                headers: { Authorization: `Bearer ${this.token}` }
                }),
            ])

            this.profile = profile.data.data
            this.balance = balance.data.data.balance
        } catch (err) {
            console.error('Error loading dashboard data', err)
            if (err.response?.data?.message == 'Token tidak tidak valid atau kadaluwarsa') {
              this.logOut()
            }
        }
    },
    logOut(){
      localStorage.removeItem('token')
      this.$router.replace('/login')
    },
  },
  async created() {
    await this.loadDashboardData()
  }

}
</script>

<style scoped>
.balance-card {
  min-width: 280px;
}

.input-container {
    margin-bottom: 30px;
    border-radius: 8px;
}
.form-control {
    border: 1px solid;
    border-radius: 8px;
    padding: 16px;
    font-size: 16px;
}
.topup-btn {
    width: 100%;
    padding: 16px;
    background-color: #DC3545;
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}
.topup-btn:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
}
.topup-btn.active {
    background-color: #DC3545;
}

</style>