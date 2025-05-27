import CookieManager, { Cookies } from "@react-native-cookies/cookies";
import QuickCrypto from "react-native-quick-crypto";

async function generateSidAuth(sid) {
    const youtube = 'https://www.youtube.com';
    const timestamp = Math.floor(new Date().getTime() / 1000);
    const input = [timestamp, sid, youtube].join(' ');
    const gen_hash = await QuickCrypto.createHash("sha1").update(input).digest("hex");
    return ['SAPISIDHASH', [timestamp, gen_hash].join('_')].join(' ');
}

function getCookie(cookies, name, matchWholeName = false) {
    const regex = matchWholeName ? `(^|\\s?)\\b${name}\\b=([^;]+)` : `(^|s?)${name}=([^;]+)`;
    const match = cookies.match(new RegExp(regex));
    return match ? match[2] : undefined;
}

function convertCookiesToString(cookies: Cookies) {
    let fullCookieString = '';

    Object.keys(cookies).forEach((cookie) => {
        let cookieString = `${cookie}=${cookies[cookie].value}; `;
        fullCookieString += cookieString;
    });

    return fullCookieString;
}

const UA_STRING =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) " +
    "AppleWebKit/537.36 (KHTML, like Gecko) " +
    "Chrome/109.0.0.0 Safari/537.36";

const REQUEST_BLACKLIST = ['/sw.js_data', '/youtubei/v1/config'];

function extractUrl(input) {
    if (input instanceof Request) {
        return input.url;
    }
    if (input instanceof URL) {
        return input.toString();
    }
    if (typeof input === 'string') {
        return input;
    }
    if (input && input.constructor === String) {
        return input.valueOf();
    }
    if (input && typeof input._url === 'string') {
        return input._url;
    }
    if (input && typeof input._resource === 'string') {
        return input._resource;
    }
    return String(input);
}

// Blacklist check for requests that shouldn't be authenticated to look as similar to the original YouTube requests
// (e.g. service worker, config requests, etc.)
function isBlacklisted(input: RequestInfo) {
    const urlString = extractUrl(input);

    let pathname = '';
    try {
        pathname = new URL(urlString, 'https://www.youtube.com').pathname;
    } catch (e) {
        console.warn('Could not parse URL:', urlString);
    }

    return REQUEST_BLACKLIST.includes(pathname);
}

/**
 * Clone whatever was passed in (plain object OR Headers)
 * and add/overwrite the extra headers supplied.
 */
function buildHeaders(original: HeadersInit | undefined, extra: Record<string, string> = {}): Headers {
    const h = new Headers(original || {});      // 1. clone
    for (const [k, v] of Object.entries(extra)) {
        h.set(k, v);                              // 2. merge
    }
    return h;                                   // 3. return new object
}

export const customFetch = async (input: RequestInfo | URL, init?: RequestInit,): Promise<Response> => {
    if (isBlacklisted(input)) {
        const headers = buildHeaders(init.headers, {
            'User-Agent': UA_STRING,
        });

        return fetch(input, {
            ...init,
            headers,
        });
    }

    const cookies = await CookieManager.get("https://www.youtube.com");

    let authCookies = convertCookiesToString(cookies)

    let sapisid = getCookie(authCookies, "SAPISID")
    let auth = await generateSidAuth(sapisid || "")

    const headers = buildHeaders(init.headers, {
        'User-Agent': UA_STRING,
        "sec-fetch-mode": "cors",
        'x-goog-authuser': '0',
        "origin": "https://www.youtube.com",
        "authorization": auth
    });

    return fetch(input, {
        ...init,
        headers,
    });
}