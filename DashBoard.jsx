import React, { useState, useEffect } from 'react';
import './DashBoard.css';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { Link } from 'react-router-dom';

const DashBoard = () => {
  const [nonOverdueLength, setNonOverdueLength] = useState(0);
  const [overdue, setOverdue] = useState(0);
  const [isarray, setIsArray] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedoption, setSelectedOption] = useState('Total');
  const [clickedButton, setClickedButton] = useState('');

  useEffect(() => {
    const dataarray = JSON.parse(localStorage.getItem('dataarray')) || [];
    setIsArray(dataarray);
    const nonOverdueItems = dataarray.filter((item) => item.status !== 'Overdue');
    setNonOverdueLength(nonOverdueItems.length);
    const overdueItems = dataarray.filter((item) => item.status === 'Overdue');
    setOverdue(overdueItems.length);
    setFilteredData(dataarray);
  }, [clickedButton]);

  const handleFilter = (filterOption) => {
    setSelectedOption(filterOption);
    setClickedButton(filterOption);
    let newData = [];
    if (filterOption === 'Total') {
      newData = isarray;
    } else if (filterOption === 'Non-overdue') {
      newData = isarray.filter((item) => item.status !== 'Overdue');
    } else if (filterOption === 'Overdue') {
      newData = isarray.filter((item) => item.status === 'Overdue');
    }
    setFilteredData(newData);
  };

  const handleSelectChange = (event) => {
    const entries = event.target.value;
  };

  return (
    <div className='dashboard-page'>
      <div className='heading'>
        <h2>DASHBOARD</h2>
      </div>
      <div className='createbtn d-flex justify-content-end'>
        <Link to="RequestPage"><button type="button" className="btn btn-primary">Create Request</button></Link>
      </div>
      <div className='dashbox mt-2'>
        <div>
          <button type="button" style={{ backgroundColor: '#acd9e7' }} className="btn-primary btns" onClick={() => handleFilter('Total')}>
            Total({isarray.length})
          </button>
          <button type="button" style={{ backgroundColor: '#fffd00' }} className="btn-primary btns" onClick={() => handleFilter('Non-overdue')}>
            Non-overdue({nonOverdueLength})
          </button>
          <button type="button" style={{ backgroundColor: '#f10708' }} className="btn-primary btns" onClick={() => handleFilter('Overdue')}>
            Overdue({overdue})
          </button>
        </div>
        <div className='searchandshow d-flex flex-row align-items-center justify-content-between'>
          <div className='show'>
            <label>Show</label>
            <select onChange={handleSelectChange}>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6</option>
              <option>7</option>
              <option>8</option>
              <option>9</option>
              <option>10</option>
            </select>
            <label>entries</label>
          </div>
          <div className='searchportion d-flex flex-row mt-2 align-items-center col-3'>
            <label htmlFor="text" id="search">Search:</label>
            <input type="text" className="form-control" />
          </div>
        </div>
        <div className="table-responsive">
          <Table className="mt-2" bordered>
            <thead>
              <tr>
                <th>ID</th>
                <th>Business Type</th>
                <th>Product</th>
                <th>Issue Priority</th>
                <th>Issue Type</th>
                <th>Target Date</th>
{/*              <th>Action Status</th>
 */}            </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.businessType}</td>
                  <td>{item.product}</td>
                  <td>{item.issuePriority}</td>
                  <td>{item.issueType}</td>
                  <td>{item.targetDate}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <div className='prevandnext d-flex align-items-center justify-content-between'>
          <label>Showing {filteredData.length} of {isarray.length} entries</label>
          <div className='twobtns'>
            <ButtonGroup aria-label="Basic example">
              <Button variant="secondary">Prev</Button>
              <Button variant="secondary">Next</Button>
            </ButtonGroup>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
