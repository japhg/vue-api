import Dashboard from '@/views/Dashboard/Index.vue'
import Login from '@/views/Login.vue'
import Create from '@/views/Product/Create.vue'
import Edit from '@/views/Product/Edit.vue'
import ProductListing from '@/views/Product/Index.vue'
import VideoLinkListing from '@/views/VideoLink/Index.vue'
import { createRouter, createWebHistory } from 'vue-router'

const authRoutes = [
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
  },
  {
    path: "/products",
    name: "products-list",
    component: ProductListing,
  },
  {
    path: "/products/create",
    name: "create-product",
    component: Create,
  },
  {
    path: "/products/edit/:id",
    name: "edit-product",
    component: Edit,
  },
  {
    path: "/videos-links",
    name: "videos-links",
    component: VideoLinkListing,
  }
];

const publicRoutes = [
  {
    path: "/",
    name: "login",
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...publicRoutes,
    ...authRoutes.map(r => ({ ...r, meta: { requiresAuth: true } })),
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    // If the user is not authenticated, we redirect them to login page.
    next({ path: '/' })
  } else {
    next()
  }
})

export default router
