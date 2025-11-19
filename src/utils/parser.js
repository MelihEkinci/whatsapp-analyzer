
export const parseChat = (text) => {
    const lines = text.split('\n');
    const messages = [];
    let currentMessage = null;

    // Regex patterns
    // iOS: [dd/mm/yy, hh:mm:ss] Author: Message
    // Also handles [dd/mm/yy, hh:mm] (no seconds)
    const iosRegex = /^\[(\d{1,2}[./-]\d{1,2}[./-]\d{2,4}),\s(\d{1,2}:\d{2}(?::\d{2})?)\]\s(.*?):\s(.*)/;

    // Android: dd/mm/yy, hh:mm - Author: Message
    const androidRegex = /^(\d{1,2}[./-]\d{1,2}[./-]\d{2,4}),\s(\d{1,2}:\d{2})\s-\s(.*?):\s(.*)/;

    // US Format: m/d/yy, h:mm AM/PM - Author: Message
    const usRegex = /^(\d{1,2}\/\d{1,2}\/\d{2,4}),\s(\d{1,2}:\d{2}\s?[AP]M)\s-\s(.*?):\s(.*)/i;

    // System messages
    const systemRegex = /^(\d{1,2}[./-]\d{1,2}[./-]\d{2,4}),\s(\d{1,2}:\d{2}(?::\d{2})?)\s-\s(.*)/;

    for (const line of lines) {
        // Try iOS
        let match = line.match(iosRegex);
        if (match) {
            pushMessage(match, true);
            continue;
        }

        // Try US
        match = line.match(usRegex);
        if (match) {
            pushMessage(match, false);
            continue;
        }

        // Try Android
        match = line.match(androidRegex);
        if (match) {
            pushMessage(match, false);
            continue;
        }

        // Try System
        match = line.match(systemRegex);
        if (match) {
            if (currentMessage) messages.push(currentMessage);
            currentMessage = {
                date: match[1],
                time: match[2],
                author: 'System',
                content: match[3],
                timestamp: parseDate(match[1], match[2])
            };
            continue;
        }

        // Continuation
        if (currentMessage) {
            currentMessage.content += '\n' + line;
        }
    }

    function pushMessage(match, isIOS) {
        if (currentMessage) messages.push(currentMessage);
        currentMessage = {
            date: match[1],
            time: match[2],
            author: match[3],
            content: match[4],
            timestamp: parseDate(match[1], match[2])
        };
    }

    if (currentMessage) messages.push(currentMessage);
    return messages;
};

const parseDate = (dateStr, timeStr) => {
    try {
        // Normalize date separators
        const normalizedDate = dateStr.replace(/[.-]/g, '/');
        const parts = normalizedDate.split('/');

        // Handle different date orders? 
        // Heuristic: if first part > 12, it's definitely day. 
        // But usually it's DD/MM/YYYY or MM/DD/YYYY. 
        // Let's assume DD/MM/YYYY for international and MM/DD/YYYY for US if detected?
        // For now, let's stick to a robust standard parser or manual construction.

        let day, month, year;

        // Check if we have US format (usually M/D/YY)
        // This is tricky without knowing locale. 
        // Let's try to parse as DD/MM/YYYY first, as it's most common for WhatsApp exports outside US.

        day = parseInt(parts[0]);
        month = parseInt(parts[1]);
        year = parseInt(parts[2]);

        // Adjust year
        if (year < 100) year += 2000;

        // Adjust time for AM/PM
        let [hours, minutes, seconds] = timeStr.replace(/[AP]M/i, '').trim().split(':').map(Number);
        if (timeStr.toLowerCase().includes('pm') && hours < 12) hours += 12;
        if (timeStr.toLowerCase().includes('am') && hours === 12) hours = 0;
        if (!seconds) seconds = 0;

        return new Date(year, month - 1, day, hours, minutes, seconds);
    } catch (e) {
        console.error("Date parsing error:", e);
        return new Date(); // Fallback
    }
};
