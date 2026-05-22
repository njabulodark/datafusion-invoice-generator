import { InvoiceContextProvider } from './contexts/InvoiceContext';
import InvoiceForm from './components/InvoiceForm/InvoiceForm';
import InvoicePreview from './components/InvoicePreview/InvoicePreview';

function App() {
  return (
    <InvoiceContextProvider>
      <div className="min-h-screen bg-gray-100">
        <div className="flex flex-col lg:flex-row gap-6 p-6">
          {/* Form Panel */}
          <div className="w-full lg:w-1/2 lg:max-w-xl">
            <div className="sticky top-6">
              <InvoiceForm />
            </div>
          </div>

          {/* Preview Panel */}
          <div className="w-full lg:w-1/2">
            <div className="lg:sticky lg:top-6">
              <InvoicePreview />
            </div>
          </div>
        </div>
      </div>
    </InvoiceContextProvider>
  );
}

export default App;
