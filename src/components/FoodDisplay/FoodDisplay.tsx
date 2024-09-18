import React from 'react';
import './FoodDisplay.css';
import { trpc } from '@/trpc/client';
import FoodItem from '../FoodItem/FoodItem';
import { Product, Category, ProductImage } from '@/payload-types';
import { useCart } from '@/hooks/use-cart';
import { BeatLoader } from 'react-spinners';

interface FoodDisplayProps {
  category: string;
  openModal: (food: Product) => void;
}

const FoodDisplay: React.FC<FoodDisplayProps> = ({ category, openModal }) => {
  const { data: foodList, isLoading, error } = trpc.getAllProducts.useQuery();
  const { addItem } = useCart();


  if (isLoading) {
    return (
      <div className='food-display' id='food-display'>
      </div>
    );
  }

  if (error) return <div>Error fetching data</div>;

  return (
    <div className='food-display' id='food-display'>
      <div className="food-display-list">
        {foodList.docs.map((item: Product) => {
          const itemCategory = item.category as Category;
          if (category === "All"|| (itemCategory && itemCategory.id === category)) {
            let imageUrl = '';
            if (typeof item.image === 'string') {
              imageUrl = item.image;
            } else if (item.image && 'url' in item.image) {
              imageUrl = (item.image as ProductImage).url || '';
            }

            return (
              <div key={item.id} onClick={() => openModal(item)}>
                <FoodItem
                  id={item.id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  image={imageUrl}
                />
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;
