<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import OpenHamburgerMenuIcon from './Icons/OpenHamburgerMenuIcon.vue'
import CloseMenuIcon from './Icons/CloseMenuIcon.vue'
import asideItems from '@/data/aside-items.json'
import router from '@/router'
import axios from 'axios'
import { userInfo } from 'os'

const mobileOpen = ref(false)
const profileOpen = ref(false)
const profileMenuRef = ref<HTMLElement | null>(null)

const onDocumentClick = (e: MouseEvent) => {
    if (!profileOpen.value) return
    if (profileMenuRef.value && !profileMenuRef.value.contains(e.target as Node)) {
        profileOpen.value = false
    }
}

const toggleMobile = () => {
    mobileOpen.value = !mobileOpen.value
}

const toggleProfile = () => {
    profileOpen.value = !profileOpen.value
}

const closeAll = () => {
    mobileOpen.value = false
    profileOpen.value = false
}

const onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
        closeAll()
    }
}

onMounted(() => {
    document.addEventListener('keydown', onKeydown)
    document.addEventListener('click', onDocumentClick)
})

onBeforeUnmount(() => {
    document.removeEventListener('keydown', onKeydown)
    document.removeEventListener('click', onDocumentClick)
})

const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))

const logout = async () => {
    try {
        await axios.post(
            'http://localhost:8000/api/logout',
            {},
            {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            },
        )

        localStorage.removeItem('token')
        localStorage.removeItem('user')

        router.push('/')
    } catch (err) {
        console.error(err)
    }
}
</script>

<template>
    <nav
        class="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700"
    >
        <div class="px-3 py-3 lg:px-5 lg:pl-3">
            <div class="flex items-center justify-between">
                <div class="flex items-center justify-start rtl:justify-end">
                    <button
                        aria-controls="logo-sidebar"
                        :aria-expanded="mobileOpen ? 'true' : 'false'"
                        type="button"
                        class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        @click="toggleMobile"
                    >
                        <span class="sr-only">Open sidebar</span>
                        <OpenHamburgerMenuIcon
                            v-if="!mobileOpen"
                            class="transition-all duration-200 ease-in-out"
                        />
                        <CloseMenuIcon
                            class="w-6 h-6 transition-all duration-200 ease-in-out"
                            v-else
                        />
                    </button>

                    <ApplicationLogo />
                </div>
                <div class="flex items-center">
                    <div class="flex items-center ms-3">
                        <div class="relative" ref="profileMenuRef">
                            <button
                                type="button"
                                class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                                :aria-expanded="profileOpen ? 'true' : 'false'"
                                @click="toggleProfile"
                            >
                                <span class="sr-only">Open user menu</span>
                                <img
                                    class="w-8 h-8 rounded-full"
                                    src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                                    alt="user photo"
                                />
                            </button>

                            <div
                                :class="[
                                    'absolute right-0 top-full mt-2 w-56 z-50 text-base list-none bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black/5 dark:bg-gray-700 dark:divide-gray-600 max-h-80 overflow-auto',
                                    profileOpen ? 'block' : 'hidden',
                                ]"
                                id="dropdown-user"
                                @click.stop
                                role="menu"
                            >
                                <div class="px-4 py-3" role="none">
                                    <p class="text-sm text-gray-900 dark:text-white" role="none">
                                        {{ user.name }}
                                    </p>
                                    <p
                                        class="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                                        role="none"
                                    >
                                        {{ user.email }}
                                    </p>
                                </div>

                                <ul class="py-1" role="none">
                                    <li>
                                        <RouterLink
                                            to="/dashboard"
                                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                            role="menuitem"
                                        >
                                            Dashboard
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <button
                                            @click="logout"
                                            class="w-full block px-4 py-2 text-sm text-start text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                            role="menuitem"
                                        >
                                            Sign out
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <!-- Overlay for mobile when sidebar is open -->
    <div
        v-if="mobileOpen"
        class="fixed inset-0 z-30 bg-black/40 sm:hidden"
        @click="mobileOpen = false"
    />

    <!-- Main Sidebar -->
    <aside
        id="logo-sidebar"
        :class="[
            'fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
            'sm:translate-x-0',
        ]"
        aria-label="Sidebar"
    >
        <div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
            <ul class="space-y-2 font-medium">
                <li v-for="(item, key) in asideItems" :key="key">
                    <RouterLink
                        :to="item.url"
                        class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                    >
                        <i :class="item.icon" />
                        <span class="ms-3">{{ item.name }}</span>
                    </RouterLink>
                </li>
            </ul>
        </div>
    </aside>
</template>
