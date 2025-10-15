import React from 'react';

const SettingsManager = () => (
    <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
            <h5 className="card-title mb-0 text-primary">
                <i className="bi bi-gear me-2"></i>
                Cài đặt hệ thống
            </h5>
        </div>
        <div className="card-body p-4">
            <div className="text-center py-5">
                <i className="bi bi-code-slash text-muted" style={{ fontSize: '3rem' }}></i>
                <h4 className="mt-3">Đang phát triển</h4>
                <p className="text-muted">Chức năng cài đặt hệ thống sẽ sớm được cập nhật.</p>
            </div>
        </div>
    </div>
);

export default SettingsManager;