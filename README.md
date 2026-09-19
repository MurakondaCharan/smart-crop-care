# 🌱 Smart Crop Care

### AI-Powered Crop Health & Direct Market Access Platform for Farmers

> **From Healthy Crops to Better Markets**

Smart Crop Care is a multilingual, farmer-friendly web application designed to support small and marginal farmers throughout the complete agricultural journey — from **crop disease detection and treatment guidance to market access, buyers/FPOs, cold storage, and transportation**.

The platform is designed with a simple interface for farmers with limited digital literacy and supports regional languages such as **English, Telugu, and Hindi**.

---

## 🎯 Problem Statement

Small and marginal farmers often face several challenges:

- Difficulty identifying crop diseases and pest attacks
- Limited access to reliable treatment guidance
- Lack of direct access to buyers
- Dependence on intermediaries
- Difficulty checking market prices
- Limited access to cold storage
- High transportation costs
- Language and digital-literacy barriers
- Poor internet connectivity

Smart Crop Care brings these services together in one platform.

---

## 💡 Our Solution

Smart Crop Care provides a complete digital journey:

```text
🌱 Crop
   ↓
📷 Crop Photo
   ↓
🔍 AI Diagnosis
   ↓
💊 Treatment Guidance
   ↓
💰 Market Prices
   ↓
🤝 Buyers / FPOs
   ↓
❄️ Cold Storage
   ↓
🚚 Transportation

✨ Key Features
📷 Crop Photo & Camera
Capture crop images using the device camera
Upload images from the gallery
Preview captured or uploaded images
Use the selected crop image for diagnosis
Camera support using browser APIs where available
🔍 AI-Assisted Crop Diagnosis

The platform can analyze crop images and provide information such as:

Possible crop
Possible disease or pest
Confidence level
Severity
Visible symptoms
Recommended actions
Prevention guidance

When configured with a Gemini API key, the application can use AI-based image analysis.

The project also contains fallback/demo diagnosis logic so that the application can demonstrate the complete workflow without requiring an AI API key.

Note: Diagnosis in this MVP is intended for demonstration and educational purposes. Important agricultural decisions should be verified with a qualified agricultural expert.

🌿 Treatment Guidance

Farmers can view simple guidance related to identified crop problems.

The treatment section can provide:

Disease information
Symptoms
Recommended actions
Prevention methods
Treatment-related information
Farmer-friendly instructions
🌐 Multilingual Support

Smart Crop Care is designed to support:

🇬🇧 English
🇮🇳 తెలుగు (Telugu)
🇮🇳 हिंदी (Hindi)

The selected language can be used across farmer-facing content.

The language preference can also be stored locally so that the selected language can be maintained during the user session.

🔊 Voice Guidance

The application supports browser-based speech synthesis for farmer guidance.

Supported voice language mappings include:

Language	Voice
English	en-IN
Telugu	te-IN
Hindi	hi-IN

This can help users who prefer listening to instructions rather than reading long text.

💰 Market Prices

The Market section allows farmers to explore available crop market information.

Features include:

Crop-based filtering
Market information
District/state-based filtering where available
Lowest/highest/average price information where supported

Important: Market information in the current MVP may contain sample/demo data and should not be treated as guaranteed real-time market information.

🤝 Buyers

The Buyers section helps demonstrate a direct market connection between farmers and potential buyers.

Farmers can explore:

Potential buyers
Crop requirements
Buyer information
Distance information where available
Buyer enquiry functionality

The feature is designed to demonstrate how farmers could explore alternative selling channels.

👨‍🌾 Farmer Producer Organizations (FPOs)

FPOs can help farmers with:

Collective aggregation
Bulk selling
Market connections
Better coordination between farmers
Access to organized agricultural markets

The Smart Crop Care platform provides an FPO discovery section as part of the farmer journey.

🧊 Cold Storage

The Cold Storage section helps farmers discover storage-related options.

It can provide information such as:

Storage facilities
Location
Available space
Crop suitability where available
Storage request functionality

This can help demonstrate post-harvest planning before selling produce.

🚚 Logistics

The Logistics section supports transportation discovery.

Farmers can explore:

Transport providers
Vehicle information
Capacity
Distance
Estimated transportation cost
Transport request functionality
🧑‍🌾 Complete Farmer Journey
Step	Feature	Purpose
1	📷 Crop Photo	Capture or upload a crop image
2	🔍 Diagnosis	Identify possible disease or pest
3	🌿 Treatment	View treatment and prevention guidance
4	💰 Market Price	Explore available market information
5	🤝 Buyer / FPO	Discover market connections
6	🧊 Cold Storage	Find storage support
7	🚚 Transport	Explore transportation options

This workflow connects crop health → treatment → market → post-harvest support in one platform.

🛠️ Technology Stack
Frontend
React
TypeScript
Vite
Tailwind CSS
Lucide React
Motion
Backend
Node.js
Express
TypeScript
AI
Google Gemini API
@google/genai
Image-based AI analysis when GEMINI_API_KEY is configured
Rule-based/demo fallback diagnosis when AI is unavailable
Additional Technologies
Multer – image upload handling
dotenv – environment variable management
jsPDF – PDF generation
Canvas Confetti – UI interaction effects
PWA tooling – progressive web application support where configured
🏗️ System Architecture
                    👨‍🌾 Farmer
                       │
                       ▼
             ┌─────────────────────┐
             │  React + Vite App   │
             │    Farmer UI        │
             └──────────┬──────────┘
                        │
                        ▼
             ┌─────────────────────┐
             │   Express Backend   │
             │      REST API       │
             └──────────┬──────────┘
                        │
          ┌─────────────┼──────────────┐
          │             │              │
          ▼             ▼              ▼
    ┌──────────┐  ┌──────────┐  ┌─────────────┐
    │ Gemini AI│  │ Treatment│  │ Market Data │
    │ Diagnosis│  │  Data    │  │             │
    └──────────┘  └──────────┘  └─────────────┘
          │             │              │
          └─────────────┼──────────────┘
                        │
              ┌─────────┴─────────┐
              │                   │
              ▼                   ▼
        🤝 Buyers/FPOs       🧊 Storage
                                  │
                                  ▼
                             🚚 Logistics
📂 Project Structure
smart-crop-care/
│
├── public/
│
├── src/
│   ├── components/
│   ├── data/
│   ├── ...
│
├── .env.example
├── .gitignore
├── index.html
├── metadata.json
├── package.json
├── server.ts
├── tsconfig.json
├── vite.config.ts
└── README.md

The exact component and data structure may evolve as the project continues to develop.

🔌 API Endpoints

The backend exposes REST APIs for the main application modules.

❤️ Health
GET /api/health

Checks whether the backend service is running.

🔐 Authentication
GET  /api/auth/me
GET  /api/auth/demo-accounts
POST /api/auth/send-otp
POST /api/auth/verify-otp
POST /api/auth/switch-account
POST /api/auth/logout
POST /api/auth/register
🔍 Diagnosis
POST /api/diagnosis/analyze
POST /api/diagnosis
GET  /api/diagnosis/history

Used for crop image analysis and diagnosis history.

🌿 Treatments
GET /api/treatments/:disease
GET /api/treatment-products
🌱 Crops
GET    /api/crops
POST   /api/crops
DELETE /api/crops/:id
💰 Market Prices
GET /api/market-prices

Supports market-related filtering where available.

🤝 Buyers
GET  /api/buyers
POST /api/buyers/enquiry
👨‍🌾 FPOs
GET /api/fpos
🧊 Cold Storage
GET  /api/cold-storage
POST /api/cold-storage/request
🚚 Logistics
GET  /api/logistics
POST /api/logistics/request
📡 Offline Synchronization
POST /api/sync/offline-queue

Used for synchronizing queued actions where supported by the application.

🌱 Soil Health
GET /api/soil-health/:farmerId
💳 Payments
POST /api/payments/process
GET  /api/payments/history/:farmerId
🔬 AI Diagnosis Flow
Farmer
   │
   ▼
Capture / Upload Crop Image
   │
   ▼
Image Preview
   │
   ▼
Diagnosis API
   │
   ├───────────────► Gemini AI
   │
   │                  OR
   │
   └───────────────► Demo Fallback Logic
                          │
                          ▼
                    Diagnosis Result
                          │
                          ▼
                   Treatment Guidance
Diagnosis Output

The system can return information such as:

Crop
Disease / Pest
Confidence
Severity
Symptoms
Recommended Actions
Prevention

The exact output depends on the configured diagnosis flow.

🌐 Multilingual Experience

The application is designed around three languages:

English
   │
   ├── Farmer Interface
   ├── Diagnosis
   ├── Treatment
   └── Voice Guidance

తెలుగు
   │
   ├── Farmer Interface
   ├── Diagnosis
   ├── Treatment
   └── Voice Guidance

हिंदी
   │
   ├── Farmer Interface
   ├── Diagnosis
   ├── Treatment
   └── Voice Guidance

The goal is to make agricultural information easier to understand for users from different language backgrounds.

📱 Farmer-Friendly Design

The application follows a simple farmer-focused design approach.

Design principles
Simple navigation
Clear actions
Large buttons
Agriculture-focused visual design
Guided workflow
Minimal technical terminology
Multilingual support
Voice assistance
Mobile-friendly interface
Main Navigation
🏠 Home
🌱 Crop Care
💰 Market
🛠️ Services
👤 Profile
Services
🤝 Buyers
👨‍🌾 FPOs
🧊 Cold Storage
🚚 Logistics
🚀 Getting Started
Prerequisites

Make sure you have:

Node.js installed
npm installed
A modern web browser
Internet connection for API/AI features
Gemini API key for Gemini-based image analysis
1. Clone the Repository
git clone https://github.com/MurakondaCharan/smart-crop-care.git
cd smart-crop-care

If the GitHub repository has not yet been renamed, use the current repository URL instead.

2. Install Dependencies
npm install
3. Configure Environment Variables

Create a .env file in the project root.

Example:

GEMINI_API_KEY=your_gemini_api_key
APP_URL=http://localhost:3000

You can use .env.example as a reference.

Important

Never commit your real API key to GitHub.

4. Start the Development Server
npm run dev

The application will be available at:

http://localhost:3000
📜 Available Scripts
Command	Description
npm run dev	Start the development server
npm run build	Build the frontend and backend
npm start	Start the production build
npm run preview	Preview the Vite application
npm run lint	Run TypeScript checks
📸 Screenshots

Screenshots can be added here as the project develops.

🏠 Home Dashboard

Add screenshot here

📷 Crop Photo / Camera

Add screenshot here

🔍 Diagnosis

Add screenshot here

🌿 Treatment

Add screenshot here

💰 Market Price

Add screenshot here

🤝 Buyers / FPOs

Add screenshot here

🧊 Cold Storage

Add screenshot here

🚚 Logistics

Add screenshot here

🎥 Demo Video

A project demonstration video can be added here.

Demo Video: Coming Soon

The demonstration should cover:

Home
  ↓
Crop Photo
  ↓
Camera / Gallery
  ↓
Diagnosis
  ↓
Treatment
  ↓
Market Price
  ↓
Buyer / FPO
  ↓
Cold Storage
  ↓
Transport
🎯 Use Cases

Smart Crop Care can be used as a demonstration platform for:

Crop disease awareness
Basic crop health assistance
Treatment information
Farmer education
Multilingual agricultural guidance
Market discovery
Buyer discovery
FPO discovery
Cold storage discovery
Transport discovery
Agricultural technology demonstrations
🌾 Expected Benefits

The platform aims to help farmers by providing:

Easier access to crop health information
Faster access to basic treatment guidance
Local-language support
Voice-assisted information
Better awareness of market opportunities
Direct buyer discovery
FPO discovery
Better post-harvest planning
Storage and transportation support
A single guided farmer workflow
⚠️ Current MVP Limitations

This project is currently an MVP / educational prototype.

Some limitations include:

Some records are sample/demo data
AI diagnosis depends on Gemini API configuration
Fallback diagnosis is intended for demonstration
Market data may not represent real-time verified prices
Application records are currently maintained in memory
Production-level authentication and security hardening are still required
Buyer, FPO, storage, and logistics information may require verified real-world data sources
Agricultural diagnosis should be verified by qualified experts before important farming decisions
🔐 Production Considerations

For production deployment, the application should be extended with:

Persistent database
Secure authentication
Role-based access control
API validation
Rate limiting
HTTPS
Secure secret management
Verified agricultural data
Real-time market integrations
Verified buyers and FPOs
Expert agricultural consultation
Monitoring and logging
Reliable offline-first synchronization
Cloud infrastructure
Backup and recovery
🔮 Future Enhancements

Future versions of Smart Crop Care can include:

🤖 Advanced AI
Dedicated crop disease detection model
More crop and disease classes
Pest identification
Disease severity estimation
Agricultural expert verification
💰 Market Integration
Real-time mandi/APMC prices
Government agricultural market APIs
Buyer bidding
Price alerts
Market trend analysis
🌦️ Smart Farming
Weather integration
Soil health monitoring
IoT sensors
Irrigation recommendations
Crop growth monitoring
📱 Communication
SMS notifications
WhatsApp integration
Voice-based farmer assistant
IVR support
More regional languages
🏪 Marketplace
Verified buyers
FPO marketplace
Digital negotiation
Order management
Payment integration
🧊 Post-Harvest
Storage availability
Storage booking
Transportation tracking
Cold-chain management
☁️ Infrastructure
Cloud deployment
Production database
Scalable APIs
Monitoring
Analytics dashboard
🏆 Project Highlights
🌱 Farmer-focused digital platform
📷 Camera-based crop image capture
🤖 AI-assisted crop diagnosis
🌿 Treatment guidance
🌐 English, Telugu and Hindi support
🔊 Voice-assisted guidance
💰 Market information
🤝 Buyer discovery
👨‍🌾 FPO discovery
🧊 Cold storage support
🚚 Logistics support
📱 Mobile-friendly interface
📡 Offline synchronization concept
🔐 Authentication and user workflow
💳 Payment workflow demonstration
🎓 Project Type

Academic / Student MVP

Smart Crop Care is developed as a student project to demonstrate how Artificial Intelligence, Web Development, Multilingual Interfaces, and Digital Agricultural Services can be combined to create a farmer-focused technology solution.

The project is intended to demonstrate the concept and technical workflow and is not presented as a certified agricultural advisory system.

🌍 Vision

To make crop health information, treatment guidance, market access, and post-harvest support simpler and more accessible for farmers through technology.

Smart Crop Care aims to connect the entire journey:

Healthy Crop
     ↓
Better Diagnosis
     ↓
Better Guidance
     ↓
Better Market Awareness
     ↓
Better Connections
     ↓
Better Post-Harvest Planning
👨‍💻 Author
Charan Tej Murakonda

B.Tech – Computer Science & Engineering
Koneru Lakshmaiah Education Foundation (KL University)

GitHub:
https://github.com/MurakondaCharan

📌 Repository

Project: Smart Crop Care

GitHub:
https://github.com/MurakondaCharan/smart-crop-care

📄 License

License information will be added by the project owner.

⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.


