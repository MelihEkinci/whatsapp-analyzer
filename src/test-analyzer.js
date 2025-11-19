
import { parseChat } from './utils/parser.js';
import { analyzeChat } from './utils/analyzer.js';

const sampleChat = `
[01/01/24, 10:00:00] Alice: Hello there
[01/01/24, 10:01:00] Bob: Hi Alice, how are you?
[01/01/24, 10:02:00] Alice: I am good. Do you want coffee?
[01/01/24, 10:05:00] Bob: Yes, coffee sounds great.
[01/01/24, 23:00:00] Alice: Good night!
`;

try {
    console.log("Parsing chat...");
    const messages = parseChat(sampleChat.trim());
    console.log(`Parsed ${messages.length} messages.`);

    console.log("Analyzing chat...");
    const stats = analyzeChat(messages);
    console.log("Analysis complete.");

    console.log("Stats keys:", Object.keys(stats));
    console.log("Users:", Object.keys(stats.users));
    console.log("Personalities:", JSON.stringify(stats.personalities, null, 2));
    console.log("Top Bigrams:", JSON.stringify(stats.topBigrams, null, 2));

    if (stats.topBigrams.length === 0) {
        console.warn("WARNING: No bigrams found!");
    }

} catch (error) {
    console.error("CRITICAL ERROR:", error);
}
