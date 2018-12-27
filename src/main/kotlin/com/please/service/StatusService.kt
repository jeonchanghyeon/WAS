package com.please.service

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

    fun getDistributors(authInfo: AuthInfo): MutableList<Map<String, Any?>>? {
        return statusDAO.getDistributor(authInfo)
    }

    fun getBranchs(authInfo: AuthInfo, distributeId: Long): MutableList<Map<String, Any?>>? {
        return statusDAO.getBranchs(authInfo, distributeId)
    }

    fun searchOrders(authInfo: AuthInfo, data: MutableMap<String, Any>, paymentTypes: MutableList<Int>?, orderStatusIds: MutableList<Int>?): JSONObject? {
        val condition = Condition(
                data["branch-id"] as String,
                data["id"] as String?,
                data["shop-name"] as String?,
                data["rider-name"] as String?,
                //orderStatusIds,
                null, //mutableListOf(1, 2, 3, 4, 5, 6),
                null, //paymentTypes,
                //data["is-shared"] as Boolean?,
                null,
                if(data["start-date"] != "-1") Timestamp(data["start-date"] as Long) else Timestamp.valueOf("1000-01-01 00:00:00"),
                if(data["end-date"] != "-1") Timestamp(data["end-data"] as Long) else Timestamp.valueOf("9999-12-31 23:59:59")
        )
        val id = if(condition.id != null) condition.id.toLongOrNull() ?: -1 else null

        val conditionJSONObject = JSONObject()
        conditionJSONObject.put("branchId", condition.branchId)
        conditionJSONObject.put("id", id)
        conditionJSONObject.put("shopName", condition.shopName)
        conditionJSONObject.put("riderName", condition.riderName)
//        conditionJSONObject.put("orderStatusIds", condition.orderStatusIds)
//        conditionJSONObject.put("paymentTypes", condition.paymentTypes)
        conditionJSONObject.put("isShared", condition.isShared)
//        conditionJSONObject.put("dateType", "create")
//        conditionJSONObject.put("startDate", condition.startDate)
//        conditionJSONObject.put("endDate", condition.endDate)

        println(conditionJSONObject.toString())
        try {
            val result = statusDAO.searchOrders(authInfo, conditionJSONObject)
            result!!.put("counts", mutableListOf(0, 0, 0, 0, 0, 0, 0))
            println("result : $result")
            return result
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }

    fun getBranchSettings(authKey: String, branchId: String): JSONObject? {
        return statusDAO.getBranchSettings(authKey, branchId)
    }

    fun setBranchSettings(authKey: String, data: MutableMap<String, Any?>, id: String): JSONObject? {
        println(data)
        val settings = statusDAO.getBranchSettings(authKey, id)

        println(settings.toString())
        if (settings != null) {
            var branchSetting = settings.get("branchSettings") as JSONObject
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