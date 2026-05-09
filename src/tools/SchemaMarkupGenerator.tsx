
import React, { useState } from 'react';
import { Copy, Code2, Plus, Trash2, Info, Eye } from 'lucide-react';
import { generateSchemaJsonLd } from '../utils/schemaUtils';
import toast from 'react-hot-toast';

type SchemaType = 'Article' | 'Product' | 'LocalBusiness' | 'FAQPage' | 'BreadcrumbList';

const SchemaMarkupGenerator = () => {
  const [schemaType, setSchemaType] = useState<SchemaType>('Article');
  const [formData, setFormData] = useState<any>({
    headline: '',
    authorName: '',
    datePublished: new Date().toISOString().split('T')[0],
    image: '',
    faqs: [{ question: '', answer: '' }]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const updateFaq = (index: number, field: string, value: string) => {
    const newFaqs = [...formData.faqs];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    setFormData((prev: any) => ({ ...prev, faqs: newFaqs }));
  };

  const addFaq = () => {
    setFormData((prev: any) => ({ ...prev, faqs: [...prev.faqs, { question: '', answer: '' }] }));
  };

  const removeFaq = (index: number) => {
    const newFaqs = [...formData.faqs];
    newFaqs.splice(index, 1);
    setFormData((prev: any) => ({ ...prev, faqs: newFaqs }));
  };

  const copyCode = () => {
    const json = generateSchemaJsonLd(schemaType, formData);
    const snippet = `<script type="application/ld+json">\n${json}\n</script>`;
    navigator.clipboard.writeText(snippet);
    toast.success('JSON-LD copied!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Schema Markup Generator</h2>
          <p className="text-muted-foreground">Create structured data in JSON-LD format to help search engines understand your content.</p>
        </div>
        <select
          value={schemaType}
          onChange={(e) => setSchemaType(e.target.value as SchemaType)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium outline-none shadow-md"
        >
          <option value="Article">Article</option>
          <option value="Product">Product</option>
          <option value="FAQPage">FAQ Page</option>
          <option value="LocalBusiness">Local Business</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
            <h3 className="font-bold border-b pb-2 flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" /> {schemaType} Details
            </h3>

            {schemaType === 'Article' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Headline</label>
                  <input
                    type="text"
                    name="headline"
                    value={formData.headline}
                    onChange={handleInputChange}
                    placeholder="Article title"
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Author Name</label>
                    <input
                      type="text"
                      name="authorName"
                      value={formData.authorName}
                      onChange={handleInputChange}
                      placeholder="Writer name"
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date Published</label>
                    <input
                      type="date"
                      name="datePublished"
                      value={formData.datePublished}
                      onChange={handleInputChange}
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/article-image.jpg"
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            {schemaType === 'Product' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    placeholder="e.g. iPhone 15 Pro"
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price || ''}
                      onChange={handleInputChange}
                      placeholder="999.99"
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Currency</label>
                    <input
                      type="text"
                      name="currency"
                      value={formData.currency || 'USD'}
                      onChange={handleInputChange}
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Availability</label>
                  <select
                    name="availability"
                    value={formData.availability || 'InStock'}
                    onChange={handleInputChange}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="InStock">In Stock</option>
                    <option value="OutOfStock">Out of Stock</option>
                    <option value="PreOrder">Pre-order</option>
                  </select>
                </div>
              </div>
            )}

            {schemaType === 'FAQPage' && (
              <div className="space-y-6">
                {formData.faqs.map((faq: any, index: number) => (
                  <div key={index} className="p-4 bg-muted/30 rounded-lg space-y-3 relative group">
                    <button 
                      onClick={() => removeFaq(index)}
                      className="absolute top-2 right-2 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-muted-foreground">Question {index + 1}</label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => updateFaq(index, 'question', e.target.value)}
                        placeholder="What is your return policy?"
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-muted-foreground">Answer</label>
                      <textarea
                        value={faq.answer}
                        onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                        placeholder="We offer a 30-day money-back guarantee."
                        rows={2}
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={addFaq}
                  className="w-full py-2 border-2 border-dashed rounded-lg text-sm text-muted-foreground hover:bg-muted/50 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" /> Add FAQ Item
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="bg-card p-6 rounded-xl border shadow-sm sticky top-24 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                <Code2 className="h-5 w-5 text-primary" /> Generated JSON-LD
              </h3>
              <button 
                onClick={copyCode}
                className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
              >
                <Copy className="h-3.5 w-3.5" /> Copy Code
              </button>
            </div>
            
            <div className="relative group">
              <pre className="p-4 bg-zinc-950 text-zinc-50 rounded-xl border overflow-x-auto text-xs leading-relaxed max-h-[500px]">
                <code>
                  {`<script type="application/ld+json">\n`}
                  {generateSchemaJsonLd(schemaType, formData)}
                  {`\n</script>`}
                </code>
              </pre>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg flex gap-3 text-xs text-muted-foreground">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <p>Place this script tag in your page's <code>&lt;head&gt;</code> or just before the closing <code>&lt;/body&gt;</code> tag.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemaMarkupGenerator;
