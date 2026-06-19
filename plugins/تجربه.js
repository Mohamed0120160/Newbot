const handler = async (m, { conn }) => {
    // 1️⃣ قائمة الروابط
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

    // 2️⃣ اختيار رابط عشوائي
    const randomImage = images[Math.floor(Math.random() * images.length)];

    // 3️⃣ إرسال الصورة مع الكابتشن والزر
    await conn.sendMessage(m.chat, {
        image: { url: randomImage },
        caption: `موقع apis nezuko ai 🐦🫴\n\nادخلو في قسم ال ai تلاقي ال api تبع جي بي تي داكي`,
        viewOnce: true,
        headerType: 4,
        contextInfo: {
            externalAdReply: {
                showAdAttribution: true,
                title: "Nezuko AI API",
                body: "اكتشف خدمات الذكاء الاصطناعي",
                thumbnailUrl: randomImage,
                sourceUrl: "https://nezuko.hidenfree.com"
            }
        },
        buttons: [
            {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                    display_text: "api nezuko-ai",
                    url: "https://nezuko.hidenfree.com"
                })
            }
        ]
    }, { quoted: m });
};

handler.command = /^(الموقع)$/i;
export default handler;