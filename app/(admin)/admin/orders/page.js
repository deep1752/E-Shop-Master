import React from 'react';

const dummyOrders = [
  { id: 1, orderNumber: 'ORD-001', customerName: 'Alice Johnson', date: '2025-04-29', total: '₹120.00', status: 'Delivered' },
  { id: 2, orderNumber: 'ORD-002', customerName: 'Bob Smith', date: '2025-04-28', total: '₹80.50', status: 'Processing' },
  { id: 3, orderNumber: 'ORD-003', customerName: 'Charlie Brown', date: '2025-04-27', total: '₹45.00', status: 'Cancelled' },
  { id: 4, orderNumber: 'ORD-004', customerName: 'Diana Prince', date: '2025-04-26', total: '₹200.00', status: 'Delivered' },
  { id: 5, orderNumber: 'ORD-005', customerName: 'Ethan Hunt', date: '2025-04-25', total: '₹65.75', status: 'Processing' },
  { id: 6, orderNumber: 'ORD-006', customerName: 'Fiona Gallagher', date: '2025-04-24', total: '₹150.20', status: 'Cancelled' },
  { id: 7, orderNumber: 'ORD-007', customerName: 'George Miller', date: '2025-04-23', total: '₹99.99', status: 'Delivered' },
  { id: 8, orderNumber: 'ORD-008', customerName: 'Hannah Montana', date: '2025-04-22', total: '₹30.00', status: 'Processing' },
  { id: 9, orderNumber: 'ORD-009', customerName: 'Ian Malcolm', date: '2025-04-21', total: '₹88.88', status: 'Delivered' },
  { id: 10, orderNumber: 'ORD-010', customerName: 'Jane Eyre', date: '2025-04-20', total: '₹47.30', status: 'Cancelled' },
];

const statusClasses = {
  Delivered: 'status-delivered',
  Processing: 'status-processing',
  Cancelled: 'status-cancelled',
};

export default function OrdersPage() {
  return (
    <div className="orders-container">
      <h1 className="orders-title">Orders</h1>
      <div className="table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {dummyOrders.map(order => (
              <tr key={order.id}>
                <td>{order.orderNumber}</td>
                <td>{order.customerName}</td>
                <td>{order.date}</td>
                <td>{order.total}</td>
                <td>
                  <span className={`status-badge ${statusClasses[order.status]}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
