import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Dashboard } from './pages/dashboard';
import { Auth } from './pages/auth';
import { ThemeProvider } from "@/components/theme-provider"
import { FinancialRecordsProvider } from './contexts/financial-records-context';


function App() {

  return (
    
    <Router>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="app-container">
          <Routes>
            <Route path="/" element = {
              <FinancialRecordsProvider>
                <Dashboard />
              </FinancialRecordsProvider>}/>
            <Route path="/auth" element={<Auth/>} />
          </Routes>
          
        </div> 
      </ThemeProvider>       
    </Router>
  );
}

export default App
