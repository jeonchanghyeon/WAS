import {$, createRow, getClosureToSelectButton} from './element.js';
import {HHMM, numberWithCommas} from './format.js';
import {ajax, getJSON, setCSRFHeader} from './ajax.js';
import {addCloseModalEvent} from './modal.js';

const createButton = (text, className, onClick) => {
    const btn = document.createElement('button');
    btn.innerHTML = text;
    btn.className = className;
    btn.onclick = onClick;

    return btn;
};

const setOrderStatus = (id, orderStatusId, riderId) => {
    ajax(`/api/orders/${id}`,
        'PATCH', JSON.stringify({id, orderStatusId, riderId}),
        setCSRFHeader);
};

export const loadDetail = (orderId, group) => {
    getJSON(`/api/orders/${orderId}`).then((obj) => {
        const {order} = obj;
        const {
            id,
            orderStatusId,
            distribName, branchName, shopName, riderName, riderTel,
            road, jibun, addressDetail, distance,
            menuPrice, additionalMenuPrice,
            paymentType, cookTime,
            deliveryCost, deliveryCostPaymentType, additionalCost,
            customerTel, memo,
            createDate, allocateDate, pickupDate, completeDate,
        } = order;

        let sumOfAdditionalCost = additionalCost
            .map(data => data['cost'])
            .reduce((sum, number) => sum + number, 0);

        const addCost = additionalCost
            .find(data => data['label'].toString() === '추가대행료')['cost'];

        const extraCharge = sumOfAdditionalCost - addCost;

        sumOfAdditionalCost += deliveryCost;

        $('distance').innerText = `${distance}km`;
        $('branchName').innerText = branchName;
        $('distribName').innerText = distribName;

        $('deliveryCost').innerText = `${numberWithCommas(deliveryCost)}원`;
        $('extraCharge').innerText = `${numberWithCommas(extraCharge)}원`;
        $('addCost').innerText = `${numberWithCommas(addCost)}원`;
        $('sum').innerText = `${numberWithCommas(sumOfAdditionalCost)}원`;

        getClosureToSelectButton([$('aside_cash'), $('aside_point')],
            'button button--empty-orange delivery-pay-buttons__button',
            'button button--empty-white delivery-pay-buttons__button')(deliveryCostPaymentType - 1);

        $('createTime').innerHTML = HHMM(createDate);
        $('allocateTime').innerHTML = HHMM(allocateDate);
        $('pickupTime').innerHTML = HHMM(pickupDate);
        $('completeTime').innerHTML = HHMM(completeDate);

        const arr = [
            'createTime',
            'allocateTime',
            'pickupTime',
            'completeTime',
        ];

        for (let i = 0; i < 4; i++) {
            if (i + 1 === orderStatusId) {
                $(arr[i]).parentElement.className = 'current-status current-status--orange';
            } else {
                $(arr[i]).parentElement.className = 'current-status current-status--normal';
            }
        }

        $('shopName').innerText = shopName;
        $('customerTel').innerText = customerTel;
        $('memo').innerText = memo;
        $('road').innerText = road;
        $('jibun').innerText = jibun;
        $('addressDetail').innerText = addressDetail;

        $('riderName').innerText = riderName;
        $('riderTel').innerText = riderTel;

        $('menuPrice').innerText = `${numberWithCommas(menuPrice)}원`;
        $('additionalMenuPrice').innerText = `${numberWithCommas(additionalMenuPrice)}원`;
        $('totalPrice').innerText = `${numberWithCommas(additionalMenuPrice + menuPrice)}원`;
        $('cookTime').innerText = `${cookTime}분`;

        if (group > 2) {
            const buttonAttrib = [];

            const emptyOrangeButton = 'button button--round button--empty-orange status-button-container__button';
            const emptyButton = 'button button--round button--empty-white status-button-container__button';
            const orangeButton = 'button button--round status-button-container__button';

            switch (orderStatusId) {
                case 1:
                case 6:
                    // 접수, 대기
                    buttonAttrib.push({
                        text: '주문수정',
                        className: emptyOrangeButton,
                    });
                    buttonAttrib.push({text: '추가접수', className: emptyOrangeButton});
                    if (group !== 3) {
                        buttonAttrib.push({
                            text: '배달기사배차',
                            className: orangeButton,
                            onclick: () => setOrderStatus(id, 4),
                        });
                    }
                    buttonAttrib.push({
                        text: '주문취소',
                        className: emptyButton,
                        onclick: () => setOrderStatus(id, 5),
                    });
                    break;
                case 2:
                    // 배차
                    buttonAttrib.push({
                        text: '주문수정',
                        className: emptyOrangeButton,
                    });
                    buttonAttrib.push({
                        text: '추가접수',
                        className: emptyOrangeButton,
                    });
                    if (group !== 3) {
                        buttonAttrib.push({
                            text: '픽업',
                            className: orangeButton,
                            onclick: () => setOrderStatus(id, 3),
                        });
                        buttonAttrib.push({
                            text: '배달기사배차',
                            className: orangeButton,
                            onclick: () => setOrderStatus(id, 2),
                        });
                    }
                    buttonAttrib.push({
                        text: '배차취소',
                        className: emptyButton,
                        onclick: () => setOrderStatus(id, 1),
                    });
                    buttonAttrib.push({
                        text: '주문취소',
                        className: emptyButton,
                        onclick: () => setOrderStatus(id, 5),
                    });

                    break;
                case 3:
                    // 픽업
                    buttonAttrib.push({
                        text: '주문수정',
                        className: emptyOrangeButton,
                    });
                    buttonAttrib.push({
                        text: '추가접수',
                        className: emptyOrangeButton,
                    });
                    if (group !== 3) {
                        buttonAttrib.push({
                            text: '완료',
                            className: orangeButton,
                            onclick: () => setOrderStatus(id, 4),
                        });
                        buttonAttrib.push({
                            text: '배달기사재배차',
                            className: orangeButton,
                            onclick: () => setOrderStatus(id, 2),
                        });
                    }
                    buttonAttrib.push({
                        text: '주문취소',
                        className: emptyButton,
                        onclick: () => setOrderStatus(id, 5),
                    });
                    buttonAttrib.push({
                        text: '배차취소',
                        className: emptyButton,
                        onclick: () => setOrderStatus(id, 1),
                    });
                    buttonAttrib.push({
                        text: '픽업취소',
                        className: emptyButton,
                        onclick: () => setOrderStatus(id, 2),
                    });
                    break;
                case 4:
                    // 완료
                    buttonAttrib.push({
                        text: '추가접수',
                        className: emptyOrangeButton,
                    });
                    buttonAttrib.push({
                        text: '주문취소',
                        className: emptyButton,
                        onclick: () => setOrderStatus(id, 5),
                    });
                    buttonAttrib.push({
                        text: '완료취소',
                        className: emptyButton,
                        onclick: () => setOrderStatus(id, 3),
                    });
                    break;
                case 5:
                    // 취소
                    buttonAttrib.push({
                        text: '추가접수',
                        className: emptyOrangeButton,
                    });
                    break;
                default:
                    break;
            }

            const container = $('asdf');
            container.innerHTML = '';

            buttonAttrib.forEach((ba) => {
                const btn = createButton(ba.text, ba.className, ba.onclick);
                container.appendChild(btn);
            });
        }

        getClosureToSelectButton([$('card'), $('cash'), $('prepay')],
            'button button--empty-orange others-right-row__button',
            'button button--empty-white others-right-row__button')(paymentType - 1);

        const tableMenu = $('menu_table');
        const {menu} = order;

        tableMenu.innerHTML = '';

        const keys = ['label', 'count', 'price'];

        for (let i = 0; i < menu.length; i++) {
            const texts = keys.map(key => menu[i][key]);
            texts.unshift(i + 1);
            const row = createRow(texts);

            tableMenu.appendChild(row);
        }

        $('delivery_detail_modal').style.display = 'inherit';
    });

    getJSON(`/api/orders/${orderId}/logs`).then((obj) => {
        const {logs} = obj;
        const tableLog = $('log-table');

        tableLog.innerHTML = '';

        const keys = [
            'id', 'name',
            'logType',
            'oldValue', 'newValue',
            'createDate',
        ];

        logs.forEach((log) => {
            const texts = keys.map((key) => {
                const value = log[key];
                if (key === 'createDate') {
                    return HHMM(value);
                }
                return value;
            });

            const row = createRow(texts);
            tableLog.appendChild(row);
        });
    });
};

addCloseModalEvent('delivery_detail_modal', 'btn_close');
