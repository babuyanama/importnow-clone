
import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api";

function Admin() {
  const [token, setToken] = useState(
    () => sessionStorage.getItem("adminToken") || ""
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    product: "",
    quantity: "",
    details: "",
  });

  // Read API response safely
  async function readResponse(response) {
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Something went wrong.");
    }

    return result;
  }

  // Handle unauthorized access
  function handleUnauthorized() {
    sessionStorage.removeItem("adminToken");

    setToken("");
    setEnquiries([]);
    setEditingId(null);
    setError("");
    setLoginError("Session expired. Please login again.");
  }

  // Admin login
  async function handleLogin(event) {
    event.preventDefault();

    setLoginLoading(true);
    setLoginError("");

    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const result = await readResponse(response);

      if (!result.token) {
        throw new Error("Login response did not contain an authentication token.");
      }

      sessionStorage.setItem("adminToken", result.token);

      setToken(result.token);
      setPassword("");
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  }

  // Logout
  function handleLogout() {
    sessionStorage.removeItem("adminToken");

    setToken("");
    setEnquiries([]);
    setEditingId(null);
    setLoginError("");
    setError("");
  }

  // Fetch all enquiries
  async function fetchEnquiries(authToken = token) {
    if (!authToken) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/enquiries`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      const result = await readResponse(response);

      // Support different backend response formats
      let records = [];

      if (Array.isArray(result)) {
        records = result;
      } else if (Array.isArray(result.enquiries)) {
        records = result.enquiries;
      } else if (Array.isArray(result.data)) {
        records = result.data;
      } else if (Array.isArray(result.data?.enquiries)) {
        records = result.data.enquiries;
      } else {
        throw new Error(
          "Invalid response from server. Expected an enquiries array."
        );
      }

      setEnquiries(records);
    } catch (err) {
      setError(err.message);
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  }

  // Start editing
  function handleEdit(item) {
    setEditingId(item.id);

    setEditForm({
      name: item.name || "",
      email: item.email || "",
      product: item.product || "",
      quantity: item.quantity || "",
      details: item.details || "",
    });
  }

  // Handle edit form changes
  function handleChange(event) {
    const { name, value } = event.target;

    setEditForm((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  // Update enquiry
  async function handleUpdate(event) {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/enquiries/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editForm),
        }
      );

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      await readResponse(response);

      setEditingId(null);

      await fetchEnquiries(token);

      alert("Enquiry updated successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  // Cancel editing
  function cancelEdit() {
    setEditingId(null);
  }

  // Delete enquiry
  async function deleteEnquiry(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this enquiry?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API_URL}/enquiries/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      await readResponse(response);

      setEnquiries((previous) =>
        previous.filter((item) => item.id !== id)
      );

      if (editingId === id) {
        setEditingId(null);
      }

      alert("Enquiry deleted successfully!");
    } catch (err) {
      alert(err.message);
    }
  }

  // Load enquiries after login
  useEffect(() => {
    if (token) {
      fetchEnquiries(token);
    }
  }, [token]);

  // Login screen
  if (!token) {
    return (
      <section className="admin">
        <div className="admin-login">
          <span className="section-tag">ADMIN PANEL</span>

          <h1>Admin Login</h1>
          <p>Please login to manage customer enquiries.</p>

          <form className="edit-form" onSubmit={handleLogin}>
            <label>Username</label>

            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter admin username"
              required
            />

            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter admin password"
              required
            />

            {loginError && (
              <p className="error-message">{loginError}</p>
            )}

            <button type="submit" disabled={loginLoading}>
              {loginLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </section>
    );
  }

  // Admin dashboard
  return (
    <section className="admin">
      <div className="admin-header">
        <div>
          <span className="section-tag">ADMIN PANEL</span>
          <h1>Customer Enquiries</h1>
          <p>Manage and review customer import requests.</p>
        </div>

        <div className="admin-count">
          <h2>{enquiries.length}</h2>
          <p>Total Enquiries</p>
        </div>
      </div>

      <button
        className="refresh-button"
        onClick={() => fetchEnquiries()}
        disabled={loading}
      >
        {loading ? "Loading..." : "↻ Refresh Enquiries"}
      </button>

      <button onClick={handleLogout}>
        Logout
      </button>

      {error && <p className="error-message">{error}</p>}

      {loading && <p>Loading customer enquiries...</p>}

      {/* Edit form */}
      {editingId !== null && (
        <form className="edit-form" onSubmit={handleUpdate}>
          <h2>Edit Enquiry #{editingId}</h2>

          <label>Name</label>
          <input
            type="text"
            name="name"
            value={editForm.name}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={editForm.email}
            onChange={handleChange}
            required
          />

          <label>Product</label>
          <input
            type="text"
            name="product"
            value={editForm.product}
            onChange={handleChange}
            required
          />

          <label>Quantity</label>
          <input
            type="text"
            name="quantity"
            value={editForm.quantity}
            onChange={handleChange}
          />

          <label>Details</label>
          <textarea
            name="details"
            rows="4"
            value={editForm.details}
            onChange={handleChange}
          />

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            className="cancel-button"
            onClick={cancelEdit}
            disabled={saving}
          >
            Cancel
          </button>
        </form>
      )}

      {/* Enquiries table */}
      {!loading && !error && (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Details</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {enquiries.length === 0 ? (
                <tr>
                  <td colSpan="8">No enquiries found.</td>
                </tr>
              ) : (
                enquiries.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.product}</td>
                    <td>{item.quantity || "-"}</td>
                    <td>{item.details || "-"}</td>
                    <td>
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() => deleteEnquiry(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default Admin;
