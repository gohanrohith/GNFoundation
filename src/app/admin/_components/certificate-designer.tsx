'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, Save } from 'lucide-react';

interface CertificateDesignerProps {
  examType: 'RMTH' | 'RSTH';
  year: number;
}

export function CertificateDesigner({ examType, year }: CertificateDesignerProps) {
  const [config, setConfig] = useState({
    organizationName: 'GN Foundation',
    certificateTitle: 'Certificate of Participation',
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    textColor: '#333333',
    backgroundColor: '#ffffff',
    titleFont: 'Georgia, serif',
    bodyFont: 'Arial, sans-serif',
    subtitleText: 'For successful participation in the {examType} Examination {year}',
    footerText: 'Keep up the excellent work!',
    showLogo: true,
    borderStyle: 'double',
    borderColor: '#667eea',
    showSignature: true,
    signatureText: 'Authorized Signature',
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadConfig();
  }, [examType, year]);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/certificate-config?examType=${examType}&year=${year}`);
      if (response.ok) {
        const data = await response.json();
        if (data.config) {
          setConfig(data.config);
        }
      }
    } catch (error) {
      console.error('Failed to load config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/certificate-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examType,
          year,
          ...config,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Success!',
          description: 'Certificate template saved successfully.',
        });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save certificate template.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    window.open(`/api/certificates/preview?examType=${examType}&year=${year}`, '_blank');
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Certificate Designer - {examType} {year}</CardTitle>
        <CardDescription>Customize your certificate template (Mail Merge Style)</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="colors">Colors & Style</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Organization Name</Label>
                <Input
                  value={config.organizationName}
                  onChange={(e) => setConfig({ ...config, organizationName: e.target.value })}
                  placeholder="GN Foundation"
                />
              </div>

              <div className="space-y-2">
                <Label>Certificate Title</Label>
                <Input
                  value={config.certificateTitle}
                  onChange={(e) => setConfig({ ...config, certificateTitle: e.target.value })}
                  placeholder="Certificate of Participation"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Subtitle Text</Label>
                <Input
                  value={config.subtitleText}
                  onChange={(e) => setConfig({ ...config, subtitleText: e.target.value })}
                  placeholder="Use {examType} and {year} as placeholders"
                />
                <p className="text-xs text-muted-foreground">
                  Use {'{examType}'} and {'{year}'} for dynamic values
                </p>
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Footer Text</Label>
                <Input
                  value={config.footerText}
                  onChange={(e) => setConfig({ ...config, footerText: e.target.value })}
                  placeholder="Keep up the excellent work!"
                />
              </div>

              <div className="space-y-2">
                <Label>Signature Text</Label>
                <Input
                  value={config.signatureText}
                  onChange={(e) => setConfig({ ...config, signatureText: e.target.value })}
                  placeholder="Authorized Signature"
                />
              </div>

              <div className="flex items-center space-x-2 pt-8">
                <Switch
                  checked={config.showSignature}
                  onCheckedChange={(checked) => setConfig({ ...config, showSignature: checked })}
                />
                <Label>Show Signature Line</Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="colors" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    value={config.primaryColor}
                    onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                    placeholder="#667eea"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={config.secondaryColor}
                    onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    value={config.secondaryColor}
                    onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                    placeholder="#764ba2"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={config.textColor}
                    onChange={(e) => setConfig({ ...config, textColor: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    value={config.textColor}
                    onChange={(e) => setConfig({ ...config, textColor: e.target.value })}
                    placeholder="#333333"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={config.backgroundColor}
                    onChange={(e) => setConfig({ ...config, backgroundColor: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    value={config.backgroundColor}
                    onChange={(e) => setConfig({ ...config, backgroundColor: e.target.value })}
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Border Style</Label>
                <Select
                  value={config.borderStyle}
                  onValueChange={(value) => setConfig({ ...config, borderStyle: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="double">Double</SelectItem>
                    <SelectItem value="solid">Solid</SelectItem>
                    <SelectItem value="dashed">Dashed</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Border Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={config.borderColor}
                    onChange={(e) => setConfig({ ...config, borderColor: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    value={config.borderColor}
                    onChange={(e) => setConfig({ ...config, borderColor: e.target.value })}
                    placeholder="#667eea"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title Font</Label>
                <Select
                  value={config.titleFont}
                  onValueChange={(value) => setConfig({ ...config, titleFont: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Georgia, serif">Georgia</SelectItem>
                    <SelectItem value="Times New Roman, serif">Times New Roman</SelectItem>
                    <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                    <SelectItem value="Helvetica, sans-serif">Helvetica</SelectItem>
                    <SelectItem value="Courier New, monospace">Courier New</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Body Font</Label>
                <Select
                  value={config.bodyFont}
                  onValueChange={(value) => setConfig({ ...config, bodyFont: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                    <SelectItem value="Helvetica, sans-serif">Helvetica</SelectItem>
                    <SelectItem value="Georgia, serif">Georgia</SelectItem>
                    <SelectItem value="Times New Roman, serif">Times New Roman</SelectItem>
                    <SelectItem value="Verdana, sans-serif">Verdana</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.showLogo}
                  onCheckedChange={(checked) => setConfig({ ...config, showLogo: checked })}
                />
                <Label>Show Organization Name</Label>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-sm mb-2">Available Merge Fields:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <code className="bg-white px-2 py-1 rounded">{'{admissionNumber}'}</code>
                <code className="bg-white px-2 py-1 rounded">{'{studentName}'}</code>
                <code className="bg-white px-2 py-1 rounded">{'{school}'}</code>
                <code className="bg-white px-2 py-1 rounded">{'{class}'}</code>
                <code className="bg-white px-2 py-1 rounded">{'{examType}'}</code>
                <code className="bg-white px-2 py-1 rounded">{'{year}'}</code>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 mt-6">
          <Button onClick={handleSave} disabled={saving} className="flex-1">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Template
              </>
            )}
          </Button>
          <Button onClick={handlePreview} variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
