import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "react-query";

import { Species } from "./Species";

const baseUrl = "https://swapi-node.vercel.app";
const initialUrl = `${baseUrl}/api/species/`;
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isError,
    error,
  } = useInfiniteQuery(
    "sw-species",
    ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.next ? `${baseUrl}${lastPage.next}` : undefined;
      }
    }
  );

  if (isLoading) return <div className="loading">Loading...</div>;
  if (isError) return <div>Error! {error.toString()}</div>;

  return (
    <>
      {isFetching && <div className="loading">Loading...</div>}
      <InfiniteScroll
        // add initialLoad={false} to prevent loading two pages on
        // component mount (see
        // https://www.udemy.com/course/learn-react-query/learn/#questions/18222646/)
        initialLoad={false}
        loadMore={fetchNextPage}
        hasMore={hasNextPage}
      >
        {data.pages.map((pageData) => {
          return pageData.results.map((species) => {
            return (
              <Species
                key={species.fields.name}
                name={species.fields.name}
                language={species.fields.language}
                averageLifespan={species.fields.average_lifespan}
              />
            );
          });
        })}
      </InfiniteScroll>
    </>
  );
}
