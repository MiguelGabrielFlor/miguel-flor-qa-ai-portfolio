
const NAME_REGEX = /^[\p{L}\s'-]+$/u;
const LETTER_REGEX = /\p{L}/u;

function isValidPersonName(value) {
    if (typeof value !== 'string') {
        return false;
    }

    const name = value.trim();

    return (
        name.length >= 2 &&
        name.length <= 50 &&
        NAME_REGEX.test(name) &&
        LETTER_REGEX.test(name)
    );
}

module.exports = {
    isValidPersonName
};
