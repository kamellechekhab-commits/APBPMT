import axios from 'axios';
import * as cheerio from 'cheerio';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface ScrapedProduct {
  title: string;
  price: number;
  url: string;
  image?: string;
  store_name: string;
}

export async function scrapeGeekzone(): Promise<ScrapedProduct[]> {
  try {
    const response = await axios.get('https://www.geekzonedz.com/nouveaux-produits');
    const $ = cheerio.load(response.data);
    const products: ScrapedProduct[] = [];

    $('.product-miniature').each((_, el) => {
      const title = $(el).find('.product-title').text().trim();
      const priceText = $(el).find('.price').text().replace(/[^0-9]/g, '');
      const price = parseInt(priceText, 10);
      const url = $(el).find('a').attr('href') || '';
      const image = $(el).find('img').attr('src') || '';

      if (title && price) {
        products.push({ title, price, url, image, store_name: 'Geekzone' });
      }
    });

    return products;
  } catch (error) {
    console.error('Error scraping Geekzone:', error);
    return [];
  }
}

export async function scrapeDigitec(): Promise<ScrapedProduct[]> {
  try {
    const response = await axios.get('https://www.digitecdz.com/boutique/');
    const $ = cheerio.load(response.data);
    const products: ScrapedProduct[] = [];

    $('.product').each((_, el) => {
      const title = $(el).find('.woocommerce-loop-product__title').text().trim();
      const priceText = $(el).find('.price').text().replace(/[^0-9]/g, '');
      const price = parseInt(priceText, 10);
      const url = $(el).find('a').attr('href') || '';
      const image = $(el).find('img').attr('src') || '';

      if (title && price) {
        products.push({ title, price, url, image, store_name: 'Digitec' });
      }
    });

    return products;
  } catch (error) {
    console.error('Error scraping Digitec:', error);
    return [];
  }
}

export async function normalizeProduct(scraped: ScrapedProduct) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `
    Extract structured data from this product title: "${scraped.title}"
    Return a JSON object with:
    {
      "category": "cpu" | "gpu" | "ram" | "motherboard" | "psu" | "case" | "storage" | "cooler",
      "brand": string,
      "model": string,
      "specs": {
        "socket": string (if cpu/mb),
        "ram_type": "DDR4" | "DDR5" (if ram/mb/cpu),
        "capacity": string (if ram/storage),
        "wattage": string (if psu)
      }
    }
    Only return valid JSON.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error('Error normalizing with Gemini:', error);
    return null;
  }
}
