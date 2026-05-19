export type Category = 'cpu' | 'gpu' | 'ram' | 'motherboard' | 'psu' | 'case' | 'storage' | 'cooler';

export interface Store {
  id: string;
  name: string;
  url: string;
  logo_url?: string;
  created_at: string;
}

export interface Component {
  id: string;
  category: Category;
  brand: string;
  model: string;
  specs: Record<string, any>;
  image_url?: string;
  created_at: string;
}

export interface Price {
  id: string;
  component_id: string;
  store_id: string;
  price: number;
  currency: string;
  product_url: string;
  last_updated: string;
}

export interface Build {
  id: string;
  user_id?: string;
  name: string;
  description?: string;
  components: string[]; // Array of component IDs
  total_price: number;
  is_public: boolean;
  created_at: string;
}
