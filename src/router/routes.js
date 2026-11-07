const routes = [
  {
    path: "/",
    component: () => import("../layouts/LoginLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/LoginPage.vue")
      }
    ],
  },
  {
    path: "/dashboard",
    component: () => import("../layouts/MainLayout.vue"),
    children: [
      {
        path: "/queuescreen",
        meta: {
          auth: true,
        },
        component: () => import("pages/QueueScreenPage.vue"),
      },
      {
        path: "/configuration/counters",
        meta: {
          auth: true,
        },
        component: () => import("pages/CountersPage.vue"),
      },
      {
        path: "/configuration/queueviewerscreen",
        meta: {
          auth: true,
        },
        component: () => import("pages/Screens/FormKeyUserPage.vue"),
      },
      {
        path: "/configuration/services",
        meta: {
          auth: true,
        },
        component: () => import("pages/ServicesPage.vue"),
      },
      {
        path: "/configuration/users",
        meta: {
          auth: true,
        },
        component: () => import("pages/UserAdminPage.vue"),
      },
    ],
  },
  {
    path: "/queueviewer",
    component: () => import("../layouts/ScreenLayout.vue"),
    children: [
      {
        path: "/queueviewer/formRegisterKey",
        component: () => import("pages/Screens/FormKeyUserPage.vue"),
      }
    ]
  },
  {
    path: "/queueviewerscreen",
    component: () => import("../layouts/ScreenLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/Screens/QueueViewerScreenKeyPage.vue"),
      }
    ]
  },

  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
