import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';

export function useDataTableParams() {
  const [page, setPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(1).withOptions({ shallow: true })
  );

  const [pageSize, setPageSize] = useQueryState(
    'pageSize',
    parseAsInteger.withDefault(10).withOptions({ shallow: true })
  );

  const [sort, setSort] = useQueryState(
    'sort',
    parseAsString.withOptions({ shallow: true })
  );

  return {
    page,
    setPage,
    pageSize,
    setPageSize,
    sort,
    setSort,
  };
}
