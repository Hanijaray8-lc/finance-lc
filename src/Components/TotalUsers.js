import axios from 'axios';
import { useEffect, useState } from 'react';

function UserCount() {
  const [count, setCount] = useState(0);
  const [financecount, setFinanceCount] = useState(0);
    const [approved, setApproved] = useState(0);
  const [rejected, setRejected] = useState(0);

  // Fetch total users
  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/users/count')
      .then(res => setCount(res.data.totalUsers))
      .catch(err => console.error(err));
  }, []);

  // Fetch total finance companies
  useEffect(() => {
    axios.get('http://localhost:5000/api/financeCompanies/count')
      .then(res => setFinanceCount(res.data.totalCompanies))
      .catch(err => console.error(err));
  }, []);

    useEffect(() => {
    axios.get('http://localhost:5000/api/financeCompanies/status-counts')
      .then(res => {
        setApproved(res.data.approvedCount);
        setRejected(res.data.rejectedCount);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '10px' }}>
        <h3>Total Users</h3>
        <p>{count}</p>
      </div>

      <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '10px' }}>
        <h3>Total Finance Companies</h3>
        <p>{financecount}</p>
      </div>

      <div style={{ padding: '20px', background: '#e0ffe0', borderRadius: '10px' }}>
        <h3>Approved Companies</h3>
        <p>{approved}</p>
      </div>

      <div style={{ padding: '20px', background: '#ffe0e0', borderRadius: '10px' }}>
        <h3>Rejected Companies</h3>
        <p>{rejected}</p>
      </div>
    </div>
    </div>

       
  );
}

export default UserCount;

