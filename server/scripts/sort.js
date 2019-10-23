/**
 * sorts the dates
 * 
 * @param {*} a  first date for comparison
 * @param {*} b  second date for comparison
 */
function sortByTime(a, b) {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
}

/**
 * sorts the emotional data from oldest
 * to newest
 * @param {*} object An array of objects
 */
function sortData(object) {
    object.sort(sortByTime)
    return object
}

module.exports = { sortData };