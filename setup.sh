#!/bin/bash
cd /a0/usr/workdir/datafusion-invoice-generator

# Create directory structure
mkdir -p src/components/InvoiceForm
mkdir -p src/components/InvoicePreview
mkdir -p src/components/PDFGenerator
mkdir -p src/components/UI
mkdir -p src/contexts
mkdir -p src/hooks
mkdir -p src/utils
mkdir -p src/templates
mkdir -p public

# Create index.html
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DataFusion Creation - Invoice Generator</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
EOF

# Create vite.config.js
cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
EOF

# Create postcss.config.js
cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# Create tailwind.config.js
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF

# Create src/index.css
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

# Create src/main.jsx
cat > src/main.jsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOF

# Create src/App.jsx
cat > src/App.jsx << 'EOF'
import { InvoiceContextProvider } from './contexts/InvoiceContext';
import InvoiceForm from './components/InvoiceForm/InvoiceForm';
import InvoicePreview from './components/InvoicePreview/InvoicePreview';

function App() {
  return (
    <InvoiceContextProvider>
      <div className="flex h-screen bg-gray-100">
        <InvoiceForm />
        <InvoicePreview />
      </div>
    </InvoiceContextProvider>
  );
}

export default App;
EOF

echo "Project structure created successfully!"
