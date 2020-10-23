import React from "react";
import { Country } from "./Country";
import { render, screen } from "@testing-library/react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { SchemaLink } from "@apollo/client/link/schema";
import {
  IExecutableSchemaDefinition,
  makeExecutableSchema,
} from "@graphql-tools/schema";
import { addMocksToSchema } from "@graphql-tools/mock";
import * as fs from "fs";
import { GraphQLError } from "graphql";

type Country = {
  name: string;
  emoji: string;
} | null;

const mockValidCountry = { name: "Australia", emoji: "🇦🇺" };

const schemaString = fs.readFileSync("schema.graphql", "utf-8");

const WrappedCountry = ({
  resolvers,
}: {
  resolvers?: IExecutableSchemaDefinition["resolvers"];
}) => {
  const schema = makeExecutableSchema({ typeDefs: schemaString, resolvers });
  const mocks = {
    Country: () => {
      return {
        name: "Australia",
        emoji: "🇦🇺",
      };
    },
  };
  const schemaWithMocks = addMocksToSchema({
    schema,
    mocks,
    preserveResolvers: true,
  });

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new SchemaLink({ schema: schemaWithMocks }),
  });
  return (
    <ApolloProvider client={client}>
      <Country />
    </ApolloProvider>
  );
};

describe("Country component", () => {
  test("show country name & flag", async () => {
    render(<WrappedCountry />);
    expect(await screen.findByText("Australia")).toBeInTheDocument();
    expect(await screen.findByText("🇦🇺")).toBeInTheDocument();
  });

  test("errors", async () => {
    const country = jest.fn().mockImplementation(() => {
      return new GraphQLError("Test error");
    });
    render(<WrappedCountry resolvers={{ Query: { country } }} />);
    expect(await screen.findByText(/Error/)).toBeInTheDocument();
  });

  test("loading", async () => {
    const wait = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const country = async () => {
      await wait(2000);
      return mockValidCountry;
    };
    render(<WrappedCountry resolvers={{ Query: { country } }} />);
    expect(await screen.findByText("Loading")).toBeInTheDocument();
  });

  test("not found", async () => {
    const country = () => null;
    render(<WrappedCountry resolvers={{ Query: { country } }} />);
    expect(await screen.findByText("Not found")).toBeInTheDocument();
  });
});
