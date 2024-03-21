import React from "react";
import TransactionDashboard from './components/TransactionDashboard'
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import TransactionStatistics from './components/TransactionStatistic';
import BarChart from "./components/BarChart";

function App() {
  return (
    // <>
    //   <div ><TransactionDashboard/></div>
    // </>

    <Router>
    <div>
     <Routes>
       <Route exact path="/" element={<TransactionDashboard/>}/>
       <Route exact path="/statistics" element={<TransactionStatistics/>}/>
       <Route exact path="/bar-chart" element={<BarChart/>}/>
     </Routes>
    </div>
 </Router>
  );
}

export default App;