import logo from './logo.svg';
import './App.css';
import Button from '@mui/material/Button';
import BuyButton from './components/BuyButton';
import BuyForm from './components/BuyForm';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <BuyButton /> */}
        <BuyForm />
      </header>
    </div>
  );
}

export default App;
