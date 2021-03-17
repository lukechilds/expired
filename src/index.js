'use strict';

const isBefore = require('date-fns/isBefore');
const differenceInMilliseconds = require('date-fns/differenceInMilliseconds');
const addSeconds = require('date-fns/addSeconds');
const parse = require('parse-headers');

const maxAgeRegex = /max-age=(\d+)/;
const noCacheRegex = /(no-cache)|(no-store)/;

const getExpirationDate = headers => {
	// Check we have headers
	if (!headers) {
		throw new Error('Missing required argument "headers"');
	}

	const {
		date: dateHeader,
		age: ageHeader,
		'cache-control': cacheControlHeader,
		expires: expiresHeader
	} = typeof headers === 'string' ? parse(headers) : headers;

	// Confirm we have date header
	if (typeof dateHeader !== 'string') {
		throw new TypeError('Missing required header "Date"');
	}

	if (typeof cacheControlHeader === 'string') {
		// Prioritize no-cache and no-store
		const noCacheMatches = cacheControlHeader.match(noCacheRegex);
		if (noCacheMatches) {
			return new Date(dateHeader);
		}

		// Prioritize Cache-Control with max-age header
		const maxAgeMatches = cacheControlHeader.match(maxAgeRegex);
		if (maxAgeMatches) {
			const maxAge = Number.parseInt(maxAgeMatches ? maxAgeMatches[1] : 0, 10);
			if (typeof ageHeader === 'number') {
				return addSeconds(new Date(dateHeader), maxAge - ageHeader);
			}

			return addSeconds(new Date(dateHeader), maxAge);
		}
	}

	if (expiresHeader) {
		return new Date(expiresHeader);
	}

	// Return expiry dateHeader
	return new Date(dateHeader);
};

// Returns boolean for whether or not the cache has expired
const expired = (headers, date) => {
	if (date) {
		if (date instanceof Date) {
			return isBefore(expired.on(headers), date);
		}

		if (typeof date === 'string') {
			return isBefore(expired.on(headers), new Date(date));
		}

		throw new Error(`Optional argument "date" must be a string or Date object, found ${typeof date}`);
	}

	return isBefore(expired.on(headers), new Date());
};

// Return ms until cache expires
expired.in = (headers, date) => {
	if (date) {
		if (date instanceof Date) {
			return differenceInMilliseconds(expired.on(headers), date);
		}

		if (typeof date === 'string') {
			return differenceInMilliseconds(expired.on(headers), new Date(date));
		}

		throw new Error(`Optional argument "date" must be a string or Date object, found ${typeof date}`);
	}

	return differenceInMilliseconds(expired.on(headers), new Date());
};

// Returns date when cache will expire
expired.on = headers => {
	return getExpirationDate(headers);
};

module.exports = expired;
