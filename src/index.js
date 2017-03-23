'use strict';

const isBefore = require('date-fns/is_before');
const differenceInMilliseconds = require('date-fns/difference_in_milliseconds');
const addSeconds = require('date-fns/add_seconds');
const parse = require('parse-headers');

// Returns boolean for whether or not the cache has expired
const expired = (headers, date) => isBefore(expired.on(headers), (date || new Date()));

// Return ms until cache expires
expired.in = (headers, date) => differenceInMilliseconds(expired.on(headers), (date || new Date()));

// Returns date when cache will expire
expired.on = headers => {
	// Check we have headers
	if (!headers) {
		throw new Error('Headers argument is missing');
	}

	// Parse headers if we got a raw string
	headers = (typeof headers === 'string') ? parse(headers) : headers;

	// Check we have date header
	if (!headers.date) {
		throw new Error('Date header is missing');
	}

	// Default to Date header
	let expiredOn = new Date(headers.date);

	// Prefer Cache-Control
	if (headers['cache-control']) {
		// Get max age ms
		let maxAge = headers['cache-control'].match(/max-age=(\d+)/);
		maxAge = parseInt(maxAge ? maxAge[1] : 0, 10);

		// Take current age into account
		if (headers.age) {
			maxAge -= headers.age;
		}

		// Calculate expirey date
		expiredOn = addSeconds(expiredOn, maxAge);

	// Fall back to Expires if it exists
	} else if (headers.expires) {
		expiredOn = new Date(headers.expires);
	}

	// Return expirey date
	return expiredOn;
};

module.exports = expired;
