
import type { TimelineEvent, ProductDetails } from './types';

type MockProduct = {
  details: ProductDetails;
  history: TimelineEvent[];
}

export const MOCK_DATA: {[key: string]: MockProduct} = {
  'PROD-TOM-001': {
    details: {
      id: 'PROD-TOM-001',
      name: 'Vine-Ripened Tomatoes',
      image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=600',
      price: 'Rs.39 / kg',
      quality: 'Grade A',
      farmer: 'Madurai AgriStorage',
      rating: 4.7,
      reviews: 152,
    },
    history: [
       {
        id: '1',
        title: 'Farmed & Harvested',
        description: 'Tomatoes were harvested by Madurai AgriStorage.',
        timestamp: '2023-03-15',
        icon: 'Farmer',
        color: 'bg-primary',
        data: {
            'Batch ID': 'BATCH-TOM-001',
            'Origin': 'Madurai, Tamil Nadu',
            'Soil Info': 'Red Loam, pH 6.5',
            'Price from Farmer': 'Rs.32 / kg',
        },
        hash: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f'
      },
      {
          id: '2',
          title: 'Agent Verified',
          description: 'Batch quality and pricing confirmed by Agent Rajan.',
          timestamp: '2023-03-20',
          icon: 'Agent',
          color: 'bg-accent',
          data: {
              'Quality': 'Grade A',
              'Transportation Cost': 'Rs.2 / kg',
              'Price from Agent': 'Rs.35 / kg',
          },
          hash: '0x7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f1a2b3c4d5e6f'
      },
      {
        id: '3',
        title: 'Ready for Consumer',
        description: 'Product available for purchase in the marketplace.',
        timestamp: '2023-03-21',
        icon: 'Consumer',
        color: 'bg-consumer',
        data: {
            'Final Consumer Price': 'Rs.39 / kg',
            'Status': 'Available',
        },
        hash: '0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f1a2b'
      },
    ]
  },
  'PROD-POT-002': {
    details: {
      id: 'PROD-POT-002',
      name: 'Ooty Potatoes',
      image: 'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=600',
      price: 'Rs.30 / kg',
      quality: 'Grade B',
      farmer: 'Nilgiri Growers',
      rating: 4.6,
      reviews: 110,
    },
    history: [
       {
        id: '1',
        title: 'Farmed & Harvested',
        description: 'Potatoes were harvested by Nilgiri Growers.',
        timestamp: '2023-04-01',
        icon: 'Farmer',
        color: 'bg-primary',
        data: {
            'Batch ID': 'BATCH-POT-002',
            'Origin': 'Ooty, Tamil Nadu',
            'Soil Info': 'Laterite, pH 5.5',
            'Price from Farmer': 'Rs.25 / kg',
        },
        hash: '0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f1a'
      },
      {
          id: '2',
          title: 'Agent Verified',
          description: 'Batch quality and pricing confirmed by Agent Priya.',
          timestamp: '2023-04-05',
          icon: 'Agent',
          color: 'bg-accent',
          data: {
              'Quality': 'Grade B',
              'Transportation Cost': 'Rs.1 / kg',
              'Price from Agent': 'Rs.28 / kg',
          },
          hash: '0x8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f1a2b3c4d5e6f7g'
      },
      {
        id: '3',
        title: 'Ready for Consumer',
        description: 'Product available for purchase in the marketplace.',
        timestamp: '2023-04-06',
        icon: 'Consumer',
        color: 'bg-consumer',
        data: {
            'Final Consumer Price': 'Rs.30 / kg',
            'Status': 'Available',
        },
        hash: '0x4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f1a2b3c'
      },
    ]
  },
  'PROD-CAU-003': {
    details: {
      id: 'PROD-CAU-003',
      name: 'Fresh Cauliflower',
      image: 'https://images.unsplash.com/photo-1566842600175-97dca489844f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxjYXVsaWZsb3dlcnxlbnwwfHx8fDE3NTcxNTk3MTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      price: 'Rs.26 / piece',
      quality: 'Grade A',
      farmer: 'Ooty Farms',
      rating: 4.8,
      reviews: 98,
    },
    history: [
       {
        id: '1',
        title: 'Farmed & Harvested',
        description: 'Cauliflower was harvested by Ooty Farms.',
        timestamp: '2023-05-10',
        icon: 'Farmer',
        color: 'bg-primary',
        data: {
            'Batch ID': 'BATCH-CAU-003',
            'Origin': 'Ooty, Tamil Nadu',
            'Soil Info': 'Alluvial, pH 6.2',
            'Price from Farmer': 'Rs.22 / piece',
        },
        hash: '0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f1a2b'
      },
      {
          id: '2',
          title: 'Agent Verified',
          description: 'Batch quality and pricing confirmed by Agent Kumar.',
          timestamp: '2023-05-12',
          icon: 'Agent',
          color: 'bg-accent',
          data: {
              'Quality': 'Grade A',
              'Transportation Cost': 'Rs.1 / piece',
              'Price from Agent': 'Rs.24 / piece',
          },
          hash: '0x9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f1a2b3c4d5e6f7g8h'
      },
       {
        id: '3',
        title: 'Ready for Consumer',
        description: 'Product available for purchase in the marketplace.',
        timestamp: '2023-05-13',
        icon: 'Consumer',
        color: 'bg-consumer',
        data: {
            'Final Consumer Price': 'Rs.26 / piece',
            'Status': 'Available',
        },
        hash: '0x5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f1a2b3c4d'
      },
    ]
  },
  'PROD-EGG-004': {
    details: {
      id: 'PROD-EGG-004',
      name: 'Glossy Brinjal (Eggplant)',
      image: 'https://images.pexels.com/photos/128420/pexels-photo-128420.jpeg?auto=compress&cs=tinysrgb&w=600',
      price: 'Rs.40 / kg',
      quality: 'Grade A',
      farmer: 'Kovai Fields',
      rating: 4.5,
      reviews: 82,
    },
    history: [
       {
        id: '1',
        title: 'Farmed & Harvested',
        description: 'Brinjal was harvested by Kovai Fields.',
        timestamp: '2023-06-01',
        icon: 'Farmer',
        color: 'bg-primary',
        data: {
            'Batch ID': 'BATCH-EGG-004',
            'Origin': 'Coimbatore, Tamil Nadu',
            'Soil Info': 'Clay Loam, pH 6.8',
            'Price from Farmer': 'Rs.35 / kg',
        },
        hash: '0x4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f1a2b3c'
      },
      {
          id: '2',
          title: 'Agent Verified',
          description: 'Batch quality and pricing confirmed by Agent Deepa.',
          timestamp: '2023-06-03',
          icon: 'Agent',
          color: 'bg-accent',
          data: {
              'Quality': 'Grade A',
              'Transportation Cost': 'Rs.2 / kg',
              'Price from Agent': 'Rs.38 / kg',
          },
          hash: '0x0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f1a2b3c4d5e6f7g8h9i'
      },
      {
        id: '3',
        title: 'Ready for Consumer',
        description: 'Product available for purchase in the marketplace.',
        timestamp: '2023-06-04',
        icon: 'Consumer',
        color: 'bg-consumer',
        data: {
            'Final Consumer Price': 'Rs.40 / kg',
            'Status': 'Available',
        },
        hash: '0x6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f1a2b3c4d5e'
      },
    ]
  },
  'PROD-SPI-005': {
    details: {
      id: 'PROD-SPI-005',
      name: 'Organic Palak (Spinach)',
      image: 'https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?auto=compress&cs=tinysrgb&w=600',
      price: 'Rs.25 / bundle',
      quality: 'Organic Grade',
      farmer: 'Cauvery Delta Farmers',
      rating: 4.9,
      reviews: 180,
    },
    history: [
      {
        id: '1',
        title: 'Farmed & Harvested',
        description: 'Spinach was harvested by Cauvery Delta Farmers.',
        timestamp: '2023-07-01',
        icon: 'Farmer',
        color: 'bg-primary',
        data: {
            'Batch ID': 'BATCH-SPI-005',
            'Origin': 'Thanjavur, Tamil Nadu',
            'Soil Info': 'Alluvial, pH 7.0',
            'Price from Farmer': 'Rs.20 / bundle',
        },
        hash: '0x5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f1a2b3c4d'
      },
      {
        id: '2',
        title: 'Ready for Consumer',
        description: 'Product available for purchase.',
        timestamp: '2023-07-02',
        icon: 'Consumer',
        color: 'bg-consumer',
        data: {
            'Final Consumer Price': 'Rs.25 / bundle',
            'Status': 'Available',
        },
        hash: '0x1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f1a2b3c4d5e6f7g8h9i0j'
    },
    ]
  },
  'PROD-ONI-006': {
    details: {
      id: 'PROD-ONI-006',
      name: 'Small Onions (Shallots)',
      image: 'https://images.unsplash.com/photo-1600807644626-fb3c8c8ba40d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNXx8c21hbGwlMjBvbmlvbnN8ZW58MHx8fHwxNzU3MTU5Nzc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      price: 'Rs.45 / kg',
      quality: 'Export Grade',
      farmer: 'Erode Growers',
      rating: 4.6,
      reviews: 89,
    },
    history: [
      {
        id: '1',
        title: 'Farmed & Harvested',
        description: 'Shallots were harvested by Erode Growers.',
        timestamp: '2023-08-10',
        icon: 'Farmer',
        color: 'bg-primary',
        data: {
            'Batch ID': 'BATCH-ONI-006',
            'Origin': 'Erode, Tamil Nadu',
            'Soil Info': 'Red Loam, pH 6.7',
            'Price from Farmer': 'Rs.40 / kg',
        },
        hash: '0x6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f1a2b3c4d5e'
      },
      {
          id: '2',
          title: 'Agent Verified',
          description: 'Batch quality and pricing confirmed by Agent Saravanan.',
          timestamp: '2023-08-12',
          icon: 'Agent',
          color: 'bg-accent',
          data: {
              'Quality': 'Export Grade',
              'Transportation Cost': 'Rs.1 / kg',
              'Price from Agent': 'Rs.42 / kg',
          },
          hash: '0x2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f1a2b3c4d5e6f7g8h9i0j1k'
      },
       {
        id: '3',
        title: 'Ready for Consumer',
        description: 'Product available for purchase in the marketplace.',
        timestamp: '2023-08-13',
        icon: 'Consumer',
        color: 'bg-consumer',
        data: {
            'Final Consumer Price': 'Rs.45 / kg',
            'Status': 'Available',
        },
        hash: '0x7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f1a2b3c4d5e6f'
      },
    ]
  },
};

export const MOCK_PRODUCTS_LIST = Object.values(MOCK_DATA).map(item => item.details);
