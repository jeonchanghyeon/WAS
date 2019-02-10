package com.please.exception

import com.please.value.ErrorInfo

class SqlAbnormalResultException(message: String) : Exception(message) {
    lateinit var errorInfo: ErrorInfo
    override val message: String = message
        get() = StringBuffer()
                .appendln(field)
                .appendln("errorCode : ${errorInfo.resultCode}")
                .append("description : ${errorInfo.description}")
                .toString()

    constructor(message: String, resultCode: Int, description: String) : this(message) {
        this.errorInfo = ErrorInfo(resultCode, description)
    }
}