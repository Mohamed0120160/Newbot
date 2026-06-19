import fs from 'fs'
import path from 'path'

const settingsPath = path.join(process.cwd(), 'settings.js')

const handler = async (m, { conn, text, usedPrefix, command, isOwner, participants }) => {
    if (!isOwner) {
        return m.reply('❌ *أمر خاص بالمطورين فقط*')
    }

    let args = text.trim().split(/\s+/)
    let action = 'add'

    // إذا كتب "زيل"
    if (args[0]?.toLowerCase() === 'زيل') {
        action = 'remove'
        args.shift()
    }

    let targetNumber = ''

    // بالرد على رسالة
    if (m.quoted) {
        targetNumber = m.quoted.sender.split('@')[0]
    }

    // بالمنشن
    else if (m.mentionedJid?.length) {
        targetNumber = m.mentionedJid[0].split('@')[0]
    }

    // بالرقم
    else if (args.length) {
        let cleaned = args.join('').replace(/[^0-9]/g, '')
        if (cleaned.length >= 8) {
            targetNumber = cleaned
        }
    }

    if (!targetNumber) {
        return m.reply(
`🍃 *طريقة الاستخدام:*

➕ *إضافة مطور*
${usedPrefix + command} 96879361317
${usedPrefix + command} @user
أو رد على رسالة الشخص

➖ *إزالة مطور*
${usedPrefix + command} زيل 96879361317
${usedPrefix + command} زيل @user
أو رد على رسالة الشخص ثم اكتب:
${usedPrefix + command} زيل`
        )
    }

    const currentOwners = global.owner || []

    try {
        let settingsContent = fs.readFileSync(settingsPath, 'utf8')

        const ownerRegex = /(global\.owner\s*=\s*\[)([\s\S]*?)(\])/s
        const match = settingsContent.match(ownerRegex)

        if (!match) {
            return m.reply('❌ *لم يتم العثور على قائمة المطورين في settings.js*')
        }

        let owners = [...currentOwners]

        // ==================
        // إضافة مطور
        // ==================
        if (action === 'add') {
            if (owners.includes(targetNumber)) {
                return m.reply(`✅ *الرقم ${targetNumber} موجود بالفعل ضمن المطورين*`)
            }

            owners.push(targetNumber)

            let formattedOwners = owners.map(num => `"${num}"`).join(', ')
            const newOwnerLine = `${match[1]}${formattedOwners}${match[3]}`

            settingsContent = settingsContent.replace(ownerRegex, newOwnerLine)
            fs.writeFileSync(settingsPath, settingsContent, 'utf8')

            global.owner = owners

            await m.reply(
`✅ *تمت إضافة مطور جديد بنجاح*
📌 *الرقم:* ${targetNumber}`
            )

            for (let owner of owners) {
                if (owner !== targetNumber) {
                    await conn.sendMessage(
                        owner + '@s.whatsapp.net',
                        {
                            text:
`➕ *تمت إضافة مطور جديد*
👤 *الرقم:* ${targetNumber}
📝 *بواسطة:* ${m.sender.split('@')[0]}`
                        }
                    ).catch(() => {})
                }
            }
        }

        // ==================
        // إزالة مطور
        // ==================
        else {
            if (!owners.includes(targetNumber)) {
                return m.reply(`❌ *الرقم ${targetNumber} ليس ضمن المطورين*`)
            }

            owners = owners.filter(num => num !== targetNumber)

            let formattedOwners = owners.map(num => `"${num}"`).join(', ')
            const newOwnerLine = `${match[1]}${formattedOwners}${match[3]}`

            settingsContent = settingsContent.replace(ownerRegex, newOwnerLine)
            fs.writeFileSync(settingsPath, settingsContent, 'utf8')

            global.owner = owners

            await m.reply(
`🗑️ *تمت إزالة المطور بنجاح*
📌 *الرقم:* ${targetNumber}`
            )

            for (let owner of owners) {
                await conn.sendMessage(
                    owner + '@s.whatsapp.net',
                    {
                        text:
`➖ *تمت إزالة مطور*
👤 *الرقم:* ${targetNumber}
📝 *بواسطة:* ${m.sender.split('@')[0]}`
                    }
                ).catch(() => {})
            }
        }

    } catch (err) {
        console.error(err)
        m.reply(`❌ *حدث خطأ أثناء تعديل الملف:*\n${err.message}`)
    }
}

handler.help = ['لمطور', 'لمطور زيل']
handler.tags = ['owner']
handler.command = /^(لمطور|addowner)$/i
handler.rowner = true

export default handler