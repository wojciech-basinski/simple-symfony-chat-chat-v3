import {emoticonsEmoji, emoticonsImages, emoticonsText} from './../../Components/Emoticons/constants/Constants';

String.prototype.replaceAll = function (str1, str2, ignore) {
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignore ? "gi" : "g")), (typeof(str2) == "string") ? str2.replace(/\$/g, "$$$$") : str2);
};
String.prototype.insert = function (index, string) {
    if (index > 0)
        return this.substring(0, index) + string + this.substring(index, this.length);
    else
        return string + this;
};

export function parseMessage(message, pm, user) {
    if (
        (message.indexOf('[yt]') !== -1 && message.indexOf('[/yt]') !== -1) ||
        (message.indexOf('[img]') !== -1 && message.indexOf('[/img]') !== -1) ||
        (message.indexOf('[url]') !== -1 && message.indexOf('[/url]') !== -1)
    ) {//noop
    } else {
        message = parseLinks(message);
    }
    message = messageCreateParts(message, user);
    if (pm) {
        let insertPwClass = '<span class="private-message">';
        let start = 0;
        let end = start + 4 + insertPwClass.length;
        message = message.insert(start, insertPwClass).insert(end, '</span>');
    }
    return message;
}

function messageCreateParts(message, user) {
    var parts = [];
    while (message.indexOf('[yt]') !== -1) {
        let start = message.indexOf('[yt]');
        let end = message.indexOf('[/yt]') + '[/yt]'.length;
        let first = message.substr(0, start);
        let second = message.substr(start, end - start);
        parts.push(first);
        parts.push(second);
        message = message.substr(end, message.length - 1);
    }
    while (message.indexOf('[img]') !== -1) {
        let start = message.indexOf('[img]');
        let end = message.indexOf('[/img]') + '[/img]'.length;
        let first = message.substr(0, start);
        let second = message.substr(start, end - start);
        parts.push(first);
        parts.push(second);
        message = message.substr(end, message.length - 1);
    }
    while (message.indexOf('[url]') !== -1) {
        let start = message.indexOf('[url]');
        let end = message.indexOf('[/url]') + '[/url]'.length;
        let first = message.substr(0, start);
        let second = message.substr(start, end - start);
        parts.push(first);
        parts.push(second);
        message = message.substr(end, message.length - 1);
    }
    var regex = /@/gi, result, indices = [];
    while ( (result = regex.exec(message)) ) {
        indices.push(result.index);
    }
    var addedSpaces = 0;
    indices.forEach(function(value, index, array) {
        let start = value;
        let insertLightSpan = '<mark>';
        let insertLightSpanEnd = '</mark>';
        let end;
        if (message.indexOf("@" + user.userName, start) === start) {
            insertLightSpan = '<span class="light">';
            insertLightSpanEnd = '</span>';
            end = start + 1 + user.userName.length;
        } else {
            var space = message.indexOf(" ", start + 1);
            var endOfMessage = message.length;
            var nextAt = message.indexOf("@", start + 1);
            if (space < 0) {
                space = 9999999999;
            }
            if (nextAt < 0) {
                nextAt = 9999999999;
            }
            end = Math.min(space, endOfMessage, nextAt);
        }

        message = message.insert(start, insertLightSpan).insert(end + insertLightSpan.length, insertLightSpanEnd);

        if (indices[index + 1]) {
            addedSpaces += insertLightSpan.length + insertLightSpanEnd.length;
            indices[index + 1] += addedSpaces;
        }

    });

    if (message.length) {
        parts.push(message);
    }
    parts.forEach(function (value, index, parts) {
        if (
            (value.indexOf('[yt]') !== -1 && value.indexOf('[/yt]') !== -1) ||
            (value.indexOf('[img]') !== -1 && value.indexOf('[/img]') !== -1) ||
            (value.indexOf('[url]') !== -1 && value.indexOf('[/url]') !== -1)
        ) {
            parts[index] = parseBbCode(value);
        } else {
            parts[index] = parseEmoticons(parseBbCode(value));
        }
    });
    if (!parts.length) {
        return parseLinks(parseEmoticons(message));
    }
    return parts.join('');
}

function parseEmoticons(message) {
    let reg = /:{1}[a-zA-Z0-9_-]{1,}:{1}/g;
    if (reg.test(message)) {
        let matched = message.match(reg).filter(onlyUnique);
        for (let i = 0; i < matched.length; i++) {
            let emojiUrlPart = emoticonsEmoji[matched[i]];
            if (emojiUrlPart === undefined) {
                continue;
            }
            message = message.replaceAll(matched[i],
                '<img class="emoticon-text" src="' + createUrlEmoji(emojiUrlPart) + '" alt="' + matched[i] + '"/>'
            );
        }
    }
    for (let i = 0; i < emoticonsText.length; i++) {
        if (Array.isArray(emoticonsText[i])) {
            for (let j = 0; j < emoticonsText[i].length; j++) {
                if (message.includes(emoticonsText[i][j])) {
                    message = message.replaceAll(emoticonsText[i][j], '<img class="emoticon-text" src="' + emoticonsImages[i].default + '" alt="' + emoticonsText[i][j] + '"/>');
                }
            }
        } else {
            if (message.includes(emoticonsText[i])) {
                message = message.replaceAll(emoticonsText[i], '<img class="emoticon-text" src="' + emoticonsImages[i].default + '" alt="' + emoticonsText[i] + '"/>');
            }
        }
    }
    return message;
}

function parseLinks(inputText) {
    if (inputText.search("https://phs-phsa.ga/chat/img/") !== -1) {
        return inputText;
    }
    var replacedText, replacePattern1;
    if (inputText.indexOf("youtube.com/watch?v=") > -1) {
        replacedText = transformYoutube(inputText);
    } else if (inputText.indexOf("youtu.be/") > -1) {
        replacedText = transformYoutube(inputText);
    } else {
        replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        replacedText = inputText.replace(replacePattern1, '[url]$1[/url]');
    }

    return replacedText;
}

function transformYoutube(inputText) {
    var replacePattern1 = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/gim;
    return inputText.replace(replacePattern1, '[yt]$1[/yt]');
}

function parseBbCode(message) {
    if (message.indexOf('[b]') !== -1 && message.indexOf('[/b]') !== -1) {
        let regex = /\[b\]/g;
        let regex2 = /\[\/b\]/g;
        message = messageReplace(message, regex, '<span class="text-bold">');
        message = messageReplace(message, regex2, '</span>');
    }
    if (message.indexOf('[i]') !== -1 && message.indexOf('[/i]') !== -1) {
        let regex = /\[i\]/g;
        let regex2 = /\[\/i\]/g;
        message = messageReplace(message, regex, '<span class="text-italic">');
        message = messageReplace(message, regex2, '</span>');
    }
    if (message.indexOf('[u]') !== -1 && message.indexOf('[/u]') !== -1) {
        let regex = /\[u\]/g;
        let regex2 = /\[\/u\]/g;
        message = messageReplace(message, regex, '<span class="text-underline">');
        message = messageReplace(message, regex2, '</span>');
    }
    if (message.indexOf('[quote]') !== -1 && message.indexOf('[/quote]') !== -1) {
        let regex = /\[quote\]/g;
        let regex2 = /\[\/quote\]/g;
        message = messageReplace(message, regex, '<blockquote><p>');
        message = messageReplace(message, regex2, '</p></blockquote><br />');
    }
    if (message.indexOf('[code]') !== -1 && message.indexOf('[/code]') !== -1) {
        let regex = /\[code\]/g;
        let regex2 = /\[\/code\]/g;
        message = messageReplace(message, regex, '<code>');
        message = messageReplace(message, regex2, '</code>');
    }
    if (message.indexOf('[url]') !== -1 && message.indexOf('[/url]') !== -1) {
        let regex = '[url]';
        let regex2 = '[/url]';
        let start = message.indexOf('[url]') + "[url]".length;
        let end = message.indexOf('[/url]') - "[/url]".length + 1;
        let text = message.substr(start, end);
        message = messageReplace(message, regex + text + regex2, '<a href="' + text + '" target="_blank">' + text + '</a>');
    }
    if (message.indexOf('[img]') !== -1 && message.indexOf('[/img]') !== -1) {
        let regex = '[img]';
        let regex2 = '[/img]';
        let start = message.indexOf('[img]') + "[img]".length;
        let end = message.indexOf('[/img]') - "[/img]".length + 1;
        let text = message.substr(start, end);
        let link = '';
        if (text.indexOf('fbcdn.net') == -1) {
            link = 'http://localhost:8080/img/?url=' + encodeURI(text);
        } else {
            link = text;
        }
        message = messageReplace(message, regex + text + regex2, '<img class="bbcode-img pointer" src="' + link + '" alt="' + text + '"/>')
    }
    if (message.indexOf('[yt]') !== -1 && message.indexOf('[/yt]') !== -1) {//todo
        let regex = '[yt]';
        let regex2 = '[/yt]';
        let start = message.indexOf('[yt]') + "[yt]".length;
        let end = message.indexOf('[/yt]') - "[/yt]".length + 1;
        let text = message.substr(start, end);
        let replaceText;
        replaceText = transformLinkYT(text);
        message = messageReplace(message, regex + text + regex2, replaceText);
    }
    return message;
}

function transformLinkYT(text) {
    let youtubeHref = 'https://www.youtube.com/embed/' + text + '?rel=0';
    return '(youtube)<img class="youtube pointer" data-href="' + youtubeHref + '" src="https://img.youtube.com/vi/' + text + '/hqdefault.jpg" />';
}

function messageReplace(message, whatReplace, replace) {
    return message.replace(whatReplace, replace);
}

function createUrlEmoji(text) {
    return 'https://cdn.jsdelivr.net/emojione/assets/3.1/png/32/' + text + '.png';
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}