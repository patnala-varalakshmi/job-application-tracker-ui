import React, { useEffect, useState } from 'react';
import { api } from '../api';

const JobApplicationList = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    api.get('/application')
      .then(res => setApplications(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Job Applications</h2>
      <ul>
        {applications.length > 0 ? (
          applications.map(app => (
            <li key={app.id}>
              {app.companyName} - {app.position} ({app.status})
            </li>
          ))
        ) : (
          <li>No applications found</li>
        )}
      </ul>
    </div>
  );
};

export default JobApplicationList;
