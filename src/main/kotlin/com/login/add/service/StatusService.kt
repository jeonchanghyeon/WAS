package com.login.add.service

import com.login.add.dataAccess.StatusDAO
import com.login.add.value.Condition
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.lang.Long
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

    fun searchOrders(data: MutableMap<String, String>): Map<String, Any>? {
        try {
            var condition = Condition(
                    data["branch"] ?: "",
                    Timestamp(java.lang.Long.parseLong(data["start_date"] ?: "0", 10)),
                    Timestamp(java.lang.Long.parseLong(data["end_date"] ?: "253402300799999", 10)),
                    data["payment_type"] ?: "",
                    data["service_type"] ?: "",
                    data["default_start"] ?: "",
                    data["delay_time"] ?: "",
                    data["additional_cost_percent"] ?: "",
                    data["additional_cost_won"] ?: ""
            )
            println(condition)
            return statusDAO.searchOrders(condition)
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }
}