import { watchFile, unwatchFile } from "fs"
import chalk from "chalk"
import { fileURLToPath } from "url"
import fs from "fs"

global.botNumber = "" // اتركه فارغًا

// قائمة المالكين الأساسيين مع إضافة الأرقام الجديدة
global.owner = ["249918614328", "212662023605", "201559086340", "212727621948", "249922420554", "96879361317", "972599358561", "972599358186", "236090745159727", "201015383185", "201096872170", "201500564191", "584167138807", "193639288447013", "212764319418"]

// قائمة العلامات الخاصة (suittag) مع إضافة الرقم الجديد
global.suittag = ["249922420554"]

// قائمة المستخدمين المميزين
global.prems = []

global.libreria = "Baileys Multi Device"
global.vs = "^1.8.2|Latest"
global.nameqr = "HULK-MD"
global.sessions = "Sessions/Principal"
global.jadi = "Sessions/SubBot"
global.yukiJadibts = true

global.botname = ".𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🎀"
global.textbot = ".𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🎀"
global.dev = "𝒛𝒊𝒂𝒅 Ｘ 𝒎𝒐𝒏𝒕𝒆"
global.author = ".𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🎀"
global.etiqueta = ".𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🎀"
global.currency = "¥enes"
global.banner = "https://raw.githubusercontent.com/mzml-gg/Api-creds.json-/main/IMG-20260320-WA0382.jpg"
global.icono = "https://raw.githubusercontent.com/mzml-gg/Api-creds.json-/main/IMG-20260320-WA0382.jpg"
global.catalogo = fs.readFileSync('./lib/catalogo.jpg')

global.group = "https://chat.whatsapp.com/JyzcMffpXp2DrvOB4Z2jz9?mode=gi_t"
global.community = "https://chat.whatsapp.com/JyzcMffpXp2DrvOB4Z2jz9?mode=gi_t"
global.channel = "https://whatsapp.com/channel/0029Vb7AkG84inotOc8BXE1K"
global.github = "https://github.com/mzml-gg"
global.gmail = "mzmlzip@gmail.com"
global.ch = {
    ch1: "120363407598531220@newsletter"
}

global.APIs = {
    xyro: { url: "https://api.xyro.site", key: null },
    yupra: { url: "https://api.yupra.my.id", key: null },
    vreden: { url: "https://api.vreden.web.id", key: null },
    delirius: { url: "https://api.delirius.store", key: null },
    zenzx: { url: "https://api.zenzxz.my.id", key: null },
    siputzx: { url: "https://api.siputzx.my.id", key: null }
}

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
    unwatchFile(file)
    console.log(chalk.redBright("Update 'settings.js'"))
    import(`${file}?update=${Date.now()}`)
})