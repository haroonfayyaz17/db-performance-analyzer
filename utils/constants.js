module.exports.ORDER_STATUSES = {
  new: "new",
  checking: "checking",
  manual_checking: "manual_checking",
  processing: "processing",
  delayed: "delayed",
  pending: "pending",
  pending_cancellation: "pending_cancellation",
  partially_processed: "partially_processed",
  partially_shipped: "partially_shipped",
  processed: "processed",
  shipped: "shipped",
  errored: "errored",
  cancelled: "cancelled",
  not_found_in_co: "not_found_in_co",
  not_orderable_in_co: "not_orderable_in_co",
  co_qty_mismatch: "co_qty_mismatch",
  in_queue: "in_queue",
  issue: "issue",
  marked_not_shipped: "marked_not_shipped",
  completed: "completed",
  refund: "refund",
  manual_fulfillment: "manual_fulfillment",
  shipped_with_tba: "shipped_with_tba",
  delivered_with_tba: "delivered_with_tba",
  wh_delivered: "wh_delivered",
  wh_shipped: "wh_shipped"
}

module.exports.MARKETPLACE_STATUSES = {
  Created: "Created",
  Acknowledged: "Acknowledged",
  Delivered: "Delivered",
  Refund: "Refund",
  Shipped: "Shipped",
  Cancelled: "Cancelled",
  partially_shipped: "Partially_Shipped",
  PendingAvailability: "PendingAvailability",
  Pending: "Pending",
  Unshipped: "Unshipped",
  PartiallyShipped: "PartiallyShipped",
  Canceled: "Canceled",
  Unfulfillable: "Unfulfillable"
}

module.exports.ORDER_INDEX_FIELDS = ["delay_till", "status", "fulfillment_channel"]
