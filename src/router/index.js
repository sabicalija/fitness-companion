import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("@/views/Dashboard.vue"),
    meta: {
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("accessToken");

  // Handle GitHub Pages redirect query
  if (to.query.redirect) {
    const url = new URL(to.query.redirect, window.location.origin);
    let targetPath = url.pathname;
    const targetQuery = Object.fromEntries(url.searchParams.entries());

    // Remove the base path from targetPath if present
    const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
    if (targetPath.startsWith(basePath)) {
      targetPath = targetPath.slice(basePath.length);
    }

    next({ path: targetPath, query: targetQuery });
    return;
  }

  // Handle OAuth flow with `code` query
  if (to.query.code) {
    // Ensure the code is only handled on the Dashboard route
    if (to.name === "Dashboard" || to.path === "/dashboard") {
      next();
      return;
    } else {
      next({ name: "Dashboard", query: { code: to.query.code } });
      return;
    }
  }

  // Ensure authentication for protected routes
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: "Home" });
  } else {
    next();
  }
});

export default router;
