# **App Name**: AgriChain

## Core Features:

- Role-Based Authentication: Authenticate users based on their roles (farmer, agent, consumer) using mobile/email and OTP. Store role information in the user profile.
- Crop Suggestion Tool: When a farmer creates a new crop batch, the system suggests the best crops based on entered data about location and soil properties, by employing a rules based tool.
- Batch Creation & QR Code Generation: Allow farmers to add new crop batches with details like crop type, location, and soil. Generate a unique QR code for each batch containing the batch ID.
- Agent Verification & Pricing: Enable agents to view incoming batches, update quality check, pricing, and warehouse conditions, and forward to retailers.
- QR Code Scanning: Allow consumers to scan QR codes using the device camera to fetch the blockchain history of a product.
- Product History Timeline: Display a visual timeline of a product's history, including farmer details, warehouse info, agent verification, and price, based on the scanned QR code.
- Blockchain Simulation: Simulate blockchain transactions using Firebase Firestore, recording each action with a timestamp and hash. This serves as a ledger for tracking product provenance.

## Style Guidelines:

- Primary color: Green (#A7D1AB), symbolizing growth and agriculture (Farmer role color).
- Background color: Very light green (#F4F9F4), a desaturated version of the primary green to maintain a clean and organic feel.
- Accent color: Blue (#82A7CA), representing trust and efficiency for agent verification (Agent role color).
- Font pairing: 'Poppins' (sans-serif) for headlines and shorter text snippets to give a modern, geometric appearance; 'PT Sans' (sans-serif) for body text to ensure readability for larger content blocks.
- Use icons to visually represent each step in the blockchain process. Farmer is represented with 🌱 (green), agent with 🏢 (blue), consumer with 🛒 (orange)
- Implement a clean, card-based layout to display product information, utilizing ShadCN UI and Tailwind for a modern and responsive design.
- Incorporate subtle animations using Flow to illustrate the steps in the blockchain, providing a visually engaging user experience.