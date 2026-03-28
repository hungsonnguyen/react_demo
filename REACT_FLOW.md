# React Week 1 – Hệ thống hóa Flow & Nguyên lý Vận hành

> Tài liệu này giải thích **toàn bộ luồng hoạt động** của dự án: từ khi trình duyệt mở trang đến khi từng pixel được vẽ lên màn hình, cùng nguyên lý vận hành của từng file `.jsx`.

---

## Mục lục

1. [Tổng quan kiến trúc](#1-tổng-quan-kiến-trúc)
2. [Luồng khởi động (Boot Flow)](#2-luồng-khởi-động-boot-flow)
3. [Cây component (Component Tree)](#3-cây-component-component-tree)
4. [Luồng dữ liệu (Data Flow)](#4-luồng-dữ-liệu-data-flow)
5. [Giải phẫu từng file](#5-giải-phẫu-từng-file)
   - [index.html](#51-indexhtml--điểm-vào-duy-nhất)
   - [main.jsx](#52-mainjsx--cầu-nối-react--dom)
   - [App.jsx](#53-appjsx--root-component)
   - [Header.jsx](#54-headerjsx)
   - [WelcomeMessage.jsx](#55-welcomemessagejsx)
   - [UserCard.jsx](#56-usercardjsx)
   - [ItemList.jsx](#57-itemlistjsx)
   - [FragmentDemo.jsx](#58-fragmentdemojsx)
6. [Cách nhúng component đúng cách](#6-cách-nhúng-component-đúng-cách)
7. [Các pattern JSX quan trọng](#7-các-pattern-jsx-quan-trọng)
8. [ES6 trong dự án – tổng hợp](#8-es6-trong-dự-án--tổng-hợp)
9. [Vòng đời render (Render Lifecycle)](#9-vòng-đời-render-render-lifecycle)
10. [Sơ đồ tham chiếu nhanh](#10-sơ-đồ-tham-chiếu-nhanh)

---

## 1. Tổng quan kiến trúc

```
Trình duyệt
    │
    ▼
index.html          ← Shell HTML tĩnh, chứa <div id="root">
    │
    ▼ (tải script)
main.jsx            ← Entry point JavaScript, gắn React vào DOM
    │
    ▼ (render)
App.jsx             ← Root component, nơi ghép mọi thứ
    ├── Header
    ├── WelcomeMessage
    │       └── children (JSX truyền vào)
    ├── UserCard × 2  (render từ mảng users)
    ├── ItemList      (nhận mảng items qua props)
    └── FragmentDemo
```

**Nguyên lý cốt lõi:**
- React **không** trực tiếp chỉnh sửa DOM thật. Nó duy trì một **Virtual DOM** (cây object JS) rồi so sánh (diffing) với DOM thật để chỉ cập nhật phần thay đổi.
- Mọi thứ người dùng thấy trên màn hình đều được "vẽ" bởi React thông qua `<div id="root">` duy nhất.

---

## 2. Luồng khởi động (Boot Flow)

```
Bước 1 — Trình duyệt tải index.html
         ┌─────────────────────────────────────────┐
         │  <body>                                  │
         │    <div id="root"></div>   ← còn rỗng    │
         │    <script src="/src/main.jsx">           │
         │  </body>                                  │
         └─────────────────────────────────────────┘
                          │
                          ▼
Bước 2 — Vite biên dịch main.jsx (JSX → JS thuần)
         Babel transform:
           <App /> → React.createElement(App, null)
                          │
                          ▼
Bước 3 — main.jsx thực thi
         createRoot(document.getElementById('root'))
              → React chiếm quyền quản lý <div id="root">
         .render(<StrictMode><App /></StrictMode>)
              → React gọi hàm App()
                          │
                          ▼
Bước 4 — App() trả về cây JSX
         React đệ quy gọi từng component con:
           Header() → trả về <header>...</header>
           WelcomeMessage() → trả về <div>...</div>
           UserCard() × 2 → mỗi cái trả về <div class="user-card">
           ItemList() → trả về <div class="item-list">
           FragmentDemo() → trả về fragment chứa <h2>, <p>, <dl>
                          │
                          ▼
Bước 5 — React tổng hợp thành Virtual DOM tree
         So sánh với DOM thật (lần đầu là rỗng)
         → Ghi toàn bộ vào <div id="root">
                          │
                          ▼
Bước 6 — Người dùng thấy giao diện ✅
```

---

## 3. Cây component (Component Tree)

```
App
├── <header class="header">          ← Header (title="⚛️ React Week 1...")
│
├── <main class="main">
│   │
│   ├── <div class="welcome-message">  ← WelcomeMessage
│   │       └── children:
│   │             <b>Chào mừng...</b>
│   │             <span>Hãy mở DevTools...</span>
│   │
│   ├── <section class="section">
│   │   ├── <h2>👥 UserCard</h2>
│   │   └── <div class="cards-row">
│   │         ├── <div class="user-card">  ← UserCard (Nguyễn Văn An, 22)
│   │         └── <div class="user-card">  ← UserCard (Trần Thị Bình, 16)
│   │
│   ├── <section class="section">
│   │   └── <div class="item-list">    ← ItemList (4 items)
│   │         └── <ul>
│   │               ├── <li> Laptop   $1,200
│   │               ├── <li> Keyboard $50
│   │               ├── <li> Mouse    $25
│   │               └── <li> Monitor  $350
│   │
│   └── <section class="section">
│         ← FragmentDemo (KHÔNG có wrapper div – đây là điểm đặc biệt)
│           <h2>🧩 Fragment Demo</h2>
│           <p>...</p>
│           <dl>
│             <dt>CPU</dt><dd>Intel i7</dd>
│             <dt>RAM</dt><dd>16 GB</dd>
│             <dt>SSD</dt><dd>512 GB</dd>
│           </dl>
│
└── <footer class="footer">
```

---

## 4. Luồng dữ liệu (Data Flow)

React theo mô hình **one-way data flow** (dữ liệu chỉ chảy một chiều: từ cha → con).

```
         App.jsx  (nguồn dữ liệu)
            │
            │  props.title = "⚛️ React Week 1..."
            ├──────────────────────────► Header
            │
            │  props.children = <b>...</b><span>...</span>
            ├──────────────────────────► WelcomeMessage
            │
            │  props = { key, name, age }  × 2 lần
            ├──────────────────────────► UserCard
            │                            UserCard
            │
            │  props.items = allItems (4 phần tử)
            ├──────────────────────────► ItemList
            │
            │  (không truyền props)
            └──────────────────────────► FragmentDemo
```

**Quy tắc vàng:**
- Component **con KHÔNG được** tự thay đổi props nhận được (props là read-only).
- Nếu cần thay đổi dữ liệu → dùng **state** (tuần sau: `useState`).

---

## 5. Giải phẫu từng file

### 5.1 `index.html` — Điểm vào duy nhất

```html
<body>
  <div id="root"></div>                    <!-- (A) Mảnh đất trống React sẽ xây lên -->
  <script type="module" src="/src/main.jsx"></script>  <!-- (B) Nạp JS -->
</body>
```

| Điểm | Ý nghĩa |
|------|---------|
| `<div id="root">` | Container duy nhất React quản lý. Lúc đầu rỗng, sau khi React chạy sẽ chứa toàn bộ UI. |
| `type="module"` | Kích hoạt ES Module – cho phép dùng `import/export` trong trình duyệt. |

---

### 5.2 `main.jsx` — Cầu nối React ↔ DOM

```jsx
import { StrictMode }  from 'react'
import { createRoot }  from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

**Phân tích từng dòng:**

| Dòng | Giải thích |
|------|-----------|
| `createRoot(...)` | Tạo "gốc React" gắn vào `<div id="root">`. API mới của React 18 (thay `ReactDOM.render`). |
| `.render(<StrictMode><App /></StrictMode>)` | Ra lệnh React vẽ cây component bắt đầu từ `<App />`. |
| `<StrictMode>` | Bật chế độ kiểm tra nghiêm ngặt (chỉ ở development). Phát hiện side-effects, API deprecated. Không ảnh hưởng production. |

---

### 5.3 `App.jsx` — Root Component

`App.jsx` là **nhạc trưởng** — không hiển thị nhiều UI tự thân, nhưng điều phối toàn bộ.

```jsx
// ① Import: khai báo module cần dùng
import Header         from './components/Header';
import ItemList, { defaultItems } from './components/ItemList';
//              ↑ named export     ↑ default export

// ② Dữ liệu tĩnh (sau này sẽ từ API/state)
const users = [
  { id: 1, name: 'Nguyễn Văn An', age: 22 },
  { id: 2, name: 'Trần Thị Bình', age: 16 },
];

// ③ Spread operator: tạo mảng mới KHÔNG mutate mảng gốc
const extraItem = { id: 4, name: 'Monitor', price: 350 };
const allItems  = [...defaultItems, extraItem];
//                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^
//                 Tương đương: defaultItems.concat([extraItem])

// ④ Component: dùng arrow function
const App = () => {
  return (
    <div className="app">      {/* className thay class (từ khoá JS) */}
      <Header title="..." />   {/* truyền prop */}
      <WelcomeMessage>
        <b>...</b>             {/* children */}
      </WelcomeMessage>
      ...
    </div>
  );
};
```

**Tại sao `className` thay vì `class`?**
> JSX được biên dịch thành JS. `class` là từ khoá reserved trong JS (dùng để khai báo class OOP). React dùng `className` để tránh xung đột.

---

### 5.4 `Header.jsx`

```jsx
const Header = ({ title }) => {
  return (
    <header className="header">
      <h1>{title}</h1>
    </header>
  );
};
```

**Luồng:**
```
App truyền: <Header title="⚛️ React Week 1..." />
                             │
                    props = { title: "⚛️ React Week 1..." }
                             │
           Destructuring: { title } lấy ra giá trị
                             │
                 <h1>⚛️ React Week 1...</h1>  ← DOM thật
```

**JSX Expression `{}`:**
Dấu `{}` trong JSX là "cửa sổ" để nhúng **bất kỳ biểu thức JavaScript hợp lệ** nào:

```jsx
<h1>{title}</h1>           // biến
<p>{1 + 2}</p>             // phép tính → 3
<p>{isAdult ? 'A' : 'B'}</p> // ternary
<p>{items.length} items</p>  // method call
```

---

### 5.5 `WelcomeMessage.jsx`

```jsx
const WelcomeMessage = ({ children }) => {
  return (
    <div className="welcome-message">
      <p className="welcome-label">🎉 Lời chào mừng:</p>
      <div className="welcome-content">{children}</div>
    </div>
  );
};
```

**`props.children` là gì?**

`children` là prop **đặc biệt** – React tự động gán nó bằng mọi thứ nằm **giữa thẻ mở và thẻ đóng**:

```jsx
// Cách dùng ở App.jsx:
<WelcomeMessage>
  <b>Chào mừng!</b>
  <span>Hãy mở DevTools</span>
</WelcomeMessage>

// React tự tạo:
props = {
  children: [
    <b>Chào mừng!</b>,     // React element
    <span>Hãy mở DevTools</span>
  ]
}
```

**Khi nào dùng `children`?**

| Tình huống | Dùng children |
|-----------|---------------|
| Layout wrapper (Card, Modal, Panel) | ✅ |
| Nội dung bên trong chưa biết trước | ✅ |
| Container có style cố định, nội dung thay đổi | ✅ |
| Nội dung đơn giản, biết chính xác | ❌ (dùng prop bình thường) |

---

### 5.6 `UserCard.jsx`

```jsx
const UserCard = ({ name, age }) => {
  const info = { name, age };       // Shorthand property (ES6)
  const isAdult = age >= 18;

  return (
    <div className="user-card">
      <h2>👤 {info.name}</h2>
      <p>Tuổi: <strong>{info.age}</strong></p>
      <p>Trạng thái:
        <span className={isAdult ? 'adult' : 'minor'}>
          {isAdult ? '✅ Thành niên' : '🔞 Vị thành niên'}
        </span>
      </p>
    </div>
  );
};
```

**Dynamic className:**
```jsx
className={isAdult ? 'adult' : 'minor'}
//         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Đây cũng là JSX Expression – className có thể thay đổi theo logic
```

**Cách App tạo nhiều UserCard:**
```jsx
// App.jsx
{users.map(({ id, name, age }) => (
  <UserCard key={id} name={name} age={age} />
))}

// React thực thi lần lượt:
// UserCard({ name: 'Nguyễn Văn An', age: 22 }) → <div>...</div>
// UserCard({ name: 'Trần Thị Bình', age: 16 }) → <div>...</div>
```

---

### 5.7 `ItemList.jsx`

File này có **2 export** — đây là pattern quan trọng:

```jsx
// Named export: export thêm dữ liệu/hàm bổ sung
export const defaultItems = [
  { id: 1, name: 'Laptop',   price: 1200 },
  ...
];

// Default export: component chính
const ItemList = ({ items }) => { ... };
export default ItemList;
```

**Import tương ứng ở App.jsx:**
```jsx
import ItemList, { defaultItems } from './components/ItemList';
//     ^^^^^^^^   ^^^^^^^^^^^^^^
//     default    named (bọc trong {})
```

**List rendering với key:**
```jsx
{items.map(({ id, name, price }) => (
  <li key={id}>         // ← key: ID duy nhất để React track
    <span>{name}</span>
    <span>${price}</span>
  </li>
))}
```

**Tại sao `key` quan trọng?**

Khi danh sách thay đổi (thêm/xoá/sắp xếp), React dùng `key` để biết element nào thay đổi mà không cần re-render toàn bộ.

```
Không có key:          Có key:
[A, B, C] → [A, C]    [A(1), B(2), C(3)] → [A(1), C(3)]
React xoá B, C         React chỉ xoá B(2) ✅ (hiệu quả hơn)
rồi tạo lại C
```

**Guard clause:**
```jsx
if (!items || items.length === 0) {
  return <p className="empty">Danh sách trống.</p>;
}
```
Kỹ thuật "early return" – xử lý edge case trước khi render chính, giữ code sạch.

---

### 5.8 `FragmentDemo.jsx`

```jsx
import React from 'react';

const FragmentDemo = () => {
  return (
    <React.Fragment>          {/* ← không tạo DOM node */}
      <h2>...</h2>
      <p>...</p>
      <dl>
        {specs.map(({ id, label, value }) => (
          <React.Fragment key={id}>   {/* ← cần key khi trong .map() */}
            <dt>{label}</dt>
            <dd>{value}</dd>
          </React.Fragment>
        ))}
      </dl>
    </React.Fragment>
  );
};
```

**So sánh Fragment vs div trong DOM thật:**

```html
<!-- Dùng <div> bọc: DOM có thêm node thừa -->
<section>
  <div>              ← node thừa
    <h2>...</h2>
    <p>...</p>
  </div>
</section>

<!-- Dùng Fragment: DOM sạch -->
<section>
  <h2>...</h2>       ← trực tiếp
  <p>...</p>
</section>
```

**Hai cú pháp Fragment:**

| Cú pháp | Khi nào dùng |
|---------|-------------|
| `<>...</>` | Khi KHÔNG cần truyền `key` |
| `<React.Fragment key={id}>` | Khi render trong `.map()` — cần `key` |

---

## 6. Cách nhúng component đúng cách

### 6.1 Nhúng component đơn giản (self-closing)

```jsx
// Khi component không cần children
<Header title="My App" />
//      ^^^^^^^^^^^^^^^^
//      props = { title: "My App" }
```

### 6.2 Nhúng component có children

```jsx
// Khi component cần bọc nội dung bên trong
<WelcomeMessage>
  <b>Nội dung bất kỳ</b>
  <p>Thêm gì cũng được</p>
</WelcomeMessage>
//  ↑ tất cả nằm giữa đây sẽ là props.children
```

### 6.3 Nhúng nhiều component từ mảng

```jsx
// Dùng .map() – luôn có key
{users.map(({ id, name, age }) => (
  <UserCard key={id} name={name} age={age} />
))}
```

### 6.4 Truyền nhiều loại props

```jsx
<UserCard
  name="Nguyễn Văn An"    // string
  age={22}                 // number – dùng {}
  active={true}            // boolean – dùng {}
  onClick={() => {}}       // function – dùng {}
  style={{ color: 'red' }} // object – dùng {{}}  (ngoài: JSX expr, trong: object)
/>
```

### 6.5 Spread props

```jsx
const userProps = { name: 'An', age: 22 };

// Thay vì:
<UserCard name={userProps.name} age={userProps.age} />

// Dùng spread:
<UserCard {...userProps} />
// Tương đương hoàn toàn ✅
```

### 6.6 Conditional rendering

```jsx
// Cách 1: Ternary (có nhánh else)
{isAdult ? <span>Thành niên</span> : <span>Vị thành niên</span>}

// Cách 2: && (chỉ render khi true – không có nhánh else)
{isLoggedIn && <Dashboard />}

// Cách 3: Early return trong component
if (!data) return <p>Loading...</p>;
return <div>{data}</div>;
```

---

## 7. Các pattern JSX quan trọng

### 7.1 JSX không phải HTML

| HTML | JSX |
|------|-----|
| `class="..."` | `className="..."` |
| `for="..."` | `htmlFor="..."` |
| `<br>` | `<br />` (phải self-close) |
| `<img src="...">` | `<img src="..." />` |
| `onclick="fn()"` | `onClick={fn}` (camelCase, không dấu `""`) |
| `<!-- comment -->` | `{/* comment */}` |

### 7.2 JSX là biểu thức JavaScript

```jsx
// Có thể gán vào biến
const element = <h1>Hello</h1>;

// Có thể return từ hàm
const getGreeting = (name) => <p>Xin chào, {name}!</p>;

// Có thể dùng trong điều kiện
const ui = isError ? <Error /> : <Success />;
```

### 7.3 JSX Expression `{}` — nhúng JS vào JSX

```jsx
// ✅ Hợp lệ – biểu thức
{name}
{1 + 2}
{items.length}
{isAdult ? 'A' : 'B'}
{items.map(i => <li>{i}</li>)}
{`Hello ${name}`}

// ❌ Không hợp lệ – câu lệnh (statement)
{if (x) { ... }}    // if là statement
{for (...) { ... }} // for là statement
// → Thay bằng ternary hoặc .map()
```

### 7.4 Root element rule

```jsx
// ❌ Lỗi: 2 root elements
return (
  <h1>Title</h1>
  <p>Content</p>
)

// ✅ Bọc trong div
return (
  <div>
    <h1>Title</h1>
    <p>Content</p>
  </div>
)

// ✅ Tốt hơn: dùng Fragment (không tạo DOM node thừa)
return (
  <>
    <h1>Title</h1>
    <p>Content</p>
  </>
)
```

---

## 8. ES6 trong dự án – tổng hợp

| Tính năng | Cú pháp | File sử dụng | Giải thích |
|-----------|---------|-------------|------------|
| `const` / `let` | `const Header = ...` | Tất cả | Thay `var`; `const` không gán lại, `let` gán lại được |
| Arrow function | `({ title }) => { ... }` | Tất cả components | Cú pháp ngắn hơn, không có `this` riêng |
| Destructuring object | `{ name, age }` | UserCard, Header, ItemList | Lấy nhiều property cùng lúc |
| Destructuring trong param | `const fn = ({ a, b }) =>` | Tất cả components | Destructure ngay tại tham số |
| Spread array | `[...defaultItems, extra]` | App.jsx | Tạo mảng mới không mutate mảng gốc |
| Shorthand property | `{ name, age }` (thay `{ name: name }`) | UserCard.jsx | Khi key và biến cùng tên |
| Template literal | `` `$${price.toLocaleString()}` `` | ItemList.jsx | Nối chuỗi có biến |
| `.map()` | `items.map(...)` | ItemList, App | Biến đổi mảng, trả về mảng mới |
| Default export | `export default Header` | Tất cả | Export một giá trị chính |
| Named export | `export const defaultItems` | ItemList | Export nhiều giá trị từ 1 file |

---

## 9. Vòng đời render (Render Lifecycle)

Ở Week 1 (không có state), vòng đời rất đơn giản:

```
Component được gọi (ví dụ: UserCard({ name, age }))
        │
        ▼
Hàm thực thi từ đầu đến cuối
        │
        ▼
return JSX
        │
        ▼
React biên dịch JSX → Virtual DOM tree
        │
        ▼
React so sánh với DOM thật (Reconciliation)
        │
        ├── Lần đầu tiên → tạo mới toàn bộ DOM
        │
        └── Khi re-render (tuần sau với state):
              chỉ cập nhật phần thay đổi ✅
```

**StrictMode** gọi hàm component **2 lần** trong development để phát hiện side effects:
```
UserCard() → gọi lần 1 (kết quả bỏ qua)
UserCard() → gọi lần 2 (kết quả dùng thật)
// Bình thường trong development, production chỉ gọi 1 lần
```

---

## 10. Sơ đồ tham chiếu nhanh

### Cấu trúc file thực tế

```
myapp/
├── index.html              ← Shell, chứa <div id="root">
├── vite.config.js          ← Cấu hình build tool
├── package.json            ← Khai báo dependencies
├── src/
│   ├── main.jsx            ← Entry: createRoot + render App
│   ├── App.jsx             ← Root component, chứa data + layout
│   ├── App.css             ← Style cho toàn ứng dụng
│   ├── index.css           ← Reset CSS
│   └── components/
│       ├── Header.jsx          props: title
│       ├── UserCard.jsx        props: name, age
│       ├── ItemList.jsx        props: items[] | export: defaultItems
│       ├── WelcomeMessage.jsx  props: children
│       └── FragmentDemo.jsx    (không nhận props)
```

### Quy tắc đặt tên

| Loại | Quy tắc | Ví dụ |
|------|---------|-------|
| Component | PascalCase | `Header`, `UserCard`, `ItemList` |
| File component | PascalCase + `.jsx` | `Header.jsx`, `UserCard.jsx` |
| Props / biến | camelCase | `userName`, `itemList` |
| CSS class | kebab-case | `user-card`, `item-list` |
| Hằng số | UPPER_SNAKE hoặc camelCase | `defaultItems` |

### Checklist khi tạo component mới

```
□ Tên file và component dùng PascalCase
□ Dùng arrow function
□ Destructure props ngay trong tham số
□ Chỉ return MỘT root element (hoặc Fragment)
□ Thêm key={} khi render từ .map()
□ export default ở cuối file
□ Named export nếu cần export thêm data/util
```

### Cú pháp nhúng – tóm tắt

```jsx
// 1. Truyền prop đơn giản
<Header title="Hello" />

// 2. Truyền biến qua prop
<Header title={myTitle} />

// 3. Truyền children
<WelcomeMessage><b>Hi</b></WelcomeMessage>

// 4. Render danh sách
{arr.map(({ id, ...rest }) => <Card key={id} {...rest} />)}

// 5. Conditional render
{show && <Modal />}
{ok ? <Success /> : <Error />}

// 6. Spread props
const p = { name: 'An', age: 22 };
<UserCard {...p} />
```

---

> **Ghi nhớ quan trọng nhất:**
> 1. **Dữ liệu chảy xuống** (cha → con qua props), **sự kiện nổi lên** (con → cha qua callback) — sẽ học ở tuần sau.
> 2. **Props là read-only** — không bao giờ `props.name = 'mới'` trong component.
> 3. **Key trong list** — luôn dùng `id` duy nhất, không dùng index mảng.
> 4. **Fragment** — dùng khi không muốn thêm DOM node thừa.
> 5. **JSX là JS** — bất kỳ biểu thức JS hợp lệ nào đều dùng được trong `{}`.
