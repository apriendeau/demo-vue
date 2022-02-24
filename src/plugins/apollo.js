import { ApolloClient, ApolloLink, from, HttpLink, InMemoryCache } from "@apollo/client/core";
import { RetryLink } from "@apollo/client/link/retry";
import { inject } from "vue";

// This link is used to attach context values to the request and/or response.
// At the moment, we use this to attach a request ID to each request and the
// associated response so that we can trace requests with their responses and
// align these with the back end.
const context = new ApolloLink((operation, forward) => {
	const context = operation.getContext();
	if (typeof context.headers !== "object") {
		context.headers = {};
	}
	const requestId = Math.random().toString(36).substr(2);
	context.headers["X-Request-ID"] = context.requestId ?? requestId;
	operation.setContext(context);
	console.log(`[gql] requesting '${operation.operationName}' [${requestId}]`);
	return forward(operation).map((response) => {
		const headers = operation.getContext().headers;
		const res = response;
		if (headers["X-Request-ID"]) {
			res.requestId = headers["X-Request-ID"];
		}
		return res;
	});
});
// This link is for the base http configuration
const http = new HttpLink({ uri: 'http://localhost:4000/graphql' });
// This link is used to retry when network errors occur. Note: It won't retry
// when a graphql error occurs.
const retry = new RetryLink();
const link = from([context, retry, http]);
// cache configuration
const cache = new InMemoryCache();
// main client configuration
export const client = new ApolloClient({
	cache,
	link,
	connectToDevTools: process.env.NODE_ENV === "development",
});

export const ApolloClientKey = "apolloClientKey";

export function useApollo() {
	return inject(ApolloClientKey);
}

export default {
	install(app) {
		app.config.globalProperties.$apollo = client;
		app.provide(ApolloClientKey, client);
	},
};
