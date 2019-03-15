package com.please.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.please.dataAccess.PointDAO
import com.please.exception.InvalidValueException
import com.please.exception.PasswordMismatchException
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
    private lateinit var userService: UserService

    fun getPoint(id: Long): String {
        val jsonObject = JSONObject()
        jsonObject.put("id", id)

        return pointDAO.getPoint(jsonObject.toString())
    }

    @Transactional
    @Throws(PasswordMismatchException::class, MissingBalanceException::class)
    fun sendPoint(authKey: String, senderId: Long, receiverId: Long, point: Int, password: String): String {
        val userTxType = 5  //송금 타입

        if(!userService.checkDepositPassword(authKey, senderId, password)) throw PasswordMismatchException("input password mismatch. (password = $password")
        checkPoint(authKey, point)  //포인트를 사용할 수 있는지 검사

        val txInfo = JSONObject(userService.getTransactionInformation(authKey, receiverId))
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