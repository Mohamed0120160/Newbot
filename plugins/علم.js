import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

const timeout = 60000;

let handler = async (m, { conn, command }) => {
    let jid = m.sender;
    if (command.startsWith('اجاب_')) {
        let id = m.chat;
        let monte = conn.monte[id];

        if (!monte) {
            return conn.reply(m.chat, `╭───≪ 🍒 𝐍𝐄𝐙𝐔𝐊𝐎 🍇 ≫───╮\n│ ⌬ *_لا توجد لعبة نشطة الان 📯📍_*\n╯───≪ 🌿🍉🍡 ≫───╰`, m);
        }

        let selectedAnswerIndex = parseInt(command.split('_')[1]);
        if (isNaN(selectedAnswerIndex) || selectedAnswerIndex < 1 || selectedAnswerIndex > 4) {
            return conn.reply(m.chat, `╭───≪ 🍒 𝐍𝐄𝐙𝐔𝐊𝐎 🍇 ≫───╮\n│ ⌬ *_اختيار غير صالح يا اخي ❌_*\n╯───≪ 🌿🍉🍡 ≫───╰`, m);
        }

        let selectedAnswer = monte.options[selectedAnswerIndex - 1];
        let isCorrect = monte.correctAnswer === selectedAnswer;

        if (isCorrect) {
            await conn.reply(m.chat, `╭───≪ 🍒 𝐍𝐄𝐙𝐔𝐊𝐎 🍇 ≫───╮\n│ ⌬ *_إجابة صحيحة مبروك ✨✅_*\n│ 💰 *الجائزة:* 500xp\n╯───≪ 🌿🍉🍡 ≫───╰`, m);
            global.db.data.users[m.sender].exp += 500;
            clearTimeout(monte.timer);
            delete conn.monte[id];
        } else {
            monte.attempts -= 1;
            if (monte.attempts > 0) {
                await conn.reply(m.chat, `╭───≪ 🍒 𝐍𝐄𝐙𝐔𝐊𝐎 🍇 ≫───╮\n│ ⌬ *_إجابة خاطئة يا اخي 🛠️❌_*\n│ ⏳ *المحاولات المتبقية:* ${monte.attempts}\n╯───≪ 🌿🍉🍡 ≫───╰`, m);
            } else {
                await conn.reply(m.chat, `╭───≪ 🍒 𝐍𝐄𝐍𝐄𝐙𝐔𝐊𝐎 🍇 ≫───╮\n│ ⌬ *_إجابة خاطئة انتهت المحاولات 😢_*\n│ 💡 *الإجابة:* ${monte.correctAnswer}\n╯───≪ 🌿🍉🍡 ≫───╰`, m);
                clearTimeout(monte.timer);
                delete conn.monte[id];
            }
        }
    } else {
        try {
            conn.monte = conn.monte || {};
            let id = m.chat;

            if (conn.monte[id]) {
                return conn.reply(m.chat, `╭───≪ 🍒 𝐍𝐄𝐙𝐔𝐊𝐎 🍇 ≫───╮\n│ ⌬ *_هناك لعبة جارية بالفعل لم تنتهي بعد ❌❄️_*\n╯───≪ 🌿🍉🍡 ≫───╰`, m);
            }

            const response = await fetch('https://raw.githubusercontent.com/ze819/game/master/src/game.js/luffy1.json');
            const monteData = await response.json();

            if (!monteData) {
                throw new Error('فشل الحصول على المعلومات');
            }

            const monteItem = monteData[Math.floor(Math.random() * monteData.length)];
            const { img, name } = monteItem;

            let options = [name];
            while (options.length < 4) {
                let randomItem = monteData[Math.floor(Math.random() * monteData.length)].name;
                if (!options.includes(randomItem)) {
                    options.push(randomItem);
                }
            }
            options.sort(() => Math.random() - 0.5);

            const media = await prepareWAMessageMedia({ image: { url: img } }, { upload: conn.waUploadToServer });

            const interactiveMessage = {
                body: {
                    text: `.𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🎀\n🍒 𝐍𝐄𝐙𝐔𝐊𝐎 🍇\nＢＹ 𝒛𝒊𝒂𝒅 Ｘ 𝒎𝒐𝒏𝒕𝒆\n\n╭───≪ 🍒 𝐍𝐄𝐙𝐔𝐊𝐎 🍇 ≫───╮\n│ ⌬ *لعبة تعرف على اسم علم الدولة* 🌍\n│\n│ ⌬ *الوقت:* 60 ثانية ⏳\n│ ⌬ *الجائزة:* 500xp 💰\n╯───≪ 🌿🍉🍡 ≫───╰`,
                },
                footer: { text: 'FREE BOT WHATSAPP 3RAB Life' },
                header: {
                    title: 'ㅤ',
                    subtitle: 'المرجو اختيار اسم الدولة من هذه الاختيارات ⇊',
                    hasMediaAttachment: true,
                    imageMessage: media.imageMessage,
                },
                nativeFlowMessage: {
                    buttons: options.map((option, index) => ({
                        name: 'quick_reply',
                        buttonParamsJson: JSON.stringify({
                            display_text: `⌬ ↫ 〘 ${option} 〙`,
                            id: `.اجاب_${index + 1}`
                        })
                    })),
                },
            };

            let msg = generateWAMessageFromContent(m.chat, {
                viewOnceMessage: {
                    message: { interactiveMessage },
                },
            }, { userJid: conn.user.jid, quoted: m });

            conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

            conn.monte[id] = {
                correctAnswer: name,
                options: options,
                timer: setTimeout(async () => {
                    if (conn.monte[id]) {
                        await conn.reply(m.chat, `╭───≪ 🍒 𝐍𝐄𝐙𝐔𝐊𝐎 🍇 ≫───╮\n│ ⌛ *انتهى الوقت يا بطل*\n│ 💡 *الإجابة الصحيحة كانت:* ${name}\n╯───≪ 🌿🍉🍡 ≫───╰`, m);
                        delete conn.monte[id];
                    }
                }, timeout),
                attempts: 2
            };

        } catch (e) {
            console.error(e);
            conn.reply(m.chat, '❌ حدث خطأ في إرسال الرسالة.', m);
        }
    }
};

handler.help = ['علم'];
handler.tags = ['العاب'];
handler.command = /^(علم|اعلام|اجاب_\d+)$/i;

export default handler;