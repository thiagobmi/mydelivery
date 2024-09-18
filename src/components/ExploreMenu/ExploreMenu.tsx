import React, { useEffect, useState } from 'react';
import './ExploreMenu.css';
import { trpc } from '@/trpc/client';
import { BeatLoader } from 'react-spinners';

interface ExploreMenuProps {
    category: string;
    setCategory: React.Dispatch<React.SetStateAction<string>>;
}

interface Category {
    id: string;
    name: string;
    description: string;
    image: {
        url: string;
    };
}

const ExploreMenu: React.FC<ExploreMenuProps> = ({ category, setCategory }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const { data: categoryData, isLoading, error } = trpc.getAllCategories.useQuery();

    useEffect(() => {
        if (categoryData) {
            setCategories(categoryData.docs);
        }
    }, [categoryData]);

    if (isLoading) {
        return (
            <div className='explore-menu' id='explore-menu'>
                <h1 className='h1e text-4xl'>Explore our menu</h1>
                <p className='text-xl'>Choose from a diverse menu with a delicious variety of dishes.</p>
                <div className="loading-container">
                    <BeatLoader size={34} color={'#e0e0e0'} loading={true} />
                </div>
            </div>
        );
    }

    if (error) return <div>Error fetching categories</div>;

    return (
        <div className='explore-menu' id='explore-menu'>
            <h1 className='h1e text-4xl'>Explore our menu</h1>
            <p className='text-xl'>Choose from a diverse menu with a delicious variety of dishes.</p>
            <div className="explore-menu-list ">
                {categories.map((item: Category, index: number) => {
                    return (
                        <div
                            onClick={() => setCategory(prev => prev === item.id ? "All" : item.id)}
                            key={index}
                            className='explore-menu-list-item items-center flex flex-col cursor-pointer'
                        >
                            <img className={category === item.id ? "active" : ""} src={item.image.url} alt={item.name}/>
                            <p className='item_menu max-w-60'>{item.name}</p>
                        </div>
                    )
                })}
            </div>
            <hr />
        </div>
    );
}

export default ExploreMenu;
