import React from 'react';
import './style.css';
import Button from '../button/Button'; 

export interface NavButtonConfig {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger"; 
  disabled?: boolean;
}

interface NavbarProps {
  logoUrl: string;
  brandName: string;
  buttons?: NavButtonConfig[];
}

const Navbar: React.FC<NavbarProps> = ({ logoUrl, brandName, buttons }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logoUrl} alt="Logo" className="navbar-logo" />
        <span className="navbar-brand-name">{brandName}</span>
      </div>

      <div className="navbar-right">
        {buttons?.slice(0, 2).map((btn, index) => (
          <Button 
            key={index}
            label={btn.label}
            onClick={btn.onClick}
            variant={btn.variant} 
            disabled={btn.disabled}
            type="button" 
          />
        ))}
      </div>
    </nav>
  );
};

export default Navbar;