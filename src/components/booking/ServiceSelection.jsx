import React, { useState, useEffect } from 'react';
import serviceService from '../../services/serviceService';

const ServiceSelection = ({ onServicesSelect, selectedServices = [] }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceCategories, setServiceCategories] = useState({});

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    const result = await serviceService.getAllServices();
    if (result.success) {
      setServices(result.data);
      
      // Group services by category
      const categories = {};
      result.data.forEach(service => {
        const category = service.loaiDichVu || 'Khác';
        if (!categories[category]) {
          categories[category] = [];
        }
        categories[category].push(service);
      });
      setServiceCategories(categories);
    }
    setLoading(false);
  };

  const handleServiceQuantityChange = (service, quantity) => {
    try {
      const newSelectedServices = [...selectedServices];
      const existingServiceIndex = newSelectedServices.findIndex(
        s => s.maDv === service.maDv
      );

      if (quantity === 0) {
        // Remove service if quantity is 0
        if (existingServiceIndex !== -1) {
          newSelectedServices.splice(existingServiceIndex, 1);
        }
      } else {
        // Update or add service
        const serviceData = {
          maDv: service.maDv,
          soLuong: quantity,
          tenDichVu: service.tenDv,
          donGia: service.donGia,
          urlHinh: service.urlHinh
        };

        if (existingServiceIndex !== -1) {
          newSelectedServices[existingServiceIndex] = serviceData;
        } else {
          newSelectedServices.push(serviceData);
        }
      }

      onServicesSelect(newSelectedServices);
    } catch (error) {
      console.error('Error updating service quantity:', error);
    }
  };

  const getServiceQuantity = (serviceId) => {
    const service = selectedServices.find(s => s.maDv === serviceId);
    return service ? service.soLuong : 0;
  };

  const calculateServicesTotal = () => {
    return selectedServices.reduce(
      (total, service) => total + ((service.donGia || 0) * service.soLuong),
      0
    );
  };

  const ServiceCard = ({ service }) => {
    const quantity = getServiceQuantity(service.maDv);

    return (
      <div className="col-md-6 col-lg-4 mb-4">
        <div className="card h-100 service-card">
          <div className="position-relative">
            <img
              src={service.urlHinh || '/images/default-service.jpg'}
              alt={service.tenDv}
              className="card-img-top"
              style={{ height: '200px', objectFit: 'cover' }}
            />
            {quantity > 0 && (
              <div className="position-absolute top-0 end-0 m-2">
                <span className="badge bg-success fs-6">
                  {quantity}
                </span>
              </div>
            )}
          </div>
          
          <div className="card-body d-flex flex-column">
            <h6 className="card-title">{service.tenDv}</h6>
            <p className="card-text text-muted small flex-grow-1">
              {service.moTa || 'Dịch vụ chất lượng cao'}
            </p>
            
            <div className="mt-auto">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-bold text-primary">
                  {service.donGia.toLocaleString('vi-VN')} VNĐ
                </span>
                {service.donVi && (
                  <span className="text-muted small">/{service.donVi}</span>
                )}
              </div>

              <div className="d-flex align-items-center justify-content-between">
                <div className="btn-group" role="group">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleServiceQuantityChange(service, Math.max(0, quantity - 1))}
                    disabled={quantity === 0}
                  >
                    <i className="bi bi-dash"></i>
                  </button>
                  <span className="btn btn-outline-primary btn-sm" style={{ minWidth: '50px' }}>
                    {quantity}
                  </span>
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleServiceQuantityChange(service, quantity + 1)}
                    disabled={quantity >= 10} // Max 10 items
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                </div>

                {quantity > 0 && (
                  <span className="text-success fw-bold">
                    {(service.donGia * quantity).toLocaleString('vi-VN')} VNĐ
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className="service-selection">
      <div className="row">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="card-title mb-0">
                <i className="bi bi-cup-straw me-2"></i>
                Chọn dịch vụ đi kèm
              </h5>
              <small className="text-muted">
                Tăng thêm trải nghiệm xem phim của bạn
              </small>
            </div>
            <div className="card-body">
              {Object.keys(serviceCategories).length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-cup text-muted" style={{ fontSize: '3rem' }}></i>
                  <p className="text-muted mt-3">Hiện tại chưa có dịch vụ nào</p>
                </div>
              ) : (
                Object.entries(serviceCategories).map(([category, categoryServices]) => (
                  <div key={category} className="mb-5">
                    <h6 className="text-primary mb-3 border-bottom pb-2">
                      <i className="bi bi-tag me-2"></i>
                      {category}
                    </h6>
                    <div className="row">
                      {categoryServices.map(service => (
                        <ServiceCard key={service.maDv} service={service} />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Services Summary */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm sticky-top">
            <div className="card-header bg-primary text-white py-3">
              <h5 className="card-title mb-0">
                <i className="bi bi-basket me-2"></i>
                Dịch vụ đã chọn
              </h5>
            </div>
            <div className="card-body">
              {selectedServices.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-basket text-muted" style={{ fontSize: '2rem' }}></i>
                  <p className="text-muted mt-2 mb-0">Chưa chọn dịch vụ nào</p>
                  <small className="text-muted">
                    Bạn có thể bỏ qua bước này nếu không cần dịch vụ
                  </small>
                </div>
              ) : (
                <>
                  <div className="mb-3">
                    {selectedServices.map((service, index) => (
                      <div key={index} className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{service.tenDichVu}</h6>
                          <div className="d-flex align-items-center">
                            <span className="text-muted small me-2">
                              {(service.donGia || 0).toLocaleString('vi-VN')} VNĐ x {service.soLuong}
                            </span>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-secondary"
                                onClick={() => {
                                  const newServices = services.find(s => s.maDv === service.maDv);
                                  if (newServices) {
                                    handleServiceQuantityChange(newServices, service.soLuong - 1);
                                  }
                                }}
                              >
                                <i className="bi bi-dash"></i>
                              </button>
                              <button
                                className="btn btn-outline-secondary"
                                onClick={() => {
                                  const newServices = services.find(s => s.maDv === service.maDv);
                                  if (newServices) {
                                    handleServiceQuantityChange(newServices, service.soLuong + 1);
                                  }
                                }}
                              >
                                <i className="bi bi-plus"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="text-end">
                          <span className="fw-bold text-primary">
                            {((service.donGia || 0) * service.soLuong).toLocaleString('vi-VN')} VNĐ
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">Tổng dịch vụ:</span>
                    <span className="fw-bold text-primary fs-5">
                      {calculateServicesTotal().toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>

                  <div className="mt-3">
                    <button
                      className="btn btn-outline-danger btn-sm w-100"
                      onClick={() => onServicesSelect([])}
                    >
                      <i className="bi bi-trash me-2"></i>
                      Xóa tất cả
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Popular Services */}
          <div className="card border-0 shadow-sm mt-3">
            <div className="card-header bg-white py-3">
              <h6 className="card-title mb-0">
                <i className="bi bi-star me-2"></i>
                Gợi ý phổ biến
              </h6>
            </div>
            <div className="card-body">
              <small className="text-muted">
                <i className="bi bi-lightbulb me-1"></i>
                Bắp rang bơ + Nước ngọt là combo được yêu thích nhất
              </small>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .service-card {
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }
        
        .service-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .btn-group .btn {
          border-radius: 0;
        }

        .btn-group .btn:first-child {
          border-top-left-radius: 0.375rem;
          border-bottom-left-radius: 0.375rem;
        }

        .btn-group .btn:last-child {
          border-top-right-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
        }

        .service-card .card-img-top {
          transition: transform 0.3s;
        }

        .service-card:hover .card-img-top {
          transform: scale(1.05);
        }

        @media (max-width: 768px) {
          .service-card {
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ServiceSelection;