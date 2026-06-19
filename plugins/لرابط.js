import axios from 'axios'
import FormData from 'form-data'
import { fileTypeFromBuffer } from 'file-type'

const handler = async (m, { conn }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ""
    
    if (!mime) return m.reply("*رد على صورة او فيديو او صوت لتحويله لرابط* 🍧")
    
    await m.react('⏳')
    
    try {
        let media = await q.download()
        if (!media) return m.reply("❌ فشل تحميل الملف من واتساب")

        // الرفع باستخدام الهاش الخاص بك
        let link = await catbox(media)
        
        if (!link || !link.includes('http')) throw link

        let caption = `📮 *تـم الـرفـع لـحـسـابـك الـخـاص :*\n\`\`\`• ${link}\`\`\`\n\n📊 *الـحـجـم :* ${formatBytes(media.length)}\n📛 *الـمـده :* "لا يـنـتـهـي 🔥"\n\n> حـقـوق **NEZUKO AI** 🐦🔥`

        await m.reply(caption)
        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('✖️')
        m.reply(`❌ *فشل الرفع:* تأكد من حجم الملف أو حاول لاحقاً.`)
    }
}

handler.command = handler.help = ['لرابط', 'catbox']
handler.tags = ['tools']
export default handler

function formatBytes(bytes) {
    if (bytes === 0) return "0 B"
    const sizes = ["B", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`
}

async function catbox(content) {
    try {
        const { ext, mime } = await fileTypeFromBuffer(content) || { ext: 'bin', mime: 'application/octet-stream' }
        const formData = new FormData()
        
        formData.append("reqtype", "fileupload")
        // === إضافة الـ Hash الخاص بك هنا ===
        formData.append("userhash", "944145b0558412de8090cb6cb") 
        
        formData.append("fileToUpload", content, {
            filename: Math.random().toString(36).substring(2, 10) + "." + ext,
            contentType: mime
        })

        const response = await axios.post("https://catbox.moe/user/api.php", formData, {
            headers: {
                ...formData.getHeaders(),
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            }
        })

        return response.data
    } catch (err) {
        throw "حدث خطأ أثناء الاتصال بسيرفر Catbox"
    }
}