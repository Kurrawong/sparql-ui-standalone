import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parseEnv } from "node:util";
import { proxySparql } from "./sparql-proxy.js";

// Serves /api/sparql/<id> from `pnpm dev`, using SPARQL_* values from .env.local
// (or the shell environment), so local development needs no platform tooling.
export function sparqlProxy() {
    return {
        name: "sparql-proxy",
        configureServer(server) {
            const file = join(server.config.root, ".env.local");
            const env = { ...process.env, ...(existsSync(file) ? parseEnv(readFileSync(file, "utf8")) : {}) };

            server.middlewares.use("/api/sparql/", async (req, res, next) => {
                if (req.method !== "POST") return next();

                const chunks = [];
                for await (const chunk of req) chunks.push(chunk);
                const request = { headers: { get: (name) => req.headers[name] ?? null }, text: async () => Buffer.concat(chunks).toString() };

                const { status, headers, body } = await proxySparql(req.url.slice(1).split("?")[0], request, env);
                res.writeHead(status, headers);
                res.end(body);
            });
        },
    };
}
