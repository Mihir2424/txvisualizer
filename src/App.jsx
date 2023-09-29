import { useEffect, useState } from "react";
import "./App.css";
import TreeComponent from "./components/TreeComponent";
import FormSection from "./components/formSection";

const App = () => {
  const [data, setData] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  useEffect(() => {
    console.log(data, "data (updated)");
  }, [data]);
  return (
    <div className="mainApp">
      <FormSection record={data} setData={setData} setWalletAddress={setWalletAddress} />
      {data !== null && <TreeComponent responseData={data} centralAddress={walletAddress} />}
    </div>
  );
};

export default App;
