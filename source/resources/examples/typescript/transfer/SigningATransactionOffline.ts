// transaction-uri.ts

/* start block 01 */
import { TransactionURI } from '../node_modules/symbol-uri-scheme/dist/src/uris/TransactionURI';

// Replace with your transaction payload from step 2
const serializedTransaction =
    'C400000000000000955D258534DE29AC7F111A3E201C35779619EFC13EC3A309' +
    '7AC8721A55799FF43C173EA4A6BC3174847086D28F0257FBE6E771C798A1A5D2' +
    '2BF64E3C0F358001C0D6111B2AC378C69A4C71D013D3C4A748BE4EE48635EB79' +
    'FC3B4696157BF6320000000001985441A08601000000000049D4EB3A04000000' +
    '988F2D81D729AC69B750A50E315D3C9070B4410F6D1E73834D01140000000000' +
    'EEAFF441BA994BE74054890000000000006F66666C696E65207472616E736163' +
    '74696F6E';

const URI = 'web+symbol://transaction?data=' + serializedTransaction + '&generationHash=test' +
    '&nodeUrl=http://localhost:3000&webhookUrl=http://myapp.local/id';

console.log(URI);

/* end block 01 */
