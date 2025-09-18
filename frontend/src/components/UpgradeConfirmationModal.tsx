import React from 'react';
import Modal from './Modal';

interface UpgradeConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const UpgradeConfirmationModal: React.FC<UpgradeConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  loading = false 
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🚀 Upgrade to Pro">
      <div className="upgrade-content">
        <div className="plan-comparison">
          <div className="current-plan">
            <h3>Current Plan: Free</h3>
            <p>✅ Up to 3 notes</p>
          </div>
          
          <div className="pro-plan">
            <h3>Pro Plan: Unlimited</h3>
            <p>🚀 Unlimited notes</p>
          </div>
        </div>
        
        <div className="upgrade-buttons">
          <button 
            className="cancel-btn" 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className="confirm-upgrade-btn" 
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Upgrading...' : 'Confirm Upgrade'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UpgradeConfirmationModal;