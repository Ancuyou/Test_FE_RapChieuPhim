import React, { useEffect, useState } from 'react';
import seatService from '../../services/seatService';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../common/Toast';


const SeatManager = () => {
  const [seatTypes, setSeatTypes] = useState([]); // Tất cả loại ghế
  const [roomSeats, setRoomSeats] = useState([]); // Danh sách ghế của phòng
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedSeatType, setSelectedSeatType] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [formData, setFormData] = useState({
    tenLoaiGhe: '',
    phuThu: 0,
  });
  const [seatFormData, setSetFormData] = useState({
    tenGhe: '',
    maLoaiGhe: '',
  });
  const [seatsMap, setSeatsMap] = useState({});
  const [editingSeat, setEditingSeat] = useState(null);
  const [hoveringSeatType, setHoveringSeatType] = useState(null);
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchAllSeatTypesAndRoomSeats();
  }, [roomId]);

  // Lấy tất cả loại ghế và ghế của phòng
  const fetchAllSeatTypesAndRoomSeats = async () => {
    setLoading(true);
    const [allTypesRes, roomSeatsRes] = await Promise.all([
      seatService.getAllSeatTypes(roomId),
      seatService.getSeatTypesByRoom(roomId)
    ]);
    if (allTypesRes.success && roomSeatsRes.success) {
      setSeatTypes(allTypesRes.data || []);
      setRoomSeats(Array.isArray(roomSeatsRes.data.listGhe) ? roomSeatsRes.data.listGhe : []);
      // Map ghế cho sơ đồ rạp
      const map = {};
      (Array.isArray(roomSeatsRes.data.listGhe) ? roomSeatsRes.data.listGhe : []).forEach(seat => {
        map[seat.tenGhe] = {
          ...seat,
          loaiGhe: seat.loaiGhe.tenLoaiGhe,
          maLoaiGhe: seat.loaiGhe.maLoaiGhe,
          phuThu: seat.loaiGhe.phuThu,
          color: getSeatTypeColor(seat.loaiGhe.tenLoaiGhe)
        };
      });
      setSeatsMap(map);
    } else {
      showError('Lỗi khi tải dữ liệu loại ghế hoặc ghế phòng');
    }
    setLoading(false);
  };

    const stringToColor = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const color = `hsl(${hash % 360}, 70%, 60%)`; // sinh màu theo hue
        return color;
    };
    // Lấy màu theo loại ghế
  const getSeatTypeColor = (seatType) => {
    switch (seatType.toLowerCase()) {
      case 'thường':
        return '#6c757d';
      case 'vip':
        return '#ffc107';
      case 'couple':
        return '#dc3545';
      default:
        return stringToColor(seatType.toLowerCase());
    }
  };

  // Open modal for adding/editing
  const openModal = (type, item = null) => {
    setModalType(type);
    
    if (type === 'addSeatType' || type === 'editSeatType') {
      setSelectedSeatType(item);
      setFormData(item ? { 
        tenLoaiGhe: item.tenLoaiGhe, 
        phuThu: item.phuThu 
      } : { 
        tenLoaiGhe: '', 
        phuThu: 0 
      });

    } else if (type === 'changeSeatType') {
      setEditingSeat(item);
      setSetFormData({
        tenGhe: item.tenGhe,
        maLoaiGhe: item.maLoaiGhe || (seatTypes.length > 0 ? seatTypes[0].maLoaiGhe : ''),
      });
    }
    
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedSeatType(null);
    setSelectedSeat(null);
    setEditingSeat(null);
    setFormData({ tenLoaiGhe: '', phuThu: 0 });
    setSetFormData({ tenGhe: '', maLoaiGhe: '' });
  };

  // Handle form input change for seat type
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'phuThu' ? parseFloat(value) : value,
    });
  };

  // Handle form input change for seat
  const handleSeatInputChange = (e) => {
    const { name, value } = e.target;
    setSetFormData({
      ...seatFormData,
      [name]: value,
    });
  };

  // Submit seat type form
  const handleSeatTypeSubmit = async (e) => {
    e.preventDefault();
    
    if (modalType === 'addSeatType') {
      const result = await seatService.createSeatType(formData);
      if (result.success) {
        showSuccess('Thêm loại ghế thành công');
        fetchAllSeatTypesAndRoomSeats();
        closeModal();
      } else {
        showError(result.message || 'Lỗi khi thêm loại ghế');
      }
    } else if (modalType === 'editSeatType') {
      const result = await seatService.updateSeatType(selectedSeatType.maLoaiGhe, formData);
      if (result.success) {
        showSuccess('Cập nhật loại ghế thành công');
        fetchAllSeatTypesAndRoomSeats();
        closeModal();
      } else {
        showError(result.message || 'Lỗi khi cập nhật loại ghế');
      }
    }
  };

  // Submit seat form
  const handleSeatSubmit = async (e) => {
    e.preventDefault();
    
    if (modalType === 'changeSeatType') {
      const result = await seatService.updateSeat(editingSeat.maGhe, {
        tenGhe: seatFormData.tenGhe,
        maLoaiGhe: seatFormData.maLoaiGhe
      });
      if (result.success) {
        showSuccess('Thay đổi loại ghế thành công');
        fetchAllSeatTypesAndRoomSeats();
        closeModal();
      } else {
        showError(result.message || 'Lỗi khi thay đổi loại ghế');
      }
    }
  };

  // Delete seat type
  const handleDeleteSeatType = async (seatTypeId) => {
    if (window.confirm('Bạn có chắc muốn xóa loại ghế này?')) {
      const result = await seatService.deleteSeatType(seatTypeId);
      if (result.success) {
        showSuccess('Xóa loại ghế thành công');
        fetchAllSeatTypesAndRoomSeats();
      } else {
        showError(result.message || 'Lỗi khi xóa loại ghế');
      }
    }
  };

  // Generate seat grid for cinema layout
  const renderSeatGrid = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const seatsPerRow = 10;
    
    return (
      <div className="mb-5">
        {/* Screen */}
        <div className="text-center mb-4">
          <div 
            className="mx-auto mb-2" 
            style={{ 
              width: '80%', 
              height: '15px', 
              backgroundColor: '#e9ecef', 
              transform: 'perspective(100px) rotateX(-5deg)',
              boxShadow: '0 3px 10px rgba(0,0,0,0.3)'
            }}
          ></div>
          <p className="text-center text-muted mb-4">Màn hình</p>
        </div>
        
        {/* Seat Grid */}
        <div className="d-flex flex-column align-items-center">
          {rows.map((row) => (
            <div key={row} className="d-flex mb-2 align-items-center">
              <div className="me-3" style={{ width: '20px' }}>{row}</div>
              <div className="d-flex">
                {Array.from({ length: seatsPerRow }, (_, i) => {
                  const seatName = `${row}${String(i + 1).padStart(2, '0')}`;
                  const seat = seatsMap[seatName];
                  
                  return (
                    <div 
                      key={i} 
                      className="mx-1 seat-item"
                      onClick={() => seat ? openModal('changeSeatType', seat) : null}
                    >
                      <div
                        className={`d-flex justify-content-center align-items-center rounded ${seat ? 'cursor-pointer' : ''}`}
                        style={{
                          width: row === 'I' || row === 'J' ? '45px' : '35px',
                          height: row === 'I' || row === 'J' ? '45px' : '35px',
                          backgroundColor: seat ? seat.color : '#f8f9fa',
                          border: seat ? '1px solid #212529' : '1px dashed #adb5bd',
                          color: seat && seat.loaiGhe !== 'Thường' ? '#212529' : '#fff',
                          fontSize: '0.75rem',
                          position: 'relative',
                        }}
                        title={seat ? `${seatName} - ${seat.loaiGhe}` : `Chưa có ghế ${seatName}`}
                      >
                        {seat ? (
                          <>
                            {seatName}
                            {seat.loaiGhe === 'Couple' && (
                              <i className="bi bi-heart-fill position-absolute" 
                                 style={{ top: '2px', right: '2px', fontSize: '10px' }}></i>
                            )}
                          </>
                        ) : seatName}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="ms-3" style={{ width: '20px' }}>{row}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid p-4">
      <div className="row mb-4">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <div>
            <button className="btn btn-outline-secondary me-3" onClick={() => navigate('/admin/room')}>
              <i className="bi bi-arrow-left me-1"></i>Quay lại
            </button>
          </div>
          <h2 className="h4 text-primary fw-bold">
            <i className="bi bi-grid-3x3 me-2"></i>
            Quản lý ghế - Phòng {roomId}  {/* Thêm số phòng vào title */}
          </h2>
          <div>
            <button className="btn btn-success" onClick={() => openModal('addSeatType')}>
              <i className="bi bi-plus-circle me-2"></i>Thêm loại ghế
            </button>
          </div>
        </div>
      </div>

      {/* Cinema Layout */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="card-title mb-0">Sơ đồ rạp</h5>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="d-flex justify-content-center py-5">
                  <div className="spinner-border text-primary"></div>
                </div>
              ) : (
                renderSeatGrid()
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Seat Types */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="card-title mb-0">Loại ghế</h5>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="d-flex justify-content-center py-5">
                  <div className="spinner-border text-primary"></div>
                </div>
              ) : (
                <div className="row">
                  {seatTypes.map((type) => {
                    // Lọc ghế của phòng thuộc loại này
                    const seatsOfType = roomSeats.filter(seat => seat.loaiGhe.maLoaiGhe === type.maLoaiGhe);
                    return (
                      <div
                        key={type.maLoaiGhe}
                        className="col-md-4 mb-3"
                        onMouseEnter={() => setHoveringSeatType(type.maLoaiGhe)}
                        onMouseLeave={() => setHoveringSeatType(null)}
                      >
                        <div className="card h-100">
                          <div
                            className="card-header d-flex justify-content-between align-items-center"
                            style={{ backgroundColor: getSeatTypeColor(type.tenLoaiGhe), color: type.tenLoaiGhe.toLowerCase() === 'thường' ? 'white' : 'black' }}
                          >
                            <h6 className="mb-0">{type.tenLoaiGhe}</h6>
                            <div className={`btn-group ${hoveringSeatType === type.maLoaiGhe ? 'opacity-100' : 'opacity-0'}`}>
                              <button
                                className="btn btn-sm btn-light"
                                onClick={() => openModal('editSeatType', type)}
                                title="Chỉnh sửa"
                              >
                                <i className="bi bi-pencil-fill"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-light"
                                onClick={() => handleDeleteSeatType(type.maLoaiGhe)}
                                title="Xóa"
                                disabled={seatsOfType.length > 0}
                              >
                                <i className="bi bi-trash-fill"></i>
                              </button>
                            </div>
                          </div>
                          <div className="card-body">
                            <p className="mb-2">Phụ thu: {type.phuThu.toLocaleString('vi-VN')} VNĐ</p>
                            <p className="mb-2">Số lượng ghế: {seatsOfType.length}</p>
                            {seatsOfType.length > 0 && (
                              <div className="mt-3">
                                <div className="d-flex flex-wrap gap-1">
                                  {seatsOfType.slice(0, 15).map((seat) => (
                                    <span
                                      key={seat.maGhe}
                                      className="badge bg-secondary"
                                      style={{
                                        backgroundColor: getSeatTypeColor(type.tenLoaiGhe) + ' !important',
                                        color: type.tenLoaiGhe.toLowerCase() === 'thường' ? 'white' : 'black'
                                      }}
                                      title="Click để thay đổi loại ghế"
                                      onClick={() => openModal('changeSeatType', { ...seat, maLoaiGhe: type.maLoaiGhe, loaiGhe: type.tenLoaiGhe })}
                                    >
                                      {seat.tenGhe}
                                    </span>
                                  ))}
                                  {seatsOfType.length > 15 && (
                                    <span className="badge bg-light text-dark">
                                      +{seatsOfType.length - 15}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal for Add/Edit Seat Type */}
      {showModal && (modalType === 'addSeatType' || modalType === 'editSeatType') && (
        <div className="modal show d-block modal-overlay">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalType === 'addSeatType' ? 'Thêm loại ghế' : 'Chỉnh sửa loại ghế'}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <form onSubmit={handleSeatTypeSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="tenLoaiGhe" className="form-label">Tên loại ghế *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="tenLoaiGhe"
                      name="tenLoaiGhe"
                      value={formData.tenLoaiGhe}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phuThu" className="form-label">Phụ thu (VNĐ) *</label>
                    <input
                      type="number"
                      className="form-control"
                      id="phuThu"
                      name="phuThu"
                      value={formData.phuThu}
                      onChange={handleInputChange}
                      min="0"
                      step="1000"
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>Hủy</button>
                  <button type="submit" className="btn btn-primary">
                    {modalType === 'addSeatType' ? 'Thêm' : 'Cập nhật'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal for Change Seat Type */}
      {showModal && modalType === 'changeSeatType' && (
        <div className="modal show d-block modal-overlay">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Thay đổi loại ghế</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <form onSubmit={handleSeatSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Tên ghế</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingSeat?.tenGhe || ''}
                      readOnly
                    />
                  </div>
                  


                  <div className="mb-3">
                    <label htmlFor="maLoaiGhe" className="form-label">Loại ghế *</label>
                    <select
                      className="form-select"
                      id="maLoaiGhe"
                      name="maLoaiGhe"
                      value={seatFormData.maLoaiGhe}
                      onChange={handleSeatInputChange}
                      required
                    >
                      <option value="">-- Chọn loại ghế --</option>
                      {seatTypes.map((type) => (
                        <option key={type.maLoaiGhe} value={type.maLoaiGhe}>
                          {type.tenLoaiGhe} ({type.phuThu.toLocaleString('vi-VN')} VNĐ)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>Hủy</button>
                  <button type="submit" className="btn btn-primary">
                    {modalType === 'addSeat' ? 'Thêm' : 'Cập nhật'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS for hover effects */}
      <style jsx="true">{`
        .modal-overlay {
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1050;
        }
        
        .seat-item {
          transition: transform 0.2s;
        }
        
        .seat-item:hover {
          transform: scale(1.1);
          z-index: 1;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default SeatManager;

