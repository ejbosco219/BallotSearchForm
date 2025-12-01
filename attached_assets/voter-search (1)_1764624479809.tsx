import { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';

import { 
  Box, IconButton, Typography, TextField, CircularProgress, InputAdornment, 
  Chip, Button, Card, CardContent, Grid, Divider, Tooltip, Badge, Paper, Avatar, MenuList, MenuItem
} from '@mui/material';
import { List, ListItemButton, ListItemText, ListItemAvatar } from '@mui/material';
import { COLUMN_MAPPINGS } from '../column-mappings';
import { Iconify } from 'src/components/iconify';
import { SearchResult, SearchParams, SearchFieldsProps, SearchResultsSectionProps, SearchResultsRef } from '../../../types/search';
import { Collapse } from '@mui/material';
import { 
  hasResults ,
  getResultsArray, 
  getSearchTerms, 
  getTotalMatches, 
  getQueryTime 
} from '../search-utils';

interface HighlightedTextProps {
  text: string;
  searchTerms: string[];
  variant?: string;
}

// Component to highlight search terms in text
const HighlightedText: React.FC<HighlightedTextProps> = ({ text, searchTerms, variant = "body2" }) => {
  if (!text || !searchTerms || searchTerms.length === 0) {
    return <span>{text}</span>;
  }
  
  // Create a regex to match all search terms (case insensitive)
  const escapedTerms = searchTerms.map(term => 
    term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escape special regex chars
  );
  const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');
  
  // Split text by matches
  const parts = text.split(regex);
  
  return (
    <span>
      {parts.map((part, i) => {
        // Check if this part matches any search term (case insensitive)
        const isMatch = searchTerms.some(term => 
          part.toLowerCase() === term.toLowerCase()
        );
        
        return isMatch ? (
          <span 
            key={i}
            style={{ 
              backgroundColor: 'rgba(255, 193, 7, 0.8)',
              color: '#212121',
              fontWeight: 'bold',
              padding: '0 4px',
              borderRadius: '2px',
              display: 'inline-block'
            }}
          >
            {part}
          </span>
        ) : part;
      })}
    </span>
  );
};



// --------------------------------------------------------------------------------------

interface SearchResultItemProps {
  result: SearchResult;
  searchTerms: string[];
  index: number;
  isSelected: boolean;  // Added missing property
  onSelect: (result: SearchResult) => void;
}

// Enhanced result item component with expanded details
const SearchResultItem: React.FC<SearchResultItemProps> = ({ 
  result, 
  searchTerms, 
  index, 
  isSelected,
  onSelect
}) => {
  const [expanded, setExpanded] = useState(false);
  
  // Separate handlers for selection and expansion
  const handleSelectVoter = () => {
    onSelect(result);
  };
  
  const handleToggleExpand = (e: React.MouseEvent) => {
    // Stop propagation to prevent the ListItemButton click handler from firing
    e.stopPropagation();
    setExpanded(!expanded);
  };
  
  // Format the address
  const addressText = [
    result.address?.street,
    result.address?.city,
    result.address?.state,
    result.address?.zipCode
  ].filter(Boolean).join(', ');
  
  // Get first letter of first and last name for avatar
  const getInitials = () => {
    const firstName = result.firstName || '';
    const lastName = result.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Safely compose display name (fallback to first/last or '-') and append title if present
  const displayName = (result.name && result.name.trim().length > 0)
    ? result.name
    : [result.firstName, result.lastName].filter(Boolean).join(' ').trim();
  const nameWithTitle = [displayName || '-', result.title && result.title.trim() ? result.title : undefined]
    .filter(Boolean)
    .join(', ');
  
  return (
    <Paper 
      elevation={1} 
      sx={{ 
        mb: 2, 
        overflow: 'hidden',
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: 3,
        },
        // Enhanced selected state styling
        ...(isSelected ? {
          border: '2px solid',
          borderColor: 'primary.main',
          backgroundColor: 'primary.lighter',
          boxShadow: '0 0 8px rgba(25, 118, 210, 0.4)', // Glow effect
          transform: 'translateY(-2px)', // Subtle lift effect
        } : {
          border: '2px solid transparent',
        })
      }}
    >
        <ListItemButton 
          onClick={handleSelectVoter}
          selected={isSelected}
          component="div" // Using div instead of a button to avoid focus issues
          sx={{
            py: 1.5,
            px: 2,
            backgroundColor: isSelected ? '#1976d2' : 'background.paper', 
            color: isSelected ? 'white' : 'inherit',
            '&.Mui-selected': {
              backgroundColor: '#1976d2',
            },
            '&.Mui-selected:hover': {
              backgroundColor: '#1565c0',
            },
            '&:hover': {
              backgroundColor: isSelected ? '#1565c0' : 'action.hover',
            }
          }}
        >
        <ListItemAvatar>
          <Badge
            color="primary"
            badgeContent={index + 1}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <Avatar 
              sx={{ 
                bgcolor: `primary.${(index % 3) * 100 + 200}`,
                color: 'primary.contrastText'
              }}
            >
              {getInitials()}
            </Avatar>
          </Badge>
        </ListItemAvatar>
        
        <Box 
          sx={{ 
            backgroundColor: isSelected ? '#1976d2' : 'transparent',
            padding: isSelected ? '8px' : '0px',
            borderRadius: '4px',
            flexGrow: 1, // This ensures the box takes up all available space
            transition: 'background-color 0.2s ease'
          }}
        >
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <HighlightedText 
                  text={nameWithTitle}
                  searchTerms={searchTerms}
                  variant="subtitle1"
                />
                {(result.voterId === '02DJN1203003' || result.voterId === '07BTY2803001') && (
                  <Box
                    component="img"
                    src="/assets/logo/special-voter.png"
                    alt="special"
                    sx={{ width: 28, height: 28, borderRadius: 1 }}
                  />
                )}
              </Box>
            }
            secondary={
              <HighlightedText 
                text={addressText}
                searchTerms={searchTerms}
                variant="body2"
              />
            }
            primaryTypographyProps={{ 
              fontWeight: isSelected ? 'bold' : 'medium',
              color: isSelected ? 'white' : 'text.primary'
            }}
            secondaryTypographyProps={{
              color: isSelected ? 'rgba(255, 255, 255, 0.8)' : 'text.secondary'
            }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
          <IconButton 
            size="small"
            onClick={handleToggleExpand}
            aria-label={expanded ? "Collapse details" : "Expand details"}
          >
            <Iconify 
              icon={expanded ? "mdi:chevron-up" : "mdi:chevron-down"} 
              width={20} 
            />
          </IconButton>
        </Box>
      </ListItemButton>
      
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ py: 1.5, bgcolor: 'background.neutral' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">Personal Info</Typography>
              <Typography variant="body2">
                <Box component="span" sx={{ fontWeight: 'bold' }}>First Name:</Box>{" "}
                <HighlightedText 
                  text={result.firstName || '-'} 
                  searchTerms={searchTerms}
                  variant="body2"
                />
              </Typography>
              <Typography variant="body2">
                <strong>Last Name:</strong> {" "}
                <HighlightedText 
                  text={result.lastName || '-'} 
                  searchTerms={searchTerms}
                  variant="body2"
                />
              </Typography>
              {result.middleName && (
                <Typography variant="body2">
                  <strong>Middle Name:</strong> {" "}
                  <HighlightedText 
                    text={result.middleName} 
                    searchTerms={searchTerms}
                    variant="body2"
                  />
                </Typography>
              )}
              {result.dateOfBirth && (
                <Typography variant="body2">
                  <strong>DOB:</strong> {result.dateOfBirth}
                </Typography>
              )}
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">Address</Typography>
              <Typography variant="body2">
                <strong>Street:</strong> {" "}
                <HighlightedText 
                  text={result.address?.street || '-'} 
                  searchTerms={searchTerms}
                  variant="body2"
                />
              </Typography>
              {result.address?.unit && (
                <Typography variant="body2">
                  <strong>Unit:</strong> {result.address.unit}
                </Typography>
              )}
              <Typography variant="body2">
                <strong>City:</strong> {" "}
                <HighlightedText 
                  text={result.address?.city || '-'} 
                  searchTerms={searchTerms}
                  variant="body2"
                />
              </Typography>
              <Typography variant="body2">
                <strong>State/ZIP:</strong> {" "}
                <HighlightedText 
                  text={`${result.address?.state || '-'} ${result.address?.zipCode || ''}`} 
                  searchTerms={searchTerms}
                  variant="body2"
                />
              </Typography>
            </Grid>
            
            {(result.voterId || result.partyAffiliation) && (
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {result.voterId && (
                    <Chip 
                      icon={<Iconify icon="mdi:id-card" width={16} />} 
                      label={`Voter ID: ${result.voterId}`} 
                      size="small" 
                      variant="outlined"
                    />
                  )}
                  {result.partyAffiliation && (
                    <Chip
                      icon={<Iconify icon="mdi:account-group" width={16} />} 
                      label={`Party: ${result.partyAffiliation}`}
                      size="small"
                      variant="outlined"
                      color={(result.partyAffiliation || '').toLowerCase().includes('dem') ? 'info' :
                        (result.partyAffiliation || '').toLowerCase().includes('rep') ? 'error' :
                        'default'}
                    />
                  )}
                  {result.voterStatus && (
                    <Chip
                      icon={<Iconify icon="mdi:check-circle" width={16} />} 
                      label={`Status: ${result.voterStatus}`}
                      size="small"
                      variant="outlined"
                      color={(result.voterStatus || '').toLowerCase().includes('active') ? 'success' : 'default'}
                    />
                  )}
                </Box>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Collapse>
    </Paper>
  );
};


// --------------------------------------------------------------------

export const SearchFields: React.FC<SearchFieldsProps> = ({ 
  onSearch, 
  isSearching, 
  onSearchResults,
  nameInputRef,
  state,
  onTabToResults,
  onShiftTabToCarousel,
  searchResults,
  clearSearch,
  autoQuery,
  onAutoQueryUsed
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const shouldAutoSearchRef = useRef(false);
  const hasUserEditedRef = useRef(false);
  const debouncedUserInput = useRef<NodeJS.Timeout>();
  const manual = true; // Set to true for manual search

  useEffect(() => {
    if (clearSearch) {
      // console.log('[SearchFields] clearSearch triggered');
      handleClearSearch();
    }
  }, [clearSearch]);

  const query = typeof autoQuery === 'string' ? autoQuery : autoQuery?.query;

  useEffect(() => {
    if (typeof query === 'string' && query.trim().length >= 2) {
      // If the user has edited the input and it differs from autoQuery, do not overwrite
      if (
        hasUserEditedRef.current &&
        searchQuery.trim().length > 0 &&
        searchQuery.trim().toLowerCase() !== query.trim().toLowerCase()
      ) {
        // console.log('[SearchFields] skipping autofill: user edited input differs from autoQuery', { query, searchQuery });
        return;
      }

      // console.log('[SearchFields] autoQuery changed, scheduling autofill', { query, autoQuery });
      const textDelay = setTimeout(() => {
        // Only proceed if user hasn't typed since this timeout was set
        if (!hasUserEditedRef.current) {
          setSearchQuery(query);
          shouldAutoSearchRef.current = true;
        }
      }, 500);

      return () => clearTimeout(textDelay);
    }
  }, [query]);

  useEffect(() => {
    if (
      shouldAutoSearchRef.current &&
      typeof query === 'string' &&
      searchQuery.trim() === query.trim()
    ) {
  // console.log('[SearchFields] running auto-search for query', { query: searchQuery });
      shouldAutoSearchRef.current = false;
      onAutoQueryUsed?.();

      const searchDelay = setTimeout(() => {
        handleSearchClick();
      }, 500);

      return () => clearTimeout(searchDelay);
    }
  }, [searchQuery]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    hasUserEditedRef.current = true;
    setSearchQuery(e.target.value);
    
    // Clear any pending auto-query when user types
    if (shouldAutoSearchRef.current) {
      shouldAutoSearchRef.current = false;
    }
    
    // Clear any existing debounce
    if (debouncedUserInput.current) {
      clearTimeout(debouncedUserInput.current);
    }
    
    // Set a flag that user input is "fresh" for a short time
    debouncedUserInput.current = setTimeout(() => {
      // After this timeout, auto-query can work again if needed
      // This helps prevent immediate conflicts with auto-query
    }, 1000);
  };

  const handleClearSearch = () => {
    // console.log('[SearchFields] handleClearSearch');
    hasUserEditedRef.current = false;
    setSearchQuery('');
    onSearchResults({ 
      topResults: [], 
      totalMatches: 0,
      searchTerms: []
    });
    
    // Focus back on the search input after clearing
    nameInputRef.current?.focus();
  };
    
  // Execute search when button is clicked
  const handleSearchClick = async () => {
    if (searchQuery.trim().length < 2) {
      return; // Don't search with very short queries
    }
    
    try {
      // Simple search with just query and state
      const searchParams: SearchParams = { 
        query: searchQuery.trim(),
        state: COLUMN_MAPPINGS[state]?.stateAbbreviation || state,
        manual: manual,
      };
      // console.log('[SearchFields] handleSearchClick', searchParams);
      
      await onSearch(searchParams);
    } catch (error) {
      console.error('Error in search:', error);
      const searchTerms = searchQuery.trim().split(/\s+/).filter(term => term.length >= 2);
      onSearchResults({ 
        topResults: [], 
        totalMatches: 0, 
        searchTerms
      });
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Only handle Enter and Tab keys in the search field
    if (e.key === 'Enter' && searchQuery.trim().length >= 2) {
      e.preventDefault();
      // console.log('[SearchFields] Enter pressed -> search');
      handleSearchClick();
    } else if (e.key === 'Tab' && !e.shiftKey) {
      // If search results exist and Tab is pressed, move focus to results
      const hasSearchResults = hasResults(searchResults);
      
      if (hasSearchResults && onTabToResults) {
        e.preventDefault(); // Prevent default tab behavior
        // console.log('[SearchFields] Tab pressed -> move focus to results');
        onTabToResults();
      }
    } else if (e.key === 'Tab' && e.shiftKey) {
      // When Shift+Tab is pressed, focus the carousel container
      e.preventDefault();
      // We need to pass this event up to the parent component
      if (typeof onShiftTabToCarousel === 'function') {
        // console.log('[SearchFields] Shift+Tab pressed -> move focus to carousel');
        onShiftTabToCarousel();
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      // Don't process arrow keys in the search input
      // This allows the carousel's key handler to work
      e.stopPropagation();
    }
  };

  // Force focus to the search input on mount
  useEffect(() => {
    nameInputRef.current?.focus();
  }, [nameInputRef]);

  // Cleanup debounced input timeout on unmount
  useEffect(() => {
    return () => {
      if (debouncedUserInput.current) {
        clearTimeout(debouncedUserInput.current);
      }
    };
  }, []);

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          label="Search voters"
          value={searchQuery}
          onChange={handleSearchInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter name, address, city, zip (e.g. 'john smith boston')"
          disabled={isSearching}
          inputRef={nameInputRef}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="mdi:magnify" width={20} />
              </InputAdornment>
            ),
            endAdornment: searchQuery ? (
              <InputAdornment position="end">
                <IconButton 
                  size="small" 
                  onClick={handleClearSearch}
                  edge="end"
                >
                  <Iconify icon="mdi:close" width={16} />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
          sx={{
            '& .MuiInputBase-root': {
              height: '48px',
              fontSize: '1rem'
            }
          }}
        />
        
        <Button
          variant="contained"
          onClick={handleSearchClick}
          disabled={isSearching || searchQuery.trim().length < 2}
          sx={{ 
            height: '48px',
            minWidth: '120px'
          }}
          startIcon={isSearching ? <CircularProgress size={20} color="inherit" /> : <Iconify icon="mdi:magnify" />}
        >
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </Box>
      <Box 
        sx={{ 
          mt: 1, 
          display: 'flex', 
          flexWrap: 'wrap',
          alignItems: 'center', 
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Search with multiple terms for better results (e.g. "johnson 123 main st boston")
        </Typography>
        
        {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: { xs: 1, sm: 0 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box component="span" sx={{ px: 0.5, border: '1px solid', borderRadius: 0.5, borderColor: 'divider', fontSize: '0.7rem', mr: 0.5 }}>Enter</Box>
            <Typography variant="caption">Search</Typography>
          </Box>
          
          {hasResults(searchResults) && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box component="span" sx={{ px: 0.5, border: '1px solid', borderRadius: 0.5, borderColor: 'divider', fontSize: '0.7rem', mr: 0.5 }}>Tab</Box>
              <Typography variant="caption">To Results</Typography>
            </Box>
          )}
        </Box> */}
      </Box>
    </Box>
  );
};


// ------------------------------------------------------------------------


export const SearchResultsSection = forwardRef<SearchResultsRef, SearchResultsSectionProps>(
  ({ 
    searchResults,
    isSearching,
    handleFieldChange,
    selectedVoter,
    onSelectVoter,
    focusedResultIndex,
    isResultsFocused,
    nameInputRef,
    setFocusedResultIndex,
    setIsResultsFocused,
    handleInvalidSignature
  }, ref) => {
    // Extract data using our utility functions
    const searchTerms = getSearchTerms(searchResults);
    const results = getResultsArray(searchResults);
    const totalMatches = getTotalMatches(searchResults);
    const queryTime = getQueryTime(searchResults);
    
    // Create refs for individual items
    const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
    
    // State to track expanded items
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

    // Ensure the array has enough slots for all items
    useEffect(() => {
      // Reset refs array when results change
      itemRefs.current = itemRefs.current.slice(0, results.length);
      if (itemRefs.current.length < results.length) {
        itemRefs.current = Array(results.length).fill(null);
      }
    }, [results]);

    // Function to focus the first result
    const focusResults = useCallback(() => {
      // console.log('focusResults called');
      
      // Focus the first item directly
      if (itemRefs.current[0]) {
        itemRefs.current[0].focus();
        // console.log('First item focused');
      } else {
        console.log('First item ref not available');
      }
    }, []);

    // Toggle expansion for an item
    const handleToggleExpand = (itemId: string, e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent item selection when clicking expand button
      setExpandedItems(prev => ({
        ...prev,
        [itemId]: !prev[itemId]
      }));
    };

    // Pass focusResults method to the parent through ref
    useImperativeHandle(ref, () => ({
      focusResults
    }), [focusResults]);

    // Handle keyboard navigation within results
    // const handleResultsKeyDown = (e: React.KeyboardEvent) => {
    //   const currentResults = getResultsArray(searchResults);
      
    //   if (!currentResults || currentResults.length === 0) return;
    
    //   // Handle special shortcut keys only
    //   switch (e.key) {
    //     case 'Escape':
    //       e.preventDefault();
    //       setIsResultsFocused(false);
    //       setFocusedResultIndex(-1);
    //       nameInputRef.current?.focus();
    //       break;
          
    //     case 'Tab':
    //       if (e.shiftKey) {
    //         // Shift+Tab returns focus to search input
    //         e.preventDefault();
    //         setIsResultsFocused(false);
    //         setFocusedResultIndex(-1);
    //         nameInputRef.current?.focus();
    //       }
    //       break;
          
    //     // Shortcut keys for rejection
    //     case 'w':
    //     case 'W':
    //       e.preventDefault();
    //       handleInvalidSignature('Illegible');
    //       break;
          
    //     case 'a':1
    //     case 'A':
    //       e.preventDefault();
    //       handleInvalidSignature('Failed Match');
    //       break;
          
    //     case 'D':
    //     case 'd':
    //       e.preventDefault();
    //       handleInvalidSignature('Soft Match');
    //       break;
    // };  

    // Show loading state
    if (isSearching) {
      return (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          p: 6,
          bgcolor: 'background.neutral',
          borderRadius: 1
        }}>
          <CircularProgress size={32} sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Searching voter records...
          </Typography>
        </Box>
      );
    }

    // No results found
    if (!results || results.length === 0) {
      return (
        <Box 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            color: 'text.secondary',
            bgcolor: 'background.neutral',
            borderRadius: 1,
            mt: 2
          }}
        >
          <Iconify 
            icon="mdi:search-off" 
            width={48} 
            sx={{ 
              mb: 2,
              color: 'text.disabled'
            }} 
          />
          <Typography variant="h6">
            No matches found
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Try using fewer or different search terms
          </Typography>
        </Box>
      );
    }

    // Results found
    return (
      <Box sx={{ mt: 2 }}>
        {/* <Box 
          sx={{ 
            p: 2, 
            borderRadius: '8px 8px 0 0', 
            bgcolor: 'primary.lighter', 
            border: '1px solid', 
            borderColor: 'primary.light',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Iconify 
              icon="mdi:account-search" 
              width={24} 
              sx={{ mr: 1, color: 'primary.main' }} 
            />
            <Typography variant="subtitle1" fontWeight="medium" color="primary.dark">
              {totalMatches.toLocaleString()} {totalMatches === 1 ? 'match' : 'matches'} found
            </Typography>
          </Box>
          
          {queryTime > 0 && (
            <Chip
              size="small"
              icon={<Iconify icon="mdi:timer" width={16} />}
              label={`${queryTime}ms`}
              variant="outlined"
              sx={{ borderColor: 'primary.light' }}
            />
          )}
        </Box> */}

        {/* Results list with custom styling */}
        <div role="listbox" style={{ width: '100%' }}>
          {/* Get normalized top street address and check for matches */}
          {results.slice(0, 20).map((result, index) => {
            const isItemSelected = index === focusedResultIndex && isResultsFocused;
            const itemId = result._id || `item-${index}`;
            
            // Get top address, city, and unit for comparison
            const topStreet = (results[0]?.address?.street || '').toString().trim().toLowerCase();
            const topCity = (results[0]?.address?.city || '').toString().trim().toLowerCase();
            const topUnit = (results[0]?.address?.unit || '').toString().trim().toLowerCase();
            const currentStreet = (result.address?.street || '').toString().trim().toLowerCase();
            const currentCity = (result.address?.city || '').toString().trim().toLowerCase();
            const currentUnit = (result.address?.unit || '').toString().trim().toLowerCase();
            const isTopResult = index === 0;
            
            // Check if any other results match street, city, and unit (if present) of the top result
            const hasAddressMatch = results.some((r, i) => {
              if (i === 0) return false; // Skip the top result
              
              const rStreetNorm = (r.address?.street || '').toString().trim().toLowerCase();
              const rCityNorm = (r.address?.city || '').toString().trim().toLowerCase();
              const matchStreet = rStreetNorm === topStreet;
              const matchCity = rCityNorm === topCity;
              
              // For unit matching, consider it a match if both have no unit or both have the same unit
              const rUnit = (r.address?.unit || '').toString().trim().toLowerCase();
              const matchUnit = (!topUnit && !rUnit) || (topUnit === rUnit);
              
              return matchStreet && matchCity && matchUnit && topStreet && topCity;
            });
            
            // Check for same name at same address duplicates
            const normalizedFirstName = (result.firstName || '').toString().trim().toLowerCase();
            const normalizedLastName = (result.lastName || '').toString().trim().toLowerCase();
            const hasNameAddressDuplicate = results.some((r, i) => {
              if (i === index) return false; // Skip current result
              
              // Check if names match
              const matchFirstName = ((r.firstName || '').toString().trim().toLowerCase()) === normalizedFirstName;
              const matchLastName = ((r.lastName || '').toString().trim().toLowerCase()) === normalizedLastName;
              
              // Check if addresses match
              const rStreet = (r.address?.street || '').toString().trim().toLowerCase();
              const rCity = (r.address?.city || '').toString().trim().toLowerCase();
              const rUnit = (r.address?.unit || '').toString().trim().toLowerCase();
              
              const matchStreet = rStreet === currentStreet;
              const matchCity = rCity === currentCity;
              const matchUnit = (!currentUnit && !rUnit) || (currentUnit === rUnit);
              
              return matchFirstName && matchLastName && matchStreet && matchCity && matchUnit;
            });
            
            // Highlight logic
            const highlightTop = isTopResult && hasAddressMatch;
            const highlightMatch = !isTopResult && 
                                 topStreet && currentStreet === topStreet && 
                                 topCity && currentCity === topCity &&
                                 ((!topUnit && !currentUnit) || (topUnit === currentUnit));
            
            // Determine border and shadow style
            const borderStyle = highlightTop || highlightMatch
              ? '2px solid #43a047' // Green border for address matches
              : isItemSelected
                ? '2px solid #1976d2' 
                : '1px solid #e0e0e0';
                
            const shadowStyle = highlightTop || highlightMatch
              ? '0 0 8px #43a04755' // Green glow for address matches
              : (typeof document !== 'undefined' && document.activeElement === itemRefs.current[index])
                ? '0 0 0 2px #1976d2'
                : undefined;
            
            return (
              <div 
                key={itemId}
                ref={el => itemRefs.current[index] = el}
                role="option"
                tabIndex={isItemSelected ? 0 : -1}
                aria-selected={isItemSelected}
                onClick={() => onSelectVoter(result)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onSelectVoter(result);
                  }
                }}
                style={{ 
                  margin: '8px 0',
                  borderRadius: '4px',
                  border: borderStyle,
                  boxShadow: shadowStyle,
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                {/* Main content */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: isItemSelected ? '#1976d2' : 'white',
                  color: isItemSelected ? 'white' : 'inherit',
                }}>
                  {/* Avatar */}
                  {/* <div style={{ marginRight: '16px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: isItemSelected ? '#64b5f6' : '#e3f2fd',
                      color: isItemSelected ? 'white' : '#1976d2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold'
                    }}>
                      {(result.firstName?.charAt(0) || '') + (result.lastName?.charAt(0) || '')}
                    </div>
                  </div> */}
                  
                  {/* Text content */}
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ 
                      fontWeight: isItemSelected ? 'bold' : 'normal',
                      fontSize: '16px',
                      marginBottom: '4px',
                      color: isItemSelected ? 'white' : 'rgba(0, 0, 0, 0.87)',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      {/* Use HighlightedText for the name (append title if present) */}
                      {/* Safe display name with optional title */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <HighlightedText 
                          text={(() => {
                            const dn = (result.name && result.name.trim().length > 0)
                              ? result.name
                              : [result.firstName, result.lastName].filter(Boolean).join(' ').trim();
                            const t = result.title && result.title.trim() ? result.title : undefined;
                            return [dn || '-', t].filter(Boolean).join(', ');
                          })()}
                          searchTerms={searchTerms}
                          variant="subtitle1"
                        />
                        {result.voterId === '02DJN1203003' && (
                          <img
                            src="/assets/logo/special-voter.png"
                            alt="special"
                            style={{ width: 28, height: 28, borderRadius: 4, marginLeft: 4 }}
                          />
                        )}
                      </div>
                      {hasNameAddressDuplicate && (
                        <span 
                          title="Multiple voters with same name at this address"
                          style={{
                            fontSize: '36px',
                            color: isItemSelected ? 'white' : '#ff9800',
                            marginLeft: '10px',
                            fontWeight: '900',
                            lineHeight: 1,
                            display: 'flex',
                            alignItems: 'center',
                            textShadow: '0 0 4px #ff9800aa'
                          }}
                        >
                          &#x2757;
                        </span>
                      )}
                    </div>
                    <div style={{ 
                      fontSize: '16px',
                      color: isItemSelected ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.87)'
                    }}>
                      {/* Use HighlightedText for the address */}
                      <HighlightedText 
                        text={[
                          result.address?.street || '',
                          result.address?.unit || '',
                          result.address?.city || '',
                          result.address?.state || ''
                        ].filter(Boolean).join(', ') || '-'}
                        searchTerms={searchTerms}
                        variant="body2"
                      />
                    </div>
                  </div>
                  {/* Expand button */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <button
                      onClick={(e) => handleToggleExpand(itemId, e)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: isItemSelected ? 'white' : '#757575',
                        padding: '24px', // Increase clickable area
                        margin: '-12px',  // Counteract extra padding so layout doesn't shift
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span style={{ fontSize: '30px', pointerEvents: 'none' }}>
                        {expandedItems[itemId] ? '▲' : '▼'}
                      </span>
                    </button>
                  </div>
                </div>
                
                {/* Expanded details section */}
                {expandedItems[itemId] && (
                  <div style={{
                    padding: '16px',
                    backgroundColor: isItemSelected ? '#e3f2fd' : '#f5f5f5',
                    borderTop: '1px solid #e0e0e0'
                  }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                      {/* Personal info section */}
                      <div style={{ flex: '1 1 300px' }}>
                          <div style={{ fontSize: '12px', color: '#757575', marginBottom: '8px' }}>
                            Personal Info
                          </div>
                          <div style={{ marginBottom: '4px' }}>
                            <span style={{ fontWeight: 'bold' }}>First Name:</span>{" "}
                            <HighlightedText 
                              text={result.firstName || '-'} 
                              searchTerms={searchTerms}
                              variant="body2"
                            />
                          </div>
                          <div style={{ marginBottom: '4px' }}>
                            <span style={{ fontWeight: 'bold' }}>Last Name:</span>{" "}
                            <HighlightedText 
                              text={result.lastName || '-'} 
                              searchTerms={searchTerms}
                              variant="body2"
                            />
                          </div>
                          {result.middleName && (
                            <div style={{ marginBottom: '4px' }}>
                              <span style={{ fontWeight: 'bold' }}>Middle Name:</span>{" "}
                              <HighlightedText 
                                text={result.middleName} 
                                searchTerms={searchTerms}
                                variant="body2"
                              />
                            </div>
                          )}
                          <div style={{ marginBottom: '4px' }}>
                            <span style={{ fontWeight: 'bold' }}>DOB:</span>{" "}
                            {result.dateOfBirth || '-'}
                          </div>
                        </div>

                        {/* Address section */}
                        <div style={{ flex: '1 1 300px' }}>
                          <div style={{ fontSize: '12px', color: '#757575', marginBottom: '8px' }}>
                            Address
                          </div>
                          <div style={{ marginBottom: '4px' }}>
                            <span style={{ fontWeight: 'bold' }}>Street:</span>{" "}
                            <HighlightedText 
                              text={result.address?.street || '-'} 
                              searchTerms={searchTerms}
                              variant="body2"
                            />
                          </div>
                          <div style={{ marginBottom: '4px' }}>
                            <span style={{ fontWeight: 'bold' }}>Unit:</span>{" "}
                            <HighlightedText 
                              text={result.address?.unit || '-'} 
                              searchTerms={searchTerms}
                              variant="body2"
                            />
                          </div>
                          <div style={{ marginBottom: '4px' }}>
                            <span style={{ fontWeight: 'bold' }}>City:</span>{" "}
                            <HighlightedText 
                              text={result.address?.city || '-'} 
                              searchTerms={searchTerms}
                              variant="body2"
                            />
                          </div>
                          <div style={{ marginBottom: '4px' }}>
                            <span style={{ fontWeight: 'bold' }}>State/ZIP:</span>{" "}
                            <HighlightedText 
                              text={`${result.address?.state || '-'} ${result.address?.zipCode || ''}`} 
                              searchTerms={searchTerms}
                              variant="body2"
                            />
                          </div>
                        </div>
                    </div>
                    
                    {/* Additional voter information */}
                    {(result.voterId || result.partyAffiliation || result.voterStatus) && (
                      <div style={{ 
                        marginTop: '16px', 
                        paddingTop: '16px', 
                        borderTop: '1px solid #e0e0e0',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}>
                        {result.voterId && (
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: '16px', 
                            fontSize: '12px',
                            backgroundColor: '#f0f0f0',
                            border: '1px solid #ddd'
                          }}>
                            Voter ID: {result.voterId}
                          </span>
                        )}
                        {result.partyAffiliation && (
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: '16px', 
                            fontSize: '12px',
                            backgroundColor: (result.partyAffiliation || '').toLowerCase().includes('dem') ? '#e3f2fd' : 
                                            (result.partyAffiliation || '').toLowerCase().includes('rep') ? '#ffebee' : '#f0f0f0',
                            border: '1px solid #ddd'
                          }}>
                            Party: {result.partyAffiliation}
                          </span>
                        )}
                        {result.voterStatus && (
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: '16px', 
                            fontSize: '12px',
                            backgroundColor: (result.voterStatus || '').toLowerCase().includes('active') ? '#e8f5e9' : '#f0f0f0',
                            border: '1px solid #ddd'
                          }}>
                            Status: {result.voterStatus}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* "Showing top 30 results" message */}
        {totalMatches > 30 && (
          <Card sx={{ 
            p: 2, 
            textAlign: 'center', 
            borderStyle: 'dashed',
            borderColor: 'divider',
            bgcolor: 'background.neutral',
            mt: 2
          }}>
            <Typography variant="body2" color="text.secondary">
              Showing top 30 of {totalMatches.toLocaleString()} results
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.5 }}>
              Refine your search to see more specific matches
            </Typography>
          </Card>
        )}
        
        {/* Keyboard shortcuts help */}
        <Card sx={{ mt: 2, p: 1.5, bgcolor: 'background.neutral' }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Keyboard shortcuts:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Chip size="small" label="↑/↓: Navigate" variant="outlined" />
            <Chip size="small" label="Enter: Select" variant="outlined" />
            <Chip size="small" label="Esc: Back to search" variant="outlined" />
            <Chip size="small" label="W: Illegible" variant="outlined" />
            <Chip size="small" label="A: Failed match" variant="outlined" />
            <Chip size="small" label="D: Wrong Town" variant="outlined" />
          </Box>
        </Card>
      </Box>
    );
  }
);
