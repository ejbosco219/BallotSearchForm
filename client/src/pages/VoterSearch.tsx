import React, { useState, useEffect } from "react";
import { mockBallotSheets, mockVoters, BallotSheetItem, Voter } from "@/data/mockData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  MapPin,
  Database,
  FileText,
  Filter
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type MatchType = "Starts" | "Within" | "Ends";

interface SearchFormData {
  firstName: string;
  lastName: string;
  streetNumber: string;
  streetName: string;
}

interface SearchFormMatchers {
  firstName: MatchType;
  lastName: MatchType;
  streetName: MatchType;
}

export default function VoterSearch() {
  // State for Ballot Sheet Navigation
  const [currentBallotIndex, setCurrentBallotIndex] = useState(0);
  const currentBallot = mockBallotSheets[currentBallotIndex];

  // State for Form
  const [formData, setFormData] = useState<SearchFormData>({
    firstName: "",
    lastName: "",
    streetNumber: "",
    streetName: ""
  });

  const [matchers, setMatchers] = useState<SearchFormMatchers>({
    firstName: "Starts",
    lastName: "Starts",
    streetName: "Starts"
  });

  // State for Results
  const [results, setResults] = useState<Voter[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Effect to prefill form when ballot changes
  useEffect(() => {
    if (currentBallot) {
      // Split name assuming "First Last" roughly, or just simple split
      const nameParts = currentBallot.nameprinted.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      setFormData({
        firstName: firstName,
        lastName: lastName,
        streetNumber: currentBallot.registeredaddress.streetNumber,
        streetName: currentBallot.registeredaddress.streetName
      });
      // Reset results when ballot changes? Maybe, to avoid confusion.
      setResults([]);
      setHasSearched(false);
    }
  }, [currentBallotIndex, currentBallot]);

  const handleNextBallot = () => {
    if (currentBallotIndex < mockBallotSheets.length - 1) {
      setCurrentBallotIndex(prev => prev + 1);
    }
  };

  const handlePrevBallot = () => {
    if (currentBallotIndex > 0) {
      setCurrentBallotIndex(prev => prev - 1);
    }
  };

  const handleInputChange = (field: keyof SearchFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMatcherChange = (field: keyof SearchFormMatchers, value: MatchType) => {
    setMatchers(prev => ({ ...prev, [field]: value }));
  };

  const generateQueryString = () => {
    const parts = [];
    if (formData.firstName) parts.push(`firstName ${matchers.firstName.toLowerCase()} "${formData.firstName}"`);
    if (formData.lastName) parts.push(`lastName ${matchers.lastName.toLowerCase()} "${formData.lastName}"`);
    if (formData.streetNumber) parts.push(`streetNumber == "${formData.streetNumber}"`);
    if (formData.streetName) parts.push(`streetName ${matchers.streetName.toLowerCase()} "${formData.streetName}"`);
    
    return parts.length > 0 ? parts.join(" AND ") : "Empty Query";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filtering Logic
    const filtered = mockVoters.filter(voter => {
      // First Name Match
      const fnInput = formData.firstName.toLowerCase();
      const fnTarget = voter.firstName.toLowerCase();
      let fnMatch = true;
      if (fnInput) {
        if (matchers.firstName === "Starts") fnMatch = fnTarget.startsWith(fnInput);
        else if (matchers.firstName === "Within") fnMatch = fnTarget.includes(fnInput);
        else if (matchers.firstName === "Ends") fnMatch = fnTarget.endsWith(fnInput);
      }

      // Last Name Match
      const lnInput = formData.lastName.toLowerCase();
      const lnTarget = voter.lastName.toLowerCase();
      let lnMatch = true;
      if (lnInput) {
        if (matchers.lastName === "Starts") lnMatch = lnTarget.startsWith(lnInput);
        else if (matchers.lastName === "Within") lnMatch = lnTarget.includes(lnInput);
        else if (matchers.lastName === "Ends") lnMatch = lnTarget.endsWith(lnInput);
      }

      // Street Number Match (Exact)
      const snNumInput = formData.streetNumber;
      const snNumTarget = voter.address.streetNumber;
      let snNumMatch = true;
      if (snNumInput) {
        snNumMatch = snNumTarget === snNumInput;
      }

      // Street Name Match
      const stInput = formData.streetName.toLowerCase();
      const stTarget = voter.address.street.toLowerCase();
      let stMatch = true;
      if (stInput) {
        if (matchers.streetName === "Starts") stMatch = stTarget.startsWith(stInput);
        else if (matchers.streetName === "Within") stMatch = stTarget.includes(stInput);
        else if (matchers.streetName === "Ends") stMatch = stTarget.endsWith(stInput);
      }

      return fnMatch && lnMatch && snNumMatch && stMatch;
    });

    setResults(filtered);
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Voter Validation</h1>
            <p className="text-slate-500">Match ballot sheet entries to the voter registration database.</p>
          </div>
          <div className="flex items-center gap-2">
             <Badge variant="outline" className="px-3 py-1 bg-white text-slate-600 border-slate-200">
               <Database className="w-3 h-3 mr-2" /> Connected
             </Badge>
          </div>
        </div>

        {/* Ballot Sheet Viewer */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-100/50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <FileText className="w-4 h-4 text-blue-600" />
              Ballot Sheet Entry
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wider mr-2">
                Record {currentBallotIndex + 1} of {mockBallotSheets.length}
              </span>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8" 
                onClick={handlePrevBallot}
                disabled={currentBallotIndex === 0}
                data-testid="button-prev-ballot"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8" 
                onClick={handleNextBallot}
                disabled={currentBallotIndex === mockBallotSheets.length - 1}
                data-testid="button-next-ballot"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <CardContent className="p-6 grid md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Name Printed</h3>
              <div className="text-2xl font-medium text-slate-900 flex items-center gap-3" data-testid="text-ballot-name">
                {currentBallot.nameprinted}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Registered Address</h3>
              <div className="text-xl text-slate-700 flex items-center gap-2" data-testid="text-ballot-address">
                <MapPin className="w-4 h-4 text-slate-400" />
                {currentBallot.registeredaddress.streetNumber} {currentBallot.registeredaddress.streetName}, {currentBallot.registeredaddress.city}, {currentBallot.registeredaddress.state} {currentBallot.registeredaddress.zip}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Search Form */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-slate-200 shadow-sm h-full">
              <CardHeader className="bg-white border-b border-slate-100 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="w-4 h-4 text-blue-600" />
                  Database Search
                </CardTitle>
                <CardDescription>
                  Find the voter in the database.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* First Name */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-500 uppercase">First Name</Label>
                    <div className="flex gap-2">
                      <div className="w-1/3 shrink-0">
                        <Select 
                          value={matchers.firstName} 
                          onValueChange={(val: MatchType) => handleMatcherChange("firstName", val)}
                        >
                          <SelectTrigger className="h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Starts">Starts</SelectItem>
                            <SelectItem value="Within">Within</SelectItem>
                            <SelectItem value="Ends">Ends</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Input 
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="h-9 flex-1 font-medium"
                        placeholder="First Name"
                        data-testid="input-firstname"
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-500 uppercase">Last Name</Label>
                    <div className="flex gap-2">
                      <div className="w-1/3 shrink-0">
                        <Select 
                          value={matchers.lastName} 
                          onValueChange={(val: MatchType) => handleMatcherChange("lastName", val)}
                        >
                          <SelectTrigger className="h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Starts">Starts</SelectItem>
                            <SelectItem value="Within">Within</SelectItem>
                            <SelectItem value="Ends">Ends</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Input 
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="h-9 flex-1 font-medium"
                        placeholder="Last Name"
                        data-testid="input-lastname"
                      />
                    </div>
                  </div>

                  <Separator className="my-2" />

                  {/* Street Number (No Matcher) */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-500 uppercase">Street Number</Label>
                    <Input 
                      value={formData.streetNumber}
                      onChange={(e) => handleInputChange("streetNumber", e.target.value)}
                      className="h-9 font-medium"
                      placeholder="123"
                      data-testid="input-streetnumber"
                    />
                  </div>

                  {/* Street Name */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-500 uppercase">Street Name</Label>
                    <div className="flex gap-2">
                      <div className="w-1/3 shrink-0">
                        <Select 
                          value={matchers.streetName} 
                          onValueChange={(val: MatchType) => handleMatcherChange("streetName", val)}
                        >
                          <SelectTrigger className="h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Starts">Starts</SelectItem>
                            <SelectItem value="Within">Within</SelectItem>
                            <SelectItem value="Ends">Ends</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Input 
                        value={formData.streetName}
                        onChange={(e) => handleInputChange("streetName", e.target.value)}
                        className="h-9 flex-1 font-medium"
                        placeholder="Main St"
                        data-testid="input-streetname"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="bg-slate-50 p-3 rounded-md border border-slate-200 mb-4 text-xs font-mono text-slate-600 break-all">
                      <span className="font-bold text-blue-600">QUERY: </span>
                      {generateQueryString()}
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 shadow-md" data-testid="button-submit">
                      <Search className="w-4 h-4 mr-2" />
                      Search Database
                    </Button>
                  </div>

                </form>
              </CardContent>
            </Card>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-2">
            <Card className="border-slate-200 shadow-sm h-full flex flex-col">
              <CardHeader className="bg-white border-b border-slate-100 pb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">Search Results</CardTitle>
                    <CardDescription>
                      {hasSearched 
                        ? `Found ${results.length} potential matches` 
                        : "Submit search to view results"}
                    </CardDescription>
                  </div>
                  {hasSearched && (
                    <Badge variant={results.length > 0 ? "default" : "secondary"} className={results.length > 0 ? "bg-green-600 hover:bg-green-700" : ""}>
                      {results.length} Matches
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1">
                {!hasSearched ? (
                  <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                    <Filter className="w-12 h-12 mb-3 opacity-20" />
                    <p>Enter search criteria and click Submit</p>
                  </div>
                ) : results.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-slate-500">
                    <Search className="w-12 h-12 mb-3 opacity-20" />
                    <p>No voters found matching your criteria</p>
                    <Button variant="link" className="text-blue-600" onClick={() => {
                      setMatchers({ firstName: "Within", lastName: "Within", streetName: "Within" });
                    }}>
                      Try relaxing search to "Within"
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 hover:bg-slate-50">
                        <TableHead>Voter ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Party</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((voter) => (
                        <TableRow key={voter._id} className="hover:bg-blue-50/50 transition-colors">
                          <TableCell className="font-mono text-xs text-slate-500">{voter.voterId}</TableCell>
                          <TableCell className="font-medium text-slate-900">
                            {voter.firstName} {voter.lastName}
                          </TableCell>
                          <TableCell className="text-slate-600">
                            {voter.address.streetNumber} {voter.address.street}, {voter.address.city}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-normal text-slate-600">
                              {voter.partyAffiliation}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost" className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-100">
                              Select
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
