package com.please.service

import com.please.dataAccess.OrderReceiptDAO
import com.please.value.OrderReceiptInfo
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class OrderReceptionService {
    @Autowired
    private lateinit var receiptDAO: OrderReceiptDAO

    fun addOrder(authKey: String, data: MutableMap<String, Any>): JSONObject? {
        val receiptInfo = OrderReceiptInfo(
                data["shop-id"] as Long,
                data["customer-tel"] as String?,
                data["jibun"] as String,
                data["road"] as String,
                data["address-detail"] as String,
                data["distance-factor"] as Double?,
                data["latitude"] as Double?,
                data["longitude"] as Double?,
                data["distance"] as Double?,
                data["menu"] as String,
                data["menu-price"] as Long,
                data["additional-menuPrice"] as Long?,
                data["payment-type"] as Int,
                data["cook-time"] as Int,
                data["order-auto-cancel-time"] as Int,
                data["delivery-cost"] as Long,
                data["additional-cost"] as String?,
                data["delivery-cost-payment-type"] as Int,
                data["memo"] as String?,
                data["is-shared"] as Boolean?,
                data["point"] as Long?,
                data["order-limit-amount"] as Long?,
                data["is-suspend"] as Boolean?  //true or null
        )

        val info = JSONObject()
        info.put("shopId", receiptInfo.shopId)
        info.put("deliveryCostPaymentType", receiptInfo.deliveryCostPaymentType)
        info.put("orderAutoCancelTime", receiptInfo.orderAutoCancelTime)
        info.put("distanceFactor", receiptInfo.distanceFactor)
        info.put("point", receiptInfo.point)
        info.put("orderLimitAmount", receiptInfo.orderLimitAmount)
        info.put("deliveryCost", receiptInfo.deliveryCost)
        info.put("additionalCost", receiptInfo.additionalCost)
        info.put("isSuspend", receiptInfo.isSuspend)
        info.put("paymentType", receiptInfo.paymentType)
        info.put("jibun", receiptInfo.jibun)
        info.put("road", receiptInfo.road)
        info.put("addressDetail", receiptInfo.addressDetail)
        info.put("latitude", receiptInfo.latitude)
        info.put("longitude", receiptInfo.longitude)
        info.put("distance", receiptInfo.distance)
        info.put("menu", receiptInfo.menu)
        info.put("menuPrice", receiptInfo.menuPrice)
        info.put("additionalMenuPrice", receiptInfo.additionalMenuPrice)
        info.put("customerTel", receiptInfo.customerTel)
        info.put("memo", receiptInfo.memo)
        info.put("cookTime", receiptInfo.cookTime)
        info.put("isShared", receiptInfo.isShared)

        return receiptDAO.addOrderReceipt(authKey, info)
    }
}