
import { parseChat } from './utils/parser.js';

const sampleIOS = `[24/03/24, 10:15:30] Alice: Hey there!
[24/03/24, 10:16:00] Bob: Hi Alice, how are you?`;

const sampleAndroid = `24/03/24, 10:15 - Alice: Hey there!
24/03/24, 10:16 - Bob: Hi Alice, how are you?`;

const sampleUS = `3/24/24, 10:15 PM - Alice: Hey there!
3/24/24, 10:16 AM - Bob: Hi Alice, how are you?`;

console.log("Testing iOS format...");
const iosMessages = parseChat(sampleIOS);
console.log(`Found ${iosMessages.length} messages`);
console.log(iosMessages[0].timestamp);

console.log("\nTesting Android format...");
const androidMessages = parseChat(sampleAndroid);
console.log(`Found ${androidMessages.length} messages`);
console.log(androidMessages[0].timestamp);

console.log("\nTesting US format...");
const usMessages = parseChat(sampleUS);
console.log(`Found ${usMessages.length} messages`);
console.log(usMessages[0].timestamp);
