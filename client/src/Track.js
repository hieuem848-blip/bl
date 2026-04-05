import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json";

function Track() {
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
  const [ID, setID] = useState();
  const [RMS, setRMS] = useState();
  const [MAN, setMAN] = useState();
  const [DIS, setDIS] = useState();
  const [RET, setRET] = useState();
  const [showDetail, setShowDetail] = useState(false);
  const [trackData, setTrackData] = useState(null);

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
      const medStage = {}; // ✅ Fix: object thay vì array, tránh lỗi key type
      for (let i = 0; i < medCtr; i++) {
        med[i + 1] = await supplychain.methods.MedicineStock(i + 1).call();
        medStage[i + 1] = await supplychain.methods.showStage(i + 1).call();
      }
      setMED(med);
      setMedStage(medStage);

      const rmsCtr = await supplychain.methods.rmsCtr().call();
      const rms = {};
      for (let i = 0; i < rmsCtr; i++) rms[i + 1] = await supplychain.methods.RMS(i + 1).call();
      setRMS(rms);

      const manCtr = await supplychain.methods.manCtr().call();
      const man = {};
      for (let i = 0; i < manCtr; i++) man[i + 1] = await supplychain.methods.MAN(i + 1).call();
      setMAN(man);

      const disCtr = await supplychain.methods.disCtr().call();
      const dis = {};
      for (let i = 0; i < disCtr; i++) dis[i + 1] = await supplychain.methods.DIS(i + 1).call();
      setDIS(dis);

      const retCtr = await supplychain.methods.retCtr().call();
      const ret = {};
      for (let i = 0; i < retCtr; i++) ret[i + 1] = await supplychain.methods.RET(i + 1).call();
      setRET(ret);

      setloader(false);
    } else {
      window.alert("Smart contract chưa được triển khai!");
    }
  };

  const handlerSubmit = async (event) => {
    event.preventDefault();
    const ctr = await SupplyChain.methods.medicineCtr().call();
    const numID = parseInt(ID); // ✅ Fix: ép kiểu về number để khớp key trong MED
    if (!(numID > 0 && numID <= ctr)) {
      alert("ID sản phẩm không hợp lệ!");
    } else {
      const medicine = MED[numID];
      const stage = parseInt(medicine?.stage); // ✅ Fix: parseInt để so sánh số với số
      let detail = {
        id: numID,
        name: medicine.name,
        desc: medicine.description,
        stage: MedStage[numID], // ✅ Fix: dùng numID (number) thay vì ID (string)
      };
      if (stage >= 1) detail.rms = RMS[medicine.RMSid];
      if (stage >= 2) detail.man = MAN[medicine.MANid];
      if (stage >= 3) detail.dis = DIS[medicine.DISid];
      if (stage >= 4) detail.ret = RET[medicine.RETid];
      if (stage === 5) detail.sold = true; // ✅ Fix: hoạt động đúng sau parseInt
      setTrackData(detail);
      setShowDetail(true);
    }
  };

  if (loader) {
    return (
      <div className="spinner-container">
        <div className="spinner-border" role="status"><span className="visually-hidden">Đang tải...</span></div>
      </div>
    );
  }

  if (showDetail && trackData) {
    return (
      <div className="card-modern">
        <h4 className="card-title">🔍 Chi tiết sản phẩm ID {trackData.id}</h4>
        <p><strong>Tên:</strong> {trackData.name}</p>
        <p><strong>Mô tả:</strong> {trackData.desc}</p>
        <p><strong>Giai đoạn hiện tại:</strong> {trackData.stage}</p>
        <hr />
        {trackData.rms && (
          <div className="mb-3">
            <h5>🥬 Cung cấp nguyên liệu bởi:</h5>
            <p className="mb-0"><strong>Tên:</strong> {trackData.rms.name}</p>
            <p><strong>Địa điểm:</strong> {trackData.rms.place}</p>
          </div>
        )}
        {trackData.man && (
          <div className="mb-3">
            <h5>🏭 Sản xuất bởi:</h5>
            <p className="mb-0"><strong>Tên:</strong> {trackData.man.name}</p>
            <p><strong>Địa điểm:</strong> {trackData.man.place}</p>
          </div>
        )}
        {trackData.dis && (
          <div className="mb-3">
            <h5>🚚 Phân phối bởi:</h5>
            <p className="mb-0"><strong>Tên:</strong> {trackData.dis.name}</p>
            <p><strong>Địa điểm:</strong> {trackData.dis.place}</p>
          </div>
        )}
        {trackData.ret && (
          <div className="mb-3">
            <h5>🏪 Bán lẻ bởi:</h5>
            <p className="mb-0"><strong>Tên:</strong> {trackData.ret.name}</p>
            <p><strong>Địa điểm:</strong> {trackData.ret.place}</p>
          </div>
        )}
        {trackData.sold && (
          <div className="mb-3">
            <h5>💰 Đã bán cho người tiêu dùng</h5>
          </div>
        )}
        <button onClick={() => setShowDetail(false)} className="btn btn-custom-primary mt-3">🔍 Tra cứu sản phẩm khác</button>
        <button onClick={() => history.push("/")} className="btn btn-custom-outline mt-3 ms-2">🏠 Trang chủ</button>
      </div>
    );
  }

  return (
    <div className="card-modern">
      <div className="d-flex justify-content-between flex-wrap mb-3">
        <span className="account-info text-muted"><b>🔑 Ví hiện tại:</b> {currentaccount}</span>
        <button onClick={() => history.push("/")} className="btn btn-custom-outline">🏠 Trang chủ</button>
      </div>
      <h4 className="card-title">📋 Danh sách sản phẩm</h4>
      <table className="table table-custom mb-4">
        <thead>
          <tr><th>ID</th><th>Tên</th><th>Mô tả</th><th>Giai đoạn</th></tr>
        </thead>
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
      <h5>🔎 Nhập ID sản phẩm để truy xuất nguồn gốc</h5>
      <form onSubmit={handlerSubmit} className="input-group-custom mt-3">
        <input
          className="form-control-sm-custom"
          type="number"
          min="1"
          onChange={(e) => setID(e.target.value)}
          placeholder="Nhập ID sản phẩm"
          required
        />
        <button className="btn btn-custom-primary" type="submit">Truy xuất</button>
      </form>
    </div>
  );
}

export default Track;