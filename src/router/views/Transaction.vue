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
            <h6>Semua Transaksi</h6>
            <b-list-group>
              <b-list-group-item
                  v-for="(transaction, index) in transactions"
                  :key="index"
                  class="d-flex justify-content-between align-items-center mb-3"
              >
                  <div>
                    <div :class="transaction.transaction_type == 'TOPUP' ? 'text-success' : 'text-danger'">
                        {{ transaction.transaction_type  == 'TOPUP' ? '+' : '–' }} {{ formatCurrency(transaction.total_amount) }}
                    </div>
                    <small class="text-muted">{{ formattedDate(transaction.created_on) }}</small>
                  </div>
                  <div class="text-muted">{{ transaction.description }}</div>
              </b-list-group-item>
            </b-list-group>

            <div class="text-center mt-3">
              <b-button
                  variant="link"
                  class="text-danger"
                  @click="loadMore"
                  :disabled="loading || noData"
              >
                  {{ loading ? 'Loading...' : noData ? 'No More Data' : 'Show more'  }}
              </b-button>
            </div>
        </div>
      </b-row>
    </b-container>
  </layout>
</template>

<script>
import axios from 'axios'
import Layout from '../layout/Layout.vue';
import Swal from 'sweetalert2'
export default {
  name: 'Transaction',
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
      loading: false,
      message: '',
      transactions: [],
      offset: 0,
      limit: 3,
      noData: false
      
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
    async getTransaction() {
        this.loading = true
        this.errorMsg = ''
        try {
            const res = await axios.get(this.baseapi+`/transaction/history?offset=${this.offset}&limit=${this.limit}`, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            })
            const data = res.data.data.records
            if (data.length < this.limit) {
                this.noData = true;
            }
            this.transactions = this.transactions.concat(data);
            this.offset += this.limit;
        } catch (err) {
            Swal.fire({
              icon: 'error',
              title: err.response?.data?.message,
              showConfirmButton: false,
              timer: 1500
            })
        } finally {
            this.loading = false
        }
    },
    async loadMore(){
        if (!this.loading && !this.noData) {
            await this.getTransaction()
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
    formattedDate(value) {
      const date = new Date(value);
      // Format options example: "September 13, 2025, 02:19 AM"
      return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
    },
    logOut(){
      localStorage.removeItem('token')
      this.$router.replace('/login')
    }
  },
  async created() {
    await this.loadDashboardData()
    await this.getTransaction()
  },
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