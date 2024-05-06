#!/usr/bin/env tsx
import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import fastifyStatic from "@fastify/static";
import Fastify from "fastify";
const app = Fastify({
	logger: true,
});
const home = os.homedir();
const tmp = os.tmpdir();

app.get("/healthcheck", (_req, res) => res.send({ message: "Stardust Container Agent is running" }));
app.get("/password", (_req, res) => res.send(process.env.VNCPASSWORD));
app.get("/screenshot", async (_req, res) => {
	fs.mkdirSync(`${tmp}/screenshots`, { recursive: true });
	const path = `${tmp}/screenshots/window.png`;
	execSync(`DISPLAY=:1 import -window root ${path}`);
	const image = fs.readFileSync(path);
	fs.unlinkSync(path);
	res.header("Content-Type", "image/png").send(image);
});
app.get("/files/list", () => {
	fs.mkdirSync(`${home}/Downloads`, { recursive: true });
	const files = fs.readdirSync(`${home}/Downloads`);
	return files;
});
app.get("/files/download/:name", (req, res) => {
	const { name: fileName } = req.params as { name: string };
	if (!fileName) {
		console.log("No file name provided");
		return res.code(404).send({ error: "No file name provided" });
	}
	try {
		const file = fs.readFileSync(`${home}/Downloads/${fileName}`);
		res.send(file);
	} catch (e) {
		console.log(e);
		res.code(500).send({ error: "File not found" });
	}
});
app.addContentTypeParser("*", (_request, payload, done) => done(null, payload));
app.put("/files/upload/:name", async (req, res) => {
	const { name: fileName } = req.params as { name: string };
	if (!fileName) {
		console.log("No file name provided");
		return res.code(404).send({ error: "No file name provided" });
	}

	try {
		fs.mkdirSync(`${home}/Uploads`, { recursive: true });
		const fileStream = fs.createWriteStream(`${home}/Uploads/${fileName}`);
		await new Promise<void>((resolve, reject) => {
			req.raw.on("data", (chunk) => {
				fileStream.write(chunk);
			});
			req.raw.on("end", () => {
				fileStream.end();
				resolve();
			});
			req.raw.on("error", (err) => {
				console.log(err);
				fileStream.end();
				fs.unlinkSync(`${home}/Uploads/${fileName}`);
				reject(err);
			});
		});
		console.log(`File ${fileName} uploaded`);
		res.send({ success: true });
	} catch (e) {
		console.log(e);
		res.status(500).send({ error: "Upload failed" });
	}
});
app.register(fastifyStatic, {
	root: path.join(import.meta.dirname, "static"),
});
try {
	await app.listen({ port: 6080, host: "0.0.0.0" });
} catch (err) {
	app.log.error(err);
	process.exit(1);
}
