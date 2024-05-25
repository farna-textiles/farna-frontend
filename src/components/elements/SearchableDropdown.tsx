import { useCallback, useState, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  TextField,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemButton,
  CircularProgress,
} from '@mui/material';
import { throttle } from 'lodash';

interface SearchDropdownProps<T> {
  queryFn: (pageParam: number, query: string) => Promise<any>;
  onSelect: (item: T | null) => void;
  placeholder?: string;
  itemToShow: (item: T) => React.ReactNode;
  itemToString: (item: T) => string;
  handleOnChange?: () => void;
  type: string;
  defaultValue?: string;
}

const SearchDropdown = <T extends { id: number }>({
  queryFn,
  onSelect,
  placeholder = 'Search...',
  itemToString,
  defaultValue,
  handleOnChange,
  itemToShow,
  type,
}: SearchDropdownProps<T>) => {
  const [inputValue, setInputValue] = useState<string>(defaultValue ?? '');
  const [isFocused, setIsFocused] = useState(false);
  const listRef = useRef<HTMLUListElement | null>(null);

  const { fetchNextPage, hasNextPage, isFetchingNextPage, data } =
    useInfiniteQuery({
      queryKey: [`${type}Search`, inputValue],
      queryFn: ({ pageParam = 1 }) => queryFn(pageParam, inputValue),
      getNextPageParam: (lastPage, allPages) => {
        const totalPages = Math.ceil(lastPage.total / 5);
        const currentPage = allPages.length;

        if (currentPage < totalPages) {
          return currentPage + 1;
        }
        return undefined;
      },
      suspense: false,
      keepPreviousData: true,
    });

  const items = data ? data.pages.flatMap((page) => page.data) : [];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setSearchTermThrottled = useCallback(
    throttle((value: string) => {
      setInputValue(value);
    }, 300),
    []
  );

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLUListElement>) => {
      if (
        hasNextPage &&
        event.currentTarget.scrollHeight - event.currentTarget.scrollTop ===
          event.currentTarget.clientHeight
      ) {
        fetchNextPage();
      }
    },
    [hasNextPage, fetchNextPage]
  );

  return (
    <Grid container spacing={1} style={{ position: 'relative' }}>
      <Grid item xs={12} style={{ position: 'relative' }}>
        <TextField
          label={type}
          fullWidth
          variant="outlined"
          value={inputValue}
          onChange={(e) => {
            const { value } = e.target;
            setInputValue(value);
            setSearchTermThrottled(value);
            onSelect(null);
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          autoComplete="off"
          onClick={() => {
            if (handleOnChange) handleOnChange();
            setInputValue('');
          }}
        />
        {items.length > 0 && isFocused && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              width: '100%',
              zIndex: 1,
            }}
          >
            <Paper elevation={3}>
              <List
                ref={listRef}
                style={{ maxHeight: '200px', overflowY: 'auto' }}
                onScroll={handleScroll}
              >
                {items.map((item) => (
                  <ListItem key={item.id}>
                    <ListItemButton
                      onClick={() => {
                        setInputValue(itemToString(item));
                        onSelect(item);
                        setIsFocused(false);
                      }}
                    >
                      {itemToShow(item)}
                    </ListItemButton>
                  </ListItem>
                ))}
                {isFetchingNextPage && hasNextPage ? (
                  <ListItem>
                    <CircularProgress size={24} />
                  </ListItem>
                ) : null}
              </List>
            </Paper>
          </div>
        )}
      </Grid>
    </Grid>
  );
};

SearchDropdown.defaultProps = {
  placeholder: 'Search...',
  defaultValue: '',
  handleOnChange: () => {},
};

export default SearchDropdown;
