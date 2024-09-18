import { format } from "date-fns";
import Image from "next/image";
import { BeatLoader } from "react-spinners";

const getStatusLabel = (status: string): string => {
  switch (status) {
    case "pending":
      return "Under review";
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

const OrderDisplay = ({
  order,
  isLoading,
  error,
}: {
  order: any;
  isLoading: boolean;
  error: any;
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center">
        <BeatLoader size={34} color={"#e0e0e0"} loading={true} />
      </div>
    );
  }

  if (error) {
    return <p>Error loading orders</p>;
  }

  if (!order) {
    return <p className="text-md">No orders found.</p>;
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md shadow">
      <p className="text-lg font-semibold">Order ID: #{order.id}</p>
      <p className="text-md">
        Status:{" "}
        <span className="font-bold text-lg">
          {getStatusLabel(order.status)}
        </span>
      </p>
      <p className="text-md">
        Date: {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm:ss")}
      </p>
      <p className="text-md">Total: $ {order.total}</p>
      <p className="text-md">
        Address: {order.address.street}, {order.address.number},{" "}
        {order.address.city}
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
              <p className="text-sm">Price: $ {item.product.price}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderDisplay;
