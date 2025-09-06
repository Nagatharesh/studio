
export type Batch = {
  id: string;
  cropType: string;
  location: string;
  soilProperties: string;
  farmer: string;
  dateFarmed: string;
  status: 'FARMED' | 'IN_WAREHOUSE' | 'VERIFIED' | 'RETAIL';
  quality?: string;
  price?: string;
  warehouseConditions?: string;
  agent?: string;
  dateVerified?: string;
  transactionHash: string;
};

export type TimelineEvent = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  icon: 'Farmer' | 'Agent' | 'Consumer';
  color: string;
  data: Record<string, string>;
  hash: string;
};

export type ProductDetails = {
    id: string;
    name: string;
    image: string;
    price: string;
    quality: string;
    farmer: string;
    rating: number;
    reviews: number;
};
