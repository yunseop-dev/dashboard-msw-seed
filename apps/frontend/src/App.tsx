import { CustomerList } from './components/CustomerList';
import { PurchaseFrequencyChart } from './components/PurchaseFrequencyChart';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <PurchaseFrequencyChart />
        <CustomerList />
      </div>
    </div>
  );
};

export default App;