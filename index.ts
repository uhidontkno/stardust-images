#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import Fastify from "fastify";
const fastify = Fastify({
	logger: true,
});
const home = os.homedir();
fastify.get("/", (_req, res) => {
	res.send({ message: "Stardust Container Agent is running" });
});
fastify.get("/files/list", () => {
	fs.mkdirSync(`${home}/Downloads`, { recursive: true });
	const files = fs.readdirSync(`${home}/Downloads`);
	return files;
});
fastify.get("/files/download/:name", (req, res) => {
	const { name: fileName } = req.params as { name: string };
	if (!fileName) {
		console.log("No file name provided");
		res.status(404).send({ error: "No file name provided" });
	}
	try {
		const file = fs.readFileSync(`${home}/Downloads/${fileName}`);
		res.send(file);
	} catch (e) {
		console.log(e);
		res.status(500).send({ error: "File not found" });
	}
});
fastify.addContentTypeParser('*', (_request, payload, done) => done(null, payload));
fastify.put("/files/upload/:name", async (req, res) => {
	const { name: fileName } = req.params as { name: string };
	if (!fileName) {
		console.log("No file name provided");
		res.status(404).send({ error: "No file name provided" });
	}
	const buffers: Buffer[] = [];
	try {
		req.raw.on("data", (chunk) => {
			buffers.push(chunk);
		});
		req.raw.on("end", () => {
			const buffer = Buffer.concat(buffers);
			fs.mkdirSync(`${home}/Uploads`, { recursive: true });
			fs.writeFileSync(`${home}/Uploads/${fileName}`, buffer);
			
		})
		return res.send({ message: "Upload successful" });

	} catch (e) {
		console.log(e);
		res.status(500).send({ error: "Upload failed" });
	}
});
try {
	await fastify.listen({ port: 6080 });
} catch (err) {
	fastify.log.error(err);
	process.exit(1);
}
