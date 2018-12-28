package com.please.service

import com.please.dataAccess.OrderReceiptDAO
import com.please.value.ReceiptInfo
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class ReceptionService {
    @Autowired
    private lateinit var receiptDAO: OrderReceiptDAO

    fun addOrder(authKey: String, data: MutableMap<String, Any>): JSONObject? {
        val receiptInfo = ReceiptInfo(
                data["shop-id"] as Long,
                data["delivery-cost-payment-type"] as String?,
                data["order-auto-cancel-time"] as String?,
                data["distance-factor"] as String?,
                data["point"] as String?,
                data["order-limit-amount"] as String?,
                data["delivery-cost"] as String?,
                data["additional-cost"] as String?,
                data["is-suspend"] as String?,
                data["payment-type"] as String?,
                data["jibun"] as String?,
                data["road"] as String?,
                data["address-detail"] as String?,
                data["latitude"] as String?,
                data["longitude"] as String?,
                data["distance"] as String?,
                data["menu"] as String?,
                data["menu-price"] as String?,
                data["additional-menuPrice"] as String?,
                data["customer-tel"] as String?,
                data["memo"] as String?,
                data["cook-time"] as String?,
                data["is-shared"] as String?
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