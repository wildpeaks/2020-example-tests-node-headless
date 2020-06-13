/* eslint-env node, mocha */
"use strict";
const {strictEqual, deepStrictEqual} = require("assert");
const {chromium} = require("playwright");
const express = require("express");

// Temporary webserver
let server;
before(() => {
	const app = express();
	app.use('/dist', express.static("dist"));
	app.get("/test.html", (_req, res) => res.send('<html><body><script src="/dist/MyLibrary.js"></script></body></html>'));
	server = app.listen(3000);
});
after((done) => {
	server.close(() => {
		done();
	});
});

describe("Tests Suite 1", function(){

	// Headless browser
	let browser;
	let context;
	let page;
	before(async function() {
		this.slow(10000);
		this.timeout(10000);
		browser = await chromium.launch();
		context = await browser.newContext();
		page = await context.newPage();
		await page.goto("http://localhost:3000/test.html", {waitUntil: "networkidle"});
	});
	after(function() {
		return browser.close();
	});

	it("MyLibrary is a function", async function () {
		const actual = await page.evaluate(() => typeof MyLibrary);
		const expected = "function";
		strictEqual(actual, expected);
	});
	it("MyLibrary returns the expected value", async function () {
		const actual = await page.evaluate(() => {
			var mycontainer = document.createElement("div");
			MyLibrary(mycontainer);
			return mycontainer.innerHTML;
		});
		const expected = "<b>Hello World</b>";
		strictEqual(actual, expected);
	});
});
