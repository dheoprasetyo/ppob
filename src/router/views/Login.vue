<template>
  <div class="container-fluid h-100">
    <div class="wrap">

        <div class="card">
        
        <!-- Right form -->
        <div class="right">
            <div class="title-row">
            <div class="title">Masuk atau buat akun untuk memulai</div>
            </div>

            <form @submit.prevent="submit">
                <div class="field">
                    <input id="email" class="input" type="email" v-model.trim="form.email"  placeholder="email" autocomplete="email" required>
                </div>
                <div class="field">
                    <input id="password" class="input" type="password"  v-model="form.password" placeholder="Password" autocomplete="current-password" required>
                </div>
                <b-button :disabled="loading" type="submit" block class="submit">
                {{ loading ? 'Loading...' : 'Masuk' }}
                </b-button>
                <!-- <button class="submit" type="submit">Masuk</button> -->
            </form>

            <p v-if="errorMsg" class="text-danger mt-2">{{ errorMsg }}</p>

            <div class="foot muted">
            Not a member?
            <span class="signup" >Sign Up</span>
            </div>
        </div>

        <!-- Left image -->
        <div class="left" aria-hidden="true" title="Replace with your image if you like"></div>
        </div>
    </div>
  </div>
</template>

<style scoped>
    :root{
      --bg:#f6f7fb;
      --card:#ffffff;
      --text:#2b2b2b;
      --muted:#6b7280;
      --primary:red;        /* golden button color */
      --primary-pressed:red;
      --ring:#e5e7eb;
    }
    *{box-sizing:border-box}
    html,body{margin:0;height:100%;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Inter,Arial,sans-serif;color:var(--text);background:var(--bg)}
    .wrap{
  max-width:1060px;
  margin:0 auto;
  padding:0 16px;

  /* make the page tall and center the card within */
  min-height:100vh;
  display:flex;            /* column layout so margin:auto can center */
  flex-direction:column;
}

.card{
  margin:auto;             /* centers horizontally & vertically inside .wrap */
}
    h1{font-weight:700;text-align:center;margin:18px 0 26px}
    .card{
      display:grid;grid-template-columns:1.1fr 1fr;gap:0;background:var(--card);
      border-radius:14px;box-shadow:0 12px 30px rgba(0,0,0,.06);overflow:hidden;
    }
    .left{
      min-height:520px;background:#111 url('https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1600&auto=format&fit=crop') center/cover no-repeat;
      filter:grayscale(100%); /* black & white like screenshot */
    }
    .right{padding:42px 46px;display:flex;flex-direction:column;justify-content:flex-start}
    .title-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:28px}
    .title{font-size:32px;font-weight:800}
    .social{display:flex;gap:12px}
    .social .btn{
      width:40px;height:40px;border-radius:999px;border:1px solid var(--ring);
      display:grid;place-items:center;color:#9ca3af;background:#fff;cursor:pointer;user-select:none;
      transition:transform .06s ease, background .15s ease;
    }
    .social .btn:hover{transform:translateY(-1px);background:#fafafa}
    label{font-size:12px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;color:#4b5563;margin-bottom:8px;display:block}
    .input{width:100%;height:48px;border:1px solid var(--ring);border-radius:10px;padding:0 14px;font-size:15px;outline:none;transition:border .12s ease, box-shadow .12s ease;background:#fff}
    .input::placeholder{color:#b6b9c2}
    .input:focus{border-color:#c8ccd6;box-shadow:0 0 0 4px rgba(0,0,0,.03)}
    .field{margin-bottom:18px}
    .submit{
      width:100%;height:52px;border:none;border-radius:10px;background:var(--primary);color:#fff;
      font-weight:700;font-size:16px;cursor:pointer;transition:transform .06s ease, background .15s ease;
    }
    .submit:hover{background:var(--primary-pressed);transform:translateY(-1px)}
    .row{display:flex;align-items:center;justify-content:space-between;margin-top:14px}
    .remember{display:flex;gap:10px;align-items:center;color:#6b7280}
    .checkbox{appearance:none;width:18px;height:18px;border:2px solid var(--primary);border-radius:4px;display:inline-grid;place-items:center;cursor:pointer}
    .checkbox:checked{background:var(--primary)}
    .link{color:#6b7280;cursor:pointer}
    .link:hover{text-decoration:underline}
    .muted{color:#6b7280}
    .signup{color:#d3932c;font-weight:600;cursor:pointer}
    .foot{margin-top:auto;padding-top:6px}
    @media (max-width: 900px){
      .card{grid-template-columns:1fr}
      .left{height:260px}
    }
  </style>

<script>
import axios from 'axios'
export default {
  name: 'Login',
  data() {
    return {
        form: { email:'', password:'' },
        loading: false,
        errorMsg: '',
        baseapi: localStorage.getItem("baseapi"),
    }
  },
  methods: {

    async submit () {
    // console.log('test')
      this.loading = true
      this.errorMsg = ''
      try {
        const res = await axios.post(this.baseapi+'/login', {
          email: this.form.email,
          password: this.form.password
        })
        // assuming API returns { token, user }
        localStorage.setItem('token', res.data.data.token)
        this.$router.push('/')
      } catch (err) {
        this.errorMsg = err.response?.data?.message || 'Login gagal'
      } finally {
        this.loading = false
      }
    },

    // submit () {
    //   if (!this.email || !this.password) return
    //   localStorage.setItem('token', 'demo-token')
    //   localStorage.setItem('user_name', this.email.split('@')[0] || 'Pengguna')
    //   this.$router.push('/')
    // },
    // register () { this.login() }
  }
}
</script>