# Helion Contract Management System

A modern, responsive web application for managing offers and contracts with a streamlined workflow for creating, tracking, and updating business offers and contracts.

## Features

### Offer Management
- Create new offers for potential clients
- Update offer details, prices, and validity periods
- Track offer status (Draft, Sent, Accepted, Rejected)
- Convert accepted offers to contracts

### Contract Management
- Create new contracts with or without prior offers
- Update contract details, duration, and payment terms
- Track contract status (Draft, Active, Suspended, Terminated, Completed)
- Close completed contracts

### Dashboard
- Overview of offer and contract statistics
- Quick actions for creating new offers and contracts
- Recent activity tracking

## Tech Stack

- **Frontend**: React with TypeScript
- **State Management**: Redux Toolkit
- **Styling**: TailwindCSS with Shadcn/UI components
- **Routing**: React Router
- **Development**: Vite
- **Containerization**: Docker

## Getting Started

### Prerequisites

- Node.js 20 or higher
- Docker (optional, for containerized development)

### Installation

#### Using Docker

1. Clone the repository

```bash
git clone https://github.com/your-username/helion-contract-system.git
cd helion-contract-system
```

2. Start the Docker container

```bash
docker-compose up -d
```

3. Access the application at `http://localhost:5173`

#### Local Development

1. Clone the repository

```bash
git clone https://github.com/your-username/helion-contract-system.git
cd helion-contract-system
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

4. Access the application at `http://localhost:5173`

## Project Structure

```
helion-contract-system/
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── ui/         # Base UI components (shadcn/ui)
│   │   ├── offers/     # Offer-specific components
│   │   └── contracts/  # Contract-specific components
│   ├── layouts/        # Page layouts
│   ├── lib/            # Utility functions
│   ├── pages/          # Page components
│   │   ├── offers/     # Offer-related pages
│   │   └── contracts/  # Contract-related pages
│   ├── store/          # Redux store configuration
│   │   └── slices/     # Redux slices
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Main application component
│   ├── index.css       # Global styles
│   └── main.tsx        # Application entry point
├── public/             # Static assets
├── docker-compose.yml  # Docker Compose configuration
├── Dockerfile          # Docker configuration
├── index.html          # HTML entry point
├── package.json        # Project dependencies
├── tailwind.config.js  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## Workflow

1. **Create an Offer**: Start by creating a new offer for a potential client.
2. **Send and Track the Offer**: Update the offer status as it progresses.
3. **Convert to Contract**: When an offer is accepted, convert it to a contract.
4. **Manage the Contract**: Track contract progress and make updates as needed.
5. **Close the Contract**: Mark contracts as completed when finished.

## Future Enhancements

- User authentication and role-based access control
- Integration with external CRM or ERP systems
- Document generation (PDF exports)
- Email notifications for offer/contract status changes
- Advanced reporting and analytics
- Integration with payment systems