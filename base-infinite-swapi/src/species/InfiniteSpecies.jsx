import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Species } from "./Species";

const baseUrl = "https://swapi-node.vercel.app";
const initialUrl = `${baseUrl}/api/species/`;
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  const {
    data = { pages: [] },
    fetchNextPage,
    hasNextPage,
    isFetching,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['sw-species'],
    queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage.next ? `${baseUrl}${lastPage.next}` : undefined;
    }
  })
  return (
    <>
      {isFetching && <div className="loading">Loading...</div>}
      {isError && <div className="error">Error: {error.toString()}</div>}
      <InfiniteScroll
        loadMore={
          () => {
            if (isFetching) return

            fetchNextPage()
          }
        }
        hasMore={hasNextPage}
        initialLoad={false}
      >
        {
          data.pages.map(
            (pageData) => {
              return pageData.results.map(
                (species) => (
                  <Species
                    key={species.fields.name}
                    name={species.fields.name}
                    language={species.fields.language}
                    averageLifespan={species.fields.average_lifespan}
                  />
                )
              )
            }
          )
        }
      </InfiniteScroll>
    </>
  )
}
