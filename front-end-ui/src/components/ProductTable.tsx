import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ExternalLink, CheckCircle, XCircle } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  reviews: number;
  bsr: number;
  weight: number;
  category: string;
  brandingPotential: 'Low' | 'Medium' | 'High';
  url: string;
  isAmazonLaunched: boolean;
  isFragile: boolean;
  isFood: boolean;
  isElectronics: boolean;
  hasSizeVariations: boolean;
}

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
}

export function ProductTable({ products, isLoading }: ProductTableProps) {
  const getBadgeVariant = (value: number, ideal: { min?: number; max?: number }) => {
    if (ideal.min && ideal.max) {
      return value >= ideal.min && value <= ideal.max ? 'default' : 'secondary';
    }
    if (ideal.max) {
      return value <= ideal.max ? 'default' : 'secondary';
    }
    return 'secondary';
  };

  const getBrandingBadgeVariant = (potential: string) => {
    return potential === 'Low' ? 'default' : 'secondary';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Scraping Amazon products...</p>
        </CardContent>
      </Card>
    );
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No products found. Click "Scrape Products" to start searching.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Found {products.length} Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price (₹)</TableHead>
                <TableHead>Reviews</TableHead>
                <TableHead>BSR</TableHead>
                <TableHead>Weight (kg)</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Branding</TableHead>
                <TableHead>Compliance</TableHead>
                <TableHead>Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="max-w-[200px]">
                    <div className="truncate" title={product.name}>
                      {product.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(product.price, { min: 500, max: 2000 })}>
                      ₹{product.price.toLocaleString()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(product.reviews, { max: 500 })}>
                      {product.reviews}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(product.bsr, { min: 200, max: 2000 })}>
                      {product.bsr.toLocaleString()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(product.weight, { max: 1 })}>
                      {product.weight}kg
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{product.category}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBrandingBadgeVariant(product.brandingPotential)}>
                      {product.brandingPotential}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {!product.isAmazonLaunched && !product.isFragile && !product.isFood && 
                       !product.isElectronics && !product.hasSizeVariations ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-3 h-3" />
                          <span className="text-xs">Compliant</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-600">
                          <XCircle className="w-3 h-3" />
                          <span className="text-xs">Issues</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <a 
                      href={product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}