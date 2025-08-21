import React from 'react';
import { upgradesComplexity, upgradesSpeed } from '../database/upgrades';

interface ShopProps {
  speedUpgradesBought: number;
  complexityUpgradesBought: number;
  money: number;
  onBuySpeedUpgrade: () => void;
  onBuyComplexityUpgrade: () => void;
}

const Shop = ({ 
  speedUpgradesBought, 
  complexityUpgradesBought, 
  money, 
  onBuySpeedUpgrade, 
  onBuyComplexityUpgrade 
}: ShopProps) => {
  const nextSpeedUpgrade = upgradesSpeed[speedUpgradesBought];
  const nextComplexityUpgrade = upgradesComplexity[complexityUpgradesBought];

  const canAffordSpeed = nextSpeedUpgrade && money >= nextSpeedUpgrade.cost;
  const canAffordComplexity = nextComplexityUpgrade && money >= nextComplexityUpgrade.cost;

  return (
    <div className="shop">
      <h3>Upgrade Shop</h3>
      <div className="shop-items">
        <div 
          className={`shop-item ${canAffordSpeed ? 'affordable' : 'unaffordable'} ${nextSpeedUpgrade ? 'clickable' : ''}`}
          onClick={canAffordSpeed ? onBuySpeedUpgrade : undefined}
        >
          <div className="upgrade-info">
            <span className="upgrade-name">{nextSpeedUpgrade?.name || 'Max Speed Reached'}</span>
            <span className={`upgrade-cost ${canAffordSpeed ? 'affordable' : 'unaffordable'}`}>
              {nextSpeedUpgrade ? `₿${nextSpeedUpgrade.cost}` : 'N/A'}
            </span>
          </div>
          <div className="upgrade-type">Speed +{nextSpeedUpgrade?.increaseBy || 0}</div>
        </div>
        <div 
          className={`shop-item ${canAffordComplexity ? 'affordable' : 'unaffordable'} ${nextComplexityUpgrade ? 'clickable' : ''}`}
          onClick={canAffordComplexity ? onBuyComplexityUpgrade : undefined}
        >
          <div className="upgrade-info">
            <span className="upgrade-name">{nextComplexityUpgrade?.name || 'Max Complexity Reached'}</span>
            <span className={`upgrade-cost ${canAffordComplexity ? 'affordable' : 'unaffordable'}`}>
              {nextComplexityUpgrade ? `₿${nextComplexityUpgrade.cost}` : 'N/A'}
            </span>
          </div>
          <div className="upgrade-type">Complexity +{nextComplexityUpgrade?.increaseBy || 0}</div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
