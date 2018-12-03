package com.login.add.service

import com.login.add.dataAccess.StatusDAO
import com.login.add.value.Condition
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
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
        val condition = Condition(
                data["branch"] as String? ?: "",
//                data["start_date"] as Timestamp? ?: Timestamp(0),
//                data["end_date"] as Timestamp? ?: Timestamp(23123123123123), // TODO INT 최대
                Timestamp(0),
                Timestamp(253402300799999),
                paymentType,
                serviceType,
                data["default_start"] as Int? ?: 0, // TODO INT 최대
                data["delay_time"] as Int? ?: 1232342342, // TODO INT 최대
                data["additional_cost_percent"] as Int? ?: 100,
                data["additional_cost_won"] as Int? ?: 0
        )

        return statusDAO.searchOrders(condition)
    }
}