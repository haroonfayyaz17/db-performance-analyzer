const { ORDER_STATUSES, MARKETPLACE_STATUSES, ORDER_INDEX_FIELDS } = require("../../utils/constants")
const { makeCols } = require("../../utils/common")

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

module.exports = (sequelize, DataTypes) => {
  const { STRING, DATE, INTEGER, ENUM, BOOLEAN, TEXT } = DataTypes
  const orders = sequelize.define(
    "orders",
    {
      ...makeCols(STRING, stringCols),
      ...makeCols(DATE, dateCols),
      status: {
        type: ENUM({
          values: Object.values(ORDER_STATUSES)
        }),
        defaultValue: ORDER_STATUSES.new
      },
      feed_data: DataTypes.JSON,
      wh_address: DataTypes.JSON,
      marketplace_order_id: {
        type: STRING,
        unique: true
      },
      marketplace_status: {
        type: ENUM({
          values: Object.values(MARKETPLACE_STATUSES)
        }),
        defaultValue: null,
        allowNull: true
      },
      proxy_supplier_order: INTEGER,
      is_locked: { type: BOOLEAN, defaultValue: false },
      is_user_cancelled: { type: BOOLEAN, defaultValue: false },
      marketplace_account_id: { type: INTEGER, allowNull: true },
      note: { type: TEXT, allowNull: true },
      email_sent: { type: BOOLEAN, defaultValue: false },
      wh_id: { type: INTEGER },
      warehouse_shipping: { type: DataTypes.FLOAT, defaultValue: 0 },
      warehouse_fee: { type: DataTypes.FLOAT, defaultValue: 0 },
      return_charges: { type: DataTypes.FLOAT, defaultValue: 0 },
      ss_order_id: STRING,
      is_force_upload_tracking: { type: BOOLEAN, defaultValue: false },
      order_fees: DataTypes.JSON
    },
    {
      indexes: ORDER_INDEX_FIELDS.map(field => ({
        name: `source_orders_${field}`,
        using: "BTREE",
        fields: [field]
      })),
      underscored: true,
      updatedAt: "updated_at",
      createdAt: "created_at"
    }
  )
  return orders
}
