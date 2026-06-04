export const productCategories = new Set(['ceramique', 'goodies', 'lifestyle']);

export const isProductItem = (item) => (
  item
  && typeof item.name === 'string'
  && productCategories.has(item.category)
  && item.price !== undefined
  && !item.title
  && !item.slug
);

export const isBlogItem = (item) => (
  item
  && typeof item.title === 'string'
  && typeof item.slug === 'string'
  && !item.name
  && item.price === undefined
);
