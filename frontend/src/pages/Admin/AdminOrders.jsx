import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { adminService } from '../../services/admin.service.js';
import { getImageUrl } from '../../services/api.js';

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const FALLBACK_IMAGE = 'https://cdn-icons-png.flaticon.com/512/3081/3081558.png';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number.isFinite(Number(value)) ? Number(value) : 0);

const formatDate = (dateString) => {
  if (!dateString) return 'Date unavailable';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return 'Date unavailable';
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatLabel = (value) =>
  value ? value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()) : 'Not recorded';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 20 };
      if (statusFilter) params.status = statusFilter;
      const response = await adminService.getAllOrders(params);
      setOrders(response.data?.orders || []);
      setPagination({
        total: response.data?.total || 0,
        pages: Math.max(response.data?.pages || 1, 1),
      });
    } catch (requestError) {
      setError(requestError.message || 'Unable to load orders. Please try again.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadOrders();
  }, [loadOrders]);

  const handleFilterChange = (event) => {
    setPage(1);
    setStatusFilter(event.target.value);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    if (!ORDER_STATUSES.includes(newStatus)) {
      toast.error('Choose a valid order status');
      return;
    }

    const previousStatus = orders.find((order) => order._id === orderId)?.status;
    if (newStatus === previousStatus) return;

    setUpdatingId(orderId);
    try {
      const response = await adminService.updateOrderStatus(orderId, newStatus);
      const updatedOrder = response.data;
      if (!updatedOrder?._id || updatedOrder.status !== newStatus) {
        throw new Error('The server did not confirm the requested order status');
      }
      if (statusFilter && statusFilter !== newStatus) {
        await loadOrders();
        toast.success(`Order status updated to ${formatLabel(newStatus)}`);
        return;
      }
      setOrders((current) =>
        current.map((order) => (order._id === orderId ? { ...order, ...updatedOrder } : order))
      );
      toast.success(`Order status updated to ${formatLabel(newStatus)}`);
    } catch (requestError) {
      toast.error(requestError.message || 'Failed to update order status');
      await loadOrders();
    } finally {
      setUpdatingId(null);
    }
  };

  const visibleOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return orders;
    return orders.filter((order) => {
      const searchable = [
        order._id,
        order.user?.name,
        order.user?.email,
        ...((order.items || []).map((item) => item.title)),
      ];
      return searchable.some((value) => String(value || '').toLowerCase().includes(query));
    });
  }, [orders, searchQuery]);

  return (
    <section className="adminContentPage">
      <div className="adminPageIntro">
        <p className="adminEyebrow">FULFILLMENT &amp; SALES</p>
        <div className="adminOrdersHeader">
          <div>
            <h1>Orders Management</h1>
            <p>Review customer orders and update fulfillment status.</p>
          </div>
          <button
            type="button"
            className="adminRefreshButton"
            onClick={loadOrders}
            disabled={loading}
          >
            {loading ? 'Loading…' : '↻ Refresh Orders'}
          </button>
        </div>
      </div>

      <div className="adminOrdersToolbar">
        <label className="adminOrdersFilter">
          <span className="srOnly">Filter by order status</span>
          <select className="adminInlineSelect" value={statusFilter} onChange={handleFilterChange}>
            <option value="">All statuses</option>
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {formatLabel(status)}
              </option>
            ))}
          </select>
        </label>
        <label className="adminOrdersSearch">
          <span className="srOnly">Search orders on this page</span>
          <input
            type="search"
            className="input"
            placeholder="Search this page by order, customer, or product"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </label>
      </div>

      {loading ? (
        <div className="adminOrdersState" role="status">
          <span className="adminOrdersSpinner" aria-hidden="true" />
          Loading orders…
        </div>
      ) : error ? (
        <div className="adminOrdersState adminOrdersError" role="alert">
          <p>{error}</p>
          <button type="button" className="adminRefreshButton" onClick={loadOrders}>
            Try again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="adminOrdersState">
          {statusFilter
            ? `No ${formatLabel(statusFilter).toLowerCase()} orders found.`
            : 'No orders have been placed yet.'}
        </div>
      ) : visibleOrders.length === 0 ? (
        <div className="adminOrdersState">No orders on this page match your search.</div>
      ) : (
        <div className="adminOrderList" aria-live="polite">
          {visibleOrders.map((order) => {
            const items = Array.isArray(order.items) ? order.items : [];
            const address = order.shippingAddress;
            const addressText = address
              ? [
                  address.street,
                  address.city,
                  address.state,
                  address.zipCode,
                  address.country,
                ]
                  .filter(Boolean)
                  .join(', ')
              : '';

            return (
              <article className="adminOrderCard" key={order._id}>
                <header className="adminOrderCardHeader">
                  <div>
                    <p className="adminOrderEyebrow">ORDER</p>
                    <h2 className="adminOrderId">#{order._id}</h2>
                    <time className="adminOrderDate" dateTime={order.createdAt || undefined}>
                      {formatDate(order.createdAt)}
                    </time>
                  </div>
                  <span className={`orderStatus ${order.status || 'unknown'}`}>
                    {formatLabel(order.status)}
                  </span>
                </header>

                <div className="adminOrderInfoGrid">
                  <section className="adminOrderInfo">
                    <h3>Customer</h3>
                    <p>{order.user?.name || 'Customer details unavailable'}</p>
                    {order.user?.email && <p className="adminOrderMuted">{order.user.email}</p>}
                    {addressText && <p className="adminOrderMuted">{addressText}</p>}
                  </section>

                  <section className="adminOrderInfo">
                    <h3>Payment</h3>
                    <p>{formatLabel(order.paymentMethod)}</p>
                    <p className="adminOrderMuted">
                      Payment status: {formatLabel(order.paymentStatus)}
                    </p>
                  </section>

                  <section className="adminOrderInfo adminOrderStatusControl">
                    <h3>Update order status</h3>
                    {ORDER_STATUSES.includes(order.status) ? (
                      <select
                        className="adminInlineSelect"
                        aria-label={`Update status for order ${order._id}`}
                        value={order.status}
                        disabled={updatingId === order._id}
                        onChange={(event) => handleStatusChange(order._id, event.target.value)}
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {formatLabel(status)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="adminOrderMuted">
                        This order has an unrecognized status and cannot be updated.
                      </p>
                    )}
                    {updatingId === order._id && (
                      <span className="adminOrderMuted" role="status">
                        Saving status…
                      </span>
                    )}
                  </section>
                </div>

                <section className="adminOrderItems">
                  <h3>Products ({items.length})</h3>
                  {items.length > 0 ? (
                    <ul>
                      {items.map((item, index) => (
                        <li key={`${item.product || item.title || 'item'}-${index}`}>
                          <img
                            src={getImageUrl(item.image) || FALLBACK_IMAGE}
                            alt=""
                            loading="lazy"
                            onError={(event) => {
                              event.currentTarget.src = FALLBACK_IMAGE;
                            }}
                          />
                          <span className="adminOrderItemTitle">
                            {item.title || 'Product details unavailable'}
                          </span>
                          <span className="adminOrderItemQuantity">
                            Qty: {Number(item.quantity) || 0}
                          </span>
                          <span className="adminOrderItemPrice">
                            {formatCurrency((Number(item.price) || 0) * (Number(item.quantity) || 0))}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="adminOrderMuted">Product details are unavailable.</p>
                  )}
                </section>

                <footer className="adminOrderCardFooter">
                  <span>Total</span>
                  <strong>{formatCurrency(order.totalAmount)}</strong>
                </footer>
              </article>
            );
          })}
        </div>
      )}

      {!loading && !error && pagination.total > 0 && (
        <nav className="adminOrdersPagination" aria-label="Order pages">
          <span>
            Page {page} of {pagination.pages} · {pagination.total} orders
          </span>
          <div>
            <button
              type="button"
              className="adminRefreshButton"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </button>
            <button
              type="button"
              className="adminRefreshButton"
              disabled={page >= pagination.pages}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </button>
          </div>
        </nav>
      )}
    </section>
  );
}

export default AdminOrders;
