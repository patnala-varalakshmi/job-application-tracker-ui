import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { getStatusClass } from '../utils/statusColors';
import { sortList } from '../utils/sortUtils'
import { validateApplication } from '../validations/applicationValidation';
import { formatDate } from '../helpers/dateHelpers'

const ApplicationApp = () => {
  const [applications, setApplications] = useState([]);
  const [newApplication, setNewApplication] = useState({ companyName: '', position: '', status: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = () => {
    api.get('/application')
      .then(res => setApplications(res.data))
      .catch(err => console.error(err));
  };

  const deleteApplication = (id) => {
    api.delete(`/application/${id}`)
      .then(() => fetchApplications())
      .catch(err => console.error(err));
  };

  const handleSubmit = async () => {
    const validationErrors = validateApplication(newApplication);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      if (isEditing) {
        try {
          await api.put(`/application/${editingId}`, {
            id: editingId,
            ...newApplication
          });
          fetchApplications();
          resetForm();
        } catch (err) {
          console.error(err);
        }
      } else {
        try {
          await api.post('/application', newApplication);
          fetchApplications();
          resetForm();
        } catch (err) {
          console.error(err);
        }
      }
    }
  };

  const handleEdit = (application) => {
    setNewApplication({ 
      companyName: application.companyName, 
      position: application.position, 
      status: application.status,
    });
    setEditingId(application.id);
    setIsEditing(true);
  };

  const resetForm = () => {
    setNewApplication({ companyName: '', position: '', status: '' });
    setIsEditing(false);
    setEditingId(null);
  };

  const sortedApplications = sortList(applications, sortKey, sortOrder);

  return (
    <div className="container my-5">
        <div className="card shadow">
          <div className="card-header bg-primary text-white">
            <h3>My Job Applications Tracker</h3>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-4 mb-2">
                <input
                  className="form-control"
                  placeholder="Company Name"
                  value={newApplication.companyName}
                  onChange={(e) => setNewApplication({ ...newApplication, companyName: e.target.value })}
                />
                {errors.company && <div className="text-danger mt-1">{errors.company}</div>}
              </div>

              <div className="col-md-4 mb-2">
                <input
                  className="form-control"
                  placeholder="Position"
                  value={newApplication.position}
                  onChange={(e) => setNewApplication({ ...newApplication, position: e.target.value })}
                />
                {errors.position && <div className="text-danger mt-1">{errors.position}</div>}
              </div>

              <div className="col-md-4 mb-2">
                <select
                  className="form-select"
                  value={newApplication.status}
                  onChange={(e) => setNewApplication({ ...newApplication, status: e.target.value })}
                >
                  <option value="">Select status</option>
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offered">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
                {errors.status && <div className="text-danger mt-1">{errors.status}</div>}
              </div>
            </div>

            <div className="mb-3">
              <button className="btn btn-primary me-2" onClick={handleSubmit}>
                {isEditing ? 'Update Application' : 'Add Application'}
              </button>
              {isEditing && (
                <button className="btn btn-secondary" onClick={resetForm}>Cancel</button>
              )}
            </div>

            <div className="d-flex justify-content-end align-items-center gap-2 mb-3">
              <select
                className="form-select w-auto"
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
              >
                <option value="createdAt">Created At</option>
                <option value="companyName">Company Name</option>
                <option value="status">Status</option>
              </select>

              <button
                className="btn btn-outline-secondary"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
              </button>
            </div>

            {applications.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-bordered table-hover mt-3">
                  <thead className="table-light">
                    <tr>
                      <th>Company Name</th>
                      <th>Position</th>
                      <th>Status</th>
                      <th>Applied on</th>
                      <th style={{ width: '150px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedApplications.map((application) => (
                      <tr key={application.id}>
                        <td>{application.companyName}</td>
                        <td>{application.position}</td>
                        <td>
                          <span className={`badge ${getStatusClass(application.status)}`}>
                            {application.status}
                          </span>
                        </td>
                        <td>{formatDate(application.createdAt)}</td>
                        <td>
                          <div className="d-flex flex-column flex-sm-row gap-2">
                            <button
                              className={`btn btn-sm ${
                                isEditing && editingId === application.id
                                  ? "btn-secondary disabled"
                                  : "btn-warning"
                              }`}
                              onClick={() => handleEdit(application)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => deleteApplication(application.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-muted mt-3">No applications found</div>
            )}

          </div>
        </div>
      </div>
  );
};

export default ApplicationApp;
