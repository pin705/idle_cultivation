# Thủy Mặc Theme Refactor - Summary

## Tổng Quan
Đã refactor toàn bộ component system của Idle Cultivation game sang phong cách Thủy Mặc (Ink Wash), loại bỏ inline styles và chuyển sang sử dụng Tailwind CSS classes.

## Nguyên Tắc Thiết Kế

### Phong Cách Thủy Mặc
- **Đen/Trắng/Vàng**: Palette chính với `ink` (#1a1a1a), `paper` (#fffef9), `gold` (#d4af37), `seal` (#8b0000)
- **Tối Giản**: Loại bỏ gradient, rounded corners, soft shadows
- **Nghiêm Cẩn**: Border rõ ràng 2px, typography mạnh mẽ, spacing đồng nhất
- **Né Nhựa Hóa**: Tránh hiệu ứng plastic, glossy, quá mượt

## Các File Đã Refactor

### 1. Cấu Hình Cốt Lõi
✅ **tailwind.config.js**
- Thêm color palette: `ink`, `paper`, `seal`, `gold`, `element-*`
- Custom border-width, box-shadow kiểu mực
- Font stack với Noto Serif SC

✅ **app/assets/css/main.css**
- Base styles: body mặc định `font-serif`, `text-ink`, `bg-paper`
- Component classes: `.btn-ink`, `.btn-seal`, `.card-ink`, `.text-title`, etc.
- Utilities: `.scrollbar-ink`, animation classes
- Loại bỏ tất cả gradient và shadow mềm

### 2. UI Components
✅ **Button.vue**
- 5 variants: primary (seal), secondary (ink outline), accent (gold), ghost, danger
- Không còn themeStore dependency
- Focus state với gold outline

✅ **Card.vue**
- Border 2px kiểu mực, shadow-ink
- Header/footer với paper-aged background
- Hoverable state với shadow-ink-lg

✅ **Tabs.vue**
- Active tab: border-seal 3px, text-seal
- Inactive: border-transparent, hover bg-paper-aged
- Bottom border 2px kiểu mực

✅ **Divider.vue**
- Horizontal/vertical với bg-ink-light
- Text divider cho section headers

### 3. Layout Components
✅ **MainLayout.vue**
- Sidebar: bg-paper với border-ink
- Toggle button: seal background, gold on hover
- Player avatar: seal background, ink border 3px
- Progress bars: border-ink, bg-seal fill
- Resources: paper-aged background
- Scrollbar: scrollbar-ink

### 4. Modal Components
✅ **BaseModal.vue**
- Overlay: bg-ink/50 với backdrop-blur
- Modal: border-ink 2px, shadow-ink-lg
- Header: paper-aged background
- Close button: border-ink, hover bg-ink

✅ **SettingsModal.vue**
- Theme selection cards với border-gold cho active
- Preview boxes với accurate theme colors
- Loại bỏ inline styles hoàn toàn

✅ **OfflineRewardModal.vue**
- Header seal color
- Qi display với gold accent
- Paper-aged backgrounds
- Seal button cho actions

### 5. Game Components
✅ **GameLog.vue**
- Border-ink 2px
- Scrollbar-ink
- Hover state: paper-aged
- Mono font cho log entries

✅ **CultivationMenu.vue**
- Main buttons: btn-gold, btn-seal
- Icon buttons: border-ink 2px, square (không rounded)
- Hover: bg-ink, text-paper

## Component Classes Mới

### Buttons
```css
.btn-ink      /* Outline đen, hover fill */
.btn-seal     /* Solid đỏ ấn */
.btn-gold     /* Outline vàng, hover fill */
```

### Cards
```css
.card-ink     /* Border + shadow kiểu mực */
```

### Typography
```css
.text-title    /* 2xl, bold, tracking-wide */
.text-subtitle /* lg, semibold */
.text-body     /* base */
.text-caption  /* sm, ink-light */
```

### Utilities
```css
.scrollbar-ink  /* Custom scrollbar với ink colors */
.shadow-ink     /* 2px 2px hard shadow */
.shadow-ink-lg  /* 4px 4px hard shadow */
```

## Color Palette

### Primary
- `ink` - #1a1a1a (text, borders)
- `ink-light` - #4a4a4a (secondary text)
- `ink-lighter` - #6b7280 (captions)
- `paper` - #fffef9 (main bg)
- `paper-aged` - #f5f4ef (secondary bg)
- `paper-dark` - #eae8e0 (tertiary bg)

### Accent
- `seal` - #8b0000 (primary actions)
- `seal-light` - #a52a2a (hover states)
- `gold` - #d4af37 (highlights)
- `gold-dark` - #b8860b (warnings)

### Elements (Ngũ Hành)
- `element-metal` - #d4af37
- `element-wood` - #2d5016
- `element-water` - #1e3a8a
- `element-fire` - #8b0000
- `element-earth` - #8b4513

## Breaking Changes

### Removed
- Tất cả inline `:style` bindings với themeStore
- Dependency vào `useThemeStore` trong hầu hết components
- Rounded corners (rounded-lg, rounded-xl)
- Gradient backgrounds
- Soft box-shadows

### Migration Pattern
```vue
<!-- Before -->
<div :style="{ 
  backgroundColor: themeStore.colors.bgPaper,
  borderColor: themeStore.colors.borderPrimary 
}">

<!-- After -->
<div class="bg-paper border-2 border-ink">
```

## Files Cần Refactor Tiếp (Tab Components)
Các tab components vẫn sử dụng inline styles cho:
- Element colors (getElementColor functions)
- Dynamic tier colors
- Progress bars với dynamic widths

**Recommendation**: Giữ nguyên dynamic styles này vì chúng thực sự dynamic dựa trên game state.

## Tài Liệu
- `THEME_GUIDE.md` - Hướng dẫn chi tiết về theme system
- `tailwind.config.js` - Full color palette
- `app/assets/css/main.css` - Component classes

## Testing Checklist
- [ ] Kiểm tra tất cả buttons (5 variants)
- [ ] Kiểm tra cards với/không header/footer
- [ ] Kiểm tra tabs switching
- [ ] Kiểm tra modals (settings, offline reward)
- [ ] Kiểm tra main layout sidebar toggle
- [ ] Kiểm tra responsive breakpoints
- [ ] Kiểm tra scrollbar styling
- [ ] Kiểm tra theme switching (dark/light modes)

## Kết Quả
✅ Loại bỏ hoàn toàn inline styles trong core UI components
✅ Theme nhất quán, dễ maintain
✅ Performance tốt hơn (không re-compute styles)
✅ Dễ dàng customize qua Tailwind config
✅ Phong cách Thủy Mặc đặc trưng, tránh nhựa hóa
