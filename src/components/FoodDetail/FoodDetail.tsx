import React from 'react';
import DesktopView from './DesktopView';
import MobileView from './MobileView';
import { Product } from '@/payload-types';
import useDeviceType from '@/hooks/use-device-type';

interface FoodDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    food: Product;
}

const FoodDetailModal: React.FC<FoodDetailModalProps> = ({ isOpen, onClose, food }) => {
    const isMobile = useDeviceType();

    return (
        <div>
            {isMobile ? 
                <MobileView isOpen={isOpen} onClose={onClose} food={food} /> :
                <DesktopView isOpen={isOpen} onClose={onClose} food={food} />
            }
        </div>
    );
};

export default FoodDetailModal;
