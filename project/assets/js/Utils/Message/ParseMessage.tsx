import React, {ReactElement} from "react";
import TextPart from "./Parts/TextPart";
import ImagePart from "./Parts/ImagePart";
import PrivateMessage from "./Containers/PrivateMessage";
import BoldText from "./Parts/BoldText";
import ItalicText from "./Parts/ItalicText";
import DownMarkText from "./Parts/DownMarkText";
import QuoteText from "./Parts/QuoteText";
import CodeText from "./Parts/CodeText";
import UrlText from "./Parts/UrlText";
import { emoticonsImages, emoticonsText, emoticonsRegex } from "../../Components/Emoticons/constants/Constants";
import Emoticon from "./Parts/Emoticon";

const MESSAGES_PARTS_STRING = 'string';
const MESSAGES_PARTS_BBCODE = 'bbCode';
const MESSAGES_PARTS_EMOTICON = 'emoticon';

function insertPm(messagesParts) {
    return <PrivateMessage children={messagesParts}/>;
}

export function parseMessage(message: string, pm, user) {
    message = transformYoutubeLinks(message);
    let messagesParts:any[] = messageCreateParts(message, user);
    messagesParts = createElementsFromParts(messagesParts);

    if (pm) {
        return insertPm(messagesParts);
    }

    return messagesParts;
}

function messageCreateParts(message: string, user) {
    let parts:any = [];
    parts.push({value: message, part: MESSAGES_PARTS_STRING});

    parts = createPartsBbCode(parts);
    parts = createLinksParts(parts);
    parts = createEmoticons(parts);

    return parts;
}

function createEmoticons(parts:any[]): any[] {
    let tempIndex;
    let newParts:any[] = [...parts];
    let regex;
    let match;
    let lastFound = 0;
    let found;
    do {
        found = 0;
        tempIndex = 0;

        newParts.forEach(function (value) {
            lastFound = 0;
            if (value.part !== MESSAGES_PARTS_STRING) {
                tempIndex++;
                return;
            }
            for (let i = 0; i < emoticonsText.length; i++) {
                if (Array.isArray(emoticonsText[i])) {
                    for (let j = 0; j < emoticonsText[i].length; j++) {
                        const valueToRegex = value.value;
                        regex = new RegExp('(' + emoticonsRegex[i][j] + ')', 'g');
                        while (match = regex.exec(valueToRegex)) {
                            found++;
                            let start = (regex.lastIndex - match[0].length) - lastFound;
                            let end = (regex.lastIndex) - lastFound;
                            let first = value.value.substr(0, start);
                            let second = value.value.substr(start, end - start);
                            let third = value.value.substr(end, value.value.length);
                            if (first !== '') {
                                newParts[tempIndex] = {value: first, part: MESSAGES_PARTS_STRING};
                                tempIndex++;
                            }
                            if (second !== '') {
                                newParts[tempIndex] = {
                                    value: emoticonsText[i][j],
                                    part: MESSAGES_PARTS_EMOTICON,
                                    src: emoticonsImages[i].default
                                };
                                tempIndex++;
                            }

                            if (third !== '') {
                                newParts[tempIndex] = {value: third, part: MESSAGES_PARTS_STRING};
                            }
                            value.value = third;
                            lastFound = (regex.lastIndex);
                        }
                        if (found) {
                            return;
                        }
                    }
                } else {
                    const valueToRegex = value.value;
                    regex = new RegExp('(' + emoticonsRegex[i] + ')', 'g');
                    while (match = regex.exec(valueToRegex)) {
                        found++;
                        let start = (regex.lastIndex - match[0].length) - lastFound;
                        let end = (regex.lastIndex) - lastFound;
                        let first = value.value.substr(0, start);
                        let second = value.value.substr(start, end - start);
                        let third = value.value.substr(end, value.value.length);
                        if (first !== '') {
                            newParts[tempIndex] = {value: first, part: MESSAGES_PARTS_STRING};
                            tempIndex++;
                        }
                        if (second !== '') {
                            newParts[tempIndex] = {
                                value: emoticonsText[i],
                                part: MESSAGES_PARTS_EMOTICON,
                                src: emoticonsImages[i].default
                            };
                            tempIndex++;
                        }

                        if (third !== '') {
                            newParts[tempIndex] = {value: third, part: MESSAGES_PARTS_STRING};
                        }
                        value.value = third;
                        lastFound = (regex.lastIndex);
                    }
                    if (found) {
                        return;
                    }
                }
            }
        });
    } while (found > 0);

    return newParts;
}

function createPartsBbCode(parts:any[]): any[] {
    parts = doCreatePartsBbCode(parts, '[yt]', '[/yt]');
    parts = doCreatePartsBbCode(parts, '[img]', '[/img]');
    parts = doCreatePartsBbCode(parts, '[b]', '[/b]');
    parts = doCreatePartsBbCode(parts, '[i]', '[/i]');
    parts = doCreatePartsBbCode(parts, '[u]', '[/u]');
    parts = doCreatePartsBbCode(parts, '[quote]', '[/quote]');
    parts = doCreatePartsBbCode(parts, '[code]', '[/code]');
    parts = doCreatePartsBbCode(parts, '[url]', '[/url]');

    return parts;
}

function createLinksParts(parts: any[]): any[] {
    let tempIndex = 0;
    let newParts:any[] = parts;
    parts.forEach(function(value) {
        if(value.part !== MESSAGES_PARTS_STRING) {
            tempIndex++;
            return;
        }

        const regex = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        let match;
        const valueToRegex = value.value;
        let lastFound = 0;
        while (match = regex.exec(valueToRegex)) {
            let start = (regex.lastIndex - match[0].length) - lastFound;
            let end = (regex.lastIndex) - lastFound;
            let first = value.value.substr(0, start);
            let second = value.value.substr(start, end - start);
            let third = value.value.substr(end, value.value.length);
            if (first !== '') {
                newParts[tempIndex] = {value: first, part: MESSAGES_PARTS_STRING};
                tempIndex++;
            }
            if (second !== '') {
                newParts[tempIndex] = {value: '[url]' + second + '[/url]', part: MESSAGES_PARTS_BBCODE};
                tempIndex++;
            }

            if (third !== '') {
                newParts[tempIndex] = {value: third, part: MESSAGES_PARTS_STRING};
            }
            value.value = third;
            lastFound = (regex.lastIndex);
        }
    });

    return newParts;
}

function doCreatePartsBbCode(parts: any[], openBbCode: string, endBbCode: string): any[] {
    let tempIndex = 0;
    let newParts:any[] = parts;
    parts.forEach(function(value) {
        if(value.part !== MESSAGES_PARTS_STRING) {
            tempIndex++;
            return;
        }
        if (value.value.indexOf(openBbCode) === -1) {
            tempIndex++;
            return;
        }
        while (value.value.indexOf(openBbCode) !== -1 && value.value.indexOf(endBbCode) !== -1) {
            let start = value.value.indexOf(openBbCode);
            let end = value.value.indexOf(endBbCode) + endBbCode.length;
            let first = value.value.substr(0, start);
            let second = value.value.substr(start, end - start);
            let third = value.value.substr(end, value.value.length);

            if (first !== '') {
                newParts[tempIndex] = {value: first, part: MESSAGES_PARTS_STRING};
                tempIndex++;
            }
            if (second !== '') {
                newParts[tempIndex] = {value: second, part: MESSAGES_PARTS_BBCODE};
                tempIndex++;
            }
            if (third !== '') {
                newParts[tempIndex] = {value: third, part: MESSAGES_PARTS_STRING};
            }
            value.value = third;
        }
    });
    return newParts;
}

function transformYoutubeLinks(text: string): string {
    if ((text.indexOf('[yt]') !== -1 && text.indexOf('[/yt]') !== -1)) {
        return text;
    }
    let replacedText = text;
    if (text.indexOf("youtube.com/watch?v=") > -1 || text.indexOf("youtu.be/") > -1) {
        replacedText = transformYoutube(text);
    }
    return replacedText;
}

function transformYoutube(inputText: string): string {
    const replacePattern1 = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/gim;
    return inputText.replace(replacePattern1, '[yt]$1[/yt]');
}

function createElementsFromParts(parts:any[]): any[] {
    parts.forEach(function(value, index) {
        switch (value.part) {
            case MESSAGES_PARTS_STRING:
                parts[index] = <TextPart text={value.value}/>;
                return;
            case MESSAGES_PARTS_BBCODE:
                parts[index] = createElementFromPartBbCode(value.value);
                return;
            case MESSAGES_PARTS_EMOTICON:
                parts[index] = <Emoticon text={value.value} src={value.src} />;
                return;
            default:
                parts[index] = <TextPart text={value.value}/>;
        }
    });
    return parts;
}

function createElementFromPartBbCode(text: string): ReactElement {
    // parts = doCreatePartsBbCode(parts, '[yt]', '[/yt]');
    if (text.indexOf('[img]') !== -1) {
        return <ImagePart text={text.substr(5, text.length - 11)} />
    }
    if (text.indexOf('[b]') !== -1) {
        return <BoldText text={text.substr(3, text.length - 7)} />
    }
    if (text.indexOf('[i]') !== -1) {
        return <ItalicText text={text.substr(3, text.length - 7)} />
    }
    if (text.indexOf('[u]') !== -1) {
        return <DownMarkText text={text.substr(3, text.length - 7)} />
    }
    if (text.indexOf('[quote]') !== -1) {
        return <QuoteText text={text.substr(7, text.length - 15)} />
    }
    if (text.indexOf('[code]') !== -1) {
        return <CodeText text={text.substr(6, text.length - 13)} />
    }
    if (text.indexOf('[url]') !== -1) {
        return <UrlText text={text.substr(5, text.length - 11)} />
    }

    return <TextPart text={text} />;
}

function createUrlEmoji(text: string): string {
    return 'https://cdn.jsdelivr.net/emojione/assets/3.1/png/32/' + text + '.png';
}