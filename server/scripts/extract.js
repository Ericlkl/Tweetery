/**
 * Extracts the tweet's text from the given twitter object
 * 
 * @param {*} tweets - Twitter object containing tweet information
 */
function extractTweets(tweets) {
    var combinedTweets;

	// Obtain text of each object
	tweets.forEach(element => {
        combinedTweets += ", " + element.text;
    });	
    
    return combinedTweets;
}

module.exports = { extractTweets };