import { useState, useMemo, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockVoters, Voter } from '@/data/mockData';
import { Search, ArrowUpDown, Copy, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AdvancedSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectVoter: (voter: Voter) => void;
}

type SortField = 'firstName' | 'lastName' | 'streetName' | 'streetNumber';
type SortOrder = 'asc' | 'desc';

export function AdvancedSearchModal({ open, onOpenChange, onSelectVoter }: AdvancedSearchModalProps) {
  const [filters, setFilters] = useState({
    firstName: '',
    lastName: '',
    streetNumber: '',
    streetName: ''
  });

  const [sortConfig, setSortConfig] = useState<{ field: SortField; order: SortOrder }>({
    field: 'lastName',
    order: 'asc'
  });

  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, pageSize]);

  const handleSort = (field: SortField) => {
    setSortConfig(current => ({
      field,
      order: current.field === field && current.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredAndSortedVoters = useMemo(() => {
    let result = [...mockVoters];

    // Filter
    if (filters.firstName) {
      result = result.filter(v => v.firstName.toLowerCase().includes(filters.firstName.toLowerCase()));
    }
    if (filters.lastName) {
      result = result.filter(v => v.lastName.toLowerCase().includes(filters.lastName.toLowerCase()));
    }
    if (filters.streetNumber) {
      result = result.filter(v => v.address.streetNumber.includes(filters.streetNumber));
    }
    if (filters.streetName) {
      result = result.filter(v => v.address.street.toLowerCase().includes(filters.streetName.toLowerCase()));
    }

    // Sort
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
          // Try to sort numerically if possible
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
  }, [filters, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedVoters.length / pageSize);
  const paginatedVoters = filteredAndSortedVoters.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortConfig.field !== field) return <ArrowUpDown className="ml-2 h-4 w-4 text-slate-400 opacity-50" />;
    return <ArrowUpDown className={`ml-2 h-4 w-4 ${sortConfig.order === 'asc' ? 'text-blue-600' : 'text-blue-600 transform rotate-180'}`} />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b bg-white">
          <DialogTitle className="text-xl flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            Advanced Voter Search
          </DialogTitle>
          <DialogDescription>
            Search the entire voter database with advanced filtering and sorting options.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 bg-slate-50 border-b space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="adv-firstName" className="text-xs font-semibold uppercase text-slate-500">First Name</Label>
              <Input 
                id="adv-firstName"
                placeholder="Filter by first name..." 
                value={filters.firstName}
                onChange={(e) => setFilters(prev => ({ ...prev, firstName: e.target.value }))}
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adv-lastName" className="text-xs font-semibold uppercase text-slate-500">Last Name</Label>
              <Input 
                id="adv-lastName"
                placeholder="Filter by last name..." 
                value={filters.lastName}
                onChange={(e) => setFilters(prev => ({ ...prev, lastName: e.target.value }))}
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adv-streetNum" className="text-xs font-semibold uppercase text-slate-500">Street Number</Label>
              <Input 
                id="adv-streetNum"
                placeholder="Filter by number..." 
                value={filters.streetNumber}
                onChange={(e) => setFilters(prev => ({ ...prev, streetNumber: e.target.value }))}
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adv-streetName" className="text-xs font-semibold uppercase text-slate-500">Street Name</Label>
              <Input 
                id="adv-streetName"
                placeholder="Filter by street name..." 
                value={filters.streetName}
                onChange={(e) => setFilters(prev => ({ ...prev, streetName: e.target.value }))}
                className="bg-white"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col bg-white min-h-[300px]">
          <div className="p-4 flex justify-between items-center border-b">
             <div className="text-sm text-slate-500">
               Showing <span className="font-medium text-slate-900">{filteredAndSortedVoters.length}</span> results
             </div>
             <div className="flex items-center gap-2">
               <span className="text-xs text-slate-500">Results per page:</span>
               <Select value={pageSize.toString()} onValueChange={(v) => setPageSize(Number(v))}>
                 <SelectTrigger className="h-8 w-[70px]">
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
                <TableRow>
                  <TableHead className="cursor-pointer hover:bg-slate-100" onClick={() => handleSort('firstName')}>
                    <div className="flex items-center">First Name <SortIcon field="firstName" /></div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-slate-100" onClick={() => handleSort('lastName')}>
                    <div className="flex items-center">Last Name <SortIcon field="lastName" /></div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-slate-100" onClick={() => handleSort('streetNumber')}>
                    <div className="flex items-center">St # <SortIcon field="streetNumber" /></div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-slate-100" onClick={() => handleSort('streetName')}>
                    <div className="flex items-center">Street Name <SortIcon field="streetName" /></div>
                  </TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedVoters.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                      No voters found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedVoters.map((voter) => (
                    <TableRow key={voter._id} className="hover:bg-slate-50 group">
                      <TableCell className="font-medium">{voter.firstName}</TableCell>
                      <TableCell className="font-medium">{voter.lastName}</TableCell>
                      <TableCell>{voter.address.streetNumber}</TableCell>
                      <TableCell>{voter.address.street}</TableCell>
                      <TableCell>{voter.address.city}</TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="h-8 gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                          onClick={() => {
                            onSelectVoter(voter);
                            onOpenChange(false);
                          }}
                        >
                          <Copy className="w-3.5 h-3.5" />
                          Copy Action
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>

        <div className="p-4 border-t bg-slate-50 flex items-center justify-between">
          <div className="text-sm text-slate-500">
            Page {currentPage} of {totalPages || 1}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
