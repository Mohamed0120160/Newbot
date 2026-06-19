import axios from "axios";
const { generateWAMessageContent, generateWAMessageFromContent, proto } =
  (await import("@whiskeysockets/baileys")).default;

/* ========= دالة جهة الاتصال (Quote) ========= */
function contactQuote(m) {
  return {
    key: {
      participants: '0@s.whatsapp.net',
      remoteJid: 'status@broadcast',
      fromMe: false,
      id: 'HULK'
    },
    message: {
      contactMessage: {
        displayName: m.pushName || 'Unknown',
        vcard: `BEGIN:VCARD
VERSION:3.0
N:${m.pushName || 'User'};;;;
FN:${m.pushName || 'User'}
item1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}
item1.X-ABLabel:📞 WhatsApp
ORG:HULK BOT ✓
TITLE:Verified
END:VCARD`
      }
    },
    participant: '0@s.whatsapp.net'
  }
}

/* ========= الأمر ========= */
let handler = async (m, { conn }) => {
    // 1️⃣ قائمة الصور العشوائية لـ نيزوكو
    const images = [
        "https://raw.githubusercontent.com/mzml-gg/nezuko-Photos/main/nezuko1.jpg",
        "https://raw.githubusercontent.com/mzml-gg/nezuko-Photos/main/nezuko2.jpg",
        "https://raw.githubusercontent.com/mzml-gg/nezuko-Photos/main/nezuko3.jpg",
        "https://raw.githubusercontent.com/mzml-gg/nezuko-Photos/main/nezuko4.jpg",
        "https://raw.githubusercontent.com/mzml-gg/nezuko-Photos/main/nezuko5.jpg",
        "https://raw.githubusercontent.com/mzml-gg/nezuko-Photos/main/nezuko6.jpg",
        "https://raw.githubusercontent.com/mzml-gg/nezuko-Photos/main/nezuko7.jpg",
        "https://raw.githubusercontent.com/mzml-gg/nezuko-Photos/main/nezuko8.jpg",
        "https://raw.githubusercontent.com/mzml-gg/nezuko-Photos/main/nezuko9.jpg"
    ];

    // 2️⃣ اختيار صورة عشوائية
    const randomImage = images[Math.floor(Math.random() * images.length)];

    // 3️⃣ دالة تجهيز ميديا الصورة للزر التفاعلي
    async function createImage(url) {
        const { imageMessage } = await generateWAMessageContent(
            { image: { url } },
            { upload: conn.waUploadToServer }
        );
        return imageMessage;
    }

    // 4️⃣ إنشاء الكارت التفاعلي وبناء هيكل الرسالة
    let cards = [{
        body: proto.Message.InteractiveMessage.Body.fromObject({
            text: `موقع apis nezuko ai 🐦🫴\n\nادخلو في قسم ال ai تلاقي ال api تبع جي بي تي داكي`,
        }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({
            text: "HULK BOT MD",
        }),
        header: proto.Message.InteractiveMessage.Header.fromObject({
            hasMediaAttachment: true,
            imageMessage: await createImage(randomImage),
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
            buttons: [
                {
                    name: "cta_url",
                    buttonParamsJson: `{
                        "display_text": "❤️ .𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🎀​ APIS✨",
                        "url": "https://nezuko.hidenfree.com"
                    }`,
                },
            ],
        }),
    }];

    const bot = generateWAMessageFromContent(
        m.chat,
        {
            viewOnceMessage: {
                message: {
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: { text: "🔗 ╎ نـظام مـوقع الـذكاء الاصـطـناعي" },
                        footer: { text: "⚡ Nezuko AI System" },
                        carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                            cards,
                        }),
                    }),
                },
            },
        },
        { quoted: contactQuote(m) }
    );

    // 5️⃣ إرسال الرسالة إلى الشات
    await conn.relayMessage(m.chat, bot.message, { messageId: bot.key.id });
};

handler.command = /^(الموقع)$/i;

export default handler;