import {$, appendOptions, createRow, getClosureToSelectButton} from './element.js';
import {HHMM, numberWithCommas} from './format.js';
import {ajax, getJSON, setCSRFHeader} from './ajax.js';
import {addCloseModalEvent} from './modal.js';

let onclose;

const setOrderStatus = (id, orderStatusId) => {
    const select = $('select-modal-rider');
    const riderId = select.options[select.selectedIndex].value;

    return ajax(`/api/orders/${id}`,
        'PATCH',
        JSON.stringify({id, orderStatusId, riderId}),
        setCSRFHeader).then((obj) => {
        const res = JSON.parse(obj);

        const {description} = res;
        alert(description);
        return res;
    }).then(() => {
        if (orderStatusId === 2 || orderStatusId === 3 || orderStatusId === 4) {
            $('delivery_detail_modal').style.display = 'none';
            onclose();
        }
    });
};

const getRiders = branchId => getJSON(`api/riders?branch-id=${branchId}`).then((obj) => {
    const {riders} = obj;

    const container = $('asdf');
    const select = document.createElement('select');

    select.id = 'select-modal-rider';

    const options = riders.map((rider) => {
        const {id, name} = rider;

        return {text: name, value: id};
    });

    appendOptions(select, options);
    container.appendChild(select);
});

const redirectToModifyOrder = (orderId) => {
    window.location.href = '/order-reception';
};

const redirectToAddOrder = (shopId) => {
    window.location.href = '/order-reception';
};

export const loadDetail = (orderId, group, func) => {
    onclose = func;

    getJSON(`/api/orders/${orderId}`).then((obj) => {
        const {order} = obj;
        const {
            id,
            orderStatusId,
            distribName, branchId, branchName, shopId, shopName, riderName, riderTel,
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

            const buttons = new Map([
                ['주문수정', {text: '주문수정', className: emptyOrangeButton, onclick: () => redirectToModifyOrder(orderId)}],
                ['추가접수', {text: '추가접수', className: emptyOrangeButton, onclick: () => redirectToAddOrder(shopId)}],
                ['접수', {text: '접수', className: orangeButton, onclick: () => setOrderStatus(id, 1)}],
                ['배차취소', {text: '배차취소', className: emptyButton, onclick: () => setOrderStatus(id, 1)}],
                ['픽업취소', {text: '픽업취소', className: emptyButton, onclick: () => setOrderStatus(id, 2)}],
                ['배달기사배차', {text: '배달기사배차', className: orangeButton, onclick: () => setOrderStatus(id, 2)}],
                ['배달기사재배차', {
                    text: '배달기사재배차',
                    className: orangeButton,
                    onclick: () => setOrderStatus(id, 1).then(setOrderStatus(id, 2))
                }],
                ['완료취소', {text: '완료취소', className: emptyButton, onclick: () => setOrderStatus(id, 3)}],
                ['픽업', {text: '픽업', className: orangeButton, onclick: () => setOrderStatus(id, 3)}],
                ['완료', {text: '완료', className: orangeButton, onclick: () => setOrderStatus(id, 4)}],
                ['주문취소', {text: '주문취소', className: emptyButton, onclick: () => setOrderStatus(id, 5)}],
            ]);

            switch (orderStatusId) {
                case 1:
                    buttonAttrib.push(buttons.get('주문수정'));
                    buttonAttrib.push(buttons.get('추가접수'));
                    if (group !== 3) {
                        buttonAttrib.push(buttons.get('배달기사배차'));
                    }
                    buttonAttrib.push(buttons.get('주문취소'));
                    break;

                case 2:
                    buttonAttrib.push(buttons.get('주문수정'));
                    buttonAttrib.push(buttons.get('추가접수'));
                    if (group !== 3) {
                        buttonAttrib.push(buttons.get('픽업'));
                        buttonAttrib.push(buttons.get('배달기사재배차'));
                    }
                    buttonAttrib.push(buttons.get('배차취소'));
                    buttonAttrib.push(buttons.get('주문취소'));
                    break;

                case 3:
                    buttonAttrib.push(buttons.get('주문수정'));
                    buttonAttrib.push(buttons.get('추가접수'));
                    if (group !== 3) {
                        buttonAttrib.push(buttons.get('완료'));
                        buttonAttrib.push(buttons.get('배달기사재배차'));
                    }
                    buttonAttrib.push(buttons.get('주문취소'));
                    buttonAttrib.push(buttons.get('배차취소'));
                    buttonAttrib.push(buttons.get('픽업취소'));
                    break;

                case 4:
                    buttonAttrib.push(buttons.get('추가접수'));
                    buttonAttrib.push(buttons.get('주문취소'));
                    buttonAttrib.push(buttons.get('완료취소'));
                    break;

                case 5:
                    buttonAttrib.push(buttons.get('추가접수'));
                    break;

                case 6:
                    buttonAttrib.push(buttons.get('주문수정'));
                    buttonAttrib.push(buttons.get('추가접수'));
                    buttonAttrib.push(buttons.get('접수'));
                    if (group !== 3) {
                        buttonAttrib.push(buttons.get('배달기사배차'));
                    }
                    buttonAttrib.push(buttons.get('주문취소'));
                    break;

                default:
                    break;
            }
            getRiders(branchId);

            const container = $('asdf');
            container.innerHTML = '';

            console.log(buttonAttrib);
            buttonAttrib.forEach(({text, className, onclick}) => {
                const btn = document.createElement('button');
                btn.innerHTML = text;
                btn.className = className;
                btn.onclick = onclick;

                container.appendChild(btn);
            });
        }

        getClosureToSelectButton([$('card'), $('cash'), $('prepay')],
            'button button--empty-orange others-right-row__button',
            'button button--empty-white others-right-row__button')(paymentType - 1);

        const tableMenu = $('menu_table');
        const {menu} = order;

        tableMenu.innerHTML = '';

        for (let i = 0; i < menu.length; i++) {
            const {label, count, price} = menu[i];
            const row = createRow([i + 1, label, count, price]);

            tableMenu.appendChild(row);
        }

        $('delivery_detail_modal').style.display = 'inherit';
    });

    getJSON(`/api/orders/${orderId}/logs`).then((obj) => {
        const {logs} = obj;
        const tableLog = $('log-table');

        tableLog.innerHTML = '';

        logs.forEach((log) => {
            const {id, name, logType, oldValue, newValue, createDate} = log;
            const row = createRow([id, name, logType, oldValue, newValue, HHMM(createDate)]);

            tableLog.appendChild(row);
        });
    });
};

addCloseModalEvent('delivery_detail_modal', 'btn_close');
