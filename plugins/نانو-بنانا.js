/**
 * 🍓 Nanobanana AI Image Editor Plugin — نيزوكو بنانا تعديل صور بالذكاء الاصطناعي
 * ⏤͟͞ू⃪𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🍓
 * حقوق التعديل: Arab Top Dev
 */

import fs from 'fs';
import FormData from 'form-data';
import axios from 'axios';
import path from 'path';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // 1. التحقق من الرد على صورة أو وجود صورة مرفقة
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (!mime.startsWith('image/')) return m.reply(`*⚠️ يـرجى الـرد عـلى صـورة مـمع كـتابة نـص الـتعديل بـعد الأمـر!*\n*مثال:* ${usedPrefix + command} حـول الـصورة لإسـكيتش رصـاص`);

    // 2. التحقق من وجود نص البرومبت
    if (!text) return m.reply(`*⚠️ يـرجى كـتابة نـص الـتعديل بـعد الأمـر!*\n*مثال:* ${usedPrefix + command} زيل ايموجي القلب من الصوره`);

    // 3. التفاعل بـ ⏳
    await m.react('⏳');

    // 4. إرسال رسالة الانتظار الأولى بنفس ستايل نيزوكو
    let statusMsg = await m.reply(`* .𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🎀🍡 _*\n\n*_ جـاري الـتعديل يـرجى الانـتظار و الـصلاة عـلى الـنبي..... 🕒 _*`);

    try {
        // 5. تحميل الصورة من سيرفر الواتساب
        let imgBuffer = await q.download();
        if (!imgBuffer) throw new Error('❌ فشل تحميل الصورة، حاول مرة أخرى.');

        // 6. تجهيز بيانات الطلب المباشر (FormData) للرفع للـ API
        const form = new FormData();
        form.append('prompt', text);
        form.append('file', imgBuffer, {
            filename: `nanobanana_edit_${Date.now()}.png`,
            contentType: mime
        });

        // 7. استدعاء الـ API الشغال والمرفق برابط الرفع المباشر
        const apiUrl = 'https://api-nanzz.my.id/docs/api/ai-image/nanobanana-edit.php'; 

        const response = await axios.post(apiUrl, form, {
            headers: {
                ...form.getHeaders(),
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 60000 // مهلة دقيقة كاملة للمعالجة الذكية
        });

        // 8. فحص وفك استجابة الـ API
        const resultData = response.data;
        if (!resultData.status || !resultData.result || !resultData.result.url) {
            throw new Error(`❌ فـشل الـتعديل، خـطأ مـن الـسيرفر: ${resultData.msg || 'خـطأ غـير مـعروف'}`);
        }

        // 9. النجاح: تعديل رسالة الحالة والتفاعل بـ ✅
        await m.react('✅');
        await conn.sendMessage(m.chat, { text: `*✅ تـم الانـتهاء مـن الـتعديل! جـاري إرسـال الـصورة...*`, edit: statusMsg.key });

        // 10. إرسال الصورة النهائية بجودة عالية HD مع الكابشن المطلوب
        let caption = `*🎁 تم أنتهاء التعديل*\n\n*_ بروميدك التعديل : _* ${text}`;
        
        await conn.sendMessage(m.chat, {
            image: { url: resultData.result.url },
            caption: caption
        }, { quoted: m });

        // تنظيف الشات وحذف رسالة جاري التعديل
        await conn.sendMessage(m.chat, { delete: statusMsg.key });

    } catch (e) {
        console.error('Nanobanana Edit Error:', e);
        // في حال حدوث أي خطأ: تفاعل ❌ وتحديث الرسالة
        await m.react('❌');
        await conn.sendMessage(m.chat, { text: `*❌ خـطأ أثـناء الـمعالجة!*\n_${e.message || e}_`, edit: statusMsg.key });
    }
};

handler.help = ['نانو', 'نانوبنانا', 'نانو-بنانا'];
handler.tags = ['tools', 'ai'];
handler.command = /^(نانو|نانوبنانا|نانو-بنانا)$/i;

export default handler;