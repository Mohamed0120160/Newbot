import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// مصفوفة الروابط الـ 9 الخاصة بصور نيزوكو للاختيار العشوائي
const nezukoImages = [
    "https://raw.githubusercontent.com/mzml-gg/nezuko-Photos/main/nezuko1.jpg",
    "https://raw.githubusercontent.com/mzml-gg/nezuko-Photos/main/nezuko2.jpg",
    "https://raw.githubusercontent.com/mzml-gg/nezuko-Photos/main/nezuko3.jpg",
    "https://raw.githubusercontent.com/mzml-gg/nezuko-Photos/main/nezuko4.jpg",
    "https://raw.githubusercontent.com/mzml-gg/nezuko-Photos/main/nezuko5.jpg",
    "https://raw.githubusercontent.com/mzml-gg/nezuko-Photos/main/nezuko6.jpg",
    "https://raw.githubusercontent.com/mzml-gg/nezuko-Photos/main/nezuko7.jpg",
    "https://raw.githubusercontent.com/mzml-gg/nezuko-Photos/main/nezuko8.jpg",
    "https://raw.githubusercontent.com/mzml-gg/nezuko-Photos/main/nezuko9.jpg"
]

let handler = async (m, { conn, usedPrefix }) => {
    const taguser = '@' + m.sender.split('@')[0]
    
    // اختيار صورة عشوائية نقية في كل مرة يتم استدعاء المنيو
    const randomImage = nezukoImages[Math.floor(Math.random() * nezukoImages.length)]
    
    const menuText = `
.𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🎀​
🍒 𝗠𝗘𝗡𝗨 🍇
ＢＹ 𝒛𝒊𝒂𝒅 Ｘ 𝒎𝒐𝒏𝒕𝒆 3ℝΑᏴ 𝒅𝒆𝒗𝒔

𝗐𝖾𝒍𝒄𝒐𝒎𝒆 ${taguser}

╭───≪ 🍒 𝗠𝗘𝗡𝗨 🍇 ≫───╮
│ ⌬ ${usedPrefix}م1 ↫ (قسـم مشـرفـين) 👑 
│ ⌬ ${usedPrefix}م2 ↫ (قـسـم تحـمـيل) 🍒 
│ ⌬ ${usedPrefix}م3 ↫ (قـسـم صـور) 🍉 
│ ⌬ ${usedPrefix}م4 ↫ (قـسم الذكاء) 🍡
│ ⌬ ${usedPrefix}م5 ↫ (قـسـم الألعاب) 🌳
│ ⌬ ${usedPrefix}م6 ↫ (قـسـم الـبـحث) 🌴 
│ ⌬ ${usedPrefix}م7 ↫ (قـسـم الأدوات) 🛠️
╯───≪ 🌿🍉🍡 ≫───╰
FREE BOT WHATSAPP 3RAB Life`.trim()

    const sections = [
        {
            title: "قائمة أقسام نيزوكو 👑",
            rows: [
                { header: "SECTION 1", title: "قسم المشرفين 👑", description: "أوامر الإدارة والجروبات", id: ".م1" },
                { header: "SECTION 2", title: "قسم التحميل 🍒", description: "تحميل من تيك توك، يوتيوب، إلخ", id: ".م2" },
                { header: "SECTION 3", title: "قسم الصور 🍉", description: "قسـم الصـور و شخصيات الانمـي 🍡", id: ".م3" },
                { header: "SECTION 4", title: "قسم الذكاء 🍡", description: "قـسم الذكـاء الاصطناعي و تـعديل الصـور 👑", id: ".م4" },
                { header: "SECTION 5", title: "قسم الألعاب 🌳", description: "فعاليات وألعاب نيزوكو", id: ".م5" },
                { header: "SECTION 6", title: "قسم البحث 🌴", description: "البحث في المواقع والمنصات", id: ".م6" },
                { header: "SECTION 7", title: "قسم الأدوات 🛠️", description: "أدوات وفحص وأوامر منوعة للمطورين", id: ".م7" }
            ]
        }
    ]

    await conn.sendMessage(m.chat, {
        product: {
            productImage: { url: randomImage },
            productId: '24529689176623820',
            title: '.𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🎀',
            description: 'ＢＹ 𝒛𝒊𝒂𝒅 Ｘ 𝒎𝒐𝒏𝒕𝒆 3ℝΑᏴ 𝒅𝒆𝒗𝒔👑',
            currencyCode: 'USD',
            priceAmount1000: '0',
            retailerId: '🍒 𝗠𝗘𝗡𝗨 🍇',
            productImageCount: 1
        },
        businessOwnerJid: '96879361317@s.whatsapp.net',
        caption: menuText,
        footer: '⏤͟͞ू⃪الاقــسام MENU 🕷⃝⃕𝆺𝅥𝆹𝅥',
        interactiveButtons: [
            {
                name: "single_select",
                buttonParamsJson: JSON.stringify({
                    title: "الاقسـام الـمتاحه 🍡⏤͟͞ू⃪",
                    sections: sections
                })
            },
            {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                    display_text: ".𓏲⋆˙⏤͟͞ू⃪𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻👑",
                    url: "https://whatsapp.com/channel/0029VbCfnh30AgW5Ygh1ZZ37"
                })
            }
        ],
        contextInfo: {
            mentionedJid: [m.sender]
        }
    }, { quoted: m })
}

handler.command = /^(menu|قائمة|اوامر|أوامر)$/i
export default handler