/**
 * 🎵 Spotify Interactive Search & Download — نيزوكو سبوتيفاي (الإصدار الاحترافي المأمن)
 * ⏤͟͞ू⃪𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🍓
 * نظام مأمن بـ 4 سيرفرات متتالية (Yupra -> Delirius -> Ryzen -> Alya) لمنع أخطاء التحميل نهائياً.
 */

import axios from 'axios';
import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = pkg;

const myCredit = `*_ .𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🍓 _*`;

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const args = text ? text.split('|') : [];
    
    // --- منطق التحميل عند اختيار أغنية من القائمة ---
    if (args.length === 2 && args[0] === 'download') {
        const url = args[1];
        await m.react('⏳');
        await conn.sendMessage(m.chat, { text: `* .𓏲⋆˙𝑵𝜩𝒁𝑼𝑲̤͝𝜣͓ۧٛ͢ ͝ 𝑩𝜣𝑻🎀🍡 _*\n\n*_ جـاري تـنـزيـل و ارسـال الأغـنـيـة... يـرجـى الانـتـظـار 🕒 _*` }, { quoted: m });

        let audioUrl = null;
        let songTitle = 'Spotify Audio';

        // 🛡️ السيرفر الأول: yupra (الأساسي)
        try {
            console.log('Trying Spotify Server 1 (Yupra)...');
            const dlApi = `https://api.yupra.my.id/api/downloader/spotify?url=${encodeURIComponent(url)}`;
            const { data: dlData } = await axios.get(dlApi);
            if (dlData.status && dlData.result && dlData.result.download) {
                audioUrl = typeof dlData.result.download === 'string' ? dlData.result.download : (dlData.result.download.url || dlData.result.download);
                songTitle = dlData.result.title || songTitle;
            }
        } catch (err) {
            console.log('Server 1 (Yupra) Failed, trying Server 2...');
        }

        // 🛡️ السيرفر الثاني (الجديد): Delirius API
        if (!audioUrl) {
            try {
                console.log('Trying Spotify Server 2 (Delirius)...');
                const dlApi2 = `https://api.delirius.store/download/spotifydl?url=${encodeURIComponent(url)}`;
                const { data: dlData2 } = await axios.get(dlApi2);
                if (dlData2.status && dlData2.data && dlData2.data.download) {
                    audioUrl = dlData2.data.download;
                    songTitle = dlData2.data.title || songTitle;
                }
            } catch (err) {
                console.log('Server 2 (Delirius) Failed, trying Server 3...');
            }
        }

        // 🛡️ السيرفر الثالث (احتياطي): RyzenDesu API
        if (!audioUrl) {
            try {
                console.log('Trying Spotify Server 3 (Ryzen)...');
                const dlApi3 = `https://api.ryzendesu.vip/api/downloader/spotify?url=${encodeURIComponent(url)}`;
                const { data: dlData3 } = await axios.get(dlApi3);
                if (dlData3.success && dlData3.metadata && dlData3.link) {
                    audioUrl = dlData3.link;
                    songTitle = dlData3.metadata.title || songTitle;
                } else if (dlData3.link) {
                    audioUrl = dlData3.link;
                }
            } catch (err) {
                console.log('Server 3 (Ryzen) Failed, trying Server 4...');
            }
        }

        // 🛡️ السيرفر الرابع (احتياطي أخير): Alya API
        if (!audioUrl) {
            try {
                console.log('Trying Spotify Server 4 (Alya)...');
                const dlApi4 = `https://api.alyameizn.xyz/api/spotify-dl?url=${encodeURIComponent(url)}&apikey=GataDios`;
                const { data: dlData4 } = await axios.get(dlApi4);
                if (dlData4.status && dlData4.result && dlData4.result.download) {
                    audioUrl = dlData4.result.download;
                    songTitle = dlData4.result.title || songTitle;
                }
            } catch (err) {
                console.log('Server 4 (Alya) Failed.');
            }
        }

        // --- عملية إرسال الملف إذا نجح أي سيرفر من الأربعة ---
        if (audioUrl) {
            try {
                await conn.sendMessage(m.chat, {
                    audio: { url: audioUrl },
                    mimetype: 'audio/mpeg',
                    ptt: false,
                    fileName: `${songTitle}.mp3`
                }, { quoted: m });
                
                return await m.react('✅');
            } catch (sendError) {
                console.error('Error sending audio message:', sendError);
            }
        }

        // إذا فشلت كل المحاولات والسيرفرات بالكامل
        await m.react('❌');
        return m.reply(`*_ هـلا ❌ حـصل خـطأ أثـنـاء الـتـحميل، جـميع الـسيرفرات مـشغولة حـالياً. حـاول لاحـقاً. _*`);
    }

    // --- منطق البحث ---
    if (!text) return m.reply(`*_ هـلا 🫠 _*\n\n*_ يـرجـى كـتـابـة اسـم الأغـنـيـة بـعد الأمـر _*\n*_ مـثال: ${usedPrefix + command} رصاصه رحمه _*`);

    await m.react('🔍');

    try {
        const searchUrl = `https://api.yupra.my.id/api/search/spotify?q=${encodeURIComponent(text)}`;
        const { data: searchData } = await axios.get(searchUrl);

        if (!searchData.status || !searchData.result || !Array.isArray(searchData.result) || searchData.result.length === 0) {
            await m.react('❌');
            return m.reply('❌ *لـم يـتـم الـعـثـور عـلـى نـتـائـج!*');
        }

        const tracks = searchData.result;
        const top = tracks[0];
        const allResults = tracks.slice(0, 15); 

        const rows = allResults.map((res, i) => {
            const artistName = res.artists && res.artists.length > 0 ? res.artists[0].name : 'Unknown Artist';
            const duration = res.duration_ms ? `${Math.floor(res.duration_ms / 60000)}:${((res.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}` : '--:--';
            
            return {
                header: `النتيجة ${i + 1}`,
                title: `🎵 ${res.name || 'لا يوجد عنوان'}`,
                description: `👤 ${artistName} | ⏱️ ${duration}`,
                id: `${usedPrefix + command} download|${res.url}`
            };
        });

        const topArtist = top.artists && top.artists.length > 0 ? top.artists[0].name : 'Unknown Artist';
        const topAlbum = top.album ? top.album.name : 'Unknown Album';
        const topDuration = top.duration_ms ? `${Math.floor(top.duration_ms / 60000)}:${((top.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}` : '--:--';
        
        const topThumbnail = top.album && top.album.images && top.album.images.length > 0 
            ? top.album.images[0].url 
            : 'https://i.scdn.co/image/ab67616d0000b2731a880919b9c6147db3111a93';

        let caption = `✨ *نـتـائـج الـبـحث عـن:* ${text}\n\n` +
            `🎵 *عـنوان الاغـنيه:* ${top.name || 'لا يوجد'}\n` +
            `👤 *المـغـني:* ${topArtist}\n` +
            `🍡 *مـده الاغـنيه:* ${topDuration}\n` +
            `💿 *البـوم الاغـنيه:* ${topAlbum}\n` +
            `🔗 *رابـط الاغـنيه:* ${top.url}\n\n` +
            `*_ اضـغط عـلـى الـزر أدناه لـعـرض الـنـتـائج والـتـحـمـيـل 👇 _*`;

        const media = await prepareWAMessageMedia({ image: { url: topThumbnail } }, { upload: conn.waUploadToServer });

        let msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.fromObject({ text: caption }),
                        footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: myCredit }),
                        header: proto.Message.InteractiveMessage.Header.fromObject({
                            title: `*_ 🎧 سـبـوتـيـفـاي نـيـزوكـو 🎧 _*`,
                            hasMediaAttachment: true,
                            imageMessage: media.imageMessage
                        }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                            buttons: [{
                                name: "single_select",
                                buttonParamsJson: JSON.stringify({
                                    title: '🍥 قـائـمـة الـنـتـائـج',
                                    sections: [{
                                        title: 'اخـتـر الأغـنـيـة لـتـحـمـيـلـهـا 🍡',
                                        rows: rows
                                    }]
                                })
                            }]
                        })
                    })
                }
            }
        }, { quoted: m });

        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
        await m.react('✅');

    } catch (e) {
        console.error('Spotify Plugin Error:', e);
        await m.react('❌');
        m.reply('❌ *حـصل خـطأ، ربـمـا السـيـرفـر مـشغـول أو الصـورة غـير مـتاحة.*');
    }
}

handler.help = ['سبوتيفاي'];
handler.tags = ['search', 'dl'];
handler.command = /^(سبوتيفاي|spotify)$/i;

export default handler;