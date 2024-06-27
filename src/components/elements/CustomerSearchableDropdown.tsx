import { useCallback, useState, useRef, useEffect } from 'react';
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
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface SearchDropdownProps<T> {
  queryFn: (pageParam: number, query: string, key: string) => Promise<any>;
  onSelect: (item: T | null) => void;
  placeholder?: string;
  itemToString: (item: T) => string;
  handleOnChange?: () => void;
  type: string;
  defaultValue?: string;
}

const CustomerSearchDropdown = <T extends { id: number }>({
  queryFn,
  onSelect,
  placeholder = 'Search...',
  itemToString,
  defaultValue,
  handleOnChange,
  type,
}: SearchDropdownProps<T>) => {
  const [inputValue, setInputValue] = useState<string>(defaultValue ?? '');

  const [isFocused, setIsFocused] = useState(false);
  const listRef = useRef<HTMLUListElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { fetchNextPage, hasNextPage, isFetchingNextPage, data } =
    useInfiniteQuery({
      queryKey: [`${type}Search`, inputValue],
      queryFn: ({ pageParam = 1 }) => queryFn(pageParam, inputValue, 'businessName'),
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

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsFocused(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleFocus = () => {
    if (isFocused) {
      setIsFocused(false)
    }
    else {
      setIsFocused(true)
    }
  };



  const handleKeyDown = (event: any, item: any) => {
    if (event.key === 'Enter') {
      setInputValue(itemToString(item));
      onSelect(item);
      setIsFocused(false);
    } else if (event.key === 'Tab') {

    }
  };

  return (
    <Grid container spacing={1} style={{ position: 'relative' }} ref={containerRef}>
      <Grid item xs={12} style={{ position: 'relative' }}>
        <div className='flex gap-x-2 justify-start items-center'>
          <TextField
            label={type}
            fullWidth
            variant="standard"
            value={inputValue}
            onChange={(e) => {
              const { value } = e.target;
              setInputValue(value);
              setSearchTermThrottled(value);
              onSelect(null);
            }}
            onFocus={toggleFocus}
            placeholder={placeholder}
            autoComplete="off"
            onClick={() => {
              if (handleOnChange) handleOnChange();
              setIsFocused(true);
            }}
          />
          <button type="button" className='flex justify-center items-center' onClick={toggleFocus}>
            <ArrowDropDownIcon />
          </button>
        </div>
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
                      onMouseDown={() => {
                        setInputValue(itemToString(item));
                        onSelect(item);
                        setIsFocused(false);
                      }}
                      onKeyDown={(event) => handleKeyDown(event, item)}
                    >
                      {itemToString(item)}
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

CustomerSearchDropdown.defaultProps = {
  placeholder: 'Search...',
  defaultValue: '',
  handleOnChange: () => { },
};

export default CustomerSearchDropdown;
