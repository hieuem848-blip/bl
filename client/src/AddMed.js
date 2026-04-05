import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json";

function AddMed() {
  const history = useHistory();
  useEffect(() => {
    loadWeb3();
    loadBlockchaindata();
  }, []);

  const [currentaccount, setCurrentaccount] = useState("");
  const [loader, setloader] = useState(true);
  const [SupplyChain, setSupplyChain] = useState();
  const [MED, setMED] = useState();
  const [MedName, setMedName] = useState();
  const [MedDes, setMedDes] = useState();
  const [MedStage, setMedStage] = useState();

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Vui lòng cài đặt MetaMask!");
    }
  };

  const loadBlockchaindata = async () => {
    setloader(true);
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    setCurrentaccount(account);
    const networkId = await web3.eth.net.getId();
    const networkData = SupplyChainABI.networks[networkId];
    if (networkData) {
      const supplychain = new web3.eth.Contract(SupplyChainABI.abi, networkData.address);
      setSupplyChain(supplychain);
      const medCtr = await supplychain.methods.medicineCtr().call();
      const med = {};
      const medStage = [];
      for (let i = 0; i < medCtr; i++) {
        med[i] = await supplychain.methods.MedicineStock(i + 1).call();
        medStage[i] = await supplychain.methods.showStage(i + 1).call();
      }
      setMED(med);
      setMedStage(medStage);
      setloader(false);
    } else {
      window.alert("Smart contract chưa được triển khai!");
    }
  };

  if (loader) {
    return (
      <div className="spinner-container">
        <div className="spinner-border" role="status"><span className="visually-hidden">Đang tải...</span></div>
      </div>
    );
  }

  const handlerSubmitMED = async (event) => {
    event.preventDefault();
    try {
      var receipt = await SupplyChain.methods.addMedicine(MedName, MedDes).send({ from: currentaccount });
      if (receipt) loadBlockchaindata();
    } catch (err) {
      alert("Lỗi khi tạo đơn hàng! Bạn có đủ quyền?");
    }
  };

  return (
    <div>
      <div className="card-modern">
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
          <span className="account-info text-muted"><b>🔑 Ví hiện tại:</b> {currentaccount}</span>
          <button onClick={() => history.push("/")} className="btn btn-custom-outline">🏠 Trang chủ</button>
        </div>

        <h4 className="card-title">📦 Tạo đơn hàng mới</h4>
        <form onSubmit={handlerSubmitMED} className="input-group-custom mb-4">
          <input className="form-control-sm-custom" type="text" onChange={(e)=>setMedName(e.target.value)} placeholder="Tên sản phẩm" required />
          <input className="form-control-sm-custom" type="text" onChange={(e)=>setMedDes(e.target.value)} placeholder="Mô tả sản phẩm" required />
          <button className="btn btn-custom-primary" type="submit">➕ Đặt hàng</button>
        </form>

        <h4 className="card-title">📋 Danh sách đơn hàng</h4>
        <table className="table table-custom">
          <thead><tr><th>ID</th><th>Tên sản phẩm</th><th>Mô tả</th><th>Giai đoạn hiện tại</th></tr></thead>
          <tbody>
            {Object.keys(MED).map(key => (
              <tr key={key}>
                <td>{MED[key].id}</td>
                <td>{MED[key].name}</td>
                <td>{MED[key].description}</td>
                <td><span className="badge-stage">{MedStage[key] || "Chưa xử lý"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AddMed;