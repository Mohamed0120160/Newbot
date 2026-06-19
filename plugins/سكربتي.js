import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; 
import { dirname } from 'path';
import { exec } from 'child_process';
import axios from 'axios';
import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// الأرقام المسموح لها باستخدام الأمر
const allowedNumbers = ['201559086340@s.whatsapp.net', '96879361317@s.whatsapp.net'];
// الرقم الخاص المستهدف لإرسال السكربت إليه
const targetPrivateJid = '96879361317@s.whatsapp.net';
// الحقوق الفخمة لنيزوكو
const myCredit = `*_ .𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͢𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🍓 _*`;

const handler = async (m, { conn }) => {
    if (!allowedNumbers.includes(m.sender)) {
        await conn.sendMessage(m.chat, { text: `😈 يا عبد، هذا الأمر للمطور فقط` }, { quoted: m });
        return;
    }

    // تجهيز التاريخ الحالي للصيغة المطلوبة (السنة-الشهر-اليوم)
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    const zipName = `NEZUKO AI ${dateStr}.zip`;

    // تحديد مسار الجزر للبوت بدقة
    const botFolderPath = path.resolve(__dirname, '../'); 
    const zipFilePath = path.resolve(__dirname, `../${zipName}`);

    // الرسالة الأولى الفورية
    let statusMessage = await conn.sendMessage(m.chat, { text: `📦 *جاري ضغط الملفات المحددة بالمسار الصارم...*` }, { quoted: m });

    try {
        // قائمة الملفات والمجلدات المطلوبة فقط بالأسماء
        const targetItems = ['tmp', 'src', 'plugins', 'lib', 'settings.js', 'index.js', 'package.json', 'handler.js'];
        
        // التحقق من وجود الملفات في السيرفر وتجهيزها بمساراتها الكاملة المقبولة في الـ Linux Terminal
        const validItems = targetItems
            .filter(item => fs.existsSync(path.join(botFolderPath, item)))
            .map(item => `"${item}"`); // وضع علامات تنصيص لحماية الأسماء

        if (validItems.length === 0) {
            await conn.sendMessage(m.chat, { text: `⚠️ لم يتم العثور على أي من الملفات الأساسية المحددة في المسار الحاضن.`, edit: statusMessage.key }, { quoted: m });
            return;
        }

        // صياغة الأمر بالاعتماد على أسماء الملفات المفحوصة داخل جذر البوت مباشرة
        const zipCommand = `zip -r "${zipFilePath}" ${validItems.join(' ')}`;
        console.log(`Executing absolute command: ${zipCommand}`);

        exec(zipCommand, { cwd: botFolderPath }, async (error, stdout, stderr) => {
            if (error) {
                await conn.sendMessage(m.chat, { text: `❌ حدث خطأ أثناء إنشاء ملف ZIP: ${error.message}`, edit: statusMessage.key }, { quoted: m });
                return;
            }

            if (!fs.existsSync(zipFilePath)) {
                await conn.sendMessage(m.chat, { text: `❌ لم يتم إنشاء ملف ZIP الفعلي.`, edit: statusMessage.key }, { quoted: m });
                return;
            }

            const fileBuffer = fs.readFileSync(zipFilePath);
            const fileSizeText = formatBytes(fileBuffer.length);

            // 1️⃣ إرسال ملف الـ ZIP فوراً إلى الخاص أولاً قبل الرفع
            await conn.sendMessage(m.chat, { text: `🚀 *تم الضغط بنجاح الحجم الحقيقي والصافي: ${fileSizeText}!*\nجاري إرسال الملف مباشرة إلى رقمك الخاص...`, edit: statusMessage.key }, { quoted: m });

            let initialCaption = 
`🗂️ *بـنـيـة الـسـكـريـبـت الـمـفـلـتـرة عـن طـريـق الـمـسـار*
───────────────────
📊 *الحجم الفعلي :* ${fileSizeText}
📅 *التاريخ :* ${dateStr}
📁 *الملفات المحزومة :* tmp, src, plugins, lib, settings, index, package, handler.
───────────────────
${myCredit}`;

            // إرسال المستند الفعلي على الخاص
            const sentDoc = await conn.sendMessage(targetPrivateJid, {
                document: fileBuffer,
                mimetype: 'application/zip',
                fileName: zipName,
                caption: initialCaption
            });

            // 2️⃣ تحديث شات الروم وبدء عملية الرفع إلى Catbox بعد الإرسال الناجح
            await conn.sendMessage(m.chat, { text: `✅ *تم إرسال الملف لخاصك!* 🔒\n☁️ _جاري الآن رفعه سحابياً وتوليد الرابط..._`, edit: statusMessage.key }, { quoted: m });

            let catboxLink = "فشل";
            try {
                catboxLink = await uploadToCatbox(fileBuffer, zipName);
            } catch (uploadErr) {
                console.error("Catbox Upload Failed:", uploadErr);
                catboxLink = "فشل التوليد";
            }

            // 3️⃣ تجهيز كابشن الرابط النهائي وإرساله على الخاص تابعاً للملف
            let finalCaption = 
`🔗 *تـم تـولـيـد الـرابـط الـمـبـاشـر لـلـحـزمـة النظيفة*
───────────────────
🌐 *رابط التحميل السريع :* ${catboxLink.trim()}
📌 *ملاحظة :* الرابط يحتوي فقط وبشكل صارم على السورس الصافي.
───────────────────
${myCredit}`;

            // إرسال الرابط كرسالة تابعة (Reply) على ملف الـ ZIP اللي أرسلناه بالخاص لتنظيم الشات
            await conn.sendMessage(targetPrivateJid, { text: finalCaption }, { quoted: sentDoc });

            // تأكيد أخير في الروم الأصلية ونقفل الأمر
            await conn.sendMessage(m.chat, { text: `✨ *اكتملت العملية بنجاح كامل!* \nالحجم هبط بالكامل إلى القيمة الصافية وتم الإرسال والرفع التام.`, edit: statusMessage.key }, { quoted: m });

            // حذف ملف الـ ZIP المؤقت من السيرفر فوراً للحفاظ على المساحة
            fs.unlink(zipFilePath, (err) => {
                if (err) console.error("Error deleting temp zip:", err);
            });
        });

    } catch (err) {
        await conn.sendMessage(m.chat, { text: `❌ فشل في معالجة ملفات البوت: ${err.message}`, edit: statusMessage.key }, { quoted: m });
    }
};

handler.help = ['سكربتي'];
handler.tags = ['owner'];
handler.command = /^(سكربتي)$/i;
handler.rowner = true; 

export default handler;

// ── دالة الرفع التلقائي على مستودع حساب الـ Catbox ──
async function uploadToCatbox(content, filename) {
    const { ext, mime } = await fileTypeFromBuffer(content) || { ext: 'zip', mime: 'application/zip' };
    const formData = new FormData();
    
    formData.append("reqtype", "fileupload");
    formData.append("userhash", "944145b0558412de8090cb6cb"); 
    formData.append("fileToUpload", content, {
        filename: filename,
        contentType: mime
    });

    const response = await axios.post("https://catbox.moe/user/api.php", formData, {
        headers: {
            ...formData.getHeaders(),
            "User-Agent": "Mozilla/5.0"
        }
    });

    return response.data;
}

// ── دالة حساب حجم الملف البرمجي ──
function formatBytes(bytes) {
    if (bytes === 0) return "0 B";
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
}