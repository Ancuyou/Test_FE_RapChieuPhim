import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Lock, Unlock, Mail, Phone, Calendar } from 'lucide-react';
import StatCard from "./StatCard.jsx";

const UserManagement = () => {
    const [users, setUsers] = useState([
        {
            id: 1,
            name: 'Nguyễn Văn A',
            email: 'nguyenvana@example.com',
            phone: '0901234567',
            role: 'Admin',
            status: 'active',
            createdAt: '2024-01-15'
        },
        {
            id: 2,
            name: 'Trần Thị B',
            email: 'tranthib@example.com',
            phone: '0912345678',
            role: 'User',
            status: 'active',
            createdAt: '2024-02-20'
        },
        {
            id: 3,
            name: 'Lê Văn C',
            email: 'levanc@example.com',
            phone: '0923456789',
            role: 'User',
            status: 'inactive',
            createdAt: '2024-03-10'
        },
        {
            id: 4,
            name: 'Phạm Thị D',
            email: 'phamthid@example.com',
            phone: '0934567890',
            role: 'Moderator',
            status: 'active',
            createdAt: '2024-04-05'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentUser, setCurrentUser] = useState({
        id: null,
        name: '',
        email: '',
        phone: '',
        role: 'User',
        status: 'active'
    });

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const handleAddUser = () => {
        setModalMode('add');
        setCurrentUser({
            id: null,
            name: '',
            email: '',
            phone: '',
            role: 'User',
            status: 'active'
        });
        setShowModal(true);
    };

    const handleEditUser = (user) => {
        setModalMode('edit');
        setCurrentUser(user);
        setShowModal(true);
    };

    const handleDeleteUser = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            setUsers(users.filter(user => user.id !== id));
        }
    };

    const handleToggleStatus = (id) => {
        setUsers(users.map(user =>
            user.id === id
                ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
                : user
        ));
    };

    const handleSaveUser = () => {
        if (modalMode === 'add') {
            const newUser = {
                ...currentUser,
                id: Math.max(...users.map(u => u.id)) + 1,
                createdAt: new Date().toISOString().split('T')[0]
            };
            setUsers([...users, newUser]);
        } else {
            setUsers(users.map(user => user.id === currentUser.id ? currentUser : user));
        }
        setShowModal(false);
    };

    return (
        <>
            <link
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
                rel="stylesheet"
            />

            <div className="min-vh-100 bg-light">
                {/* Header */}
                <nav className="navbar navbar-dark bg-primary shadow-sm">
                    <div className="container-fluid">
            <span className="navbar-brand mb-0 h1">
              <i className="bi bi-speedometer2 me-2"></i>
              Admin Dashboard
            </span>
                    </div>
                </nav>

                <div className="container-fluid py-4">
                    <div className="row">
                        {/* Sidebar */}
                        <div className="col-md-2">
                            <div className="list-group">
                                <a href="#" className="list-group-item list-group-item-action active">
                                    Quản lý người dùng
                                </a>
                                <a href="#" className="list-group-item list-group-item-action">
                                    Cài đặt
                                </a>
                                <a href="#" className="list-group-item list-group-item-action">
                                    Báo cáo
                                </a>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="col-md-10">
                            <div className="card shadow-sm">
                                <div className="card-header bg-white py-3">
                                    <div className="row align-items-center">
                                        <div className="col">
                                            <h4 className="mb-0">Quản Lý Tài Khoản Người Dùng</h4>
                                        </div>
                                        <div className="col-auto">
                                            <button
                                                className="btn btn-primary"
                                                onClick={handleAddUser}
                                            >
                                                <Plus size={18} className="me-2" />
                                                Thêm người dùng
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-body">
                                    {/* Filters */}
                                    <div className="row g-3 mb-4">
                                        <div className="col-md-5">
                                            <div className="input-group">
                        <span className="input-group-text bg-white">
                          <Search size={18} />
                        </span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Tìm kiếm theo tên hoặc email..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <select
                                                className="form-select"
                                                value={filterRole}
                                                onChange={(e) => setFilterRole(e.target.value)}
                                            >
                                                <option value="all">Tất cả vai trò</option>
                                                <option value="Admin">Admin</option>
                                                <option value="Moderator">Moderator</option>
                                                <option value="User">User</option>
                                            </select>
                                        </div>
                                        <div className="col-md-3">
                                            <select
                                                className="form-select"
                                                value={filterStatus}
                                                onChange={(e) => setFilterStatus(e.target.value)}
                                            >
                                                <option value="all">Tất cả trạng thái</option>
                                                <option value="active">Hoạt động</option>
                                                <option value="inactive">Không hoạt động</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="row g-3 mb-4">
                                        <div className="col-md-3">
                                            <div className="card bg-primary text-white">
                                                <div className="card-body">
                                                    <h6 className="card-title">Tổng số</h6>
                                                    <h3 className="mb-0">{users.length}</h3>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="card bg-success text-white">
                                                <div className="card-body">
                                                    <h6 className="card-title">Hoạt động</h6>
                                                    <h3 className="mb-0">{users.filter(u => u.status === 'active').length}</h3>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="card bg-warning text-white">
                                                <div className="card-body">
                                                    <h6 className="card-title">Không hoạt động</h6>
                                                    <h3 className="mb-0">{users.filter(u => u.status === 'inactive').length}</h3>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="card bg-info text-white">
                                                <div className="card-body">
                                                    <h6 className="card-title">Admin</h6>
                                                    <h3 className="mb-0">{users.filter(u => u.role === 'Admin').length}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Users Table */}
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead className="table-light">
                                            <tr>
                                                <th>ID</th>
                                                <th>Họ tên</th>
                                                <th>Email</th>
                                                <th>Số điện thoại</th>
                                                <th>Vai trò</th>
                                                <th>Trạng thái</th>
                                                <th>Ngày tạo</th>
                                                <th className="text-center">Thao tác</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {filteredUsers.map(user => (
                                                <tr key={user.id}>
                                                    <td>{user.id}</td>
                                                    <td>
                                                        <div className="fw-bold">{user.name}</div>
                                                    </td>
                                                    <td>
                                                        <Mail size={14} className="me-1 text-muted" />
                                                        {user.email}
                                                    </td>
                                                    <td>
                                                        <Phone size={14} className="me-1 text-muted" />
                                                        {user.phone}
                                                    </td>
                                                    <td>
                              <span className={`badge ${
                                  user.role === 'Admin' ? 'bg-danger' :
                                      user.role === 'Moderator' ? 'bg-warning' :
                                          'bg-secondary'
                              }`}>
                                {user.role}
                              </span>
                                                    </td>
                                                    <td>
                              <span className={`badge ${
                                  user.status === 'active' ? 'bg-success' : 'bg-secondary'
                              }`}>
                                {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                              </span>
                                                    </td>
                                                    <td>
                                                        <Calendar size={14} className="me-1 text-muted" />
                                                        {user.createdAt}
                                                    </td>
                                                    <td>
                                                        <div className="btn-group btn-group-sm" role="group">
                                                            <button
                                                                className="btn btn-outline-primary"
                                                                onClick={() => handleEditUser(user)}
                                                                title="Chỉnh sửa"
                                                            >
                                                                <Edit2 size={14} />
                                                            </button>
                                                            <button
                                                                className={`btn ${user.status === 'active' ? 'btn-outline-warning' : 'btn-outline-success'}`}
                                                                onClick={() => handleToggleStatus(user.id)}
                                                                title={user.status === 'active' ? 'Khóa' : 'Mở khóa'}
                                                            >
                                                                {user.status === 'active' ? <Lock size={14} /> : <Unlock size={14} />}
                                                            </button>
                                                            <button
                                                                className="btn btn-outline-danger"
                                                                onClick={() => handleDeleteUser(user.id)}
                                                                title="Xóa"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {filteredUsers.length === 0 && (
                                        <div className="text-center py-5 text-muted">
                                            <p>Không tìm thấy người dùng nào</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {modalMode === 'add' ? 'Thêm người dùng mới' : 'Chỉnh sửa người dùng'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div>
                                    <div className="mb-3">
                                        <label className="form-label">Họ tên</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={currentUser.name}
                                            onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={currentUser.email}
                                            onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Số điện thoại</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            value={currentUser.phone}
                                            onChange={(e) => setCurrentUser({...currentUser, phone: e.target.value})}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Vai trò</label>
                                        <select
                                            className="form-select"
                                            value={currentUser.role}
                                            onChange={(e) => setCurrentUser({...currentUser, role: e.target.value})}
                                        >
                                            <option value="User">User</option>
                                            <option value="Moderator">Moderator</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Trạng thái</label>
                                        <select
                                            className="form-select"
                                            value={currentUser.status}
                                            onChange={(e) => setCurrentUser({...currentUser, status: e.target.value})}
                                        >
                                            <option value="active">Hoạt động</option>
                                            <option value="inactive">Không hoạt động</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleSaveUser}
                                >
                                    {modalMode === 'add' ? 'Thêm' : 'Cập nhật'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default UserManagement;