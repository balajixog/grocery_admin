import React, { useState, useEffect } from 'react';
import '../css/UserManagement.css'; // Import CSS for UserManagement

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // To manage editing mode
  const [selectedUser, setSelectedUser] = useState(null); // Store the user being edited
  const [newPassword, setNewPassword] = useState(''); // Store new password

  useEffect(() => {
    // Fetch user data from the backend API
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/users'); // Replace with your correct endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsEditing(true); // Enable editing mode
  };

  const handleSavePassword = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/user/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: newPassword }),
      });
      if (!response.ok) {
        throw new Error('Failed to update password');
      }
      alert('Password updated successfully!');
      setIsEditing(false); // Close edit mode
      setNewPassword(''); // Clear the new password input
    } catch (error) {
      alert('Error updating password');
    }
  };

  if (loading) {
    return <div className="user-management">Loading users...</div>;
  }

  if (error) {
    return <div className="user-management">Error: {error}</div>;
  }

  return (
    <div className="user-management">
      <h2>User Management</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Email</th>
            <th>Password</th> {/* Add password column */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>******</td> {/* Masked password */}
              <td>
                {/* Add buttons for viewing, editing, or deleting users */}
                <button onClick={() => viewUser(user.id)}>View</button>
                <button onClick={() => handleEditClick(user)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal for Password */}
      {isEditing && selectedUser && (
        <div className="edit-modal">
          <h3>Edit Password for User ID: {selectedUser.id}</h3>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handleSavePassword}>Save Password</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

const viewUser = (id) => {
  // Function to fetch and display a specific user's details
  fetch(`http://localhost:8080/api/user/${id}`)
    .then(response => response.json())
    .then(data => {
      alert(`User Details:\nID: ${data.id}\nEmail: ${data.email}`);
    })
    .catch(error => {
      alert('Error fetching user details');
    });
};

export default UserManagement;
