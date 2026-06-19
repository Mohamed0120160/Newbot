// plugins/_nezukonum.js
// معالج تلقائي للترحيب بالمستخدمين الجدد في الخاص (مع استيراد Baileys)

import { proto } from '@whiskeysockets/baileys'
import { serialize } from '../lib/simple.js'

let handler = async (m, { conn }) => {
    // نعمل فقط في الخاص
    if (m.key.remoteJid.endsWith('@g.us')) return
    // نتجاهل رسائل البوت نفسه
    if (m.key.fromMe) return

    const userJid = m.sender

    // التأكد من وجود بيانات المستخدم
    if (!global.db.data.users[userJid]) {
        global.db.data.users[userJid] = {}
    }

    // إذا تم الترحيب به مسبقًا، لا نفعل شيئًا
    if (global.db.data.users[userJid].welcomed) return

    // تحديث الحالة فورًا
    global.db.data.users[userJid].welcomed = true
    await global.db.write()

    const userName = m.pushName || 'مستخدم'
    const botNumber = conn.user?.id?.split(':')[0] || 'غير معروف'
    const date = new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' })

    const caption = `تـم الاتصـال ب الـبوت : ${userName}
رقـم البـوت : ${botNumber}
تـاريـخ الاتصـال : ${date}

مــــعلــــومات بــــسيطه الــــبوت يــــعمــــل فــــي الــــمجمــــوعه اســــࢪع مــــن الــــخاص

اشــــرك فــــي قــــنوات البوت علــــۍ واقع الــــتواصل`

    const imageUrl = 'https://raw.githubusercontent.com/mzml-gg/nezuko-Photos/main/nezuko9.jpg'

    // بناء الأزرار باستخدام Proto الصحيح
    const buttons = [
        proto.Message.InteractiveMessage.Button.create({
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
                display_text: "📢 قناة الواتساب",
                url: "https://whatsapp.com/channel/0029VbCfnh30AgW5Ygh1ZZ37"
            })
        }),
        proto.Message.InteractiveMessage.Button.create({
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
                display_text: "📸 انستغرام",
                url: "https://instagram.com/3rab_top_devs"
            })
        }),
        proto.Message.InteractiveMessage.Button.create({
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
                display_text: "▶️ يوتيوب",
                url: "https://youtube.com/@3rab_top_devs"
            })
        })
    ]

    try {
        // إرسال كـ Product Message مع أزرار تفاعلية
        await conn.sendMessage(
            userJid,
            {
                product: {
                    productImage: { url: imageUrl },
                    productId: 'welcome-' + Date.now(),
                    title: '✨ مرحباً بك في بوت نيزوكو ✨',
                    description: 'تم الاتصال بنجاح ✓',
                    currencyCode: 'USD',
                    priceAmount1000: '0',
                    retailerId: 'NEZUKO BOT',
                    productImageCount: 1
                },
                businessOwnerJid: conn.user.id,
                caption: caption,
                footer: '⚡ تابعنا ليصلك كل جديد',
                interactiveButtons: buttons
            },
            { quoted: m }
        )
        console.log(`✅ تم إرسال الترحيب (Product) إلى ${userName} (${userJid})`)
    } catch (e) {
        console.error('❌ فشل إرسال Product Message:', e)
        // خطة بديلة: صورة عادية مع templateButtons
        try {
            await conn.sendMessage(
                userJid,
                {
                    image: { url: imageUrl },
                    caption: caption,
                    footer: '⚡ تابعنا ليصلك كل جديد',
                    templateButtons: buttons,
                    viewOnce: false
                },
                { quoted: m }
            )
            console.log(`⚠️ تم إرسال الصورة العادية مع الأزرار إلى ${userJid}`)
        } catch (e2) {
            console.error('❌ فشلت الخطة البديلة:', e2)
            // إرسال النص فقط
            await conn.sendMessage(userJid, { text: caption }, { quoted: m }).catch(() => {})
        }
    }
}

// هذا السطر يجعل الملف يُنفذ على كل رسالة
handler.all = true

export default handler