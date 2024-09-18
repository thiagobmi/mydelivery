import React, { useContext } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { useCart } from '@/hooks/use-cart';
interface FoodItemProps {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}


const FoodItem: React.FC<FoodItemProps> = ({ id, name, price, description, image }) => {

  const {items} = useCart();
  const itemCount = items.length;
  
  const cartTotalItems = items.filter(item => item.product.id === id).reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className='food-item'>
    <div className="food-item-img-container">
      <img className='food-item-image cursor-pointer' src={image} alt={name} />
      {cartTotalItems === 0
        ? <img className='add' src={assets.add_icon_white.src} alt="Add" />
        : <div className='food-item-counter'>
          <img src={assets.remove_icon_red.src} alt='Remove' />
          <p className='cartitemsp'>{cartTotalItems}</p>
          <img src={assets.add_icon_green.src} alt='Add' />
        </div>
      }
    </div>
    <div className="food-item-info">
      <div className="food-item-name-rating">
        <p className='namewe'>{name}</p>
      </div>
      <p className="food-item-desc">{description}</p>
      <p className="food-item-price">R${price}</p>
    </div>
  </div>
    );
}

export default FoodItem;
