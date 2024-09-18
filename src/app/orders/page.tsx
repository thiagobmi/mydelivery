"use client";

import { useEffect, useState } from "react";
import { trpc } from "@/trpc/client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { format } from "date-fns";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Image from "next/image";
import { BeatLoader } from "react-spinners";

const getStatusLabel = (status: string): string => {
  switch (status) {
    case "pending":
      return "Under Review";
    case "processing":
      return "Processing";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    default:
      return "Unknown";
  }
};

const OrdersPage = () => {
  const { data: userOrders, isLoading, error } = trpc.auth.getOrdersFromUser.useQuery();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (userOrders && userOrders.length > 0) {
      setExpandedOrderId(userOrders[0].id);
    }
  }, [userOrders]);

  const handleOrderClick = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (isLoading) {
    return (
      <MaxWidthWrapper>
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-200 py-8">My Orders</h1>
        <div className="flex justify-center items-center h-64">
          <BeatLoader size={34} color={'#e0e0e0'} loading={true} />
        </div>
      </MaxWidthWrapper>
    );
  }

  if (error) {
    return (
      <MaxWidthWrapper>
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-200 py-8">My Orders</h1>
        <div className="flex justify-center items-center h-64">
          <p className="text-lg font-semibold text-red-500">Error loading orders</p>
        </div>
      </MaxWidthWrapper>
    );
  }

  if (!userOrders || userOrders.length === 0) {
    return (
      <MaxWidthWrapper>
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-200 py-8">My Orders</h1>
        <div className="flex justify-center items-center h-64">
          <p className="text-lg font-semibold">No orders found.</p>
        </div>
      </MaxWidthWrapper>
    );
  }

  return (
    <MaxWidthWrapper>
      <div className="py-8">
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-200">My Orders</h1>
        <div className="mt-10">
          <ul className="space-y-6">
            {userOrders.map((order: any) => (
              <li
                key={order.id}
                onClick={() => handleOrderClick(order.id)}
                className={`border rounded-lg p-6 bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-shadow cursor-pointer ${expandedOrderId === order.id ? 'border-blue-500' : ''}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      Order ID: <span className="font-bold text-gray-900 dark:text-gray-100">#{order.id}</span>
                    </p>
                    <p className="text-md text-gray-600 dark:text-gray-400">
                      Status: <span className="font-bold">{getStatusLabel(order.status)}</span>
                    </p>
                    <p className="text-md text-gray-600 dark:text-gray-400">
                      Date: <span className="font-medium">{format(new Date(order.createdAt), "dd/MM/yyyy HH:mm:ss")}</span>
                    </p>
                    <p className="text-md text-gray-600 dark:text-gray-400">
                      Total: <span className="font-medium">R$ {order.total}</span>
                    </p>
                    {expandedOrderId === order.id && (
                      <>
                        <p className="text-md text-gray-600 dark:text-gray-400">
                          Address: <span className="font-medium">{order.address.street}, {order.address.number}, {order.address.city}</span>
                        </p>
                        <h3 className="text-lg font-semibold mt-4">Products:</h3>
                        <ul className="space-y-2">
                          {order.items.map((item: any, index: number) => (
                            <li key={index} className="flex items-center space-x-4">
                              <div className="relative h-14 w-14">
                                {item.product.image?.url && (
                                  <Image
                                    src={item.product.image.url}
                                    alt={item.product.name}
                                    fill
                                    className="rounded-md object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  />
                                )}
                              </div>
                              <div>
                                <p className="text-md font-medium">{item.product.name}</p>
                                <p className="text-sm">Quantity: {item.quantity}</p>
                                <p className="text-sm">Price: R$ {item.product.price}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                  <div>
                    {expandedOrderId === order.id ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default OrdersPage;
