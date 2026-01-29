import { useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, Download } from 'lucide-react';
import { toast } from 'sonner';

interface ParsedProduct {
  name: string;
  gender: string;
  fit: string;
  size: string;
  wash: string;
  price: number;
  stockLevel: number;
  isValid: boolean;
  errors: string[];
}

interface ImportCsvDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (products: ParsedProduct[]) => void;
}

const ImportCsvDialog = ({ open, onOpenChange, onImport }: ImportCsvDialogProps) => {
  const { language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsedProducts, setParsedProducts] = useState<ParsedProduct[]>([]);
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const validGenders = ['Men', 'Women'];
  const validFits = ['Slim', 'Skinny', 'Relaxed'];

  const validateProduct = (row: string[], rowIndex: number): ParsedProduct => {
    const errors: string[] = [];
    
    const [name, gender, fit, size, wash, priceStr, stockStr] = row.map(cell => cell?.trim() || '');

    // Validate required fields
    if (!name) errors.push(language === 'en' ? 'Name is required' : 'নাম আবশ্যক');
    if (!gender) errors.push(language === 'en' ? 'Gender is required' : 'লিঙ্গ আবশ্যক');
    else if (!validGenders.includes(gender)) errors.push(language === 'en' ? 'Gender must be Men or Women' : 'লিঙ্গ Men বা Women হতে হবে');
    if (!fit) errors.push(language === 'en' ? 'Fit is required' : 'ফিট আবশ্যক');
    else if (!validFits.includes(fit)) errors.push(language === 'en' ? 'Fit must be Slim, Skinny, or Relaxed' : 'ফিট Slim, Skinny, বা Relaxed হতে হবে');
    if (!size) errors.push(language === 'en' ? 'Size is required' : 'সাইজ আবশ্যক');
    if (!wash) errors.push(language === 'en' ? 'Wash is required' : 'ওয়াশ আবশ্যক');
    
    const price = parseFloat(priceStr);
    if (isNaN(price) || price < 0) errors.push(language === 'en' ? 'Invalid price' : 'অবৈধ মূল্য');
    
    const stockLevel = parseInt(stockStr, 10);
    if (isNaN(stockLevel) || stockLevel < 0) errors.push(language === 'en' ? 'Invalid stock level' : 'অবৈধ স্টক স্তর');

    return {
      name: name || `Row ${rowIndex + 1}`,
      gender: gender || '',
      fit: fit || '',
      size: size || '',
      wash: wash || '',
      price: isNaN(price) ? 0 : price,
      stockLevel: isNaN(stockLevel) ? 0 : stockLevel,
      isValid: errors.length === 0,
      errors,
    };
  };

  const parseCsvContent = (content: string): ParsedProduct[] => {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length < 2) return []; // Need at least header + 1 row

    // Skip header row
    const dataRows = lines.slice(1);
    
    return dataRows.map((line, index) => {
      // Handle CSV parsing with quoted fields
      const cells: string[] = [];
      let currentCell = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          cells.push(currentCell);
          currentCell = '';
        } else {
          currentCell += char;
        }
      }
      cells.push(currentCell);

      return validateProduct(cells, index);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error(language === 'en' ? 'Please select a CSV file' : 'একটি CSV ফাইল নির্বাচন করুন');
      return;
    }

    setIsProcessing(true);
    setFileName(file.name);

    try {
      const content = await file.text();
      const products = parseCsvContent(content);
      setParsedProducts(products);

      if (products.length === 0) {
        toast.error(language === 'en' ? 'No valid data found in CSV' : 'CSV-এ কোন বৈধ ডেটা পাওয়া যায়নি');
      }
    } catch (error) {
      toast.error(language === 'en' ? 'Error reading file' : 'ফাইল পড়তে ত্রুটি');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = () => {
    const validProducts = parsedProducts.filter(p => p.isValid);
    if (validProducts.length === 0) {
      toast.error(language === 'en' ? 'No valid products to import' : 'আমদানি করার জন্য কোন বৈধ পণ্য নেই');
      return;
    }

    onImport(validProducts);
    toast.success(
      language === 'en' 
        ? `Successfully imported ${validProducts.length} products` 
        : `সফলভাবে ${validProducts.length}টি পণ্য আমদানি করা হয়েছে`
    );
    handleClose();
  };

  const handleClose = () => {
    setParsedProducts([]);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onOpenChange(false);
  };

  const downloadTemplate = () => {
    const headers = 'Product Name,Gender,Fit,Size,Wash,Price,Stock Level';
    const example1 = 'Classic Blue Jean,Men,Slim,32,Dark Wash,89.99,50';
    const example2 = 'High Rise Skinny,Women,Skinny,28,Light Wash,79.99,35';
    const csvContent = `${headers}\n${example1}\n${example2}`;
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'inventory-import-template.csv';
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success(language === 'en' ? 'Template downloaded' : 'টেমপ্লেট ডাউনলোড হয়েছে');
  };

  const validCount = parsedProducts.filter(p => p.isValid).length;
  const invalidCount = parsedProducts.filter(p => !p.isValid).length;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            {language === 'en' ? 'Import Products from CSV' : 'CSV থেকে পণ্য আমদানি'}
          </DialogTitle>
          <DialogDescription>
            {language === 'en' 
              ? 'Upload a CSV file with product data. Required columns: Product Name, Gender, Fit, Size, Wash, Price, Stock Level'
              : 'পণ্যের ডেটা সহ একটি CSV ফাইল আপলোড করুন।'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template Download */}
          <Button
            variant="outline"
            onClick={downloadTemplate}
            className="w-full gap-2"
          >
            <Download className="h-4 w-4" />
            {language === 'en' ? 'Download Template' : 'টেমপ্লেট ডাউনলোড'}
          </Button>

          {/* File Input */}
          <div className="space-y-2">
            <div 
              className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 transition-colors hover:border-primary/50"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileSpreadsheet className="mb-2 h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium">
                {fileName || (language === 'en' ? 'Click to select CSV file' : 'CSV ফাইল নির্বাচন করতে ক্লিক করুন')}
              </p>
              <p className="text-xs text-muted-foreground">
                {language === 'en' ? 'or drag and drop' : 'বা টেনে এনে ছাড়ুন'}
              </p>
            </div>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Parsing Results */}
          {parsedProducts.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="default" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {validCount} {language === 'en' ? 'valid' : 'বৈধ'}
                </Badge>
                {invalidCount > 0 && (
                  <Badge variant="destructive" className="gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {invalidCount} {language === 'en' ? 'invalid' : 'অবৈধ'}
                  </Badge>
                )}
              </div>

              <ScrollArea className="h-48 rounded-lg border">
                <div className="p-2 space-y-2">
                  {parsedProducts.map((product, index) => (
                    <div
                      key={index}
                      className={`rounded-lg p-2 text-sm ${
                        product.isValid ? 'bg-success/10' : 'bg-destructive/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{product.name}</span>
                        {product.isValid ? (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                      {product.isValid ? (
                        <p className="text-xs text-muted-foreground">
                          {product.gender} | {product.fit} | Size {product.size} | ${product.price} | Stock: {product.stockLevel}
                        </p>
                      ) : (
                        <p className="text-xs text-destructive">
                          {product.errors.join(', ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            {language === 'en' ? 'Cancel' : 'বাতিল'}
          </Button>
          <Button
            onClick={handleImport}
            disabled={validCount === 0 || isProcessing}
          >
            {language === 'en' ? `Import ${validCount} Products` : `${validCount}টি পণ্য আমদানি`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportCsvDialog;
