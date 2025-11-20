// Server plugin to seed initial secret realms
export default defineNitroPlugin(async () => {
    const { SecretRealmModel } = await import('../models/SecretRealm')
    
    const initialRealms = [
        {
            key: 'misty_forest',
            name: 'Mê Lâm Sơn',
            description: 'Khu rừng sương mù bao phủ, ẩn chứa nhiều linh dược quý hiếm',
            tier: 'common',
            duration: 120,
            ticketCost: 1,
            requirements: { minRealm: 'Luyện Khí', minQi: 0 },
            lootTable: [
                { itemName: 'Thảo Dược Thường', itemType: 'material', dropRate: 0.8, quantity: { min: 2, max: 5 } },
                { itemName: 'Linh Thạch', itemType: 'material', dropRate: 0.5, quantity: { min: 5, max: 10 } }
            ],
            rewards: { qi: { min: 50, max: 100 }, spiritStones: { min: 10, max: 30 }, herbs: { min: 3, max: 8 } }
        },
        {
            key: 'crystal_cave',
            name: 'Thủy Tinh Động',
            description: 'Hang động ngập tràn tinh thạch phát sáng, nguồn linh khí dồi dào',
            tier: 'rare',
            duration: 180,
            ticketCost: 1,
            requirements: { minRealm: 'Trúc Cơ', minQi: 500 },
            lootTable: [
                { itemName: 'Tinh Thạch Cấp 1', itemType: 'material', dropRate: 0.6, quantity: { min: 1, max: 3 } },
                { itemName: 'Kiếm Thủy Tinh', itemType: 'equipment', dropRate: 0.2, quantity: { min: 1, max: 1 } }
            ],
            rewards: { qi: { min: 150, max: 300 }, spiritStones: { min: 50, max: 100 }, herbs: { min: 5, max: 15 } }
        },
        {
            key: 'ancient_ruins',
            name: 'Cổ Tích Di Tích',
            description: 'Tàn tích của tông môn cổ đại, chứa đựng kho tàng và bí pháp thất truyền',
            tier: 'epic',
            duration: 240,
            ticketCost: 2,
            requirements: { minRealm: 'Kim Đan', minQi: 2000 },
            lootTable: [
                { itemName: 'Cổ Pháp Bảo', itemType: 'equipment', dropRate: 0.4, quantity: { min: 1, max: 1 } },
                { itemName: 'Đạo Ngộ Linh Thư', itemType: 'consumable', dropRate: 0.3, quantity: { min: 1, max: 2 } }
            ],
            rewards: { qi: { min: 500, max: 1000 }, spiritStones: { min: 150, max: 300 }, herbs: { min: 20, max: 50 } }
        },
        {
            key: 'heaven_tower',
            name: 'Thiên Đỉnh Bảo Tháp',
            description: 'Tháp cao chọc trời, mỗi tầng là một thử thách khắc nghiệt',
            tier: 'legendary',
            duration: 300,
            ticketCost: 3,
            requirements: { minRealm: 'Nguyên Anh', minQi: 5000 },
            lootTable: [
                { itemName: 'Huyền Thiên Bảo Khí', itemType: 'equipment', dropRate: 0.5, quantity: { min: 1, max: 1 } },
                { itemName: 'Thiên Kiếp Bùa', itemType: 'consumable', dropRate: 0.6, quantity: { min: 1, max: 3 } },
                { itemName: 'Đạo Ngộ Linh Thạch', itemType: 'material', dropRate: 0.8, quantity: { min: 3, max: 10 } }
            ],
            rewards: { qi: { min: 1500, max: 3000 }, spiritStones: { min: 500, max: 1000 }, herbs: { min: 50, max: 100 } }
        }
    ]
    
    try {
        for (const realmData of initialRealms) {
            const exists = await SecretRealmModel.findOne({ key: realmData.key })
            if (!exists) {
                await SecretRealmModel.create(realmData)
                console.log(`[SecretRealm] Created: ${realmData.name}`)
            }
        }
    } catch (e) {
        console.error('[SecretRealm] Seed error:', e)
    }
})
