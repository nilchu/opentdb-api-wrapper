// Todo: add JSdoc, Mocha test suite, JShint for linting, refactor according to best practices

const opentdb_api = (function(config) {
	'use strict'

	const BASE_URL = 'https://www.opentdb.com/'
	const RESPONSE_CODES = {
		0: 'Success',
		1: 'No Results',
		2: 'Invalid Parameter',
		3: 'Token Not Found',
		4: 'Empty'
	}
	const QUESTION_STANDARD = 10
	const QUESTION_LIMIT = 50
	const DEFAULT_CONFIG = {
		'encode': undefined,
		'amount': QUESTION_STANDARD,
		'token': undefined,
		'difficulty': undefined,
		'type': undefined,
		'category': undefined
	}

	if ( typeof window == typeof undefined ) {
		var fetch = require( 'node-fetch' )
	}

	function getReponseCodes() {
		return RESPONSE_CODES
	}

	function urlBuilder( config ) {
		
		let url = BASE_URL + 'api.php'		
		let query = ''

		if ( !config ) {
			config = DEFAULT_CONFIG
		}

		if ( !config.amount ) {
			config.amount = QUESTION_STANDARD
		}
		
		if ( config.amount > QUESTION_LIMIT ) {
			config.amount = QUESTION_LIMIT
		} 
		
		for ( let prop in config ) {
			if ( config[prop] ) {
				query += `${prop}=${config[prop]}&`
			}
		}

		if ( query ) {
			query = '?' + query
			query = query.slice(0,-1)
		}
		
		return apiRequest( url + query )
	}

	function fetchToken() {
		let url = `${BASE_URL}api_token.php?command=request` 
		return apiRequest( url )
	}

	function resetToken( token ) {
		let url = `${BASE_URL}api_token.php?command=reset&token=${token}`
		return apiRequest( url )
	}

	function fetchCategories() {
		let url = `${BASE_URL}api_category.php`
		return apiRequest( url )

	}

	function fetchGlobalQuestionCount() {
		let url = `${BASE_URL}api_count_global`
		return apiRequest( url )
	}

	function fetchCategoryQuestionCount( id ) {
			return new Promise(( resolve, reject ) => {
				if ( !id ) {
					reject({ 'error': 'Missing category id' })
				} else {
					let url = `${BASE_URL}api_count.php?category=${id}`
					resolve( apiRequest( url ) )
				}
			})
		}
	
	function fetchQuestions( config ) {
		return urlBuilder( config )
	}
	
	function apiRequest( url ) {
		return new Promise( function( resolve, reject ) {

			// Todo: check response status etc
			fetch( url )
				.then( response => response.json() )
				.then( data => resolve(data) )
				.catch( error => reject(error) )
		})
	} 

	return {
		fetchGlobalQuestionCount,
		fetchCategoryQuestionCount,
		fetchCategories,
		fetchQuestions,
		fetchToken,
		resetToken,
		getReponseCodes
	}

})()