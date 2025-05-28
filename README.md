# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

```
its-gamify-ui/
├── public/                   # Các tệp tĩnh (favicon, index.html, manifest.json)
├── src/                      # Mã nguồn chính
│   ├── assets/               # Ảnh, font, icons, CSS, SCSS...
│   ├── components/           # Các component dùng chung
|   |   ├── layout/           # Các layout như Navbar, Sidebar, Footer
│   │   └── ui/               # Các component UI chung (Button, Modal, Input)
│   ├── hooks/                # Custom hooks (useAuth, useTheme...)
│   ├── utils/                # Hàm tiện ích (formatDate, debounce...)
│   ├── pages/                # Các trang (Home, About, Dashboard...)
│   │   ├── Home/             # Mỗi page có thư mục riêng
│   │   ├── About/
│   │   └── Dashboard/
│   ├── store/                # Quản lý state (Redux, Zustand...)
│   │   ├── slices/           # Redux slices (authSlice, userSlice)
│   │   └── index.ts          # Combine các reducers
│   ├── routes/               # Cấu hình Router
│   │   ├── privateRoutes.ts  # Route yêu cầu đăng nhập
│   │   ├── publicRoutes.ts   # Route không yêu cầu đăng nhập
│   │   └── index.tsx         # App Router chính
│   ├── services/             # API services (Axios, Fetch)
│   │   ├── authService.ts    # Service xác thực
│   │   └── userService.ts    # Service người dùng
│   ├── config/               # Cấu hình chung (axios, env, theme...)
│   │   ├── axios.ts          # Cấu hình axios
│   │   ├── env.ts            # Load biến môi trường
│   │   └── theme.ts          # Dark/Light Theme config
│   ├── interfaces/           # Chứa TypeScript types
│   │   ├── user.ts           # Định nghĩa kiểu dữ liệu User
│   │   └── auth.ts           # Định nghĩa kiểu dữ liệu Auth
│   ├── i18n/ #
│   │   ├── locales/
│   │   │   ├── en/
│   │   │   ├──common.json
│   │   │   ├── vi/
│   │   │   ├──common.json
│   │   └── config.ts
│   ├── App.tsx               # Component gốc của ứng dụng
│   └── main.tsx              # Entry point của ứng dụng
├── .env                      # Biến môi trường
├── tsconfig.json             # Cấu hình TypeScript
├── package.json              # Danh sách dependencies
├── vite.config.ts            # Cấu hình Vite
└── README.md                 # Tài liệu dự án
```
