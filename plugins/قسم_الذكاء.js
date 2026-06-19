// م4.js - قـسـم الـذكاء الاصطناعي 🧠
// تم التعديل لاستخدام روابط سريعة وإرسال صورة/فيديو مثل الأقسام السابقة

import fetch from 'node-fetch';

// دالة اقتباس جهة الاتصال
function contactQuote(m) {
  return {
    key: {
      participants: '0@s.whatsapp.net',
      remoteJid: 'status@broadcast',
      fromMe: false,
      id: 'NEZUKO_MENU_AI'
    },
    message: {
      contactMessage: {
        displayName: m.pushName || 'User',
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${m.pushName || 'User'};;;;\nFN:${m.pushName || 'User'}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:📞 WhatsApp\nORG:NEZUKO BOT ✓\nTITLE:Verified\nEND:VCARD`
      }
    },
    participant: '0@s.whatsapp.net'
  };
}

// استخراج أسماء الأوامر من handler.command
function extractCommands(plugin, usedPrefix) {
  let cmds = [];
  let cmdDef = plugin.command;
  if (!cmdDef) return cmds;

  const addCmd = (c) => {
    if (typeof c === 'string' && c.trim()) {
      cmds.push(usedPrefix + c.trim());
    }
  };

  if (Array.isArray(cmdDef)) {
    cmdDef.forEach(addCmd);
  } else if (typeof cmdDef === 'string') {
    addCmd(cmdDef);
  } else if (cmdDef instanceof RegExp) {
    let src = cmdDef.source;
    src = src.replace(/^\^/, '').replace(/\$$/, '').replace(/\/[gis]*$/, '');
    let parts = src.split('|');
    let firstPart = parts[0].replace(/[()]/g, '');
    if (firstPart) cmds.push(usedPrefix + firstPart);
  }
  return cmds;
}

let handler = async (m, { conn, usedPrefix }) => {
  // 1. مصفوفة الروابط السريعة (مثل الأقسام السابقة)
  const assets = [
    "https://raw.githubusercontent.com/mzml-gg/nezuko-photos/main/nezuko1.jpg",
    "https://raw.githubusercontent.com/mzml-gg/nezuko-photos/main/nezuko2.jpg",
    "https://raw.githubusercontent.com/mzml-gg/nezuko-photos/main/nezuko3.jpg",
    "https://raw.githubusercontent.com/mzml-gg/nezuko-photos/main/nezuko4.jpg",
    "https://raw.githubusercontent.com/mzml-gg/nezuko-photos/main/nezuko5.jpg",
    "https://raw.githubusercontent.com/mzml-gg/nezuko-photos/main/nezuko6.jpg",
    "https://raw.githubusercontent.com/mzml-gg/nezuko-photos/main/nezuko7.jpg",
    "https://raw.githubusercontent.com/mzml-gg/nezuko-photos/main/nezuko8.jpg",
    "https://raw.githubusercontent.com/mzml-gg/nezuko-photos/main/nezuko9.jpg",
    "https://raw.githubusercontent.com/mzml-gg/nezuko-photos/main/NEZUKO-video.mp4"
  ];

  // 2. اختيار عشوائي
  const selection = assets[Math.floor(Math.random() * assets.length)];
  const isVideo = selection.endsWith('.mp4');

  // 3. جمع أوامر قسم الذكاء الاصطناعي (AI)
  let aiCommands = [];
  if (global.plugins) {
    for (let plugin of Object.values(global.plugins)) {
      if (!plugin) continue;
      let isAICmd = false;
      if (plugin.tags && Array.isArray(plugin.tags)) {
        if (plugin.tags.includes('ai') || plugin.tags.includes('AI') || plugin.tags.includes('ذكاء اصطناعي')) {
          isAICmd = true;
        }
      }
      if (isAICmd) {
        let cmds = extractCommands(plugin, usedPrefix);
        aiCommands.push(...cmds);
      }
    }
  }
  aiCommands = [...new Set(aiCommands)].sort();

  const currentDate = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  const dayName = new Date().toLocaleDateString('ar-EG', { weekday: 'long' });
  const taguser = '@' + m.sender.split('@')[0];

  let menuText = `
╗═══≪ 🌿🤖🧠 ≫═══╔
 .𓏲⋆˙𝑵𝑬𝒁𝑼𝑲𝑶 𝑩𝑶𝑻🎀​
  𝖡𝖸  𝒛𝒊𝒂𝒅 Ж 𝒎𝒐𝒏𝒕𝒆 𝒅𝒆𝒗𝒔 👑 
╝═══≪ 🌿🤖🧠 ≫═══╚

╮──────────────╭
𓆩⃞🧠𓆪  𝗐𝖾𝗅𝖼𝗈𝗆𝖾 ${taguser}
𓆩⃞🤖𓆪  قـسـم الـذكاء الاصطناعي AI 🧠
╯──────────────╰

╮───≪🌴الأوامر المتاحة≫───╭`.trim();

  if (aiCommands.length === 0) {
    menuText += `\n│ ⌬ لا توجد أوامر ذكاء اصطناعي حالياً`;
  } else {
    for (let cmd of aiCommands) {
      menuText += `\n│ ⌬ ${cmd}`;
    }
  }

  menuText += `
ََ
╯───≪ 🌿🤖🍍 ≫───╰

𓆩⃞🍇 𓆪 𝗕𝗬 𝒛𝒊𝒂𝒅 Ｘ 𝒎𝒐𝒏𝒕𝒆 👑 
؍ 🌸♡゙ تاريـخ: ${currentDate}
؍ 🌸♡゙ اليـوم: ${dayName}
`.trim();

  // 4. تجهيز التوجيه (forwardingScore = 1)
  const contextInfo = {
    mentionedJid: [m.sender],
    isForwarded: true,
    forwardingScore: 1,
    forwardedNewsletterMessageInfo: {
      newsletterJid: '120363407598531220@newsletter',
      newsletterName: '.𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻 ＣＨ 👑',
      serverMessageId: -1
    }
  };

  // 5. إرسال الوسائط مع النص
  if (isVideo) {
    await conn.sendMessage(m.chat, {
      video: { url: selection },
      caption: menuText,
      gifPlayback: true,
      contextInfo
    }, { quoted: contactQuote(m) });
  } else {
    await conn.sendMessage(m.chat, {
      image: { url: selection },
      caption: menuText,
      contextInfo
    }, { quoted: contactQuote(m) });
  }
};

handler.command = /^(م4)$/i;
handler.help = ['م4'];
handler.tags = ['menu'];

export default handler;