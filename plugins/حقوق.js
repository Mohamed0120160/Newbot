import { addExif } from '../lib/sticker.js'

let handler = async (m, { conn, text }) => {
    try {
        // التحقق من وجود رد على استيكر
        if (!m.quoted) {
            return m.reply(`*▰▱▰ [ 𝑵𝑬𝒁𝑼𝑲𝑶 ] ▰▱▰*

*┌──────────────⚠️*
*│⋄ الـحـالـة:* خـطـأ فـي الـاسـتـخـدام
*└──────────────⚡*

📝 *لازم ترد على الاستيكر اللي عايز تضيف عليه اسم الباكدج*

💡 *مثال:* .حقوق اسم الباكدج | اسم المؤلف

*─━─━─━─━─*
© 𝑵𝑬𝒁𝑼𝑲𝑶`);
        }

        // إرسال الرياكشن
        await conn.sendMessage(m.chat, { 
            react: { text: '🕷', key: m.key } 
        });

        let stiker = false
        try {
            let [packname, ...author] = text ? text.split('|') : ['']
            author = (author || []).join('|')
            let mime = m.quoted.mimetype || ''
            
            if (!/webp/.test(mime)) {
                return m.reply(`*▰▱▰ [ 𝑵𝑬𝒁𝑼𝑲𝑶 ] ▰▱▰*

❌ *لازم ترد على استيكر عشان نضيف الاسم!*

*─━─━─━─━─*
© 𝑵𝑬𝒁𝑼𝑲𝑶`);
            }
            
            let img = await m.quoted.download()
            if (!img) {
                return m.reply(`*▰▱▰ [ 𝑵𝑬𝒁𝑼𝑲𝑶 ] ▰▱▰*

❌ *فيه حاجة مش مزبوطه.. حاول تنزل الاستيكر تاني!*

*─━─━─━─━─*
© 𝑵𝑬𝒁𝑼𝑲𝑶`);
            }
            
            stiker = await addExif(img, packname || '', author || '')
        } catch (e) {
            console.error(e)
            if (Buffer.isBuffer(e)) stiker = e
        } finally {
            if (stiker) {
                await conn.sendMessage(m.chat, { 
                    sticker: stiker, 
                    mimetype: 'image/webp', 
                    contextInfo: {
                        externalAdReply: {
                            title: "𝑵𝑬𝒁𝑼𝑲𝑶",
                            body: "⏤͟͞ू⃪ 𝑵𝑬𝒁𝑼𝑲𝑶 𝑩𝑶𝑻⃝𖤐",
                            thumbnailUrl: "https://files.catbox.moe/1044iz.jpg",
                            mediaUrl: "https://whatsapp.com/channel/0029Vb7AkG84inotOc8BXE1K",
                            mediaType: 2,
                        }
                    }
                }, { quoted: m });
            } else {
                throw new Error('حصلت غلطة!')
            }
        }
        
    } catch (e) {
        console.error(e);
        await m.reply(`*▰▱▰ [ 𝑵𝑬𝒁𝑼𝑲𝑶 ] ▰▱▰*

❌ *حصلت غلطة! تأكد انك رديت على استيكر وضفت اسم الباكدج*

*─━─━─━─━─*
© 𝑵𝑬𝒁𝑼𝑲𝑶`);
    }
}

handler.help = ['حقوق <packname>|<author>']
handler.tags = ['sticker']
handler.command = /^(حقوق)$/i

export default handler;