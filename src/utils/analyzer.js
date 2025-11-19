export const analyzeChat = (messages) => {
    if (!messages || messages.length === 0) return null;

    const stats = {
        totalMessages: messages.length,
        users: {},
        timeline: {},
        hourlyActivity: Array(24).fill(0),
        wordCount: {},
        bigramCount: {},
        emojiCount: {},
        topWords: [],
        topBigrams: [],
        topEmojis: [],
        conversationStarters: {},
        responseTimes: {},
        mediaCount: {},
        interactionMatrix: {},
        vocabulary: {},
        personalities: {},
    };

    // Massive Stop Words & Junk Filter
    const stopWords = new Set([
        'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'is', 'are', 'was', 'were', 'am', 'im', 'its', 'can', 'just', 'dont', 'did', 'like', 'know', 'ok', 'okay', 'yes', 'no', 'yeah', 'your', 'more', 'still', 'here',
        've', 'bir', 'bu', 'da', 'de', 'için', 'ile', 'çok', 'ama', 'o', 'kadar', 'gibi', 'var', 'ben', 'ne', 'sen', 'diye', 'mi', 'yok', 'daha', 'bana', 'seni', 'beni', 'onu', 'bunu', 'şunu', 'mı', 'mu', 'mü', 'ama', 'fakat', 'lakin', 'ancak', 'çünkü', 'yani', 'öyle', 'böyle', 'şöyle', 'hiç', 'her', 'kim', 'nasıl', 'neden', 'niye', 'şey', 'bi', 'tamam', 'peki', 'evet', 'hayır', 'oldu', 'olur', 'yap', 'et', 'gel', 'git', 'bak', 'lan', 'ya', 'ha', 'he', 'zaten', 'biz', 'biraz', 'san', 'şu', 'senin', 'benim', 'bizim', 'siz', 'sizin', 'onlar', 'onların', 'ki', 'ise', 'mu', 'mü',
        'falan', 'abi', 'bence', 'haha', 'hahaha', 'sonra', 'iyi', 'melih', 'cakici', 'message', 'zaman', 'değil', 'arada', 'cok', 'baya', 'valla', 'akşam', 'bugün', 'derin', 'şimdi', 'bile', 'lazım', 'aynen', 'olarak', 'isteyen', 'sadece', 'olsun', 'belki', 'bende', 'yeni', 'yarın', 'güzel', 'varsa', 'tam', 'yine', 'euro', 'gün', 'işte', 'başka', 'adam', 'geldi', 'olan', 'image', 'sticker', 'video', 'omitted', 'edited', 'null', 'undefined',
        'andre', 'this', 'edited', 'son', 'ilk', 'saat', 'sanırım', 'hala', 'degil', 'bide', 'instagram', 'önce', 'amk', 'kahve', 'ona', 'neyse', 'tibet', 'kendi', 'direk', 'icin', 'dedi', 'para', 'artık', 'yer', 'bisey', 'tmm', 'lol', 'size', 'göre', 'dedim', 'bira', 'heralde', 'sanki', 'aksam', 'doğru', 'olabilir', 'iki', 'yoksa', 'kolay', 'orda', 'alman', 'bilmiyorum', 'uyar', 'onun', 'gene', 'oluyor', 'burda', 'bişe', 'filan', 'fıstık', 'yani', 'işte', 'tabi', 'tabii', 'aynen', 'zaten',
        'yaa', 'hmm', 'bişey', 'geliyor', 'acaba', 'beyler', 'tane', 'olsa', 'tan', 'tek', 'geldim', 'kötü', 'buna', 'diyor', 'hafta', 'oha', 'sene', 'hee', 'herkes', 'kişi', 'erten', 'olmaz', 'vardı', 'sana', 'simdi', 'aslında', 'geçen', 'gelmek', 'lazim', 'şeyler', 'dün', 'erlangen', 'almanca', 'büyük', 'demek', 'fazla', 'ondan', 'bütün', 'ara', 'veya', 'oyle', 'aynı', 'yapmak', 'gelen', 'belli', 'hem', 'eve', 'guzel'
    ]);

    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

    let previousMessage = null;
    const STARTER_THRESHOLD_MS = 2 * 60 * 60 * 1000; // 2 hours

    // Sentiment Dictionaries (Simplified)
    const positiveWords = new Set([
        'guzel', 'güzel', 'süper', 'harika', 'muhteşem', 'iyi', 'sevdim', 'aşk', 'love', 'great', 'good', 'best', 'happy', 'thanks', 'teşekkür', 'tebrik', 'kutlarım', 'bomba', 'efsane', 'kral', 'adamsın', 'hahaha', 'haha', 'lol', 'huhu', 'yes', 'evet', 'aynen', 'tabi', 'tabii', 'keyif', 'mutlu', 'sevindim', 'başarı', 'kazandık', 'oleyy', 'yaşasın'
    ]);
    const negativeWords = new Set([
        'kötü', 'berbat', 'iğrenç', 'nefret', 'hayır', 'no', 'bad', 'sad', 'hate', 'worst', 'üzgün', 'maalesef', 'tüh', 'yazık', 'lanet', 'aptal', 'salak', 'gerizekalı', 'mal', 'bok', 'siktir', 'amk', 'aq', 'sie', 'sus', 'kes', 'kızgın', 'sinirli', 'bıktım', 'yeter', 'off', 'of', 'hayal kırıklığı', 'sorun', 'problem', 'hata', 'yanlış'
    ]);

    // Emoji Sentiment (Valence: -1 to 1)
    const emojiSentiment = {
        '😂': 0.8, '🤣': 0.9, '❤️': 1.0, '😍': 1.0, '👍': 0.5, '😊': 0.6, '😘': 0.8, '😁': 0.6, '🎉': 0.9, '🔥': 0.7,
        '😭': -0.8, '😢': -0.6, '😔': -0.5, '😡': -0.9, '🤬': -1.0, '👎': -0.5, '🙄': -0.2, '😒': -0.4, '💔': -0.8, '💩': -0.3
    };

    // System Message Patterns
    const systemPatterns = [
        /messages and calls are end-to-end encrypted/i,
        /created group/i,
        /added \+?\d+/i,
        /changed the subject to/i,
        /changed the group description/i,
        /security code changed/i,
        /waiting for this message/i,
        /this chat is with a business account/i,
        /disappearing messages/i,
        /added you/i,
        /left/i,
        /joined using this group's invite link/i
    ];

    const possibleGroupNames = new Set();

    messages.forEach(msg => {
        // Initialize user stats
        if (!stats.users[msg.author]) {
            stats.users[msg.author] = {
                count: 0,
                words: 0,
                totalChars: 0,
                nightOwlCount: 0,
                earlyBirdCount: 0,
                weekendCount: 0,
                systemMsgCount: 0,
                sentimentScore: 0, // New: Accumulate sentiment
                sentimentCount: 0  // New: Count of scored messages
            };
            stats.conversationStarters[msg.author] = 0;
            stats.responseTimes[msg.author] = { totalTime: 0, count: 0 };
            stats.mediaCount[msg.author] = 0;
            stats.interactionMatrix[msg.author] = {};
            stats.vocabulary[msg.author] = { uniqueWords: new Set(), totalWords: 0 };
            stats.personalities[msg.author] = [];
        }
        stats.users[msg.author].count++;
        stats.users[msg.author].totalChars += msg.content.length;

        // Check for Group Names in content
        const createdMatch = msg.content.match(/created group "(.*?)"/i);
        if (createdMatch) possibleGroupNames.add(createdMatch[1]);

        const subjectMatch = msg.content.match(/changed the subject to "(.*?)"/i);
        if (subjectMatch) possibleGroupNames.add(subjectMatch[1]);

        // Check if message is system-like
        if (systemPatterns.some(pattern => pattern.test(msg.content))) {
            stats.users[msg.author].systemMsgCount++;
        }

        // Media Detection
        if (msg.content.includes('omitted') || msg.content.includes('image') || msg.content.includes('video') || msg.content.includes('sticker')) {
            if (msg.content.includes('omitted')) {
                stats.mediaCount[msg.author]++;
            }
        }

        // Word Analysis & Bigrams & Sentiment
        let cleanContent = msg.content.toLowerCase();

        // Calculate Message Sentiment
        let msgSentiment = 0;
        let hasSentiment = false;

        // 1. Emoji Sentiment
        const emojis = msg.content.match(emojiRegex);
        if (emojis) {
            emojis.forEach(emoji => {
                stats.emojiCount[emoji] = (stats.emojiCount[emoji] || 0) + 1;
                if (emojiSentiment[emoji]) {
                    msgSentiment += emojiSentiment[emoji];
                    hasSentiment = true;
                }
            });
        }

        cleanContent = cleanContent.replace(/<[^>]*>/g, '');
        cleanContent = cleanContent.replace(/\[\d+.*?\]/g, '');
        cleanContent = cleanContent.replace(/(.)\1{2,}/g, '$1$1');

        const words = cleanContent.split(/[\s,.!?;:"'()\[\]]+/);
        stats.users[msg.author].words += words.length;

        const validWords = [];
        words.forEach(word => {
            // Word Sentiment
            if (positiveWords.has(word)) { msgSentiment += 1; hasSentiment = true; }
            if (negativeWords.has(word)) { msgSentiment -= 1; hasSentiment = true; }

            if (word.length > 2 &&
                !stopWords.has(word) &&
                !/^\d+$/.test(word) &&
                !word.startsWith('http') &&
                !word.startsWith('www') &&
                !word.startsWith('//') &&
                !word.includes('=') &&
                !word.includes('&') &&
                !word.includes('image') &&
                !word.includes('sticker') &&
                !word.includes('video') &&
                !word.includes('omitted')) {

                stats.wordCount[word] = (stats.wordCount[word] || 0) + 1;
                stats.vocabulary[msg.author].uniqueWords.add(word);
                stats.vocabulary[msg.author].totalWords++;
                validWords.push(word);
            }
        });

        if (hasSentiment) {
            stats.users[msg.author].sentimentScore += msgSentiment;
            stats.users[msg.author].sentimentCount++;
        }

        // Bigram Generation
        for (let i = 0; i < validWords.length - 1; i++) {
            const bigram = `${validWords[i]} ${validWords[i + 1]}`;
            stats.bigramCount[bigram] = (stats.bigramCount[bigram] || 0) + 1;
        }

        // Timeline
        const dateKey = msg.date;
        if (!stats.timeline[dateKey]) {
            stats.timeline[dateKey] = 0;
        }
        stats.timeline[dateKey]++;

        // Hourly & Personality Tracking
        if (msg.timestamp && !isNaN(msg.timestamp)) {
            const hour = msg.timestamp.getHours();
            const day = msg.timestamp.getDay();

            stats.hourlyActivity[hour]++;

            if (hour >= 0 && hour < 6) stats.users[msg.author].nightOwlCount++;
            if (hour >= 6 && hour < 9) stats.users[msg.author].earlyBirdCount++;
            if (day === 0 || day === 6) stats.users[msg.author].weekendCount++;

            if (previousMessage && previousMessage.timestamp && !isNaN(previousMessage.timestamp)) {
                const timeDiff = msg.timestamp - previousMessage.timestamp;

                if (timeDiff > STARTER_THRESHOLD_MS) {
                    stats.conversationStarters[msg.author]++;
                }

                if (msg.author !== previousMessage.author) {
                    if (timeDiff < STARTER_THRESHOLD_MS) {
                        stats.responseTimes[msg.author].totalTime += timeDiff;
                        stats.responseTimes[msg.author].count++;
                    }

                    if (!stats.interactionMatrix[msg.author][previousMessage.author]) {
                        stats.interactionMatrix[msg.author][previousMessage.author] = 0;
                    }
                    stats.interactionMatrix[msg.author][previousMessage.author]++;
                }
            } else {
                stats.conversationStarters[msg.author]++;
            }
        }

        previousMessage = msg;
    });

    // Determine Personalities
    const maxMessages = Math.max(...Object.values(stats.users).map(u => u.count));

    Object.keys(stats.users).forEach(user => {
        const u = stats.users[user];
        const total = u.count;
        if (total < 5) return;

        if (u.nightOwlCount / total > 0.08) stats.personalities[user].push('🦉 Night Owl');
        if (u.earlyBirdCount / total > 0.08) stats.personalities[user].push('☀️ Early Bird');
        if (u.weekendCount / total > 0.35) stats.personalities[user].push('📅 Weekend Warrior');

        const avgChars = u.totalChars / total;
        if (avgChars > 50) stats.personalities[user].push('📜 Marathoner');
        else if (avgChars < 25) stats.personalities[user].push('⚡ Rapid Fire');

        if (total > maxMessages * 0.5) stats.personalities[user].push('📢 Chatterbox');

        // Sentiment Personality
        const avgSentiment = u.sentimentCount > 0 ? u.sentimentScore / u.sentimentCount : 0;
        if (avgSentiment > 0.5) stats.personalities[user].push('🥰 Positivity Guru');
        else if (avgSentiment < -0.2) stats.personalities[user].push('😒 Grumpy Cat');

        if (stats.personalities[user].length === 0) {
            stats.personalities[user].push('⚖️ Balanced');
        }
    });

    // Sort and get top words
    stats.topWords = Object.entries(stats.wordCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 50)
        .map(([text, value]) => ({ text, value }));

    // Sort and get top bigrams
    stats.topBigrams = Object.entries(stats.bigramCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 50)
        .map(([text, value]) => ({ text, value }));

    // Sort and get top emojis
    stats.topEmojis = Object.entries(stats.emojiCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([emoji, count]) => ({ emoji, count }));

    // Filter out System Users
    const filteredUsers = {};
    console.log("Detected Possible Group Names:", Array.from(possibleGroupNames));

    Object.keys(stats.users).forEach(user => {
        const u = stats.users[user];

        // 1. Is the user name in the detected group names?
        if (possibleGroupNames.has(user)) {
            console.log(`Filtering out ${user} (Matched Group Name)`);
            return;
        }

        // 2. Is the user name "System" or "WhatsApp"?
        if (user === 'System' || user === 'WhatsApp') return;

        // 3. Does the user have a high ratio of system messages?
        if (u.count > 0 && (u.systemMsgCount / u.count) > 0.5) {
            console.log(`Filtering out ${user} (High System Message Ratio: ${u.systemMsgCount}/${u.count})`);
            return;
        }

        // 4. Fallback: Vocabulary check
        const systemKeywords = ['changed', 'added', 'removed', 'security code', 'encrypted', 'created', 'left', 'joined', 'subject', 'description', 'disappearing'];
        const userVocab = stats.vocabulary[user].uniqueWords;
        let systemWordCount = 0;
        userVocab.forEach(w => {
            if (systemKeywords.some(kw => w.includes(kw))) systemWordCount++;
        });

        const isSystemVocab = userVocab.size > 0 && (systemWordCount / userVocab.size) > 0.5;
        if (isSystemVocab) {
            console.log(`Filtering out ${user} (High System Vocabulary)`);
            return;
        }

        filteredUsers[user] = stats.users[user];
    });
    stats.users = filteredUsers;

    // Clean up other stats for removed users
    const validUsers = new Set(Object.keys(stats.users));
    ['conversationStarters', 'responseTimes', 'mediaCount', 'interactionMatrix', 'vocabulary', 'personalities'].forEach(key => {
        Object.keys(stats[key]).forEach(user => {
            if (!validUsers.has(user)) delete stats[key][user];
        });
    });

    return stats;
};
