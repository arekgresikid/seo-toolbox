export const generateSchemaJsonLd = (type: string, data: any): string => {
  let schema: any = {
    "@context": "https://schema.org",
    "@type": type,
  };

  switch (type) {
    case 'Article':
      schema = {
        ...schema,
        "headline": data.headline,
        "image": data.image ? [data.image] : [],
        "datePublished": data.datePublished,
        "dateModified": data.dateModified || data.datePublished,
        "author": [{
          "@type": "Person",
          "name": data.authorName
        }]
      };
      break;
    case 'Product':
      schema = {
        ...schema,
        "name": data.name,
        "image": data.image ? [data.image] : [],
        "description": data.description,
        "offers": {
          "@type": "Offer",
          "url": data.url,
          "priceCurrency": data.currency || "USD",
          "price": data.price,
          "availability": `https://schema.org/${data.availability || 'InStock'}`
        }
      };
      break;
    case 'FAQPage':
      schema = {
        ...schema,
        "mainEntity": (data.faqs || []).map((faq: any) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      };
      break;
    default:
      schema = { ...schema, ...data };
  }

  return JSON.stringify(schema, null, 2);
};
