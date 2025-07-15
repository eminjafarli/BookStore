import React, { useEffect, useState } from "react";
import axios from "axios";
import EditUserModal from "/EditUserModal";
import AddUserModal from "/AddUserModal";

function UsersDashboard() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        axios.get("/api/users", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
            .then(res => setUsers(res.data));
    }, []);

    return (
        <div>
            <button onClick={() => setShowAddModal(true)}>Add Member</button>
            {users.map(user => (
                <div key={user.id}>
                    {user.username} - {user.name} {user.surname} - {user.books.length} books
                    <button onClick={() => { setSelectedUser(user); setShowEditModal(true); }}>Edit</button>
                </div>
            ))}
            {showEditModal && <EditUserModal user={selectedUser} onClose={() => setShowEditModal(false)} />}
            {showAddModal && <AddUserModal onClose={() => setShowAddModal(false)} />}
        </div>
    );
}

export default UsersDashboard;
