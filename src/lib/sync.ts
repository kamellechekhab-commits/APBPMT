import { scrapeGeekzone, scrapeDigitec, normalizeProduct, ScrapedProduct } from './crawler';
import { supabase } from './supabase';

export async function runCrawler() {
  console.log('Starting crawler...');
  const products: ScrapedProduct[] = [];
  
  const geekzoneProducts = await scrapeGeekzone();
  products.push(...geekzoneProducts);
  
  const digitecProducts = await scrapeDigitec();
  products.push(...digitecProducts);

  console.log(`Scraped ${products.length} products in total.`);

  for (const product of products) {
    const normalized = await normalizeProduct(product);
    if (!normalized) continue;

    // 1. Find or create component
    const { data: component, error: compError } = await supabase
      .from('components')
      .upsert({
        category: normalized.category,
        brand: normalized.brand,
        model: normalized.model,
        specs: normalized.specs
      }, { onConflict: 'brand,model' })
      .select()
      .single();

    if (compError) {
      console.error('Error upserting component:', compError);
      continue;
    }

    // 2. Find store ID
    const { data: store } = await supabase
      .from('stores')
      .select('id')
      .eq('name', product.store_name)
      .single();

    if (!store) continue;

    // 3. Upsert price
    await supabase
      .from('prices')
      .upsert({
        component_id: component.id,
        store_id: store.id,
        price: product.price,
        product_url: product.url,
        last_updated: new Date().toISOString()
      }, { onConflict: 'component_id,store_id' });
  }
  console.log('Crawler finished.');
}
