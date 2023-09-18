import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import './RequestPage.css';
import data from './SelectionData';
import products from './ProductData';

const RequestPage = () => {
  const maxCharacters = 1000;

  const initialFormData = {
    businessType: '',
    product: [],
    productLead: '',
    spoc: '',
    issueType: '',
    issuePriority: '',
    observationDate: '',
    targetDate: '',
    observationDescription: '',
    recommendation: '',
    controlFunctionTargetDate: '',
    internalTargetDate: '',
    uploadFiles: [],
  };

  const array = data
    .filter((item) => item.type === 'business type')
    .map((item) => (
      <option key={item.title} value={item.value}>
        {item.title}
      </option>
    ));

  const issue = data
    .filter((item) => item.type === 'Issue Type')
    .map((item) => (
      <option key={item.title} value={item.value}>
        {item.title}
      </option>
    ));

  const [formData, setFormData] = useState(initialFormData);
  const [observationDescription, setObservationDescription] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [observationTyped, setObservationTyped] = useState(false);
  const [recommendationTyped, setRecommendationTyped] = useState(false);
  const [todolist, setTodoList] = useState([]);

  const handleSelectChange = (selectedOptions) => {
    const selectedProducts = selectedOptions.map((option) => option.value);
    let productLeads = '';
    let spocs = '';

    if (selectedOptions.length === 1) {
      productLeads = selectedOptions[0].ProductLead;
      spocs = selectedOptions[0].SPOC;
    } else if (selectedOptions.length >= 2) {
      productLeads = '';
      spocs = '';
    }

    setFormData({
      ...formData,
      product: selectedProducts,
      productLead: productLeads,
      spoc: spocs,
    });
  };

  const showProductLeadAndSpoc = formData.product.length <= 1;

  const selectedIssueType = (event) => {
    const selectedtitle = event.target.value;
    const selectedObj = data.find(
      (item) => item.type === 'Issue Type' && item.title === selectedtitle
    );
    const issuePriority = selectedObj ? selectedObj.priority : '';

    setFormData({
      ...formData,
      issueType: selectedtitle,
      issuePriority: issuePriority,
    });
  };

  const isFutureDate = (selectedDate) => {
    const today = new Date();
    const selected = new Date(selectedDate);
    return selected > today;
  };

  const handleObservationDateChange = (event) => {
    const selectedDate = event.target.value;

    if (isFutureDate(selectedDate)) {
      alert('Please Select a valid Observation Date.');
      return;
    }

    setFormData({
      ...formData,
      observationDate: selectedDate,
    });
  };

  const isPastDate = (selectedDate) => {
    const today = new Date();
    const selected = new Date(selectedDate);
    return selected < today;
  };

  const isBetweenDates = (selectedDate, startDate, endDate) => {
    const selected = new Date(selectedDate);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return selected >= start && selected <= end;
  };

  const handleTargetDateChange = (event) => {
    const selectedDate = event.target.value;

    if (isPastDate(selectedDate) || selectedDate === formData.observationDate) {
      alert('Please select a valid Target Date.');
      return;
    }

    setFormData({
      ...formData,
      targetDate: selectedDate,
    });
  };

  const handleInternalTargetDateChange = (event) => {
    const selectedDate = event.target.value;

    if (!isBetweenDates(selectedDate, formData.observationDate, formData.targetDate)) {
      alert('Please select an Internal Target Date between Observation Date and Target Date.');
      return;
    }

    setFormData({
      ...formData,
      internalTargetDate: selectedDate,
    });
  };

  const handleControlFunctionDateChange = (event) => {
    const selectedDate = event.target.value;

    if (selectedDate === formData.observationDate) {
      alert("Control Function Target Date cannot be the same as Observation Date.");
      return;
    }

    if (selectedDate > formData.observationDate) {
      alert("Control Function Target Date cannot be after Observation Date.");
      return;
    }

    setFormData({
      ...formData,
      controlFunctionTargetDate: selectedDate,
    });
  };

  const handleAddTodo = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setTodoList([...todolist, selectedFile]);
    }
  };

  const deleteTodo = (index) => {
    const updatedList = [...todolist];
    updatedList.splice(index, 1);
    setTodoList(updatedList);
  };

  const handleCreate = () => {
    
    const newData = {
      businessType: formData.businessType,
      product: formData.product,
      productLead: formData.productLead,
      spoc: formData.spoc,
      issueType: formData.issueType,
      issuePriority: formData.issuePriority,
      observationDate: formData.observationDate,
      targetDate: formData.targetDate,
      observationDescription,
      recommendation,
      controlFunctionTargetDate: formData.controlFunctionTargetDate,
      internalTargetDate: formData.internalTargetDate,
      uploadFiles: formData.uploadFiles,
    };

    
    const existingData = JSON.parse(localStorage.getItem('dataarray')) || [];

    if (formData.product.length === 1) {
      existingData.push(newData);
    } else if (formData.product.length >= 2) {
      const newData1 = { ...newData, product: [formData.product[0]] };
      const newData2 = { ...newData, product: [formData.product[1]] };
      existingData.push(newData1, newData2);
    }


    localStorage.setItem('dataarray', JSON.stringify(existingData));
    setFormData(initialFormData);
    setObservationDescription('');
    setRecommendation('');
    setObservationTyped(false);
    setRecommendationTyped(false);
    setTodoList([]);
  };

  return (
    <div className='request-page'>
      <div className='headandlinktodash d-flex align-items-center justify-content-between'>
        <h2>Control Request Form</h2>
        <div className='linktodash'>
          <Link to='/'>DASHBOARD</Link> / GOVERNANCE FORM
        </div>
      </div>
      <div className='boxshadow d-flex align-items-center justify-content-center'>
        <div className="formbox">
          <div className="row g-3 p-4">
            <div className="col-6">
              <label>Business Type <span className='symbol'>*</span></label>
              <select className="form-control"
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
              >
                <option value="">---Select Business----</option>
                {array}
              </select>
            </div>
            <div className="col-6">
              <label>Product <span className='symbol'>*</span></label>
              <Select
                isMulti
                name="colors"
                options={products}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleSelectChange}
              />
            </div>
            {showProductLeadAndSpoc && (
              <>
                <div className="col-6">
                  <label>Product Lead <span className="symbol">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.productLead}
                    placeholder="Enter names or email addresses..."
                    onChange={(e) => setFormData({ ...formData, productLead: e.target.value })}
                  />
                </div>
                <div className="col-6">
                  <label>SPOC<span className="symbol">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.spoc}
                    placeholder="Enter names or email addresses..."
                    onChange={(e) => setFormData({ ...formData, spoc: e.target.value })}
                  />
                </div>
              </>
            )}
            <div className="col-6">
              <label>Issue Type <span className='symbol'>*</span></label>
              <select className="form-control"
                value={formData.issueType}
                onChange={selectedIssueType}>
                <option value="">---Select Issue Type----</option>
                {issue}
              </select>
            </div>
            <div className="col-6">
              <label>Issue Priority <span className='symbol'>*</span></label>
              <input
                type="text"
                name='issuePriority'
                className="form-control"
                value={formData.issuePriority}
                placeholder="Issue priority"
              />
            </div>
            <div className="col-6">
              <label>Observation Date <span className='symbol'>*</span></label>
              <input
                type="date"
                className="form-control"
                value={formData.observationDate}
                onChange={handleObservationDateChange}
              />
            </div>
            <div className="col-6">
              <label>Target Date<span className='symbol'>*</span></label>
              <input
                type="date"
                className="form-control"
                value={formData.targetDate}
                onChange={handleTargetDateChange}
              />
            </div>
            <div className="col-6">
              <label htmlFor="observationDescription">Observation Description <span className="symbol">*</span></label>
              <textarea
                id="observationDescription"
                className="form-control"
                placeholder="Observation Description"
                value={observationDescription}
                onChange={(e) => {
                  const text = e.target.value;
                  if (text.length <= maxCharacters) {
                    setObservationDescription(text);
                  }
                }}
                onFocus={() => setObservationTyped(true)}
              />
              {observationTyped && <p>Characters remaining: {maxCharacters - observationDescription.length}</p>}
            </div>
            <div className="col-6">
              <label htmlFor="recommendation">Recommendation <span className="symbol">*</span></label>
              <textarea
                id="recommendation"
                className="form-control"
                placeholder="Recommendation"
                value={recommendation}
                onChange={(e) => {
                  const text = e.target.value;
                  if (text.length <= maxCharacters) {
                    setRecommendation(text);
                  }
                }}
                onFocus={() => setRecommendationTyped(true)}
              />
              {recommendationTyped && <p>Characters remaining: {maxCharacters - recommendation.length}</p>}
            </div>
            <div className="col-6">
              <label>Control Function Target Date <span className="symbol">*</span></label>
              <input
                type="date"
                className="form-control"
                value={formData.controlFunctionTargetDate}
                onChange={handleControlFunctionDateChange}
              />
            </div>
            <div className="col-6">
              <label>Internal Target Date<span className='symbol'>*</span></label>
              <input
                type="date"
                className="form-control"
                value={formData.internalTargetDate}
                onChange={handleInternalTargetDateChange}
              />
            </div>
            <div className="mb-3">
              <label>Upload Files<span className='symbol'>*</span></label>
              <input
                className="form-control w-50"
                type="file"
                id="formFile"
                onChange={handleAddTodo}
              />
              <ul>
                {todolist.map((file, index) => (
                  <li key={index}>
                    {file.name}
                    <button onClick={() => deleteTodo(index)}>Delete</button>
                  </li>
                ))}
              </ul>
            </div>

            <div className='formcreatebtn d-flex flex-row align-items-center justify-content-end'>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCreate}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestPage;
