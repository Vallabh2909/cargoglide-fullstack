# SMB Logistics Automation Platform :- CargoGlide

## Overview
A scalable and user-friendly platform to streamline logistics for SMBs by automating order creation, shipping, and tracking processes.

## Key Features
- **Signup & Account Creation**: Simple registration using name, email, company name, contact number, and IEC code.
- **Dashboard**: Real-time updates on orders (delayed, new, ready to ship).
- **Order Creation**: Add order details including source/destination, product details, and dimensions.
- **Shipping Options**: Compare carriers, modes (air, water, road), pricing, and delivery times.
- **Shipping Execution**: Generate waybills, calculate charges, and print labels/invoices.
- **Real-Time Tracking**: Live updates from source to destination.
- **Notifications**: SMS and email updates for order status and tracking.

## Technical Stack
- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Cloud & Deployment**: AWS (EC2, S3, Lambda), Docker, Kubernetes (EKS)
- **AI/ML**: TensorFlow.js / Python (Flask/Django)
- **Communication**: Socket.io, Twilio, SendGrid
- **Payment Gateway**: Razorpay
- **APIs**: Shipping APIs (FedEx, DHL, UPS)
- **Documentation**: PDFKit/jsPDF for labels, invoices, and customs documents.

## Innovation Highlights
- **AI-Powered Recommendations**: Suggest best carriers and shipping modes.
- **Hidden Fee Estimator**: Predicts customs, taxes, and handling charges.
- **Automated Customs Documentation**: Generates necessary forms automatically.
- **Collaborative Workspace**: Enables real-time team collaboration.

## Key Metrics for Success
- User satisfaction (NPS, feedback)
- Platform adoption (active users, repeat usage)
- Shipping cost savings due to AI
- Time saved through automation
- Scalability and feature expansion.

## How to Run Locally
1. Clone the repository:
   ```bash
   git clone <repo-url>

2. Run following commands in both folders:
   ```bash
   npm i && npm run dev
