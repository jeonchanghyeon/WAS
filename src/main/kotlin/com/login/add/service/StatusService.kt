package com.login.add.service

import com.login.add.dataAccess.StatusDAO
import com.login.add.value.Condition
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.lang.Long.parseLong
import java.sql.Timestamp

@Service
class StatusService {
    @Autowired
    private lateinit var statusDAO: StatusDAO

    fun getDistributor(userId: String, group: Int): List<String>? {
        when (group) {
            in 7..8 -> return statusDAO.getDistributor(userId)
        }
        return null
    }

    fun getBranchName(distributeName: String): List<String>? {
        return statusDAO.getBranchName(distributeName)
    }

    fun searchOrders(data: MutableMap<String, Any>, paymentType: Array<Boolean>, serviceType: Array<Boolean>): Map<String, Any>? {
        println(data["start_date"])
        println(data["end_date"])
        val condition = Condition(
                data["branch"] as String? ?: "",
                if (data["start_date"] != "-1") Timestamp.valueOf(data["start_date"] as String) else Timestamp(0),
                if (data["end_date"] != "-1") Timestamp.valueOf(data["end_date"] as String) else Timestamp(23123123123123), // TODO INT 최대
                paymentType,
                serviceType,
                data["default_start"] as Int? ?: 0, // TODO INT 최대
                data["delay_time"] as Int? ?: 1232342342, // TODO INT 최대
                data["additional_cost_percent"] as Int? ?: 100,
                data["additional_cost_won"] as Int? ?: 0
        )

        return statusDAO.searchOrders(condition)
    }

    fun setBranchSettings(authKey: String, data: MutableMap<String, Any?>, id: String): Int {
        val parsingData: JSONObject = JSONObject()

        parsingData.put("basicStartTime", data["basicStartTime"])
        parsingData.put("delayTime", data["delayTime"])
        parsingData.put("extraCharge", data["extraCharge"])
        parsingData.put("extraChargePercent", data["extraChargePercent"])
        parsingData.put("enableOrderAccept", data["enableOrderAccept"])

        return statusDAO.setBranchSettings(authKey, parsingData, id)
    }
}