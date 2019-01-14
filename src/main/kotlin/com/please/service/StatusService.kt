package com.please.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.please.dataAccess.OrderDAO
import com.please.dataAccess.StatusDAO
import com.please.value.AuthInfo
import com.please.value.Condition
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.sql.Timestamp

@Service
class StatusService {
    @Autowired
    private lateinit var statusDAO: StatusDAO
    @Autowired
    private lateinit var orderDAO: OrderDAO

    fun getDistributors(authInfo: AuthInfo): MutableList<Map<String, Any?>>? {
        return statusDAO.getDistributor(authInfo)
    }

    fun getBranchs(authInfo: AuthInfo, distributeId: Long): MutableList<Map<String, Any?>>? {
        return statusDAO.getBranchs(authInfo, distributeId)
    }

    fun searchOrdersInfo(authInfo: AuthInfo, condition: Condition): JSONObject? {
        val branchId = condition.branchId

        val ordersResult = orderDAO.searchOrders(branchId, ObjectMapper().writeValueAsString(condition).toString().replace("shared", "isShared"))

        print("ordersResult")
        println(ordersResult)
        ordersResult ?: return null

        val startDate = Timestamp.valueOf(condition.startDate) ?: return null
        val endDate = Timestamp.valueOf(condition.endDate) ?: return null

        val countsResult = orderDAO.getOrderStatusCounts(branchId, startDate, endDate)

        print("countsResult")
        println(countsResult)

        countsResult ?: return null

        val result = JSONObject()

        result.put("orders", ordersResult["orders"])
        result.put("counts", countsResult["info"])

        return result
    }

    fun getBranchSettings(authKey: String, branchId: String): JSONObject? {
        return statusDAO.getBranchSettings(authKey, branchId)
    }

    fun setBranchSettings(authKey: String, data: MutableMap<String, Any?>, id: String): JSONObject? {
        println(data)
        val settings = statusDAO.getBranchSettings(authKey, id)

        println(settings.toString())
        if (settings != null) {
            val branchSetting = settings.get("branchSettings") as JSONObject
            val newSettings = JSONObject()

            val names = arrayOf("basicStartTime", "delayTime", "extraCharge", "extraChargePercent", "enableOrderAccept")

            newSettings.put("id", id)
            for (name in names) {
                newSettings.put(name, data[name] ?: branchSetting.get(name))
            }

            println(newSettings.toString())

            return statusDAO.setBranchSettings(authKey, newSettings.toString())
        }

        return null
    }
}