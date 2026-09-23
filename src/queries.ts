export interface SampleQuery {
	title: string;
	description: string;
	query: string;
}

// Add a sample query by dropping a new .rq file in src/sample-queries/ — no
// code changes needed. The first two lines are always title then
// description, the rest is the query itself:
//
//   # title: Your title
//   # description: One sentence shown next to the title.
//   SELECT * WHERE { ... }
const files = import.meta.glob("./queries/*.rq", {
	eager: true,
	query: "?raw",
	import: "default",
}) as Record<string, string>;

function parseSampleQuery(raw: string): SampleQuery {
	const lines = raw.split("\n");
	const title = lines[0].replace(/^#\s*title:\s*/i, "").trim() || "Untitled";
	const description = lines[1].replace(/^#\s*description:\s*/i, "").trim();

	return { title, description, query: lines.slice(2).join("\n").trim() };
}

export const sampleQueries: SampleQuery[] = Object.keys(files)
	.sort()
	.map((path) => parseSampleQuery(files[path]));
