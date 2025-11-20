# Tab Components Migration Guide

## Pattern để refactor Tab Components

### 1. Script Setup
```vue
// ❌ Before
import { useThemeStore } from '../../stores/theme'
const themeStore = useThemeStore()
const { colors } = useThemeStore()

// ✅ After  
import { useThemeColors } from '../../composables/useThemeColors'
const { getElementColorClass, getTierColorClass, getTierBgClass, getElementName } = useThemeColors()
```

### 2. Loại bỏ helper functions
```typescript
// ❌ Before - Delete these
function getTierColor(tier: string): string {
  return colors.tier[tier] || colors.tier.common
}

function getElementColor(element: string): string {
  return colors.element[element] || colors.element.neutral
}

// ✅ After - Use composable directly
// Không cần functions này nữa!
```

### 3. Template changes

#### Element Colors
```vue
<!-- ❌ Before -->
<div :style="{ color: getElementColor(item.element) }">
  {{ item.element }}
</div>

<!-- ✅ After -->
<div :class="getElementColorClass(item.element)">
  {{ getElementName(item.element) }}
</div>
```

#### Tier Colors
```vue
<!-- ❌ Before -->
<span :style="{ color: getTierColor(item.tier) }">
  {{ item.name }}
</span>

<!-- ✅ After -->
<span :class="getTierColorClass(item.tier)">
  {{ item.name }}
</span>
```

#### Tier Backgrounds
```vue
<!-- ❌ Before -->
<div :style="{ backgroundColor: getTierColor(item.tier) }">

<!-- ✅ After -->
<div :class="getTierBgClass(item.tier)">
```

#### Tier Borders
```vue
<!-- ❌ Before -->
<div class="border-2" :style="{ borderColor: getTierColor(item.tier) }">

<!-- ✅ After -->
<div :class="['border-2', getTierBorderClass(item.tier)]">
```

### 4. Remove all v-bind('colors.xxx') in styles

```vue
<!-- ❌ Before -->
<style scoped>
.item-name {
  color: v-bind('colors.text.primary');
}
</style>

<!-- ✅ After -->
<!-- Use Tailwind classes in template instead -->
<div class="text-ink">
```

## Các Tab Components cần update

- [x] CultivationTab.vue (done)
- [ ] EquipmentTab.vue
- [ ] TechniquesTab.vue  
- [ ] SectTab.vue
- [ ] MissionsTab.vue
- [ ] ShopTab.vue
- [ ] AchievementsTab.vue
- [ ] AscensionTab.vue

## Common Tailwind Classes

### Text Colors
- `text-ink` - Text chính
- `text-ink-light` - Text phụ
- `text-ink-lighter` - Caption
- `text-seal` - Primary accent
- `text-gold` - Highlights
- `text-element-metal`, `text-element-wood`, etc. - Element colors

### Backgrounds
- `bg-paper` - Background chính
- `bg-paper-aged` - Background phụ
- `bg-paper-dark` - Background tertiary

### Borders
- `border-ink` - Border chính
- `border-ink-light` - Border phụ
- `border-seal` - Primary border
- `border-gold` - Accent border

### Layout
- Use Tailwind grid/flex classes instead of custom CSS
- `gap-4`, `gap-6` for spacing
- `p-4`, `p-6` for padding
- `border-2` for all borders (consistent 2px)
