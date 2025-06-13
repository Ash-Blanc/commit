
import { useState } from 'react';
import { Upload, File, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDocuments } from '@/hooks/useDocuments';
import { toast } from '@/hooks/use-toast';

interface DocumentUploaderProps {
  applicationId?: string;
}

const DocumentUploader = ({ applicationId }: DocumentUploaderProps) => {
  const { documents, uploadDocument, deleteDocument, getDocumentUrl } = useDocuments();
  const [uploading, setUploading] = useState(false);
  const [selectedType, setSelectedType] = useState('');

  const documentTypes = [
    'transcript',
    'essay',
    'recommendation_letter',
    'test_scores',
    'resume',
    'portfolio',
    'other'
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedType) {
      toast({
        title: "Error",
        description: "Please select a file and document type",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const result = await uploadDocument(file, selectedType, applicationId);
      
      if (result?.error) {
        throw new Error('Upload failed');
      }

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
      
      setSelectedType('');
      event.target.value = '';
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    try {
      const result = await deleteDocument(documentId);
      
      if (result?.error) {
        throw new Error('Delete failed');
      }

      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (document: any) => {
    try {
      const url = await getDocumentUrl(document.file_path);
      if (url) {
        window.open(url, '_blank');
      } else {
        throw new Error('Failed to get download URL');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Document Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="document-type">Document Type</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="file-upload">Upload File</Label>
            <Input
              id="file-upload"
              type="file"
              onChange={handleFileUpload}
              disabled={uploading || !selectedType}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
          </div>
          
          {uploading && (
            <div className="text-sm text-muted-foreground">
              Uploading document...
            </div>
          )}
        </div>

        {/* Documents List */}
        <div className="space-y-3">
          <h4 className="font-medium">Uploaded Documents</h4>
          {documents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No documents uploaded yet</p>
          ) : (
            <div className="space-y-2">
              {documents.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <File className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{document.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {document.type.replace('_', ' ')} • {Math.round(document.file_size / 1024)} KB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(document)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(document.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentUploader;
