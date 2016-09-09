import { combineReducers } from 'redux';
import { NAVTABS_SWITCH, CHANGE_JS, CHANGE_INPUT, SWITCH_CANDIDATES } from '../actions';
import Immutable from 'immutable';

function navTabs(state, action) {
    if (state === undefined) {
        state = Immutable.Map({
            currentIndex: 0
        });
    }
    switch (action.type) {
        case NAVTABS_SWITCH:
            return state.set('currentIndex', action.index);
    }
    return state;
}

function generateUserSelectedList(change, list) {
    if (!list) {
        return {};
    }
    let lastSelected = null;
    let selectedList = list.map(item=>{
        let { productType, unifiedId, selected, count } = item;
        selected = change.unifiedId == unifiedId
            || item.candidates && item.candidates.some(can => change.unifiedId == can.unifiedId)
                ? change.value : selected;
        let res = {
            productType, unifiedId,
            selected,
            count: selected ? count : 0
        };
        if (change.unifiedId == unifiedId) {
            lastSelected = res;
        }
        return res;
    });
    return {
        lastSelected, selectedList
    }
}

function generateDesc(baseDeductionDo) {
    if (baseDeductionDo) {
        let unicashierStepCashDeductionDO = baseDeductionDo.unicashierStepCashDeductionDO;
        let text = '';
        if (baseDeductionDo.ratio) {
            text = baseDeductionDo.ratio*10+'折';
        } else if (unicashierStepCashDeductionDO) {
            if (unicashierStepCashDeductionDO.deduce) {
                switch (unicashierStepCashDeductionDO.limitTime) {
                    case 0:
                        text += '每'; break;
                    case 1:
                        break;
                    default:
                        text += '(限'+unicashierStepCashDeductionDO.limitTime+'次)'
                }
                text += '满'+unicashierStepCashDeductionDO.step+'元，减'+unicashierStepCashDeductionDO.deduce+'元';
            } else {
                text += '赠品';
                text += unicashierStepCashDeductionDO.step ? '，满'+unicashierStepCashDeductionDO.step+'元可享' : '';
            }
        } else {
            text += '赠品'
        }
        return text;
    }
    return null;
}

function cashierParam(state, action) {
    if (state === undefined) {
        state = Immutable.fromJS({
            js: '',
            input: {
                total: '',
                noDiscount: '',
                selectList: []
            },
            candidates: {
                unifiedId: null
            }
        });
        state = state.set('result', {});
    }
    let selectedList = {};
    switch (action.type) {
        case CHANGE_JS:
            state = state.set('js', action.js);
            break;
        case CHANGE_INPUT:
            if (action.key != 'list') {
                state = state.setIn(['input', action.key], action.value);
            } else {
                selectedList = generateUserSelectedList(action, state.get('result').rule.selectedList);
            }
            break;
        case SWITCH_CANDIDATES:
            state = state.setIn(['candidates', 'unifiedId'], action.unifiedId);
            selectedList = generateUserSelectedList(action, state.get('result').rule.selectedList);
            break;
    }

    if (action.type == SWITCH_CANDIDATES) {
        return state;
    }

    let result = {
        rule: {},
        getDPDiscountInitData: {}
    };

    !function() {
        try {
            let inputData = state.get('input');
            let pay = eval('new function() {'+state.get('js')+';return this}');
            result.rule = JSON.parse(pay.rule({
                totalAmount: inputData.get('total') || undefined,
                noDiscountAmount: inputData.get('noDiscount') || undefined,
                selectedList: selectedList.selectedList || [],
                lastSelected: selectedList.lastSelected
            }));
            result.getDPDiscountInitData = JSON.parse(pay.getDPDiscountInitData(result.rule));
            result.getUnifiedData = pay.getUnifiedData();
            result.rule.selectedList.forEach(item => {
                let offer = result.getUnifiedData.offers.filter(offer => {
                    return item.unifiedId == offer.unifiedId;
                })[0];
                item.desc = generateDesc(offer && offer.unicashierBaseDeductionDO);
                item.desc = item.desc || item.productType+' '+item.unifiedId;
                if (item.candidates) {
                    item.desc += ' >';
                    item.candidates.forEach(candidate => {
                        let offer = result.getUnifiedData.offers.filter(offer => {
                            return candidate.unifiedId == offer.unifiedId;
                        })[0];
                        candidate.desc = generateDesc(offer && offer.unicashierBaseDeductionDO);
                        candidate.desc = candidate.desc || candidate.unifiedId;
                    });
                }
            });
        } catch (e) {
            console.log(e);
        }
    }();

    return state.set('result', result);
}

const rootReducer = combineReducers({
    navTabs,
    cashierParam
});

export default rootReducer;
