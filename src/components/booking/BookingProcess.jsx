import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieDetail from './MovieDetail';
import SeatSelection from './SeatSelection';
import ServiceSelection from './ServiceSelection';
import PaymentProcess from './PaymentProcess';
import promotionService from '../../services/promotionService';
import ticketService from '../../services/ticketService';
import { useToast } from '../common/Toast';

const BookingProcess = ({ movieId: initialMovieId }) => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  // Booking states
  const [currentStep, setCurrentStep] = useState(1);
  const [movieId, setMovieId] = useState(initialMovieId);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [promotionCode, setPromotionCode] = useState('');
  const [appliedPromotion, setAppliedPromotion] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // No need to fetch promotions - only validate entered codes
  }, []);

  const handleShowtimeSelect = (showtime) => {
    setSelectedShowtime(showtime);
    setCurrentStep(2);
  };

  const handleSeatsSelect = (seats) => {
    setSelectedSeats(seats);
  };

  const handleServicesSelect = (services) => {
    setSelectedServices(services);
  };

  const handlePromotionApply = async () => {
    if (!promotionCode.trim()) {
      showError('Vui lòng nhập mã khuyến mãi');
      return;
    }

    setLoading(true);
    try {
      // Validate promotion first
      const validateResult = await promotionService.validatePromotion(promotionCode);
      if (validateResult.success) {
        // Get promotion details
        const detailResult = await promotionService.getPromotionDetail(promotionCode);
        if (detailResult.success) {
          setAppliedPromotion(detailResult.data);
          showSuccess('Áp dụng khuyến mãi thành công');
        } else {
          showError(detailResult.message);
          setAppliedPromotion(null);
        }
      } else {
        showError(validateResult.message);
        setAppliedPromotion(null);
      }
    } catch (error) {
      showError('Có lỗi xảy ra khi kiểm tra khuyến mãi');
      setAppliedPromotion(null);
    }
    setLoading(false);
  };

  const calculateTicketTotal = () => {
    if (!selectedShowtime || selectedSeats.length === 0) return 0;
    
    // Sử dụng donGiaCoSo từ API mới
    const basePrice = selectedShowtime.donGiaCoSo * selectedSeats.length;
    const seatSurcharge = selectedSeats.reduce((total, seat) => total + (seat.phuThu || 0), 0);
    return basePrice + seatSurcharge;
  };

  const calculateServicesTotal = () => {
    return selectedServices.reduce((total, service) => total + (service.donGia * service.soLuong), 0);
  };

  const calculateDiscount = () => {
    if (!appliedPromotion) return 0;
    
    const subtotal = calculateTicketTotal() + calculateServicesTotal();
    const discountValue = appliedPromotion.giaTri || 0;
    
    // giaTri is percentage (e.g., 20 for 20%)
    return (subtotal * discountValue) / 100;
  };

  const calculateFinalTotal = () => {
    const subtotal = calculateTicketTotal() + calculateServicesTotal();
    const discount = calculateDiscount();
    return Math.max(0, subtotal - discount);
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      showError('Vui lòng chọn ít nhất một ghế');
      return;
    }

    setLoading(true);

    // Format dữ liệu theo API mới
    const bookingRequest = {
      maPhim: movieId,
      maSuatChieu: selectedShowtime.maSuatChieu,
      maGheList: selectedSeats.map(seat => seat.maGhe),
      maKhuyenMai: appliedPromotion?.maKm || null,
      dichVuList: selectedServices.map(service => ({
        maDv: service.maDv,
        soLuong: service.soLuong
      })),
      phuongThucThanhToan: "VNPAY"
    };

    try {
      const result = await ticketService.bookTicket(bookingRequest);
      
      if (result.success) {
        setBookingData(result.data);
        setCurrentStep(4); // Move to payment step
        showSuccess('Đặt vé thành công! Vui lòng thanh toán để hoàn tất.');
      } else {
        showError(result.message);
      }
    } catch (error) {
      showError('Có lỗi xảy ra khi đặt vé. Vui lòng thử lại.');
    }

    setLoading(false);
  };

  const handlePaymentSuccess = () => {
    showSuccess('Thanh toán thành công! Cảm ơn bạn đã sử dụng dịch vụ.');
    navigate('/tickets'); // Navigate to tickets page
  };

  const handlePaymentFailure = () => {
    showError('Thanh toán thất bại. Vui lòng thử lại.');
    setCurrentStep(3); // Go back to confirmation step
  };

  const handleStepChange = (step) => {
    if (step === 1) {
      setCurrentStep(1);
    } else if (step === 2 && selectedShowtime) {
      setCurrentStep(2);
    } else if (step === 3 && selectedSeats.length > 0) {
      setCurrentStep(3);
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, title: 'Chọn phim & suất chiếu', icon: 'bi-film' },
      { number: 2, title: 'Chọn ghế', icon: 'bi-grid-3x3' },
      { number: 3, title: 'Dịch vụ & Thanh toán', icon: 'bi-credit-card' },
      { number: 4, title: 'Hoàn tất', icon: 'bi-check-circle' }
    ];

    return (
      <div className="booking-steps mb-4">
        <div className="row">
          {steps.map((step, index) => (
            <div key={step.number} className="col-3">
              <div className="d-flex align-items-center">
                <div
                  className={`step-indicator ${currentStep >= step.number ? 'active' : ''} ${
                    currentStep > step.number ? 'completed' : ''
                  }`}
                  onClick={() => handleStepChange(step.number)}
                  style={{ cursor: currentStep > step.number ? 'pointer' : 'default' }}
                >
                  <i className={`bi ${step.icon}`}></i>
                  <span className="step-number">{step.number}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`step-connector ${currentStep > step.number ? 'completed' : ''}`}></div>
                )}
              </div>
              <div className="step-title mt-2 text-center">
                <small className={currentStep >= step.number ? 'text-primary fw-bold' : 'text-muted'}>
                  {step.title}
                </small>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderBookingSummary = () => {
    if (currentStep < 3) return null;

    return (
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">
            <i className="bi bi-receipt me-2"></i>
            Tóm tắt đơn hàng
          </h5>
        </div>
        <div className="card-body">
          {/* Movie & Showtime Info */}
          <div className="mb-3">
            <h6 className="text-primary">{selectedShowtime?.phim?.tenPhim}</h6>
            <p className="mb-1">
              <i className="bi bi-calendar me-2"></i>
              {new Date(selectedShowtime?.thoiGianChieu).toLocaleDateString('vi-VN')}
            </p>
            <p className="mb-1">
              <i className="bi bi-clock me-2"></i>
              {new Date(selectedShowtime?.thoiGianChieu).toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            <p className="mb-0">
              <i className="bi bi-geo-alt me-2"></i>
              {selectedShowtime?.phongChieu?.tenPhong}
            </p>
          </div>

          <hr />

          {/* Selected Seats */}
          <div className="mb-3">
            <h6>Ghế đã chọn</h6>
            <div className="d-flex flex-wrap gap-2 mb-2">
              {selectedSeats.map((seat, index) => (
                <span key={index} className="badge bg-primary">
                  {seat.tenGhe}
                </span>
              ))}
            </div>
            <div className="d-flex justify-content-between">
              <span>Vé ({selectedSeats.length} ghế)</span>
              <span>{calculateTicketTotal().toLocaleString('vi-VN')} VNĐ</span>
            </div>
          </div>

          {/* Selected Services */}
          {selectedServices.length > 0 && (
            <>
              <hr />
              <div className="mb-3">
                <h6>Dịch vụ đi kèm</h6>
                {selectedServices.map((service, index) => (
                  <div key={index} className="d-flex justify-content-between mb-1">
                    <span>{service.tenDichVu} x{service.soLuong}</span>
                    <span>{(service.gia * service.soLuong).toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                ))}
                <div className="d-flex justify-content-between fw-bold">
                  <span>Tổng dịch vụ</span>
                  <span>{calculateServicesTotal().toLocaleString('vi-VN')} VNĐ</span>
                </div>
              </div>
            </>
          )}

          {/* Promotion */}
          {appliedPromotion && (
            <>
              <hr />
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-success">
                      <i className="bi bi-tag me-1"></i>
                      Khuyến mãi ({appliedPromotion.maKm})
                    </span>
                    <span className="badge bg-success ms-2">Đã áp dụng</span>
                  </div>
                  <span className="text-success fw-bold">
                    -{calculateDiscount().toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>
                <small className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  {appliedPromotion.tenKm} - {appliedPromotion.moTa}
                </small>
              </div>
            </>
          )}

          <hr />

          {/* Total */}
          <div className="d-flex justify-content-between fw-bold fs-5">
            <span>Tổng cộng</span>
            <span className="text-primary">
              {calculateFinalTotal().toLocaleString('vi-VN')} VNĐ
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="booking-process">
      <div className="container-fluid px-4">
        {renderStepIndicator()}

        <div className="row">
          <div className={currentStep < 3 ? 'col-12' : 'col-lg-8'}>
            {/* Step 1: Movie Detail & Showtime Selection */}
            {currentStep === 1 && (
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <MovieDetail 
                    movieId={movieId} 
                    onShowtimeSelect={handleShowtimeSelect}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Seat Selection */}
            {currentStep === 2 && selectedShowtime && (
              <div>
                <SeatSelection
                  scheduleData={selectedShowtime}
                  onSeatsSelect={handleSeatsSelect}
                  selectedSeats={selectedSeats}
                />
                
                <div className="d-flex justify-content-between mt-4">
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => setCurrentStep(1)}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Quay lại
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setCurrentStep(3)}
                    disabled={selectedSeats.length === 0}
                  >
                    Tiếp tục
                    <i className="bi bi-arrow-right ms-2"></i>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Services & Payment Confirmation */}
            {currentStep === 3 && (
              <div>
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body">
                    <ServiceSelection
                      onServicesSelect={handleServicesSelect}
                      selectedServices={selectedServices}
                    />
                  </div>
                </div>

                {/* Promotion Section */}
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-header bg-white">
                    <h5 className="mb-0">
                      <i className="bi bi-tag me-2"></i>
                      Mã khuyến mãi
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-8">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Nhập mã khuyến mãi"
                            value={promotionCode}
                            onChange={(e) => setPromotionCode(e.target.value.toUpperCase())}
                          />
                          <button
                            className="btn btn-outline-primary"
                            onClick={handlePromotionApply}
                            disabled={loading}
                          >
                            Áp dụng
                          </button>
                        </div>
                        {appliedPromotion && (
                          <div className="mt-2">
                            <small className="text-success">
                              <i className="bi bi-check-circle me-1"></i>
                              Đã áp dụng: {appliedPromotion.tenKhuyenMai}
                            </small>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Promotion help text */}
                    <div className="mt-3">
                      <small className="text-muted">
                        <i className="bi bi-lightbulb me-1"></i>
                        Nhập mã khuyến mãi để nhận ưu đãi đặc biệt
                      </small>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-between">
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => setCurrentStep(2)}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Quay lại
                  </button>
                  <button 
                    className="btn btn-success btn-lg"
                    onClick={handleBooking}
                    disabled={loading || selectedSeats.length === 0}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-credit-card me-2"></i>
                        Đặt vé & Thanh toán
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Payment */}
            {currentStep === 4 && bookingData && (
              <PaymentProcess
                bookingData={bookingData}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentFailure={handlePaymentFailure}
              />
            )}
          </div>

          {/* Booking Summary (for steps 3+) */}
          {currentStep >= 3 && (
            <div className="col-lg-4">
              {renderBookingSummary()}
            </div>
          )}
        </div>
      </div>

      <style jsx="true">{`
        .step-indicator {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: #e9ecef;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: all 0.3s ease;
        }

        .step-indicator.active {
          background-color: #007bff;
          color: white;
        }

        .step-indicator.completed {
          background-color: #28a745;
          color: white;
        }

        .step-connector {
          flex: 1;
          height: 2px;
          background-color: #e9ecef;
          margin: 0 10px;
          transition: all 0.3s ease;
        }

        .step-connector.completed {
          background-color: #28a745;
        }

        .step-number {
          font-weight: bold;
          font-size: 1.1rem;
        }

        .step-title {
          min-height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .step-indicator {
            width: 40px;
            height: 40px;
          }
          
          .step-number {
            font-size: 0.9rem;
          }
          
          .step-title small {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingProcess;