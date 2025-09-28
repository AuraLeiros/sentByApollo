
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

async function main() {
	
	const uri = 'mongodb://my-db:27017'
	const client = new MongoClient(uri);

	try {
		await client.connect()
		console.log('Connected');
	} catch (err) {
		console.error("failed");
	} finally {
		await client.close();
	}
}

main();





