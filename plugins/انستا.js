/**
 * 📸 Instagram Video Downloader — نيزوكو إنستا
 * ⏤͟͞ू⃪𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🎀
 * يعتمد على الـ API الخاص بـ nezuko.hidenfree.com وتحميل الـ Buffer بأعلى جودة
 */

import axios from 'axios'

// --- إعدادات وثوابت البث والقناة (Newsletter) للحقوق والمظهر الاحترافي ---
const newsletterJid  = '120363407598531220@newsletter';
const newsletterName = '.𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🎀';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  
  // التحقق من إدخال الرابط
  if (!args[0]) {
    return m.reply(
      `❌ *الاستخدام المعتمد:*\n${usedPrefix + command} <رابط_إنستغرام>\n\n*مثال:*\n${usedPrefix + command} https://www.instagram.com/reel/DZiTH63MWbF`
    )
  }

  const url = args[0]

  // إعداد كائن الـ contextInfo المطور لتثبيت وحماية الرسالة بـ السيرفرات
  const contextInfo = {
    mentionedJid: [m.sender],
    isForwarded: true,
    forwardingScore: 999,
    forwardedNewsletterMessageInfo: {
      newsletterJid: newsletterJid,
      newsletterName: newsletterName,
      serverMessageId: -1
    },
    externalAdReply: {
      title: '.𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🎀',
      body: 'تحميل مقاطع وفيديوهات إنستغرام بأعلى جودة 🎬',
      thumbnail: global.icons || '', 
      sourceUrl: url,
      mediaType: 1,
      renderLargerThumbnail: false
    }
  }

  try {
    // إرسال رسالة انتظار للمستخدم بحقن الثيم التوثيقي
    await conn.reply(
      m.chat,
      `*⏳ جَــأࢪي م࣬ـــ؏ٚـأݪـجَۿ أݪــࢪأبٚطَ وسحب الفيديو من إنستغرام... 📥*`,
      m,
      { contextInfo, quoted: m }
    )

    // 1. استدعاء الـ API الخاص بك
    const apiUrl = `https://nezuko.hidenfree.com/api/download/instagram-api?url=${encodeURIComponent(url)}`
    const apiResponse = await axios.get(apiUrl)
    const result = apiResponse.data

    // التحقق من نجاح الاستجابة ووجود رابط التحميل
    if (!result || !result.success || !result.download) {
      return conn.reply(
        m.chat,
        `❌ *فشل جلب البيانات:* السيرفر لم يقم بإرجاع رابط تحميل مباشر، تأكد من صحة الرابط أو جرب لاحقاً.`,
        m,
        { contextInfo, quoted: m }
      )
    }

    const downloadUrl = result.download

    // 2. تحميل الفيديو كـ Buffer لضمان تخطي مشاكل الحظر وإرساله بأعلى جودة مادية (HD)
    const videoResponse = await axios.get(downloadUrl, { responseType: 'arraybuffer' })
    const videoBuffer = Buffer.from(videoResponse.data, 'binary')

    // 3. إرسال ملف الفيديو النهائي كـ رد مدمج معه الـ contextInfo
    await conn.sendMessage(
      m.chat,
      {
        video: videoBuffer,
        mimetype: 'video/mp4',
        caption: `✨ *تـم الـتـحـمـيـل بـأعـلـى جـودة بـنـجـاح!* \n\n🔗 *الرابط الأصلي:* ${result.url || url}\n🎀 *بواسطة:* ${newsletterName}`,
        contextInfo: contextInfo
      },
      { quoted: m }
    )

  } catch (e) {
    console.error(e)
    await conn.reply(
      m.chat,
      `❌ *حدث خطأ غير متوقع أثناء المعالجة:*\n${e.message || e}`,
      m,
      { contextInfo, quoted: m }
    )
  }
}

handler.help = ['انستا']
handler.command = ['انستا', 'ig', 'insta', 'instagram']
handler.tags = ['download']

export default handler