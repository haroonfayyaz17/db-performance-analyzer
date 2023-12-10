const mongoose = require("mongoose")

const { ORDER_STATUSES, MARKETPLACE_STATUSES, ORDER_INDEX_FIELDS } = require("../../utils/constants")
const { makeCols } = require("../../utils/common")
const { merge } = require("lodash")

const stringCols = [
  "marketplace_customer_order_id",
  "store_name",
  "marketplace_id",
  "buyer_name",
  "buyer_email",
  "fulfillment_channel",
  "shipping_service",
  "notice",
  "issue_reason",
  "issue_note",
  "proxy_bce_num"
]
const dateCols = [
  "required_shipping_date",
  "order_date",
  "required_delivery_date",
  "marketplace_status_timestamp",
  "last_checked",
  "proxy_bce_timestamp",
  "manual_locked_at",
  "cancelled_at",
  "delay_till",
  "start_processing_at",
  "ao_interact_time"
]

const ordersSchema = new mongoose.Schema(
  {
    ...makeCols(String, stringCols),
    ...makeCols(Date, dateCols),
    status: { type: String, enum: Object.values(ORDER_STATUSES), default: ORDER_STATUSES.new },
    feed_data: JSON,
    wh_address: JSON,
    marketplace_order_id: { type: String, unique: true },
    marketplace_status: { type: String, enum: Object.values(MARKETPLACE_STATUSES), default: null, allowNull: true },
    proxy_supplier_order: Number,
    is_locked: { type: Boolean, default: false },
    is_user_cancelled: { type: Boolean, default: false },
    marketplace_account_id: { type: Number, allowNull: false },
    note: { type: String, allowNull: true },
    email_sent: { type: Boolean, default: false },
    wh_id: { type: Number },
    warehouse_shipping: { type: Number, default: 0 },
    warehouse_fee: { type: Number, default: 0 },
    return_charges: { type: Number, default: 0 },
    ss_order_id: String,
    is_force_upload_tracking: { type: Boolean, default: false },
    order_fees: JSON
  },
  {
    indexes: ORDER_INDEX_FIELDS.map(field => ({ name: `source_orders_${field}`, using: "BTREE", fields: [field] })),
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
)
ordersSchema.index(
  ORDER_INDEX_FIELDS.concat("marketplace_order_id").reduce((obj, field) => merge(obj, { [field]: "text" }), {})
)

module.exports = mongoose.model("Orders", ordersSchema)
