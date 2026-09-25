import { app } from "@azure/functions";
// ../sparql-proxy.js is copied in from proxy/ when the deployment is assembled (see README).
import { proxySparql } from "../sparql-proxy.js";

app.http("sparql", {
    methods: ["POST"],
    // Sign-in is enforced by the Static Web App in front of this function.
    authLevel: "anonymous",
    route: "sparql/{id}",
    handler: (request) => proxySparql(request.params.id, request, process.env),
});
