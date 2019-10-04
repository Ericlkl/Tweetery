function extractTweets(tweets) {
    var combinedTweets;

	// Obtain text of each object
	tweets.forEach(element => {
        // console.log(element.text);
        // tweetArray.push(element.text);
        combinedTweets += ", " + element.text;
    });	
    
    return combinedTweets;
}

module.exports = { extractTweets };