import React, { useState, useEffect } from 'react';
import './Mainn.css';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function Mainn() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'debit'
  });
  const [dataList, setDataList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const location = useLocation();
  const user = location.state;

  useEffect(() => {
    if (!user || !user.Email) return;

    async function fetchData() {
      try {
        const response = await axios.get(`/mainn/${encodeURIComponent(user.Email)}`);
        setDataList(response.data);
      } catch (e) {
        console.error("Error fetching data:", e);
        setDataList([]);
      }
    }
    fetchData();
  }, [user]);

  const totalBalance = dataList.reduce((acc, entry) => {
    return entry.type === 'credit' ? acc + entry.amount : acc - entry.amount;
  }, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openAddForm = () => {
    setEditIndex(null);
    setFormData({ description: '', amount: '', type: 'debit' });
    setShowForm(true);
  };

  const openEditForm = (index) => {
    const entry = dataList[index];
    setFormData({
      description: entry.description,
      amount: entry.amount,
      type: entry.type
    });
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = async (index) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    const entry = dataList[index];
    try {
      await axios.delete(`/mainn/${entry._id}`);
      setDataList(prev => prev.filter((_, i) => i !== index));
    } catch (e) {
      console.error(e);
      alert("Failed to delete entry.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.Email) {
      alert("User email missing!");
      return;
    }

    const newEntry = {
      Email: user.Email,
      description: formData.description,
      amount: Number(formData.amount),
      type: formData.type,
    };

    try {
      if (editIndex === null) {
        const response = await axios.post('/mainn', newEntry);
        if (response.status === 200 && response.data.message === "Entry submitted") {
          // Fetch the updated list
          const refreshed = await axios.get(`/mainn/${encodeURIComponent(user.Email)}`);
          setDataList(refreshed.data);
        } else {
          alert(response.data.message || "Submission error");
        }
      } else {
        const entryToUpdate = dataList[editIndex];
        const response = await axios.put(`/mainn/${entryToUpdate._id}`, newEntry);
        if (response.status === 200 && response.data.message === "Entry updated") {
          setDataList(prev => {
            const updated = [...prev];
            updated[editIndex] = response.data.entry;
            return updated;
          });
        } else {
          alert(response.data.message || "Update error");
        }
      }
    } catch (e) {
      console.error(e);
      alert("Submission failed");
    }

    setFormData({ description: '', amount: '', type: 'debit' });
    setShowForm(false);
    setEditIndex(null);
  };

  return (
    <div className="main-container">
      <div className="top-bar">
        <h2>Hisaaab Kitaab</h2>
        <div className="balance">Total Balance: ₹{totalBalance}</div>
      </div>

      <div className="content">
        <button className="add-button" onClick={openAddForm}>
          <FaPlus /> Add Entry
        </button>

        {dataList.length === 0 && <p>No entries found.</p>}

        {dataList.map((val, ind) => {
          const isCredit = val.type === 'credit';
          return (
            <div key={val._id || ind} className="databox">
              <div className="description">{val.description}</div>
              <div className="amountt" style={{ color: isCredit ? 'green' : 'red' }}>
                {isCredit ? `₹${val.amount}` : `- ₹${val.amount}`}
              </div>
              <div className="button-group">
                <button className="edit-btn" onClick={() => openEditForm(ind)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(ind)}>Delete</button>
              </div>
            </div>
          );
        })}

        {showForm && (
          <div className="modal-overlay">
            <div className="modal-form">
              <h3>{editIndex === null ? "Add New Entry" : "Edit Entry"}</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-line">
                  <label>Description</label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-line">
                  <label>Amount (₹)</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    min="0.01"
                    step="0.01"
                  />
                </div>

                <div className="form-line radio-group">
                  <label>Type</label>
                  <div className="radio-options">
                    <label>
                      <input
                        type="radio"
                        name="type"
                        value="debit"
                        checked={formData.type === 'debit'}
                        onChange={handleChange}
                      />
                      Debit
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="type"
                        value="credit"
                        checked={formData.type === 'credit'}
                        onChange={handleChange}
                      />
                      Credit
                    </label>
                  </div>
                </div>

                <div className="form-buttons">
                  <button type="submit" className="ok-btn">OK</button>
                  <button
                    type="button"
                    className="close-btn"
                    onClick={() => {
                      setShowForm(false);
                      setEditIndex(null);
                    }}
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Mainn;
