"use client";

import React, { useState } from 'react';
import Header from '@/components/Header/Header';
import ExploreMenu from '@/components/ExploreMenu/ExploreMenu';
import FoodDisplay from '@/components/FoodDisplay/FoodDisplay';
import FoodDetail from '@/components/FoodDetail/FoodDetail';
import { Product } from '@/payload-types';
import { useCart } from '@/hooks/use-cart';
import { useTheme } from '@/context/themecontext';
import { FaMapMarkerAlt } from 'react-icons/fa';

const Home: React.FC = () => {
  const [category, setCategory] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedFood, setSelectedFood] = useState<Product | null>(null);

  const openModal = (food: Product) => {
    setSelectedFood(food);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  const { items } = useCart();
  const itemCount = items.length;
  const { addItem } = useCart();
  const theme = useTheme();

  return (
<div className="">
<div className="flex items-center lg:p-2 justify-center rounded-md mt-4"> 
  <FaMapMarkerAlt className="text-red-600 mr-2 lg:text-4xl text-2xl" />
  <a 
    href="https://www.google.com/maps/search/?api=1&query=Rua+dos+Andradas,+45,+Alegrete-RS" 
    target="_blank" 
    rel="noopener noreferrer"
    className="text-gray-700 dark:text-white font-medium lg:text-2xl text-base"
  >
    456 Elm Street, Springfield, IL 62701
  </a>
</div>


      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} openModal={openModal} />

      {isModalOpen && selectedFood && (
        <FoodDetail isOpen={isModalOpen} onClose={closeModal} food={selectedFood} />
      )}
    </div>
  );
};

export default Home;
