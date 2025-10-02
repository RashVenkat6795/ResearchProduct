import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Search, Filter, Globe, Zap } from "lucide-react";

interface FilterPanelProps {
  filters: {
    minPrice: number;
    maxPrice: number;
    maxReviews: number;
    minBSR: number;
    maxBSR: number;
    maxWeight: number;
    excludeAmazonLaunched: boolean;
    excludeFragile: boolean;
    excludeFood: boolean;
    excludeElectronics: boolean;
    excludeSizeVariations: boolean;
    excludeConsumptionLiving: boolean;
  };
  onFilterChange: (filters: any) => void;
  onScrape: () => void;
  onScrapeAll: () => void;
  onComprehensiveScrape: () => void;
  isLoading: boolean;
}

export function FilterPanel({ filters, onFilterChange, onScrape, onScrapeAll, onComprehensiveScrape, isLoading }: FilterPanelProps) {
  const handleInputChange = (field: string, value: string | boolean) => {
    const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
    onFilterChange({
      ...filters,
      [field]: numValue
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Analysis Criteria
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div>
          <Label>Price Range (₹)</Label>
          <div className="flex gap-2 mt-2">
            <div className="flex-1">
              <Label className="text-sm text-muted-foreground">Min (₹300-₹2500)</Label>
              <Input
                type="number"
                placeholder="300"
                value={filters.minPrice || ''}
                onChange={(e) => handleInputChange('minPrice', e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label className="text-sm text-muted-foreground">Max (ideal: ₹500-₹2000)</Label>
              <Input
                type="number"
                placeholder="2500"
                value={filters.maxPrice || ''}
                onChange={(e) => handleInputChange('maxPrice', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div>
          <Label>Maximum Reviews</Label>
          <p className="text-sm text-muted-foreground mb-2">&lt;1000 (ideal: &lt;500)</p>
          <Input
            type="number"
            placeholder="1000"
            value={filters.maxReviews || ''}
            onChange={(e) => handleInputChange('maxReviews', e.target.value)}
          />
        </div>

        {/* BSR Range */}
        <div>
          <Label>BSR Range</Label>
          <div className="flex gap-2 mt-2">
            <div className="flex-1">
              <Label className="text-sm text-muted-foreground">Min (100-5000)</Label>
              <Input
                type="number"
                placeholder="100"
                value={filters.minBSR || ''}
                onChange={(e) => handleInputChange('minBSR', e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label className="text-sm text-muted-foreground">Max (ideal: 200-2000)</Label>
              <Input
                type="number"
                placeholder="5000"
                value={filters.maxBSR || ''}
                onChange={(e) => handleInputChange('maxBSR', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Weight */}
        <div>
          <Label>Maximum Weight (kg)</Label>
          <p className="text-sm text-muted-foreground mb-2">&lt;2kg (ideal: &lt;1kg)</p>
          <Input
            type="number"
            step="0.1"
            placeholder="2"
            value={filters.maxWeight || ''}
            onChange={(e) => handleInputChange('maxWeight', e.target.value)}
          />
        </div>

        {/* Exclusions */}
        <div>
          <Label>Exclude Categories</Label>
          <div className="space-y-3 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="amazon-launched"
                checked={filters.excludeAmazonLaunched}
                onCheckedChange={(checked) => handleInputChange('excludeAmazonLaunched', checked)}
              />
              <Label htmlFor="amazon-launched" className="text-sm">Amazon launched products</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="fragile"
                checked={filters.excludeFragile}
                onCheckedChange={(checked) => handleInputChange('excludeFragile', checked)}
              />
              <Label htmlFor="fragile" className="text-sm">Fragile items</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="food"
                checked={filters.excludeFood}
                onCheckedChange={(checked) => handleInputChange('excludeFood', checked)}
              />
              <Label htmlFor="food" className="text-sm">Food items</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="electronics"
                checked={filters.excludeElectronics}
                onCheckedChange={(checked) => handleInputChange('excludeElectronics', checked)}
              />
              <Label htmlFor="electronics" className="text-sm">Electronics</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="size-variations"
                checked={filters.excludeSizeVariations}
                onCheckedChange={(checked) => handleInputChange('excludeSizeVariations', checked)}
              />
              <Label htmlFor="size-variations" className="text-sm">Size variations</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="consumption-living"
                checked={filters.excludeConsumptionLiving}
                onCheckedChange={(checked) => handleInputChange('excludeConsumptionLiving', checked)}
              />
              <Label htmlFor="consumption-living" className="text-sm">Consumption/Living objects</Label>
            </div>
          </div>
        </div>

        {/* Scrape Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={onScrape} 
            className="w-full" 
            disabled={isLoading}
          >
            <Search className="w-4 h-4 mr-2" />
            {isLoading ? 'Scraping...' : 'Scrape Products'}
          </Button>
          
          <Button
            onClick={onScrapeAll}
            className="w-full" 
            variant="outline"
            disabled={isLoading}
          >
            <Globe className="w-4 h-4 mr-2" />
            {isLoading ? 'Scraping...' : 'Scrape All Products'}
          </Button>

          <Button
            onClick={onComprehensiveScrape}
            className="w-full" 
            variant="secondary"
            disabled={isLoading}
          >
            <Zap className="w-4 h-4 mr-2" />
            {isLoading ? 'Scraping...' : 'Comprehensive Scrape'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}