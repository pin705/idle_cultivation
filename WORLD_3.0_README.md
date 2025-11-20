# World 3.0: Sự Kiện & Thám Hiểm

## Tổng Quan
World 3.0 bổ sung hệ thống động cho thế giới tu tiên với chu kỳ thế giới, sự kiện hiếm và mật cảnh.

## Tính Năng Mới

### 1. Chu Kỳ Thế Giới Động (World Cycles)
Thay thế chu kỳ ngũ hành đơn giản, giờ có 4 loại chu kỳ đặc biệt:

- **Bình Thường (Normal)**: Hệ số tiêu chuẩn x1.0, xác suất 70%
- **Nhật Thực (Eclipse)**: Giảm Qi x0.5 nhưng tăng drop rate x2.0, xác suất 10%
- **Ngũ Hành Hòa Hợp (Harmony)**: Tăng Qi x2.0 và Linh Thạch x1.5, xác suất 15%
- **Hỗn Loạn Thiên Địa (Chaos)**: Tăng Qi x3.0 và drop rate x3.0, rất hiếm (5%)

**Cơ chế**: Server kiểm tra mỗi 60 giây (WORLD_CHECK), random chọn chu kỳ mới khi hết thời gian.

### 2. Sự Kiện Thế Giới Hiếm (World Events)
3 loại sự kiện đặc biệt có thể xuất hiện ngẫu nhiên:

- **Khoáng Thạch Sao Băng**: x5.0 Qi, thưởng 100 Linh Thạch, 1 phút
- **Thủy Triều Linh Lực**: x3.0 Qi + 50 Qi bonus, 2 phút
- **Vũ Trụ Cộng Hưởng**: x4.0 Qi, cho vật phẩm đặc biệt, 3 phút

**Xác suất**: 5% mỗi lần WORLD_CHECK (mỗi 60s), không trùng lặp.

### 3. Mật Cảnh (Secret Realms)
Hệ thống dungeon dựa trên vé với 4 mật cảnh:

#### Mê Lâm Sơn (Common)
- Chi phí: 1 vé
- Thời gian: 2 phút
- Yêu cầu: Luyện Khí
- Phần thưởng: 50-100 Qi, 10-30 Linh Thạch, Thảo Dược

#### Thủy Tinh Động (Rare)
- Chi phí: 1 vé
- Thời gian: 3 phút
- Yêu cầu: Trúc Cơ, 500 Qi
- Phần thưởng: 150-300 Qi, 50-100 Linh Thạch, Tinh Thạch

#### Cổ Tích Di Tích (Epic)
- Chi phí: 2 vé
- Thời gian: 4 phút
- Yêu cầu: Kim Đan, 2000 Qi
- Phần thưởng: 500-1000 Qi, 150-300 Linh Thạch, Cổ Pháp Bảo

#### Thiên Đỉnh Bảo Tháp (Legendary)
- Chi phí: 3 vé
- Thời gian: 5 phút
- Yêu cầu: Nguyên Anh, 5000 Qi
- Phần thưởng: 1500-3000 Qi, 500-1000 Linh Thạch, Huyền Thiên Bảo Khí

**Cơ chế vé**: Mỗi người chơi có 3 vé, reset mỗi 24 giờ.

## API Actions Mới

### WORLD_CHECK
- Kiểm tra và cập nhật chu kỳ thế giới
- Roll sự kiện ngẫu nhiên
- Tự động gọi mỗi 60s từ client

### REALM_LIST
- Lấy danh sách mật cảnh
- Reset vé nếu đã qua 24h
- Trả về: realms, tickets, activeRun

### REALM_ENTER
- Bước vào mật cảnh (tiêu vé)
- Kiểm tra yêu cầu (realm, qi)
- Bắt đầu timer

### REALM_COMPLETE
- Hoàn thành mật cảnh
- Roll loot table
- Nhận phần thưởng

## Database Models

### Player Schema Updates
```typescript
world: {
  element: String,
  cycleTimer: Number,
  cycleDuration: Number,
  currentCycle: 'normal' | 'eclipse' | 'harmony' | 'chaos',
  cycleEndsAt: Date,
  activeEvent: {
    type: 'meteor_shower' | 'spirit_tide' | 'cosmic_resonance' | null,
    endsAt: Date
  }
},
secretRealms: {
  tickets: Number,
  activeRun: {
    realmKey: String,
    startedAt: Date,
    endsAt: Date
  },
  completed: [String],
  lastTicketReset: Date
}
```

### SecretRealm Model
```typescript
key: String (unique)
name: String
description: String
tier: 'common' | 'rare' | 'epic' | 'legendary'
duration: Number
ticketCost: Number
requirements: { minRealm, minQi }
lootTable: [{ itemName, itemType, dropRate, quantity }]
rewards: { qi, spiritStones, herbs }
```

## UI Components

### SecretRealmsModal.vue
- Grid hiển thị danh sách mật cảnh
- Vé counter
- Active run progress
- Loot preview
- Tier badges với màu sắc

### World Indicators (index.vue)
- Chu kỳ hiện tại (nếu khác normal)
- Sự kiện đang diễn ra (animate pulse)
- Màu sắc theo element

## Balance & Testing

### Multiplier Stacking
Qi rate = baseRate × elementMult × techMult × eqMult × **cycleMult** × **eventMult** + adds

**Ví dụ max combo**:
- Base: 1 Qi/s
- Element match: x2
- Tech: x1.2
- Equipment: x1.1
- Chaos cycle: x3
- Meteor event: x5
- **Total: ~40 Qi/s** (cực hiếm)

### Drop Rates
- Loot table sử dụng xác suất độc lập
- Có thể nhận nhiều item cùng lúc
- Quantity random trong range

### Ticket Economy
- 3 vé/ngày = 3 runs common hoặc 1 legendary
- Khuyến khích chơi hàng ngày
- Không mất vé nếu fail requirements

## Tích Hợp
- **TICK action**: Áp dụng cycle/event multipliers
- **Game loop**: Gọi WORLD_CHECK mỗi 60s
- **CultivationMenu**: Thêm nút Mật Cảnh (gradient purple)
- **Seed plugin**: Tạo sẵn 4 mật cảnh khi server khởi động

## Tiếp Theo (Endgame 4.0)
- Ascension reset với permanent bonuses
- Seasonal ladders
- Cosmetic rewards
- Leaderboards
