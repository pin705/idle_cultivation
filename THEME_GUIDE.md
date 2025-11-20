# Hướng Dẫn Sử Dụng Thủy Mặc Theme

## Phong Cách Thiết Kế

### Nguyên Tắc
- **Tối giản**: Tránh sử dụng quá nhiều màu sắc hoặc hiệu ứng
- **Nghiêm cẩn**: Border rõ ràng, typography mạnh mẽ
- **Né "nhựa hóa"**: Tránh gradient màu mè, shadows quá mềm, rounded corners quá nhiều

### Palette Màu Chính

#### Màu Cơ Bản
- `ink` / `#1a1a1a` - Đen mực (text, borders chính)
- `ink-light` / `#4a4a4a` - Xám mực (text phụ)
- `ink-lighter` / `#6b7280` - Xám nhạt (text caption)
- `paper` / `#fffef9` - Trắng giấy (background chính)
- `paper-aged` / `#f5f4ef` - Giấy cũ (background phụ)
- `paper-dark` / `#eae8e0` - Giấy tối (background tertiary)

#### Màu Nhấn
- `seal` / `#8b0000` - Đỏ ấn (primary actions, important)
- `seal-light` / `#a52a2a` - Đỏ ấn nhạt (hover states)
- `gold` / `#d4af37` - Vàng (accents, highlights)
- `gold-dark` / `#b8860b` - Vàng tối (warnings)

#### Ngũ Hành (Elements)
- `element-metal` / `#d4af37` - Kim (vàng)
- `element-wood` / `#2d5016` - Mộc (xanh lá đậm)
- `element-water` / `#1e3a8a` - Thủy (xanh dương đậm)
- `element-fire` / `#8b0000` - Hỏa (đỏ đậm)
- `element-earth` / `#8b4513` - Thổ (nâu)

## Tailwind Classes Sẵn Có

### Backgrounds
```html
<div class="bg-paper">Nền giấy trắng</div>
<div class="bg-paper-aged">Nền giấy cũ</div>
<div class="bg-paper-dark">Nền giấy tối</div>
```

### Text Colors
```html
<p class="text-ink">Text đen mực</p>
<p class="text-ink-light">Text xám</p>
<p class="text-ink-lighter">Text xám nhạt</p>
<p class="text-seal">Text đỏ ấn</p>
<p class="text-gold">Text vàng</p>
```

### Borders
```html
<div class="border-2 border-ink">Border đen mực 2px</div>
<div class="border border-ink-light">Border xám mực 1px</div>
<div class="border-2 border-gold">Border vàng 2px</div>
```

### Component Classes (từ main.css)

#### Buttons
```html
<!-- Button outline đen -->
<button class="btn-ink">Click me</button>

<!-- Button solid đỏ -->
<button class="btn-seal">Primary Action</button>

<!-- Button outline vàng -->
<button class="btn-gold">Gold Action</button>
```

#### Cards
```html
<div class="card-ink">
  <!-- Card với border mực và shadow -->
</div>
```

#### Text Hierarchy
```html
<h1 class="text-title">Tiêu đề lớn</h1>
<h2 class="text-subtitle">Tiêu đề phụ</h2>
<p class="text-body">Nội dung chính</p>
<small class="text-caption">Caption nhỏ</small>
```

### Shadows
```html
<div class="shadow-ink">Shadow nhẹ kiểu mực</div>
<div class="shadow-ink-lg">Shadow lớn kiểu mực</div>
```

### Scrollbar
```html
<div class="scrollbar-ink">Scrollbar kiểu mực</div>
<div class="scrollbar-hide">Ẩn scrollbar</div>
```

## Ví Dụ Sử Dụng

### Card Component
```vue
<div class="border-2 border-ink bg-paper shadow-ink p-4">
  <h3 class="text-title mb-2">Cảnh Giới</h3>
  <p class="text-body">Luyện Khí Tầng 5</p>
</div>
```

### Button Group
```vue
<div class="flex gap-2">
  <button class="btn-seal">Tu Luyện</button>
  <button class="btn-ink">Hủy</button>
</div>
```

### Progress Bar
```vue
<div class="h-2 border-2 border-ink bg-paper-dark overflow-hidden">
  <div class="h-full bg-seal transition-all" :style="{ width: progress + '%' }"></div>
</div>
```

### Stats Display
```vue
<div class="border border-ink-light bg-paper-aged p-3">
  <span class="text-caption">Linh Khí:</span>
  <span class="text-title text-gold ml-2">1,234</span>
</div>
```

## Các Pattern Thường Dùng

### Modal Overlay
```vue
<div class="fixed inset-0 bg-ink/50 backdrop-blur-sm z-50"></div>
```

### Divider
```vue
<div class="border-t-2 border-ink my-4"></div>
```

### Badge/Tag
```vue
<span class="px-2 py-1 border border-gold text-gold text-sm font-medium">
  Hoàn Thành
</span>
```

### Element Tag
```vue
<span class="text-element-fire font-medium">🔥 Hỏa</span>
<span class="text-element-water font-medium">💧 Thủy</span>
```

## Lưu Ý Quan Trọng

1. **Tránh sử dụng**: `rounded-lg`, `rounded-xl`, gradients, soft shadows
2. **Ưu tiên**: Borders rõ ràng, màu thuần, spacing đều đặn
3. **Typography**: Sử dụng font-serif cho text chính
4. **Transitions**: Giữ subtle (200-300ms), tránh quá mượt
5. **Element Colors**: Sử dụng cho cultivation elements, không dùng cho UI chung

## Migration từ Inline Styles

### Trước (❌)
```vue
<div :style="{ 
  backgroundColor: themeStore.colors.bgPaper,
  borderColor: themeStore.colors.borderPrimary 
}">
```

### Sau (✅)
```vue
<div class="bg-paper border-2 border-ink">
```
