import { useState, useMemo, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Voter } from '@/types/voter';
import { Search, ArrowUpDown, Copy, ChevronLeft, ChevronRight, ClipboardCopy, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { searchVoters } from '@/lib/api';

interface AdvancedSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectVoter: (voter: Voter) => void;
}

type SortField = 'firstName' | 'lastName' | 'streetName' | 'streetNumber';
type SortOrder = 'asc' | 'desc';
type MatchType = 'Starts' | 'Within' | 'Ends';

export function AdvancedSearchModal({ open, onOpenChange, onSelectVoter }: AdvancedSearchModalProps) {
  const { toast } = useToast();
  
  const [filters, setFilters] = useState({
    firstName: '',
    lastName: '',
    streetNumber: '',
    streetName: ''
  });

  const [matchers, setMatchers] = useState<{
    firstName: MatchType;
    lastName: MatchType;
    streetName: MatchType;
  }>({
    firstName: 'Starts',
    lastName: 'Starts',
    streetName: 'Starts'
  });

  const [sortConfig, setSortConfig] = useState<{ field: SortField; order: SortOrder }>({
    field: 'lastName',
    order: 'asc'
  });

  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [triggeredSearch, setTriggeredSearch] = useState(false);
  const [results, setResults] = useState<Voter[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, pageSize, matchers]);

  // Reset search when modal opens
  useEffect(() => {
    if (open) {
      setTriggeredSearch(false);
      setResults([]);
      setFilters({
        firstName: '',
        lastName: '',
        streetNumber: '',
        streetName: ''
      });
    }
  }, [open]);

  const handleSort = (field: SortField) => {
    setSortConfig(current => ({
      field,
      order: current.field === field && current.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSearch = async () => {
    setTriggeredSearch(true);
    setIsSearching(true);
    
    try {
      const searchParams: any = {};
      
      if (filters.firstName) {
        searchParams.firstName = {
          value: filters.firstName,
          match: matchers.firstName.toLowerCase() as 'starts' | 'within' | 'ends'
        };
      }
      
      if (filters.lastName) {
        searchParams.lastName = {
          value: filters.lastName,
          match: matchers.lastName.toLowerCase() as 'starts' | 'within' | 'ends'
        };
      }
      
      if (filters.streetNumber) {
        searchParams.streetNumber = filters.streetNumber;
      }
      
      if (filters.streetName) {
        searchParams.streetName = {
          value: filters.streetName,
          match: matchers.streetName.toLowerCase() as 'starts' | 'within' | 'ends'
        };
      }
      
      const voters = await searchVoters(searchParams);
      setResults(voters);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Failed",
        description: "Failed to search voters. Please check your connection.",
        variant: "destructive"
      });
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const sortedResults = useMemo(() => {
    const result = [...results];
    result.sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';

      switch (sortConfig.field) {
        case 'firstName':
          aValue = a.firstName.toLowerCase();
          bValue = b.firstName.toLowerCase();
          break;
        case 'lastName':
          aValue = a.lastName.toLowerCase();
          bValue = b.lastName.toLowerCase();
          break;
        case 'streetNumber':
          aValue = parseInt(a.address.streetNumber) || a.address.streetNumber;
          bValue = parseInt(b.address.streetNumber) || b.address.streetNumber;
          break;
        case 'streetName':
          aValue = a.address.street.toLowerCase();
          bValue = b.address.street.toLowerCase();
          break;
      }

      if (aValue < bValue) return sortConfig.order === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.order === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [results, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedResults.length / pageSize);
  const paginatedVoters = sortedResults.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleCopyToClipboard = (voter: Voter, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `${voter.firstName} ${voter.lastName}\n${voter.address.streetNumber} ${voter.address.street}, ${voter.address.city}, ${voter.address.state} ${voter.address.zipCode}`;
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: `Copied details for ${voter.firstName} ${voter.lastName}`,
    });
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortConfig.field !== field) return <ArrowUpDown className="ml-2 h-4 w-4 text-slate-400 opacity-50" />;
    return <ArrowUpDown className={`ml-2 h-4 w-4 ${sortConfig.order === 'asc' ? 'text-blue-600' : 'text-blue-600 transform rotate-180'}`} />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[50vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 pb-2 border-b bg-white shrink-0">
          <DialogTitle className="text-lg flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-600" />
            Advanced Voter Search
          </DialogTitle>
          <DialogDescription className="text-xs">
            Search the database using specific matching criteria.
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 bg-slate-50 border-b space-y-3 shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            {/* First Name */}
            <div className="md:col-span-3 space-y-1">
              <Label htmlFor="adv-firstName" className="text-[10px] font-semibold uppercase text-slate-500">First Name</Label>
              <div className="flex">
                <Select 
                  value={matchers.firstName} 
                  onValueChange={(val: MatchType) => setMatchers(prev => ({ ...prev, firstName: val }))}
                >
                  <SelectTrigger className="h-8 text-xs w-[85px] rounded-r-none border-r-0 bg-slate-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Starts">Starts</SelectItem>
                    <SelectItem value="Within">Within</SelectItem>
                    <SelectItem value="Ends">Ends</SelectItem>
                  </SelectContent>
                </Select>
                <Input 
                  id="adv-firstName"
                  placeholder="Search..." 
                  value={filters.firstName}
                  onChange={(e) => setFilters(prev => ({ ...prev, firstName: e.target.value }))}
                  className="h-8 bg-white rounded-l-none text-xs"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>

            {/* Last Name */}
            <div className="md:col-span-3 space-y-1">
              <Label htmlFor="adv-lastName" className="text-[10px] font-semibold uppercase text-slate-500">Last Name</Label>
              <div className="flex">
                <Select 
                  value={matchers.lastName} 
                  onValueChange={(val: MatchType) => setMatchers(prev => ({ ...prev, lastName: val }))}
                >
                  <SelectTrigger className="h-8 text-xs w-[85px] rounded-r-none border-r-0 bg-slate-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Starts">Starts</SelectItem>
                    <SelectItem value="Within">Within</SelectItem>
                    <SelectItem value="Ends">Ends</SelectItem>
                  </SelectContent>
                </Select>
                <Input 
                  id="adv-lastName"
                  placeholder="Search..." 
                  value={filters.lastName}
                  onChange={(e) => setFilters(prev => ({ ...prev, lastName: e.target.value }))}
                  className="h-8 bg-white rounded-l-none text-xs"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>

            {/* Street Number - No matcher needed usually, but keeping consistent height */}
            <div className="md:col-span-2 space-y-1">
              <Label htmlFor="adv-streetNum" className="text-[10px] font-semibold uppercase text-slate-500">Street #</Label>
              <Input 
                id="adv-streetNum"
                placeholder="#" 
                value={filters.streetNumber}
                onChange={(e) => setFilters(prev => ({ ...prev, streetNumber: e.target.value }))}
                className="h-8 bg-white text-xs"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>

            {/* Street Name */}
            <div className="md:col-span-3 space-y-1">
              <Label htmlFor="adv-streetName" className="text-[10px] font-semibold uppercase text-slate-500">Street Name</Label>
              <div className="flex">
                <Select 
                  value={matchers.streetName} 
                  onValueChange={(val: MatchType) => setMatchers(prev => ({ ...prev, streetName: val }))}
                >
                  <SelectTrigger className="h-8 text-xs w-[85px] rounded-r-none border-r-0 bg-slate-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Starts">Starts</SelectItem>
                    <SelectItem value="Within">Within</SelectItem>
                    <SelectItem value="Ends">Ends</SelectItem>
                  </SelectContent>
                </Select>
                <Input 
                  id="adv-streetName"
                  placeholder="Search..." 
                  value={filters.streetName}
                  onChange={(e) => setFilters(prev => ({ ...prev, streetName: e.target.value }))}
                  className="h-8 bg-white rounded-l-none text-xs"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="md:col-span-1">
              <Button 
                size="sm" 
                className="w-full h-8 bg-blue-600 hover:bg-blue-700 text-xs" 
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Searching...
                  </>
                ) : (
                  'Search'
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col bg-white min-h-0">
          <div className="px-4 py-2 flex justify-between items-center border-b shrink-0 bg-slate-50/50">
             <div className="text-xs text-slate-500">
               {triggeredSearch ? (
                 <>Found <span className="font-medium text-slate-900">{sortedResults.length}</span> results</>
               ) : (
                 "Enter criteria and click Search"
               )}
             </div>
             <div className="flex items-center gap-2">
               <span className="text-[10px] text-slate-500 uppercase font-semibold">Per page:</span>
               <Select value={pageSize.toString()} onValueChange={(v) => setPageSize(Number(v))}>
                 <SelectTrigger className="h-6 w-[60px] text-xs">
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="10">10</SelectItem>
                   <SelectItem value="20">20</SelectItem>
                   <SelectItem value="30">30</SelectItem>
                 </SelectContent>
               </Select>
             </div>
          </div>

          <ScrollArea className="flex-1">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0 z-10">
                <TableRow className="h-8 hover:bg-slate-50">
                  <TableHead className="h-8 py-1 text-xs font-semibold cursor-pointer hover:bg-slate-100 w-[20%]" onClick={() => handleSort('firstName')}>
                    <div className="flex items-center">First Name <SortIcon field="firstName" /></div>
                  </TableHead>
                  <TableHead className="h-8 py-1 text-xs font-semibold cursor-pointer hover:bg-slate-100 w-[20%]" onClick={() => handleSort('lastName')}>
                    <div className="flex items-center">Last Name <SortIcon field="lastName" /></div>
                  </TableHead>
                  <TableHead className="h-8 py-1 text-xs font-semibold cursor-pointer hover:bg-slate-100 w-[10%]" onClick={() => handleSort('streetNumber')}>
                    <div className="flex items-center">St # <SortIcon field="streetNumber" /></div>
                  </TableHead>
                  <TableHead className="h-8 py-1 text-xs font-semibold cursor-pointer hover:bg-slate-100 w-[25%]" onClick={() => handleSort('streetName')}>
                    <div className="flex items-center">Street Name <SortIcon field="streetName" /></div>
                  </TableHead>
                  <TableHead className="h-8 py-1 text-xs font-semibold w-[15%]">City</TableHead>
                  <TableHead className="h-8 py-1 text-xs font-semibold w-[10%] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!triggeredSearch ? (
                   <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-slate-400 text-xs">
                      Enter search terms above to find voters.
                    </TableCell>
                  </TableRow>
                ) : paginatedVoters.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-slate-500 text-xs">
                      No voters found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedVoters.map((voter) => (
                    <TableRow key={voter._id} className="hover:bg-slate-50 group h-9">
                      <TableCell className="py-1 text-xs font-medium">{voter.firstName}</TableCell>
                      <TableCell className="py-1 text-xs font-medium">{voter.lastName}</TableCell>
                      <TableCell className="py-1 text-xs">{voter.address.streetNumber}</TableCell>
                      <TableCell className="py-1 text-xs">{voter.address.street}</TableCell>
                      <TableCell className="py-1 text-xs">{voter.address.city}</TableCell>
                      <TableCell className="py-1 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-6 w-6 text-slate-500 hover:text-blue-600"
                            onClick={(e) => handleCopyToClipboard(voter, e)}
                            title="Copy to Clipboard"
                          >
                            <ClipboardCopy className="w-3 h-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            className="h-6 px-2 text-[10px] bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                            onClick={() => {
                              onSelectVoter(voter);
                            }}
                          >
                            Select
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>

        <div className="p-2 px-4 border-t bg-slate-50 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            Page {currentPage} of {totalPages || 1}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs px-2"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-3 w-3 mr-1" />
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs px-2"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
