export function getAvatarUrl(url) {
    if (url.search('http') !== -1) {
        return url;
    }
    if (url !== '' && url !== null && url !== undefined) {
        return 'https://phs-phsa.ga/download/file.php?avatar=' + url;
    }
    return 'https://t3.ftcdn.net/jpg/00/68/94/42/240_F_68944229_6IIpPh1zjgZuNKBu0emQazU0CUSRACY7.jpg';
}