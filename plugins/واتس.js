import axios from 'axios'

const myCredit = `*_ .𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🍓 _*`;

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // 1. التحقق من إدخال الرقم
    if (!text) return m.reply(`*⚠️ يـرجى كـتابة رقـم الـهاتف بـعد الأمـر!*\n*مثال:* ${usedPrefix + command} +20111854xxxx`);

    // 2. تنظيف وتجهيز الرقم (حذف المسافات والعلامات)
    let number = text.replace(/[^0-9]/g, '');
    if (!number) return m.reply('❌ *الـرقم الـمستخدَم غـير صـحيح!*');

    // 3. التفاعل بـ ⏳
    await m.react('⏳');

    // 4. إرسال رسالة جاري التعديل يرجى الانتظار
    let statusMsg = await m.reply(`* .𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🎀🍡 _*\n\n*_ جاري الفحص والتعديل يرجى الانتظار والصلاة على النبي..... 🕒 _*`);

    try {
        // 5. فحص الحساب داخلياً عبر جافا الواتساب لمعرفة نوع الحساب والـ jid
        let jid = number + '@s.whatsapp.net';
        let [result] = await conn.onWhatsApp(jid);

        // 6. تحديد نوع الحساب (أعمال أو عادي)
        let accountType = 'لا يوجد حساب واتساب';
        if (result && result.exists) {
            accountType = result.biz ? 'حساب أعمال (Business)' : 'حساب عادي (Personal)';
        } else {
            throw new Error('الـرقم غـير مـسجل فـي الـواتساب أصـلاً.');
        }

        // 7. جلب صورة البروفايل الرسمية للرقم
        let profilePic;
        try {
            profilePic = await conn.profilePictureUrl(jid, 'image');
        } catch {
            // صورة افتراضية في حال كان الرقم يخفي صورته عن الغرباء
            profilePic = 'https://telegra.ph/file/24fa902eee85d33618514.png'; 
        }

        // 8. نظام ذكي لتحديد الدولة بناءً على مفتاح الرقم (أمثلة لأشهر الدول)
        let country = 'دولة غير معروفة 🌍';
        if (number.startsWith('20')) country = 'مصر 🇪🇬';
        else if (number.startsWith('966')) country = 'السعودية 🇸🇦';
        else if (number.startsWith('968')) country = 'عُمان 🇴🇲';
        else if (number.startsWith('964')) country = 'العراق 🇮🇶';
        else if (number.startsWith('971')) country = 'الإمارات 🇦🇪';
        else if (number.startsWith('965')) country = 'الكويت 🇰🇼';
        else if (number.startsWith('974')) country = 'قطر 🇶🇦';
        else if (number.startsWith('973')) country = 'البحرين 🇧🇭';
        else if (number.startsWith('212')) country = 'المغرب 🇲🇦';
        else if (number.startsWith('213')) country = 'الجزائر 🇩🇿';
        else if (number.startsWith('216')) country = 'تونس 🇹🇳';
        else if (number.startsWith('249')) country = 'السودان 🇸🇩';
        else if (number.startsWith('962')) country = 'الأردن 🇯🇴';
        else if (number.startsWith('963')) country = 'سوريا 🇸🇾';
        else if (number.startsWith('961')) country = 'لبنان 🇱🇧';
        else if (number.startsWith('970')) country = 'فلسطين 🇵🇸';
        else if (number.startsWith('967')) country = 'اليمن 🇾🇪';
        else if (number.startsWith('218')) country = 'ليبيا 🇱🇾';

        // 9. تجهيز كابتشن البيانات المطلوب
        let directLink = `https://wa.me/${number}`;
        
        let caption = `*🎁 تم أنتهاء التعديل والفحص*\n\n` +
                      `*الدوله :* ${country}\n` +
                      `*حساب واتس :* ${accountType}\n` +
                      `*متصل : زمن اخر اتصال :* لا يوجد 🔏\n` +
                      `*رابط مباشر :* ${directLink}\n\n` +
                      `${myCredit}`;

        // 10. النجاح: تغيير التفاعل لـ ✅ وتحديث الرسالة ثم إرسال الصورة HD
        await m.react('✅');
        await conn.sendMessage(m.chat, { text: `*✅ تم الانتهاء وجلب البيانات بنجاح!*`, edit: statusMsg.key });

        await conn.sendMessage(m.chat, {
            image: { url: profilePic },
            caption: caption
        }, { quoted: m });

        // تنظيف الشات وحذف رسالة الانتظار
        await conn.sendMessage(m.chat, { delete: statusMsg.key });

    } catch (e) {
        console.error(e);
        await m.react('❌');
        await conn.sendMessage(m.chat, { 
            text: `*❌ خـطأ أثـناء الـفحص!*\n_${e.message || 'تأكد من كتابة الرقم مع كود الدولة الصحيح.'}_`, 
            edit: statusMsg.key 
        }, { quoted: m });
    }
};

handler.help = ['واتس <الرقم>'];
handler.tags = ['tools'];
handler.command = /^(واتس|رقم)$/i;

export default handler;