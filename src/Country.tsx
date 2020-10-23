import React from "react";
import { useQuery, gql } from "@apollo/client";

const COUNTRY_QUERY = gql`
  query GetCountry {
    country(cca3: "AUS") {
      cca3
      name
      emoji
    }
  }
`;

export const Country: React.FC = () => {
  const { loading, error, data } = useQuery(COUNTRY_QUERY);

  if (loading) return <p>Loading</p>;
  if (error) return <p>Error loading data: {error.message}</p>;

  if (!data.country) {
    return <p>Not found</p>;
  }

  const { name, emoji } = data.country;

  return (
    <div>
      <dl>
        <dt>Country</dt>
        <dd>{name}</dd>
        <dt>Flag</dt>
        <dd>{emoji}</dd>
      </dl>
    </div>
  );
};
