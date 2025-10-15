import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ticketService from '../../services/ticketService';
import { useToast } from '../common/Toast';

const InvoiceDetail = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const { showError } = useToast();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (invoiceId) {
      fetchInvoiceDetail();
    }
  }, [invoiceId]);

  const fetchInvoiceDetail = async () => {
    setLoading(true);
    try {
      const result = await ticketService.getInvoiceDetail(invoiceId);
      if (result.success) {
        setInvoice(result.data);
      } else {
        showError(result.message);
      }
    } catch (error) {
      showError('Có lỗi xảy ra khi tải thông tin hóa đơn');
    }
    setLoading(false);
  };

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'PAID':
        return { class: 'bg-success', text: 'Đã thanh toán' };
      case 'PROCESSING':
        return { class: 'bg-warning', text: 'Đang xử lý' };
      case 'CANCELLED':
        return { class: 'bg-danger', text: 'Đã hủy' };
      case 'EXPIRED':
        return { class: 'bg-secondary', text: 'Hết hạn' };
      default:
        return { class: 'bg-primary', text: 'Chờ xử lý' };
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('vi-VN'),
      time: date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
  };

  if (loading) {
    return (
      <div className="invoice-detail">
        <div className="container">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="text-center">
              <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}></div>
              <h5>Đang tải thông tin hóa đơn...</h5>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="invoice-detail">
        <div className="container">
          <div className="text-center py-5">
            <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
            <h4 className="mt-3">Không tìm thấy hóa đơn</h4>
            <p className="text-muted">Hóa đơn có thể đã bị xóa hoặc không tồn tại.</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/tickets')}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Quay lại danh sách vé
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(invoice.trangThai);
  const createDate = formatDateTime(invoice.ngayLap);

  return (
    <div className="invoice-detail">
      {/* Page Header */}
      <div className="bg-primary text-white py-4 mb-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-2" style={{ backgroundColor: 'transparent' }}>
                  <li className="breadcrumb-item">
                    <a 
                      href="/" 
                      className="text-white text-decoration-none"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/');
                      }}
                    >
                      <i className="bi bi-house me-1"></i>
                      Trang chủ
                    </a>
                  </li>
                  <li className="breadcrumb-item">
                    <a 
                      href="/tickets" 
                      className="text-white text-decoration-none"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/tickets');
                      }}
                    >
                      Vé của tôi
                    </a>
                  </li>
                  <li className="breadcrumb-item active text-white" aria-current="page">
                    Chi tiết hóa đơn
                  </li>
                </ol>
              </nav>
              <h2 className="mb-0">
                <i className="bi bi-receipt me-2"></i>
                Chi tiết hóa đơn #{invoice.maHD}
              </h2>
            </div>
            <div className="col-md-4 text-md-end">
              <span className={`badge ${statusBadge.class} fs-6`}>
                {statusBadge.text}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          {/* Invoice Information */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">
                  <i className="bi bi-info-circle me-2"></i>
                  Thông tin hóa đơn
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Mã hóa đơn:</strong> {invoice.maHD}</p>
                    <p><strong>Ngày lập:</strong> {createDate.date} lúc {createDate.time}</p>
                    <p><strong>Phương thức thanh toán:</strong> {invoice.phuongThucThanhToan}</p>
                    {invoice.maGiaoDich && (
                      <p><strong>Mã giao dịch:</strong> {invoice.maGiaoDich}</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <p><strong>Số lượng vé:</strong> {invoice.soLuongVe}</p>
                    <p><strong>Trạng thái:</strong> <span className={`badge ${statusBadge.class}`}>{statusBadge.text}</span></p>
                    {invoice.expiredAt && (
                      <p><strong>Hết hạn:</strong> {formatDateTime(invoice.expiredAt).date} lúc {formatDateTime(invoice.expiredAt).time}</p>
                    )}
                  </div>
                </div>
                {invoice.ghiChu && (
                  <div className="mt-3">
                    <h6>Ghi chú:</h6>
                    <div className="bg-light p-3 rounded">
                      <pre className="mb-0" style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                        {invoice.ghiChu}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Ticket List */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">
                  <i className="bi bi-ticket me-2"></i>
                  Danh sách vé ({invoice.danhSachVe?.length || 0})
                </h5>
              </div>
              <div className="card-body">
                {invoice.danhSachVe && invoice.danhSachVe.length > 0 ? (
                  <div className="row">
                    {invoice.danhSachVe.map((ticket, index) => {
                      const showDate = formatDateTime(ticket.thoiGianChieu);
                      const ticketStatus = getStatusBadge(ticket.trangThai);
                      
                      return (
                        <div key={index} className="col-md-6 mb-3">
                          <div className="card border h-100">
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <h6 className="card-title text-primary mb-0">{ticket.tenPhim}</h6>
                                <span className={`badge ${ticketStatus.class}`}>
                                  {ticketStatus.text}
                                </span>
                              </div>
                              
                              <div className="mb-2">
                                <small className="text-muted d-block">
                                  <i className="bi bi-geo-alt me-1"></i>
                                  {ticket.tenPhongChieu}
                                </small>
                                <small className="text-muted d-block">
                                  <i className="bi bi-calendar me-1"></i>
                                  {showDate.date} lúc {showDate.time}
                                </small>
                              </div>
                              
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <span className="badge bg-secondary me-1">
                                    Ghế {ticket.tenGhe}
                                  </span>
                                  <small className="text-muted">({ticket.loaiGhe})</small>
                                </div>
                                <strong className="text-primary">
                                  {ticket.thanhTien?.toLocaleString('vi-VN')} VNĐ
                                </strong>
                              </div>

                              {/* Mã QR */}
                              <div className="mt-3">
                                <img
                                  src={ticket.qrCodeUrl}
                                  alt={`QR Code for ${ticket.maVe}`}
                                  className="img-fluid"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-3">
                    <i className="bi bi-ticket text-muted" style={{ fontSize: '2rem' }}></i>
                    <p className="text-muted mt-2">Không có vé nào</p>
                  </div>
                )}
              </div>
            </div>

            {/* Services List */}
            {invoice.danhSachDichVu && invoice.danhSachDichVu.length > 0 && (
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-light">
                  <h5 className="mb-0">
                    <i className="bi bi-cup-straw me-2"></i>
                    Dịch vụ đi kèm ({invoice.danhSachDichVu.length})
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    {invoice.danhSachDichVu.map((service, index) => (
                      <div key={index} className="col-md-6 mb-3">
                        <div className="card border h-100">
                          <div className="card-body">
                            <h6 className="card-title">{service.tenDichVu}</h6>
                            <p className="card-text text-muted small">{service.moTa}</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <span>
                                <span className="badge bg-primary">{service.soLuong}</span>
                                <small className="text-muted ms-1">x {service.giaDichVu?.toLocaleString('vi-VN')} VNĐ</small>
                              </span>
                              <strong className="text-primary">
                                {service.thanhTien?.toLocaleString('vi-VN')} VNĐ
                              </strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment Summary */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm sticky-top" style={{ top: '2rem' }}>
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  <i className="bi bi-calculator me-2"></i>
                  Tóm tắt thanh toán
                </h5>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span>Tổng tiền vé:</span>
                  <span>{invoice.tongTienVe?.toLocaleString('vi-VN')} VNĐ</span>
                </div>
                
                {invoice.tongTienDichVu > 0 && (
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tổng tiền dịch vụ:</span>
                    <span>{invoice.tongTienDichVu?.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                )}
                
                {invoice.tongTienVe + invoice.tongTienDichVu !== invoice.tongTien && (
                  <div className="d-flex justify-content-between mb-2 text-success">
                    <span>
                      <i className="bi bi-tag me-1"></i>
                      Giảm giá:
                    </span>
                    <span>
                      -{((invoice.tongTienVe + invoice.tongTienDichVu) - invoice.tongTien).toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>
                )}
                
                <hr />
                
                <div className="d-flex justify-content-between fw-bold fs-5">
                  <span>Tổng cộng:</span>
                  <span className="text-primary">
                    {invoice.tongTien?.toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-3">
              <button 
                className="btn btn-outline-primary w-100 mb-2"
                onClick={() => navigate('/tickets')}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Quay lại danh sách vé
              </button>
              
              <button 
                className="btn btn-primary w-100"
                onClick={() => window.print()}
              >
                <i className="bi bi-printer me-2"></i>
                In hóa đơn
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;