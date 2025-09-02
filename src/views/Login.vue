<script setup lang="ts">
import TextField from '@/components/Form/TextField.vue'
import PrimaryButton from '@/components/PrimaryButton.vue'
import { ref } from 'vue'
import api from '../services/api'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Checkbox from '@/components/Form/Checkbox.vue'

const router = useRouter()

const username = ref('')
const password = ref('')
const remember = ref(null)
const errorMessage = ref('')

async function submit() {
    try {
        const res = await api.post('/login', {
            username: username.value,
            password: password.value,
            remember: remember.value,
        })

        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))

        api.defaults.headers.common.Authorization = `Bearer ${res.data.token}`

        router.push('/dashboard')
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Login failed'
        console.error(error)
    }
}
</script>
<template>
    <main class="h-screen">
        <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
            </div>

            <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form class="space-y-6" @submit.prevent="submit">
                    <div>
                        <TextField
                            id="username"
                            type="type"
                            name="username"
                            label="Username"
                            v-model="username"
                            required
                            autocomplete="username"
                            :error="errorMessage"
                        />
                    </div>

                    <div>
                        <TextField
                            id="password"
                            type="password"
                            name="password"
                            label="Password"
                            v-model="password"
                            required
                            autocomplete="current-password"
                        />
                        <div class="mt-2">
                            <div class="text-sm">
                                <Checkbox v-model:checked="remember" label="Remember me" />
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col gap-2">
                        <PrimaryButton type="submit"> Sign in </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    </main>
</template>
