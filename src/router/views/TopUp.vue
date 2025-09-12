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
            <h6>Silahkan masukan</h6>
            <h2><strong>Nominal Top Up</strong></h2>

            <div class="input-container">
                <b-form-input
                    v-model="nominal"
                    placeholder="masukan nominal Top Up"
                    type="text"
                    class="form-control"
                ></b-form-input>
            </div>

            <div class="amount-grid">
                <div 
                    v-for="amount in amounts" 
                    :key="amount"
                    class="amount-btn"
                    :class="{ selected: selectedAmount === amount }"
                    @click="selectAmount(amount)"
                >
                    {{ formatCurrency(amount) }}
                </div>
            </div>

            <button 
                class="topup-btn"
                :class="{ active: isFormValid }"
                :disabled="!isFormValid || loading"
                @click="topUp()"
            >
                {{ loading ? 'Loading...' : 'Top Up' }}
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
  name: 'TopUp',
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
      nominal: 0,
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
    selectAmount(value){
        this.nominal = value
    },
    async topUp() {
        console.log('test')
        this.loading = true
        this.errorMsg = ''
        try {
            const res = await axios.post(this.baseapi+'/topup', {
                top_up_amount: this.nominal,
            },
            {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            })
            this.message = res.data.message;
            this.balance = res.data.data.balance
            this.nominal = 0
        } catch (err) {
            this.errorMsg = err.response?.data?.message || 'Top Up gagal'
        } finally {
            this.loading = false
        }
    },
    logOut(){
      localStorage.removeItem('token')
      this.$router.replace('/login')
    }
  },
  computed: {
    isFormValid() {
        return this.nominal && this.nominal > 0 && this.nominal < 1000000;
    }
  },
  async created () {
    const token = localStorage.getItem('token')

    try {
      const [profile, balance] = await Promise.all([
        axios.get(this.baseapi+'/profile', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(this.baseapi+'/balance', {
          headers: { Authorization: `Bearer ${token}` }
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
.amount-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
    margin-bottom: 30px;
}
.amount-btn {
    padding: 16px 12px;
    border: 1px solid;
    background: #ffffff;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    text-align: center;
}
.topup-btn {
    width: 100%;
    padding: 16px;
    background-color: #9ca3af;
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
    background-color: #3b82f6;
}

</style>