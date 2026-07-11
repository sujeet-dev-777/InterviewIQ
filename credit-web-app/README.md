# Credit Web App

## Overview
The Credit Web App is a web application that allows users to purchase credits through a simple and intuitive interface. The application is structured with a frontend built using React and a backend powered by Node.js and Express.

## Features
- User-friendly interface for buying credits.
- Dummy payment processing to simulate real transactions.
- Responsive design with global styles.

## Project Structure
```
credit-web-app
├── src
│   ├── frontend
│   │   ├── index.tsx          # Entry point for the frontend application
│   │   ├── App.tsx            # Main App component with routing
│   │   ├── pages
│   │   │   ├── Home.tsx       # Landing page component
│   │   │   └── BuyCredits.tsx  # Component for purchasing credits
│   │   ├── components
│   │   │   ├── Header.tsx     # Navigation and branding component
│   │   │   └── CreditForm.tsx  # Form for credit purchase
│   │   ├── services
│   │   │   └── api.ts         # API calls to the backend
│   │   └── styles
│   │       └── globals.css    # Global CSS styles
│   ├── backend
│   │   ├── server.ts          # Entry point for the backend application
│   │   ├── controllers
│   │   │   └── paymentController.ts # Handles payment requests
│   │   ├── routes
│   │   │   └── paymentRoutes.ts # Defines payment-related endpoints
│   │   ├── services
│   │   │   └── paymentService.ts   # Dummy payment logic
│   │   ├── models
│   │   │   └── user.ts        # User data model
│   │   └── utils
│   │       └── validators.ts   # Validation functions
│   └── shared
│       └── types
│           └── index.ts       # Shared TypeScript types
├── tests
│   ├── frontend
│   │   └── BuyCredits.test.tsx # Tests for the BuyCredits component
│   └── backend
│       └── payment.test.ts     # Tests for payment functionality
├── package.json                # npm configuration file
├── tsconfig.json               # TypeScript configuration file
├── .env.example                # Example environment variables
└── README.md                   # Project documentation
```

## Getting Started

### Prerequisites
- Node.js
- npm

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd credit-web-app
   ```
3. Install dependencies:
   ```
   npm install
   ```

### Running the Application
1. Start the backend server:
   ```
   npm run start:backend
   ```
2. Start the frontend application:
   ```
   npm run start:frontend
   ```

### Usage
- Navigate to `http://localhost:3000` to access the application.
- Use the "Buy Credits" page to simulate purchasing credits.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.