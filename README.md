# DataFusion Creation - Invoice Generator MVP

A modern, responsive web application for creating, previewing, and exporting professional invoices. Built with React 18+, Vite, and Tailwind CSS.

## Features

- **Invoice Creation Form**: Input business details, client info, line items, tax, and discounts
- **Line Item Management**: Dynamic add/edit/delete with auto-calculated amounts
- **Auto Calculations**: Real-time subtotal, tax, discount, and grand total computation
- **Live Preview**: WYSIWYG invoice preview matching PDF output
- **PDF Export**: Professional PDF generation using @react-pdf/renderer
- **Invoice Numbering**: Auto-generated sequential invoice numbers (DFC-YYYY-NNN)
- **Business Branding**: Logo upload, custom company details
- **Draft Persistence**: Automatic save/load using LocalStorage
- **Responsive UI**: Mobile-first design with side-by-side layout on desktop

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18+ | UI framework |
| Vite | Build tool and dev server |
| Tailwind CSS | Utility-first styling |
| @react-pdf/renderer | PDF generation |
| React Hook Form | Form management |
| Lucide React | Icon library |
| dayjs | Date handling |
| LocalStorage | Client-side persistence |

## Project Structure

```
src/
├── components/
│   ├── InvoiceForm/          # Main form components
│   ├── InvoicePreview/       # Live preview
│   ├── PDFGenerator/         # PDF template
│   └── UI/                   # Reusable UI components
├── contexts/                 # Global state
├── hooks/                    # Custom hooks
├── utils/                    # Utilities
├── templates/                # PDF templates
├── App.jsx                   # Main app
└── main.jsx                  # Entry point
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Usage

1. Fill in your business details
2. Enter client information
3. Add line items (description, quantity, rate)
4. Set tax and discount rates
5. Preview your invoice in real-time
6. Click "Export PDF" to download

## Success Metrics

- Invoice creation time: < 3 minutes
- PDF generation: < 2 seconds
- Page load time: < 1.5 seconds
- Fully responsive across all devices

## Future Enhancements

- Multi-template selection
- Multi-currency support
- User authentication & accounts
- Database backend
- Email invoicing
- Payment gateway integration

## License

MIT
