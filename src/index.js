const isBefore = require('date-fns/is_before');
const differenceInMilliseconds = require('date-fns/difference_in_milliseconds');
const addSeconds = require('date-fns/add_seconds');
const parse = require('parse-headers');

// Returns boolean for whether or not the cache has expired
const expired = (headers, currentDate = new Date()) => isBefore(expired.on(headers), currentDate);

// Return ms until cache expires
expired.in = (headers, currentDate = new Date()) => differenceInMilliseconds(expired.on(headers), currentDate);

// Returns date when cache will expire
expired.on = headers => {
	// Parse headers if we got a raw string
	headers = (typeof headers === 'string') ? parse(headers) : headers;

	let expiredOn = new Date();

	// Prefer Cache-Control
	if (headers['cache-control']) {
		// Date from headers
		const originDate = new Date(headers.date);

		// Get max age ms
		let maxAge = headers['cache-control'].match(/max-age=(\d+)/);
		maxAge = parseInt(maxAge ? maxAge[1] : 0, 10);

		// Take current age into account
		if (headers.age) {
			maxAge -= headers.age;
		}

		// Calculate expirey date
		expiredOn = addSeconds(originDate, maxAge);

	// Fall back to Expires if it exists
	} else if (headers.expires) {
		expiredOn = new Date(headers.expires);
	}

	// Return expirey date
	return expiredOn;
};

module.exports = expired;
