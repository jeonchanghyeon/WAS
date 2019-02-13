package com.please.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.please.dataAccess.PointDAO
import com.please.dataAccess.UserDAO
import com.please.exception.MissingBalanceException
import com.please.value.TransactionInfo
import org.json.JSONArray
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class PointService {
    @Autowired
    private lateinit var pointDAO: PointDAO
    @Autowired
    private lateinit var userDAO: UserDAO

    fun getPoint(id: Long): String {
        val jsonObject = JSONObject()
        jsonObject.put("id", id)

        return pointDAO.getPoint(jsonObject.toString())
    }

    @Transactional
    @Throws(MissingBalanceException::class)
    fun sendPoint(authKey: String, receiverId: Long, point: Int): String {
        val userTxType = 5
        val jsonInfo = JSONObject()
        jsonInfo.put("id", receiverId)

        checkPoint(authKey, point)  //포인트를 사용할 수 있는지 검사

        val txInfo = JSONObject(userDAO.getTransactionInformation(authKey, jsonInfo.toString()))
        val description = "${txInfo.getString("senderName")} ${txInfo.getString("receiverName")}에게 송금"

        val senderTxInfo = TransactionInfo(txInfo.getString("receiverAuthKey"), point * 1, userTxType, receiverId, description)
        val receiverTxInfo = TransactionInfo(authKey, point * -1, userTxType, txInfo.getLong("senderId"), description)
        val senderInfo = JSONObject(ObjectMapper().writeValueAsString(senderTxInfo))
        val receiverInfo = JSONObject(ObjectMapper().writeValueAsString(receiverTxInfo))
        val processingInfo = JSONArray(mutableListOf(senderInfo, receiverInfo))

        return pointDAO.updatePoint(processingInfo.toString())
    }

    fun checkPoint(authKey: String, point: Int): Boolean {
        val checkPoint = JSONObject(pointDAO.checkPoint(authKey, point))
        val enable = checkPoint.getInt("enable")
        val afterPoint = checkPoint.getInt("point")

        if (enable != 1) {
            throw MissingBalanceException("Point check result false. (points after processing = $afterPoint)")
        }
        return true
    }
}