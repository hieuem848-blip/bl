import React, { useState, useEffect } from 'react';
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json";
import { useHistory } from "react-router-dom";

function AssignRoles() {
  const history = useHistory();
  useEffect(() => {
    loadWeb3();
    loadBlockchaindata();
  }, []);

  const [currentaccount, setCurrentaccount] = useState("");
  const [loader, setloader] = useState(true);
  const [SupplyChain, setSupplyChain] = useState();
  const [RMSname, setRMSname] = useState();
  const [MANname, setMANname] = useState();
  const [DISname, setDISname] = useState();
  const [RETname, setRETname] = useState();
  const [RMSplace, setRMSplace] = useState();
  const [MANplace, setMANplace] = useState();
  const [DISplace, setDISplace] = useState();
  const [RETplace, setRETplace] = useState();
  const [RMSaddress, setRMSaddress] = useState();
  const [MANaddress, setMANaddress] = useState();
  const [DISaddress, setDISaddress] = useState();
  const [RETaddress, setRETaddress] = useState();
  const [RMS, setRMS] = useState();
  const [MAN, setMAN] = useState();
  const [DIS, setDIS] = useState();
  const [RET, setRET] = useState();

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Không tìm thấy MetaMask! Hãy cài đặt ví Ethereum.");
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
      let i;
      const rmsCtr = await supplychain.methods.rmsCtr().call();
      const rms = {};
      for (i = 0; i < rmsCtr; i++) {
        rms[i] = await supplychain.methods.RMS(i + 1).call();
      }
      setRMS(rms);
      const manCtr = await supplychain.methods.manCtr().call();
      const man = {};
      for (i = 0; i < manCtr; i++) {
        man[i] = await supplychain.methods.MAN(i + 1).call();
      }
      setMAN(man);
      const disCtr = await supplychain.methods.disCtr().call();
      const dis = {};
      for (i = 0; i < disCtr; i++) {
        dis[i] = await supplychain.methods.DIS(i + 1).call();
      }
      setDIS(dis);
      const retCtr = await supplychain.methods.retCtr().call();
      const ret = {};
      for (i = 0; i < retCtr; i++) {
        ret[i] = await supplychain.methods.RET(i + 1).call();
      }
      setRET(ret);
      setloader(false);
    } else {
      window.alert('Smart contract chưa được triển khai trên mạng này');
    }
  };

  if (loader) {
    return (
      <div className="spinner-container">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  const redirect_to_home = () => history.push('/');

  // Handler tương tự giữ nguyên nhưng thay alert tiếng Việt
  const handlerSubmitRMS = async (event) => {
    event.preventDefault();
    try {
      var receipt = await SupplyChain.methods.addRMS(RMSaddress, RMSname, RMSplace).send({ from: currentaccount });
      if (receipt) loadBlockchaindata();
    } catch (err) {
      alert("Lỗi khi thêm nhà cung cấp! Kiểm tra quyền.");
    }
  };
  const handlerSubmitMAN = async (event) => {
    event.preventDefault();
    try {
      var receipt = await SupplyChain.methods.addManufacturer(MANaddress, MANname, MANplace).send({ from: currentaccount });
      if (receipt) loadBlockchaindata();
    } catch (err) {
      alert("Lỗi khi thêm nhà sản xuất!");
    }
  };
  const handlerSubmitDIS = async (event) => {
    event.preventDefault();
    try {
      var receipt = await SupplyChain.methods.addDistributor(DISaddress, DISname, DISplace).send({ from: currentaccount });
      if (receipt) loadBlockchaindata();
    } catch (err) {
      alert("Lỗi khi thêm nhà phân phối!");
    }
  };
  const handlerSubmitRET = async (event) => {
    event.preventDefault();
    try {
      var receipt = await SupplyChain.methods.addRetailer(RETaddress, RETname, RETplace).send({ from: currentaccount });
      if (receipt) loadBlockchaindata();
    } catch (err) {
      alert("Lỗi khi thêm nhà bán lẻ!");
    }
  };

  return (
    <div>
      <div className="card-modern">
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
          <span className="account-info text-muted"><b>🔑 Ví của bạn:</b> {currentaccount}</span>
          <button onClick={redirect_to_home} className="btn btn-custom-outline">🏠 Trang chủ</button>
        </div>

        {/* Nhà cung cấp nguyên liệu */}
        <div className="mb-5">
          <h4 className="card-title">🥬 Nhà cung cấp nguyên liệu thô (RMS)</h4>
          <form onSubmit={handlerSubmitRMS} className="input-group-custom mb-3">
            <input className="form-control-sm-custom" type="text" onChange={(e)=>setRMSaddress(e.target.value)} placeholder="Địa chỉ Ethereum" required />
            <input className="form-control-sm-custom" type="text" onChange={(e)=>setRMSname(e.target.value)} placeholder="Tên công ty" required />
            <input className="form-control-sm-custom" type="text" onChange={(e)=>setRMSplace(e.target.value)} placeholder="Trụ sở" required />
            <button className="btn btn-custom-primary" type="submit">➕ Đăng ký</button>
          </form>
          <table className="table table-custom">
            <thead><tr><th>ID</th><th>Tên</th><th>Địa điểm</th><th>Địa chỉ ví</th></tr></thead>
            <tbody>
              {Object.keys(RMS).map(key => (
                <tr key={key}><td>{RMS[key].id}</td><td>{RMS[key].name}</td><td>{RMS[key].place}</td><td>{RMS[key].addr}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Nhà sản xuất */}
        <div className="mb-5">
          <h4 className="card-title">🏭 Nhà sản xuất (Manufacturer)</h4>
          <form onSubmit={handlerSubmitMAN} className="input-group-custom mb-3">
            <input className="form-control-sm-custom" type="text" onChange={(e)=>setMANaddress(e.target.value)} placeholder="Địa chỉ Ethereum" required />
            <input className="form-control-sm-custom" type="text" onChange={(e)=>setMANname(e.target.value)} placeholder="Tên công ty" required />
            <input className="form-control-sm-custom" type="text" onChange={(e)=>setMANplace(e.target.value)} placeholder="Trụ sở" required />
            <button className="btn btn-custom-primary" type="submit">➕ Đăng ký</button>
          </form>
          <table className="table table-custom">
            <thead><tr><th>ID</th><th>Tên</th><th>Địa điểm</th><th>Địa chỉ ví</th></tr></thead>
            <tbody>
              {Object.keys(MAN).map(key => (
                <tr key={key}><td>{MAN[key].id}</td><td>{MAN[key].name}</td><td>{MAN[key].place}</td><td>{MAN[key].addr}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Nhà phân phối */}
        <div className="mb-5">
          <h4 className="card-title">🚚 Nhà phân phối (Distributor)</h4>
          <form onSubmit={handlerSubmitDIS} className="input-group-custom mb-3">
            <input className="form-control-sm-custom" type="text" onChange={(e)=>setDISaddress(e.target.value)} placeholder="Địa chỉ Ethereum" required />
            <input className="form-control-sm-custom" type="text" onChange={(e)=>setDISname(e.target.value)} placeholder="Tên công ty" required />
            <input className="form-control-sm-custom" type="text" onChange={(e)=>setDISplace(e.target.value)} placeholder="Trụ sở" required />
            <button className="btn btn-custom-primary" type="submit">➕ Đăng ký</button>
          </form>
          <table className="table table-custom">
            <thead><tr><th>ID</th><th>Tên</th><th>Địa điểm</th><th>Địa chỉ ví</th></tr></thead>
            <tbody>
              {Object.keys(DIS).map(key => (
                <tr key={key}><td>{DIS[key].id}</td><td>{DIS[key].name}</td><td>{DIS[key].place}</td><td>{DIS[key].addr}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Nhà bán lẻ */}
        <div>
          <h4 className="card-title">🏪 Nhà bán lẻ (Retailer)</h4>
          <form onSubmit={handlerSubmitRET} className="input-group-custom mb-3">
            <input className="form-control-sm-custom" type="text" onChange={(e)=>setRETaddress(e.target.value)} placeholder="Địa chỉ Ethereum" required />
            <input className="form-control-sm-custom" type="text" onChange={(e)=>setRETname(e.target.value)} placeholder="Tên cửa hàng" required />
            <input className="form-control-sm-custom" type="text" onChange={(e)=>setRETplace(e.target.value)} placeholder="Địa điểm" required />
            <button className="btn btn-custom-primary" type="submit">➕ Đăng ký</button>
          </form>
          <table className="table table-custom">
            <thead><tr><th>ID</th><th>Tên</th><th>Địa điểm</th><th>Địa chỉ ví</th></tr></thead>
            <tbody>
              {Object.keys(RET).map(key => (
                <tr key={key}><td>{RET[key].id}</td><td>{RET[key].name}</td><td>{RET[key].place}</td><td>{RET[key].addr}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AssignRoles;