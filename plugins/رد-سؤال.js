// حہּٰقَــــوٰقَ 𝒛𝒊𝒂𝒅-𝒅𝒗 💻🔥
// ملف التحقق من إجابة لعبة الألغاز (سؤال)

export async function before(m) {
    let id = m.chat
    
    // التحقق من أن الرسالة رد على سؤال البوت (لعبة سؤال/لغز)
    if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !m.text || !/اللغز/i.test(m.quoted.text)) return !0
    
    this.tekateki = this.tekateki ? this.tekateki : {}
    if (!(id in this.tekateki)) return !0

    if (m.quoted.id == this.tekateki[id][0].id) {
        let json = JSON.parse(JSON.stringify(this.tekateki[id][1]))
        
        // التحقق من الإجابة (تجاهل المسافات وحالة الأحرف)
        if (m.text.toLowerCase().trim() == json.response.toLowerCase().trim()) {
            global.db.data.users[m.sender].exp += this.tekateki[id][2]
            
            // رد الفوز الملكي
            m.reply(`╭───≪ 🍒 𝐍𝐄𝐙𝐔𝐊𝐎 🍇 ≫───╮
│ ⌬ *_إجابة صحيحة مبروك ✨✅_*
│ 🧩 *ذكاء خارق يا بطل*
│ 💰 *الجائزة:* ${this.tekateki[id][2]}xp
╯───≪ 🌿🍉🍡 ≫───╰`)
            
            clearTimeout(this.tekateki[id][3])
            delete this.tekateki[id]
        } else {
            // رد في حال كانت الإجابة خاطئة
            m.reply(`╭───≪ 🍒 𝐍𝐄𝐙𝐔𝐊𝐎 🍇 ≫───╮
│ ⌬ *_إجابة خاطئة يا اخي 🛠️❌_*
│ 🧩 *ركز وحاول مرة تانية*
╯───≪ 🌿🍉🍡 ≫───╰`)
        }
    }
    return !0
}