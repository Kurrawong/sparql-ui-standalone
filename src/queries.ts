export interface SampleQuery {
	title: string;
	description: string;
	query: string;
}

// Add a sample query by dropping a new .rq file in src/queries/ — no code
// changes needed. Optional leading comment lines set the title and
// description; both are optional and default to "Untitled" / blank:
//
//   # title: Your title
//   # description: One sentence shown next to the title.
//   SELECT * WHERE { ... }
//
// The leading "/" makes Vite resolve this from the root of the app being
// built, so a downstream app's own src/queries/ is picked up automatically.
const files = import.meta.glob("/src/queries/*.rq", {
	eager: true,
	query: "?raw",
	import: "default",
}) as Record<string, string>;

function parseSampleQuery(raw: string): SampleQuery {
	const lines = raw.split("\n");
	let cursor = 0;
	let title = "Untitled";
	let description = "";

	const titleMatch = lines[cursor]?.match(/^#\s*title:\s*(.*)$/i);
	if (titleMatch) {
		title = titleMatch[1].trim() || "Untitled";
		cursor++;
	}

	const descriptionMatch = lines[cursor]?.match(/^#\s*description:\s*(.*)$/i);
	if (descriptionMatch) {
		description = descriptionMatch[1].trim();
		cursor++;
	}

	return { title, description, query: lines.slice(cursor).join("\n").trim() };
}

export const sampleQueries: SampleQuery[] = Object.keys(files)
	.sort()
	.map((path) => parseSampleQuery(files[path]));
