import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ticketService from '../services/ticketService';
import { useToast } from '../components/common/Toast';

const TicketsPage = () => {
  const navigate = useNavigate();
  const { showError } = useToast();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserTickets();
  }, []);

  const fetchUserTickets = async () => {
    setLoading(true);
    try {
      const result = await ticketService.getUserTickets();
      if (result.success) {
        // Đảm bảo data là array, nếu không set về array rỗng
        setTickets(Array.isArray(result.data) ? result.data : []);
      } else {
        showError(result.message);
        setTickets([]); // Set empty array nếu fail
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      showError('Có lỗi xảy ra khi tải danh sách vé');
      setTickets([]); // Set empty array nếu error
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
      <div className="tickets-page">
        <div className="container">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="text-center">
              <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}></div>
              <h5>Đang tải danh sách vé...</h5>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tickets-page">
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
                  <li className="breadcrumb-item active text-white" aria-current="page">
                    Vé của tôi
                  </li>
                </ol>
              </nav>
              <h2 className="mb-0">
                <i className="bi bi-ticket-detailed me-2"></i>
                Vé của tôi
              </h2>
              <p className="mb-0 opacity-75">
                Quản lý và xem thông tin các vé đã đặt
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container">
        {tickets.length === 0 ? (
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="text-center py-5">
                <i className="bi bi-ticket text-muted" style={{ fontSize: '4rem' }}></i>
                <h3 className="mt-3">Chưa có vé nào</h3>
                <p className="text-muted">
                  Bạn chưa đặt vé nào. Hãy chọn phim yêu thích và đặt vé ngay!
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/')}
                >
                  <i className="bi bi-film me-2"></i>
                  Đặt vé ngay
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="row">
            {tickets.map((invoice) => (
              <div key={invoice.maHD} className="col-12 mb-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white py-3">
                    <div className="row align-items-center">
                      <div className="col-md-6">
                        <h5 className="mb-0">
                          <i className="bi bi-receipt me-2"></i>
                          Đơn hàng #{invoice.maHD}
                        </h5>
                        <small className="text-muted">
                          Đặt lúc: {formatDateTime(invoice.ngayLap).date} {formatDateTime(invoice.ngayLap).time}
                        </small>
                      </div>
                      <div className="col-md-6 text-end">
                        <span className={`badge ${getStatusBadge(invoice.trangThai).class} fs-6`}>
                          {getStatusBadge(invoice.trangThai).text}
                        </span>
                        <div className="mt-1">
                          <span className="fw-bold text-primary fs-5">
                            {invoice.tongTien.toLocaleString('vi-VN')} VNĐ
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="row">
                      {(invoice.danhSachVe || []).map((ticket, index) => (
                        <div key={ticket.maVe} className="col-md-6 mb-3">
                          <div className="ticket-item border rounded p-3 h-100">
                            <div className="d-flex align-items-start">
                              <div className="ticket-icon me-3">
                                <div 
                                  className="rounded d-flex align-items-center justify-content-center text-white"
                                  style={{ width: '50px', height: '50px', backgroundColor: '#ff4b2b' }}
                                >
                                  <i className="bi bi-film fs-4"></i>
                                </div>
                              </div>
                              
                              <div className="flex-grow-1">
                                <h6 className="fw-bold text-primary mb-1">
                                  {ticket.tenPhim}
                                </h6>
                                
                                <div className="ticket-details">
                                  <p className="mb-1 small">
                                    <i className="bi bi-geo-alt me-1 text-muted"></i>
                                    {ticket.tenPhongChieu}
                                  </p>
                                  
                                  <p className="mb-1 small">
                                    <i className="bi bi-calendar me-1 text-muted"></i>
                                    {formatDateTime(ticket.thoiGianChieu).date}
                                  </p>
                                  
                                  <p className="mb-1 small">
                                    <i className="bi bi-clock me-1 text-muted"></i>
                                    {formatDateTime(ticket.thoiGianChieu).time}
                                  </p>
                                  
                                  <p className="mb-1 small">
                                    <i className="bi bi-grid-3x3 me-1 text-muted"></i>
                                    Ghế {ticket.tenGhe}
                                  </p>
                                </div>

                                <div className="d-flex justify-content-between align-items-center mt-2">
                                  <span className="fw-bold">
                                    {ticket.thanhTien.toLocaleString('vi-VN')} VNĐ
                                  </span>
                                  <span className={`badge ${getStatusBadge(ticket.trangThai).class}`}>
                                    {getStatusBadge(ticket.trangThai).text}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Additional Invoice Info */}
                    {invoice.ghiChu && (
                      <div className="mt-3 p-3 bg-light rounded">
                        <h6 className="text-muted mb-2">Chi tiết thanh toán:</h6>
                        <pre className="mb-0 small text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                          {invoice.ghiChu}
                        </pre>
                      </div>
                    )}

                    {/* Payment Info */}
                    <div className="mt-3 pt-3 border-top">
                      <div className="row align-items-center">
                        <div className="col-md-9">
                          <div className="row text-center">
                            <div className="col-md-4">
                              <small className="text-muted d-block">Phương thức thanh toán</small>
                              <span className="badge bg-primary">
                                {invoice.phuongThucThanhToan}
                              </span>
                            </div>
                            {invoice.maGiaoDich && (
                              <div className="col-md-4">
                                <small className="text-muted d-block">Mã giao dịch</small>
                                <span className="small">{invoice.maGiaoDich}</span>
                              </div>
                            )}
                            <div className="col-md-4">
                              <small className="text-muted d-block">Tổng số vé</small>
                              <span className="fw-bold">{(invoice.danhSachVe || []).length}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3 text-end">
                          <button 
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => navigate(`/invoice/${invoice.maHD}`)}
                          >
                            <i className="bi bi-eye me-1"></i>
                            Xem chi tiết
                          </button>
                          <div className="mt-2">
                            <span className="fw-bold text-success">
                              {invoice.tongTien.toLocaleString('vi-VN')} VNĐ
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx="true">{`
        .tickets-page {
          min-height: calc(100vh - 120px);
          background-color: #f8f9fa;
        }

        .breadcrumb-item + .breadcrumb-item::before {
          color: rgba(255, 255, 255, 0.5);
        }

        .breadcrumb-item.active {
          color: rgba(255, 255, 255, 0.8) !important;
        }

        .ticket-item {
          transition: transform 0.2s, box-shadow 0.2s;
          background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
        }

        .ticket-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .ticket-icon {
          flex-shrink: 0;
        }

        .ticket-details i {
          width: 14px;
        }

        @media (max-width: 768px) {
          .col-md-6.text-end {
            text-align: left !important;
            margin-top: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default TicketsPage;