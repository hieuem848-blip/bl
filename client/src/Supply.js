import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json";

function Supply() {
  const history = useHistory();
  useEffect(() => {
    loadWeb3();
    loadBlockchaindata();
  }, []);

  const [currentaccount, setCurrentaccount] = useState("");
  const [loader, setloader] = useState(true);
  const [SupplyChain, setSupplyChain] = useState();
  const [MED, setMED] = useState();
  const [MedStage, setMedStage] = useState();

  // ✅ Fix: mỗi bước có state ID riêng, tránh xung đột khi nhập nhiều ô
  const [ID_RMS, setID_RMS] = useState();
  const [ID_MAN, setID_MAN] = useState();
  const [ID_DIS, setID_DIS] = useState();
  const [ID_RET, setID_RET] = useState();
  const [ID_SOLD, setID_SOLD] = useState();

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Cài đặt MetaMask để tiếp tục!");
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
      const medStage = {}; // ✅ Fix: object thay vì array
      for (let i = 0; i < medCtr; i++) {
        med[i + 1] = await supplychain.methods.MedicineStock(i + 1).call();
        medStage[i + 1] = await supplychain.methods.showStage(i + 1).call();
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

  // ✅ Fix: mỗi bước nhận đúng ID của chính nó
  const handlerSubmit = async (method, stepName, id) => {
    try {
      var receipt = await SupplyChain.methods[method](id).send({ from: currentaccount });
      if (receipt) loadBlockchaindata();
    } catch (err) {
      alert(`Lỗi ở bước ${stepName}! Kiểm tra quyền hoặc ID sản phẩm.`);
    }
  };

  return (
    <div>
      <div className="card-modern">
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
          <span className="account-info text-muted"><b>🔑 Ví hiện tại:</b> {currentaccount}</span>
          <button onClick={() => history.push("/")} className="btn btn-custom-outline">🏠 Trang chủ</button>
        </div>

        <h4 className="card-title">⚙️ Vận hành chuỗi cung ứng</h4>
        <p>Luồng: <strong>Đặt hàng → Cung cấp nguyên liệu → Sản xuất → Phân phối → Bán lẻ → Đã bán</strong></p>

        <table className="table table-custom mb-4">
          <thead><tr><th>ID hàng</th><th>Tên</th><th>Mô tả</th><th>Giai đoạn</th></tr></thead>
          <tbody>
            {Object.keys(MED).map(key => (
              <tr key={key}>
                <td>{MED[key].id}</td>
                <td>{MED[key].name}</td>
                <td>{MED[key].description}</td>
                <td><span className="badge-stage">{MedStage[key]}</span></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="row g-3">
          <div className="col-md-6 col-lg-4">
            <div className="card-modern h-100">
              <h5>🥬 1. Cung cấp nguyên liệu</h5>
              <p className="text-muted small">Chỉ nhà cung cấp (RMS)</p>
              <div className="input-group-custom">
                <input
                  className="form-control-sm-custom"
                  type="number" min="1"
                  onChange={(e) => setID_RMS(e.target.value)}
                  placeholder="ID sản phẩm"
                />
                <button
                  className="btn btn-custom-primary"
                  onClick={() => handlerSubmit("RMSsupply", "Cung cấp", ID_RMS)}
                >Xác nhận cung cấp</button>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card-modern h-100">
              <h5>🏭 2. Sản xuất</h5>
              <p className="text-muted small">Chỉ nhà sản xuất (MAN)</p>
              <div className="input-group-custom">
                <input
                  className="form-control-sm-custom"
                  type="number" min="1"
                  onChange={(e) => setID_MAN(e.target.value)}
                  placeholder="ID sản phẩm"
                />
                <button
                  className="btn btn-custom-primary"
                  onClick={() => handlerSubmit("Manufacturing", "Sản xuất", ID_MAN)}
                >Xác nhận sản xuất</button>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card-modern h-100">
              <h5>🚚 3. Phân phối</h5>
              <p className="text-muted small">Chỉ nhà phân phối (DIS)</p>
              <div className="input-group-custom">
                <input
                  className="form-control-sm-custom"
                  type="number" min="1"
                  onChange={(e) => setID_DIS(e.target.value)}
                  placeholder="ID sản phẩm"
                />
                <button
                  className="btn btn-custom-primary"
                  onClick={() => handlerSubmit("Distribute", "Phân phối", ID_DIS)}
                >Xác nhận phân phối</button>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card-modern h-100">
              <h5>🏪 4. Bán lẻ</h5>
              <p className="text-muted small">Chỉ nhà bán lẻ (RET)</p>
              <div className="input-group-custom">
                <input
                  className="form-control-sm-custom"
                  type="number" min="1"
                  onChange={(e) => setID_RET(e.target.value)}
                  placeholder="ID sản phẩm"
                />
                <button
                  className="btn btn-custom-primary"
                  onClick={() => handlerSubmit("Retail", "Bán lẻ", ID_RET)}
                >Xác nhận bán lẻ</button>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card-modern h-100">
              <h5>💰 5. Đã bán</h5>
              <p className="text-muted small">Chỉ nhà bán lẻ (RET)</p>
              <div className="input-group-custom">
                <input
                  className="form-control-sm-custom"
                  type="number" min="1"
                  onChange={(e) => setID_SOLD(e.target.value)}
                  placeholder="ID sản phẩm"
                />
                <button
                  className="btn btn-custom-primary"
                  onClick={() => handlerSubmit("sold", "Đánh dấu đã bán", ID_SOLD)}
                >Đánh dấu đã bán</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Supply;