import React from "react";
import { Country } from "./Country";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://graphqlcountries.com",
  cache: new InMemoryCache(),
});

export const App: React.FC = () => (
  <ApolloProvider client={client}>
    <div className="App">
      <Country />
    </div>
  </ApolloProvider>
);

export default App;
