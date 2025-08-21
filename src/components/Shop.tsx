import React from 'react';
import { upgradesComplexity, upgradesSpeed } from '../database/upgrades';

interface ShopProps {
  speedUpgradesBought: number;
  complexityUpgradesBought: number;
  money: number;
}

const Shop = ({ speedUpgradesBought, complexityUpgradesBought, money }: ShopProps) => {
  const nextSpeedUpgrade = upgradesSpeed[speedUpgradesBought];
  const nextComplexityUpgrade = upgradesComplexity[complexityUpgradesBought];

  return (
    <div className="shop">
      <h3>Upgrade Shop</h3>
      <div className="shop-items">
        <div className="shop-item">
          <div className="upgrade-info">
            <span className="upgrade-name">{nextSpeedUpgrade?.name || 'Max Speed Reached'}</span>
            <span className="upgrade-cost">{nextSpeedUpgrade ? `₿${nextSpeedUpgrade.cost}` : 'N/A'}</span>
          </div>
          <div className="upgrade-type">Speed +{nextSpeedUpgrade?.increaseBy || 0}</div>
        </div>
        <div className="shop-item">
          <div className="upgrade-info">
            <span className="upgrade-name">{nextComplexityUpgrade?.name || 'Max Complexity Reached'}</span>
            <span className="upgrade-cost">{nextComplexityUpgrade ? `₿${nextComplexityUpgrade.cost}` : 'N/A'}</span>
          </div>
          <div className="upgrade-type">Complexity +{nextComplexityUpgrade?.increaseBy || 0}</div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
