import React, { useState } from 'react';
import api from '../api/client';
import { useAuth } from '../hooks/useAuth';
import UpgradeConfirmationModal from './UpgradeConfirmationModal';

interface UpgradeButtonProps {
  onUpgradeSuccess?: () => void;
  className?: string;
}

const UpgradeButton: React.FC<UpgradeButtonProps> = ({ 
  onUpgradeSuccess, 
  className = '' 
}) => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await api.post(`/tenants/upgrade`, { tenantId: user.tenantId });
      setShowModal(false);
      
      // Call the success callback if provided
      if (onUpgradeSuccess) {
        onUpgradeSuccess();
      } else {
        // Default behavior - reload the page
        window.location.reload();
      }
    } catch (err) {
      if (err && typeof err === 'object' && 'response' in err) {
        setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to upgrade');
      } else {
        setError('Failed to upgrade. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        className={`upgrade-btn ${className}`}
      >
        Upgrade to Pro
      </button>

      <UpgradeConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleUpgrade}
        loading={loading}
      />

      {error && (
        <div className="upgrade-error">
          {error}
        </div>
      )}
    </>
  );
};

export default UpgradeButton;
